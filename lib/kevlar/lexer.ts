export enum TokenType {
  Number,
  String,
  Boolean,
  Identifier,
  Let,
  Mut,
  Var,
  Fn,
  If,
  Else,
  For,
  In,
  While,
  Match,
  Return,
  Print,
  Plus,
  Minus,
  Star,
  Slash,
  Percent,
  Power,
  Eq,
  NotEq,
  Lt,
  Gt,
  Lte,
  Gte,
  And,
  Or,
  Not,
  Assign,
  PlusAssign,
  MinusAssign,
  StarAssign,
  SlashAssign,
  PercentAssign,
  LParen,
  RParen,
  LBrace,
  RBrace,
  LBracket,
  RBracket,
  Comma,
  Colon,
  Semicolon,
  Arrow,
  FatArrow,
  Range,
  Dot,
  Newline,
  EOF,
}

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  col: number;
}

const KEYWORDS: Record<string, TokenType> = {
  let: TokenType.Let,
  mut: TokenType.Mut,
  var: TokenType.Var,
  fn: TokenType.Fn,
  if: TokenType.If,
  else: TokenType.Else,
  for: TokenType.For,
  in: TokenType.In,
  while: TokenType.While,
  match: TokenType.Match,
  return: TokenType.Return,
  print: TokenType.Print,
  true: TokenType.Boolean,
  false: TokenType.Boolean,
};

export function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  let line = 1;
  let col = 1;

  const peek = (offset = 0): string => source[i + offset] ?? "";
  const advance = (): string => {
    const ch = source[i++];
    if (ch === "\n") { line++; col = 1; } else { col++; }
    return ch;
  };

  while (i < source.length) {
    const startLine = line;
    const startCol = col;

    if (peek() === "/" && peek(1) === "/") {
      while (i < source.length && peek() !== "\n") advance();
      continue;
    }

    if (peek() === "\n") {
      advance();
      if (tokens.length > 0 && tokens[tokens.length - 1].type !== TokenType.Newline) {
        tokens.push({ type: TokenType.Newline, value: "\n", line: startLine, col: startCol });
      }
      continue;
    }

    if (/\s/.test(peek())) {
      advance();
      continue;
    }

    if (peek() === '"' || peek() === "'") {
      const quote = advance();
      let str = "";
      let hasInterp = false;
      while (i < source.length && peek() !== quote) {
        if (peek() === "\\") {
          advance();
          const esc = advance();
          if (esc === "n") str += "\n";
          else if (esc === "t") str += "\t";
          else if (esc === "\\") str += "\\";
          else if (esc === "'") str += "'";
          else if (esc === '"') str += '"';
          else if (esc === "{") str += "{";
          else str += esc;
        } else if (peek() === "$" && peek(1) === "{") {
          hasInterp = true;
          str += "${";
          advance();
          advance();
          let depth = 1;
          while (i < source.length && depth > 0) {
            const ch = advance();
            str += ch;
            if (ch === "{") depth++;
            else if (ch === "}") depth--;
          }
        } else {
          str += advance();
        }
      }
      if (i < source.length) advance();
      tokens.push({ type: TokenType.String, value: hasInterp ? str : str, line: startLine, col: startCol });
      continue;
    }

    if (/\d/.test(peek()) || (peek() === "." && /\d/.test(peek(1)))) {
      let num = "";
      while (i < source.length && /[\d.]/.test(peek())) num += advance();
      tokens.push({ type: TokenType.Number, value: num, line: startLine, col: startCol });
      continue;
    }

    if (/[a-zA-Z_]/.test(peek())) {
      let ident = "";
      while (i < source.length && /[a-zA-Z0-9_]/.test(peek())) ident += advance();
      const kw = KEYWORDS[ident];
      if (kw !== undefined) {
        if (kw === TokenType.Boolean) {
          tokens.push({ type: TokenType.Boolean, value: ident, line: startLine, col: startCol });
        } else {
          tokens.push({ type: kw, value: ident, line: startLine, col: startCol });
        }
      } else {
        tokens.push({ type: TokenType.Identifier, value: ident, line: startLine, col: startCol });
      }
      continue;
    }

    if (peek() === "=" && peek(1) === ">" ) {
      advance(); advance();
      tokens.push({ type: TokenType.FatArrow, value: "=>", line: startLine, col: startCol });
      continue;
    }
    if (peek() === "-" && peek(1) === ">") {
      advance(); advance();
      tokens.push({ type: TokenType.Arrow, value: "->", line: startLine, col: startCol });
      continue;
    }
    if (peek() === "." && peek(1) === "." && peek(2) !== ".") {
      advance(); advance();
      tokens.push({ type: TokenType.Range, value: "..", line: startLine, col: startCol });
      continue;
    }

    const twoChar = source.slice(i, i + 2);
    const TWO_CHAR_TOKENS: Record<string, TokenType> = {
      "==": TokenType.Eq, "!=": TokenType.NotEq, "<=": TokenType.Lte, ">=": TokenType.Gte,
      "&&": TokenType.And, "||": TokenType.Or, "**": TokenType.Power,
      "+=": TokenType.PlusAssign, "-=": TokenType.MinusAssign,
      "*=": TokenType.StarAssign, "/=": TokenType.SlashAssign, "%=": TokenType.PercentAssign,
    };
    if (TWO_CHAR_TOKENS[twoChar]) {
      advance(); advance();
      tokens.push({ type: TWO_CHAR_TOKENS[twoChar], value: twoChar, line: startLine, col: startCol });
      continue;
    }

    const ONE_CHAR_TOKENS: Record<string, TokenType> = {
      "+": TokenType.Plus, "-": TokenType.Minus, "*": TokenType.Star, "/": TokenType.Slash,
      "%": TokenType.Percent, "<": TokenType.Lt, ">": TokenType.Gt,
      "!": TokenType.Not, "=": TokenType.Assign,
      "(": TokenType.LParen, ")": TokenType.RParen,
      "{": TokenType.LBrace, "}": TokenType.RBrace,
      "[": TokenType.LBracket, "]": TokenType.RBracket,
      ",": TokenType.Comma, ":": TokenType.Colon, ";": TokenType.Semicolon,
      ".": TokenType.Dot,
    };
    if (ONE_CHAR_TOKENS[peek()]) {
      const ch = advance();
      tokens.push({ type: ONE_CHAR_TOKENS[ch], value: ch, line: startLine, col: startCol });
      continue;
    }

    advance();
  }

  tokens.push({ type: TokenType.EOF, value: "", line, col });
  return tokens;
}