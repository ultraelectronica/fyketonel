"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { JetBrains_Mono } from "next/font/google";

const oxygenMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

interface OxygenEditorProps {
  initialCode?: string;
  onRun: (code: string) => { output: string[]; value: string; type: string; error?: string };
  onSave?: (filename: string, code: string) => void;
  onQuit: () => void;
  filename?: string;
}

const OXYGEN_KEYWORDS = [
  "let", "mut", "var", "fn", "if", "else", "for", "in", "while", "match",
  "return", "print", "true", "false",
];

const OXYGEN_BUILTINS = [
  "sqrt", "abs", "ceil", "floor", "round", "sign", "trunc", "sin", "cos",
  "tan", "asin", "acos", "atan", "atan2", "exp", "log", "log2", "log10",
  "pow", "cbrt", "min", "max", "hypot", "len", "push", "pop", "str", "int",
  "float", "type", "rand", "rand_int",
];

const OXYGEN_CONSTANTS = ["PI", "E", "PHI", "TAU", "LN2", "LN10", "SQRT2"];
const OXYGEN_COMPLETIONS = [...OXYGEN_KEYWORDS, ...OXYGEN_BUILTINS, ...OXYGEN_CONSTANTS];
const OXYGEN_INDENT = "  ";

function getLineIndent(code: string, cursor: number) {
  const lineStart = code.lastIndexOf("\n", cursor - 1) + 1;
  return code.slice(lineStart, cursor).match(/^\s*/)?.[0] ?? "";
}

function getPreviousNonWhitespace(code: string, cursor: number) {
  for (let i = cursor - 1; i >= 0; i--) {
    if (!/\s/.test(code[i] ?? "")) return code[i];
  }
  return "";
}

function getNextNonWhitespace(code: string, cursor: number) {
  for (let i = cursor; i < code.length; i++) {
    if (!/\s/.test(code[i] ?? "")) return code[i];
  }
  return "";
}

function getCompletionContext(code: string, cursor: number) {
  const match = code.slice(0, cursor).match(/[a-zA-Z_][a-zA-Z0-9_]*$/);
  if (!match) return null;

  return {
    query: match[0],
    start: cursor - match[0].length,
  };
}

function getCompletionKind(token: string) {
  if (OXYGEN_KEYWORDS.includes(token)) return "keyword";
  if (OXYGEN_BUILTINS.includes(token)) return "builtin";
  if (OXYGEN_CONSTANTS.includes(token)) return "constant";
  return "symbol";
}

function getCompletionTone(token: string) {
  if (OXYGEN_KEYWORDS.includes(token)) return "text-purple-400";
  if (OXYGEN_BUILTINS.includes(token)) return "text-blue-400";
  if (OXYGEN_CONSTANTS.includes(token)) return "text-orange-400";
  return "text-foreground";
}

