"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Terminal, Minimize2, Maximize2, X } from "lucide-react";

interface TerminalLine {
  type: "input" | "output" | "error" | "success";
  content: string;
  timestamp?: Date;
}

interface Command {
  name: string;
  description: string;
  execute: (args: string[]) => TerminalLine[];
}

export function RetroTerminal() {
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      type: "success",
      content: "Welcome to FYKE TERMINAL v1.0.0",
    },
    {
      type: "output",
      content: "Type 'help' to see available commands.",
    },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new lines are added
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [lines]);

  // Commands definition
  const commands: Record<string, Command> = {
    help: {
      name: "help",
      description: "Show all available commands",
      execute: () => [
        { type: "output", content: "╔════════════════════════════════════════════════╗" },
        { type: "output", content: "║          AVAILABLE COMMANDS                    ║" },
        { type: "output", content: "╚════════════════════════════════════════════════╝" },
        { type: "output", content: "" },
        { type: "output", content: "  help          - Show this help message" },
        { type: "output", content: "  ls            - List portfolio sections" },
        { type: "output", content: "  projects      - Show all projects" },
        { type: "output", content: "  whoami        - Display portfolio owner info" },
        { type: "output", content: "  skills        - List technology stack" },
        { type: "output", content: "  contact       - Show contact information" },
        { type: "output", content: "  clear         - Clear terminal output" },
        { type: "output", content: "  theme         - Toggle dark/light mode" },
        { type: "output", content: "  echo [text]   - Echo back the text" },
        { type: "output", content: "  date          - Display current date/time" },
        { type: "output", content: "" },
        { type: "success", content: "Use ↑/↓ arrows to navigate command history" },
      ],
    },
    ls: {
      name: "ls",
      description: "List portfolio sections",
      execute: () => [
        { type: "output", content: "Portfolio Sections:" },
        { type: "output", content: "" },
        { type: "output", content: "  📂 Projects/        - Lab Archive Citadel" },
        { type: "output", content: "  📂 Plans/           - Future experiments" },
        { type: "output", content: "  📂 Skills/          - Tech stack inventory" },
        { type: "output", content: "  📂 Contact/         - Communication channels" },
        { type: "output", content: "" },
        { type: "success", content: "4 sections available" },
      ],
    },
    projects: {
      name: "projects",
      description: "Show all projects",
      execute: () => [
        { type: "output", content: "╔════════════════════════════════════════════════╗" },
        { type: "output", content: "║          PROJECT ARCHIVE                       ║" },
        { type: "output", content: "╚════════════════════════════════════════════════╝" },
        { type: "output", content: "" },
        { type: "output", content: "Visit /projects to view the complete" },
        { type: "output", content: "Lab Archive Citadel with detailed" },
        { type: "output", content: "project information, tech stacks," },
        { type: "output", content: "and live demonstrations." },
        { type: "output", content: "" },
        { type: "success", content: "Navigate to Projects page for full details" },
      ],
    },
    whoami: {
      name: "whoami",
      description: "Display portfolio owner info",
      execute: () => [
        { type: "output", content: "╔════════════════════════════════════════════════╗" },
        { type: "output", content: "║          SYSTEM OPERATOR                       ║" },
        { type: "output", content: "╚════════════════════════════════════════════════╝" },
        { type: "output", content: "" },
        { type: "output", content: "  Name:     Fyke" },
        { type: "output", content: "  Role:     Full-Stack Developer" },
        { type: "output", content: "  Status:   Building awesome projects" },
        { type: "output", content: "  Location: Digital realm" },
        { type: "output", content: "" },
        { type: "success", content: "Passionate about creating innovative solutions" },
      ],
    },
    skills: {
      name: "skills",
      description: "List technology stack",
      execute: () => [
        { type: "output", content: "╔════════════════════════════════════════════════╗" },
        { type: "output", content: "║          TECH STACK INVENTORY                  ║" },
        { type: "output", content: "╚════════════════════════════════════════════════╝" },
        { type: "output", content: "" },
        { type: "output", content: "  Frontend:    React, Next.js, TypeScript" },
        { type: "output", content: "  Styling:     Tailwind CSS, Framer Motion" },
        { type: "output", content: "  Backend:     Node.js, Python" },
        { type: "output", content: "  Database:    PostgreSQL, MongoDB" },
        { type: "output", content: "  Tools:       Git, Docker, VS Code" },
        { type: "output", content: "" },
        { type: "success", content: "Always learning and expanding the arsenal" },
      ],
    },
    contact: {
      name: "contact",
      description: "Show contact information",
      execute: () => [
        { type: "output", content: "╔════════════════════════════════════════════════╗" },
        { type: "output", content: "║          CONTACT CHANNELS                      ║" },
        { type: "output", content: "╚════════════════════════════════════════════════╝" },
        { type: "output", content: "" },
        { type: "output", content: "  GitHub:   github.com/heimin22/fyketonel" },
        { type: "output", content: "  Email:    Available on request" },
        { type: "output", content: "" },
        { type: "success", content: "Let's build something amazing together!" },
      ],
    },
    clear: {
      name: "clear",
      description: "Clear terminal output",
      execute: () => {
        setLines([]);
        return [];
      },
    },
    theme: {
      name: "theme",
      description: "Toggle dark/light mode",
      execute: () => {
        // Toggle theme
        const html = document.documentElement;
        const isDark = html.classList.contains("dark");
        if (isDark) {
          html.classList.remove("dark");
        } else {
          html.classList.add("dark");
        }
        return [
          {
            type: "success",
            content: `Theme switched to ${isDark ? "light" : "dark"} mode`,
          },
        ];
      },
    },
    echo: {
      name: "echo",
      description: "Echo back the text",
      execute: (args) => [
        {
          type: "output",
          content: args.join(" ") || "",
        },
      ],
    },
    date: {
      name: "date",
      description: "Display current date/time",
      execute: () => {
        const now = new Date();
        return [
          {
            type: "output",
            content: now.toLocaleString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
          },
        ];
      },
    },
  };

  const executeCommand = (commandString: string) => {
    const trimmed = commandString.trim();
    if (!trimmed) return;

    // Add command to history
    setHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    // Add input line
    setLines((prev) => [
      ...prev,
      { type: "input", content: `$ ${trimmed}`, timestamp: new Date() },
    ]);

    // Parse command and arguments
    const parts = trimmed.split(/\s+/);
    const commandName = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Execute command
    const command = commands[commandName];
    if (command) {
      const output = command.execute(args);
      setLines((prev) => [...prev, ...output]);
    } else {
      setLines((prev) => [
        ...prev,
        {
          type: "error",
          content: `Command not found: ${commandName}`,
        },
        {
          type: "output",
          content: "Type 'help' to see available commands.",
        },
      ]);
    }

    setInput("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeCommand(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex =
          historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= history.length) {
          setHistoryIndex(-1);
          setInput("");
        } else {
          setHistoryIndex(newIndex);
          setInput(history[newIndex]);
        }
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      // Simple autocomplete
      if (input.trim()) {
        const matches = Object.keys(commands).filter((cmd) =>
          cmd.startsWith(input.toLowerCase())
        );
        if (matches.length === 1) {
          setInput(matches[0]);
        }
      }
    }
  };

  const getLineColor = (type: TerminalLine["type"]) => {
    switch (type) {
      case "input":
        return "text-primary";
      case "error":
        return "text-red-500";
      case "success":
        return "text-green-500";
      default:
        return "text-foreground";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "relative overflow-hidden rounded-none",
        isMaximized
          ? "fixed inset-4 z-50 border-4 border-border bg-card shadow-[8px_8px_0_var(--border)] dark:border-ring"
          : "border-4 border-border bg-card shadow-[6px_6px_0_var(--border)] dark:border-ring"
      )}
    >
      {/* Scanline effect */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.03)_50%)] bg-[length:100%_4px] opacity-30" />

      {/* Terminal Header */}
      <div className="relative flex items-center justify-between border-b-4 border-border bg-primary/10 px-4 py-3 dark:border-ring">
        <div className="flex items-center gap-3">
          <Terminal className="size-5 text-primary" />
          <span className="retro text-xs uppercase tracking-[0.2em] text-foreground">
            FYKE Terminal
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsMinimized(!isMinimized)}
            className="group rounded-none border-2 border-border bg-background p-1.5 shadow-[2px_2px_0_var(--border)] transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0_var(--primary)] active:translate-y-0 active:shadow-[1px_1px_0_var(--border)] dark:border-ring"
            aria-label="Minimize terminal"
          >
            <Minimize2 className="size-3 text-foreground transition-colors group-hover:text-primary" />
          </button>
          <button
            type="button"
            onClick={() => setIsMaximized(!isMaximized)}
            className="group rounded-none border-2 border-border bg-background p-1.5 shadow-[2px_2px_0_var(--border)] transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0_var(--primary)] active:translate-y-0 active:shadow-[1px_1px_0_var(--border)] dark:border-ring"
            aria-label={isMaximized ? "Restore terminal" : "Maximize terminal"}
          >
            <Maximize2 className="size-3 text-foreground transition-colors group-hover:text-primary" />
          </button>
          <button
            type="button"
            onClick={() => setLines([
              {
                type: "success",
                content: "Welcome to FYKE TERMINAL v1.0.0",
              },
              {
                type: "output",
                content: "Type 'help' to see available commands.",
              },
            ])}
            className="group rounded-none border-2 border-border bg-background p-1.5 shadow-[2px_2px_0_var(--border)] transition-all hover:-translate-y-0.5 hover:border-red-500 hover:shadow-[3px_3px_0_#ef4444] active:translate-y-0 active:shadow-[1px_1px_0_var(--border)] dark:border-ring"
            aria-label="Reset terminal"
          >
            <X className="size-3 text-foreground transition-colors group-hover:text-red-500" />
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            {/* Output Area */}
            <div
              ref={outputRef}
              className={cn(
                "relative overflow-y-auto bg-background/95 p-4 font-mono",
                isMaximized ? "h-[calc(100vh-12rem)]" : "h-80"
              )}
              onClick={() => inputRef.current?.focus()}
            >
              <AnimatePresence mode="popLayout">
                {lines.map((line, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.02 }}
                    className={cn(
                      "retro mb-1 whitespace-pre-wrap text-xs leading-relaxed",
                      getLineColor(line.type)
                    )}
                  >
                    {line.content}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Input Line */}
              <div className="mt-2 flex items-center gap-2">
                <span className="retro text-xs text-primary">$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="retro flex-1 bg-transparent text-xs text-foreground outline-none"
                  placeholder="Type a command..."
                  autoFocus
                />
              </div>

              {/* Cursor blink */}
              <motion.span
                className="inline-block h-3 w-1.5 bg-primary"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            </div>

            {/* Status Bar */}
            <div className="relative border-t-4 border-border bg-primary/10 px-4 py-2 dark:border-ring">
              <div className="flex items-center justify-between text-[0.5rem] uppercase tracking-[0.2em] text-muted-foreground">
                <span className="retro">Ready</span>
                <span className="retro">Commands: {Object.keys(commands).length}</span>
                <span className="retro">Lines: {lines.length}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default RetroTerminal;