function highlightKevlar(line: string): string {
  let result = "";
  let i = 0;
  while (i < line.length) {
    if (line[i] === "/" && line[i + 1] === "/") {
      result += `<span class="text-muted-foreground">${escapeHtml(line.slice(i))}</span>`;
      return result;
    }

    if (line[i] === '"' || line[i] === "'") {
      const quote = line[i];
      let str = quote;
      i++;
      while (i < line.length && line[i] !== quote) {
        if (line[i] === "\\" && i + 1 < line.length) {
          str += line[i] + line[i + 1];
          i += 2;
        } else {
          str += line[i];
          i++;
        }
      }
      if (i < line.length) { str += line[i]; i++; }
      result += `<span class="text-amber-400">${escapeHtml(str)}</span>`;
      continue;
    }

    if (/\d/.test(line[i]) || (line[i] === "." && i + 1 < line.length && /\d/.test(line[i + 1]))) {
      let num = "";
      while (i < line.length && /[\d.]/.test(line[i])) { num += line[i]; i++; }
      result += `<span class="text-cyan-400">${escapeHtml(num)}</span>`;
      continue;
    }

    if (/[a-zA-Z_]/.test(line[i])) {
      let ident = "";
      while (i < line.length && /[a-zA-Z0-9_]/.test(line[i])) { ident += line[i]; i++; }
      if (OXYGEN_KEYWORDS.includes(ident)) {
        result += `<span class="text-purple-400">${escapeHtml(ident)}</span>`;
      } else if (OXYGEN_CONSTANTS.includes(ident)) {
        result += `<span class="text-orange-400">${escapeHtml(ident)}</span>`;
      } else if (OXYGEN_BUILTINS.includes(ident)) {
        result += `<span class="text-blue-400">${escapeHtml(ident)}</span>`;
      } else {
        result += escapeHtml(ident);
      }
      continue;
    }

    const ops = ["==", "!=", "<=", ">=", "&&", "||", "**", "+=", "-=", "*=", "/=", "%=", "=>", "->", ".."];
    let matched = false;
    for (const op of ops) {
      if (line.slice(i, i + op.length) === op) {
        result += `<span class="text-pink-400">${escapeHtml(op)}</span>`;
        i += op.length;
        matched = true;
        break;
      }
    }
    if (matched) continue;

    const singleOps = ["+", "-", "*", "/", "%", "=", "<", ">", "!", "(", ")", "{", "}", "[", "]", ",", ":", ";"];
    if (singleOps.includes(line[i])) {
      result += `<span class="text-pink-400">${escapeHtml(line[i])}</span>`;
      i++;
      continue;
    }

    result += escapeHtml(line[i]);
    i++;
  }
  return result;
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function OxygenEditor({ initialCode, onRun, onSave, onQuit, filename: initialFilename }: OxygenEditorProps) {
  const [code, setCode] = useState(initialCode ?? "");
  const [output, setOutput] = useState<string[]>([]);
  const [filename, setFilename] = useState(initialFilename ?? "untitled.kv");
  const [mode, setMode] = useState<"edit" | "command">("edit");
  const [commandInput, setCommandInput] = useState("");
  const [statusMessage, setStatusMessage] = useState("OXYGEN v1.0 — Kevlar Code Editor");
  const [selection, setSelection] = useState({
    start: (initialCode ?? "").length,
    end: (initialCode ?? "").length,
  });
  const [completionIndex, setCompletionIndex] = useState(0);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  const completionContext =
    mode === "edit" && selection.start === selection.end
      ? getCompletionContext(code, selection.start)
      : null;
  const completions = completionContext
    ? OXYGEN_COMPLETIONS.filter((token) => token.startsWith(completionContext.query) && token !== completionContext.query).slice(0, 6)
    : [];
  const activeCompletionIndex = completionIndex < completions.length ? completionIndex : 0;

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  useEffect(() => {
    textAreaRef.current?.focus();
  }, [mode]);

  const syncEditorScroll = (textarea: HTMLTextAreaElement) => {
    if (highlightRef.current) {
      highlightRef.current.scrollTop = textarea.scrollTop;
      highlightRef.current.scrollLeft = textarea.scrollLeft;
    }

    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textarea.scrollTop;
    }
  };

  const syncSelection = (textarea: HTMLTextAreaElement) => {
    setSelection({ start: textarea.selectionStart, end: textarea.selectionEnd });
  };

  const focusEditor = (position: number) => {
    requestAnimationFrame(() => {
      const textarea = textAreaRef.current;
      if (!textarea) return;

      textarea.focus();
      textarea.selectionStart = position;
      textarea.selectionEnd = position;
      syncSelection(textarea);
      syncEditorScroll(textarea);
    });
  };

  const applyCompletion = (token: string) => {
    if (!completionContext) return;

    const nextCode = code.slice(0, completionContext.start) + token + code.slice(selection.end);
    const nextCursor = completionContext.start + token.length;
    setCode(nextCode);
    setSelection({ start: nextCursor, end: nextCursor });
    setStatusMessage(`Autocomplete: ${token}`);
    focusEditor(nextCursor);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (mode === "command") return;

    if (e.key === "Escape") {
      e.preventDefault();
      setMode("command");
      setCommandInput("");
      return;
    }

    if (e.ctrlKey && e.key === "Enter") {
      e.preventDefault();
      handleRun();
      return;
    }

    if (e.ctrlKey && e.key === "s") {
      e.preventDefault();
      handleSave();
      return;
    }

    if (completions.length > 0 && e.key === "ArrowDown") {
      e.preventDefault();
      setCompletionIndex((current) => (current + 1) % completions.length);
      return;
    }

    if (completions.length > 0 && e.key === "ArrowUp") {
      e.preventDefault();
      setCompletionIndex((current) => (current - 1 + completions.length) % completions.length);
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();

      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentIndent = getLineIndent(code, start);
      const previousChar = getPreviousNonWhitespace(code, start);
      const nextChar = getNextNonWhitespace(code, end);
      const indent = previousChar === "{" ? currentIndent + OXYGEN_INDENT : currentIndent;

      if (previousChar === "{" && nextChar === "}") {
        const insert = `\n${indent}\n${currentIndent}`;
        setCode(code.slice(0, start) + insert + code.slice(end));
        const cursorPos = start + 1 + indent.length;
        setSelection({ start: cursorPos, end: cursorPos });
        focusEditor(cursorPos);
      } else {
        const insert = `\n${indent}`;
        setCode(code.slice(0, start) + insert + code.slice(end));
        const cursorPos = start + insert.length;
        setSelection({ start: cursorPos, end: cursorPos });
        focusEditor(cursorPos);
      }
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();

      if (completions.length > 0 && completionContext?.query) {
        applyCompletion(completions[activeCompletionIndex] ?? completions[0]);
        return;
      }

      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newCode = code.substring(0, start) + OXYGEN_INDENT + code.substring(end);
      setCode(newCode);
      setSelection({ start: start + OXYGEN_INDENT.length, end: start + OXYGEN_INDENT.length });
      focusEditor(start + OXYGEN_INDENT.length);
      return;
    }
  };

  const handleRun = () => {
    try {
      const result = onRun(code);
      const lines: string[] = [];
      if (result.output.length > 0) {
        lines.push("── Output ──");
        lines.push(...result.output);
      }
      if (result.error) {
        lines.push("── Error ──");
        lines.push(result.error);
      } else if (result.value !== undefined) {
        lines.push(`── Result: ${result.value} (${result.type}) ──`);
      }
      setOutput(lines);
      setStatusMessage(result.error ? "Error" : `Executed successfully`);
    } catch (err) {
      setOutput(["── Error ──", err instanceof Error ? err.message : String(err)]);
      setStatusMessage("Error");
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(filename, code);
      setStatusMessage(`Saved: ${filename}`);
    }
  };

  const handleCommand = (cmd: string) => {
    const parts = cmd.trim().split(/\s+/);
    const command = parts[0]?.toLowerCase();

    switch (command) {
      case "run":
      case "r":
        handleRun();
        break;
      case "save":
      case "s":
        if (parts[1]) setFilename(parts[1]);
        handleSave();
        break;
      case "quit":
      case "q":
        onQuit();
        break;
      case "clear":
      case "c":
        setOutput([]);
        setStatusMessage("Output cleared");
        break;
      case "help":
      case "h":
        setOutput([
          "── Oxygen Editor Commands ──",
          "",
          "  :run, :r       Execute Kevlar code",
          "  :save, :s [f]   Save to file (optional filename)",
          "  :quit, :q       Exit Oxygen editor",
          "  :clear, :c      Clear output panel",
          "  :help, :h       Show this help",
          "",
          "Keyboard Shortcuts:",
          "  Ctrl+Enter      Run code",
          "  Ctrl+S           Save file",
          "  Escape           Enter command mode",
          "  Enter            Smart indent",
          "  Tab              Accept autocomplete or insert 2 spaces",
          "  ↑/↓              Move autocomplete selection",
        ]);
        break;
      default:
        setStatusMessage(`Unknown command: ${command}`);
    }
    setMode("edit");
    setCommandInput("");
  };

  const lineCount = code.split("\n").length;

  return (
    <div className="flex h-full flex-col border-4 border-border bg-background dark:border-ring" style={{ fontFamily: "var(--font-jetbrains-sans)" }}>
      <div className="flex items-center justify-between border-b-4 border-border bg-primary/10 px-3 py-2 dark:border-ring">
        <div className="flex items-center gap-2">
          <span className="retro text-[0.65rem] uppercase tracking-[0.2em] text-primary">O₂</span>
          <span className="retro text-[0.65rem] uppercase tracking-[0.15em] text-foreground">OXYGEN</span>
        </div>
        <div className="retro text-[0.6rem] uppercase tracking-[0.15em] text-muted-foreground">
          {filename} — {lineCount} lines
        </div>
        <div className="flex items-center gap-2">
          <span className="retro text-[0.55rem] uppercase tracking-[0.1em] text-muted-foreground">
            {statusMessage}
          </span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto border-r-2 border-border dark:border-ring">
          <div className="flex min-h-full">
            <div
              ref={lineNumbersRef}
              className="flex-shrink-0 overflow-hidden border-r border-border bg-card px-2 py-1 text-right dark:border-ring"
            >
              {Array.from({ length: lineCount }, (_, i) => (
                <div
                  key={i}
                  className={`${oxygenMono.className} text-[0.65rem] leading-[1.6] text-muted-foreground`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
            <div className="flex-1">
              {mode === "edit" ? (
                <div className="relative h-full min-h-full bg-background">
                  <div
                    ref={highlightRef}
                    aria-hidden
                    className="pointer-events-none absolute inset-0 overflow-hidden p-1"
                  >
                    <div
                      className={`${oxygenMono.className} min-h-full whitespace-pre text-xs text-foreground`}
                      style={{ lineHeight: "1.6", fontOpticalSizing: "auto" }}
                    >
                      {code.split("\n").map((line, i) => (
                        <div
                          key={i}
                          dangerouslySetInnerHTML={{ __html: highlightKevlar(line) || "&nbsp;" }}
                        />
                      ))}
                    </div>
                  </div>

                  <textarea
                    ref={textAreaRef}
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value);
                      syncSelection(e.currentTarget);
                    }}
                    onKeyDown={handleKeyDown}
                    onSelect={(e) => syncSelection(e.currentTarget)}
                    onClick={(e) => syncSelection(e.currentTarget)}
                    onScroll={(e) => syncEditorScroll(e.currentTarget)}
                    className={`${oxygenMono.className} relative z-10 h-full w-full resize-none bg-transparent p-1 text-xs text-transparent caret-foreground outline-none selection:bg-primary/30`}
                    style={{ minHeight: "100%", lineHeight: "1.6", fontOpticalSizing: "auto" }}
                    spellCheck={false}
                    autoFocus
                  />

                  {completions.length > 0 ? (
                    <div className="absolute bottom-2 right-2 z-20 min-w-44 border-2 border-border bg-card/95 shadow-lg backdrop-blur-sm dark:border-ring">
                      {completions.map((token, index) => (
                        <button
                          key={token}
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            applyCompletion(token);
                          }}
                          className={`flex w-full items-center justify-between gap-3 px-2 py-1 text-left ${index === activeCompletionIndex ? "bg-primary/15" : "bg-transparent"}`}
                        >
                          <span className={`${oxygenMono.className} text-[0.7rem] ${getCompletionTone(token)}`}>
                            {token}
                          </span>
                          <span className="retro text-[0.45rem] uppercase tracking-[0.12em] text-muted-foreground">
                            {getCompletionKind(token)}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className={`${oxygenMono.className} p-1`} style={{ lineHeight: "1.6", fontOpticalSizing: "auto" }}>
                  {code.split("\n").map((line, i) => (
                    <div
                      key={i}
                      className="text-xs"
                      dangerouslySetInnerHTML={{ __html: highlightKevlar(line) || "&nbsp;" }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex w-1/3 flex-col overflow-hidden">
          <div className="border-b-2 border-border px-2 py-1 dark:border-ring">
            <span className="retro text-[0.6rem] uppercase tracking-[0.15em] text-primary">Output</span>
          </div>
          <div ref={outputRef} className="flex-1 overflow-auto p-2">
            {output.length === 0 ? (
              <span className="retro text-[0.65rem] text-muted-foreground">
                Press Ctrl+Enter or :run to execute
              </span>
            ) : (
              output.map((line, i) => (
                <div key={i} className="retro text-[0.65rem] leading-relaxed text-foreground">
                  {line}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center border-t-4 border-border bg-primary/10 px-3 py-1 dark:border-ring">
        {mode === "command" ? (
          <div className="flex w-full items-center gap-1">
            <span className="retro text-xs text-primary">:</span>
            <input
              type="text"
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleCommand(commandInput);
                } else if (e.key === "Escape") {
                  setMode("edit");
                  setCommandInput("");
                }
              }}
              className={`${oxygenMono.className} flex-1 bg-transparent text-xs text-foreground outline-none`}
              style={{ fontOpticalSizing: "auto" }}
              autoFocus
              placeholder="Command (run/save/quit/clear/help)"
            />
          </div>
        ) : (
          <div className="flex w-full items-center justify-between">
            <span className="retro text-[0.55rem] uppercase tracking-[0.1em] text-muted-foreground">
              Esc → command mode | Ctrl+Enter → run | Enter → smart indent | Tab → autocomplete/indent
            </span>
            <span className="retro text-[0.55rem] uppercase tracking-[0.1em] text-primary">KEVLAR v2</span>
          </div>
        )}
      </div>
    </div>
  );
}
