import { TokenType, Token, tokenize } from "./lexer";

export type ASTNode =
  | ProgramNode
  | LetDeclNode
  | FnDeclNode
  | IfNode
  | ForInNode
  | WhileNode
  | MatchNode
  | ReturnNode
  | AssignmentNode
  | BinaryExprNode
  | UnaryExprNode
  | CallNode
  | IndexNode
  | ListNode
  | StringInterpNode
  | RangeNode
  | IdentifierNode
  | NumberLiteralNode
  | StringLiteralNode
  | BooleanLiteralNode
  | PrintNode
  | BlockNode;

export interface ProgramNode {
  kind: "program";
  statements: ASTNode[];
}

export interface LetDeclNode {
  kind: "let_decl";
  mutable: boolean;
  name: string;
  typeAnnotation?: string;
  value: ASTNode;
}

export interface FnDeclNode {
  kind: "fn_decl";
  name: string;
  params: Array<{ name: string; typeAnnotation?: string }>;
  returnType?: string;
  body: ASTNode;
  isArrow: boolean;
}

export interface IfNode {
  kind: "if";
  condition: ASTNode;
  thenBranch: ASTNode;
  elseBranch?: ASTNode;
}

export interface ForInNode {
  kind: "for_in";
  variable: string;
  iterable: ASTNode;
  body: ASTNode;
}

export interface WhileNode {
  kind: "while";
  condition: ASTNode;
  body: ASTNode;
}

export interface MatchNode {
  kind: "match";
  expression: ASTNode;
  arms: Array<{ pattern: MatchPattern; body: ASTNode }>;
}

export type MatchPattern =
  | { kind: "literal"; value: number | boolean | string }
  | { kind: "wildcard" }
  | { kind: "identifier"; name: string };

export interface ReturnNode {
  kind: "return";
  value: ASTNode;
}

export interface AssignmentNode {
  kind: "assignment";
  target: ASTNode;
  operator: string;
  value: ASTNode;
}

export interface BinaryExprNode {
  kind: "binary";
  operator: string;
  left: ASTNode;
  right: ASTNode;
}

export interface UnaryExprNode {
  kind: "unary";
  operator: string;
  operand: ASTNode;
}

export interface CallNode {
  kind: "call";
  callee: ASTNode;
  args: ASTNode[];
}

export interface IndexNode {
  kind: "index";
  object: ASTNode;
  index: ASTNode;
}

export interface ListNode {
  kind: "list";
  elements: ASTNode[];
}

export interface StringInterpNode {
  kind: "string_interp";
  parts: Array<string | ASTNode>;
}

export interface RangeNode {
  kind: "range";
  start: ASTNode;
  end: ASTNode;
}

export interface IdentifierNode {
  kind: "identifier";
  name: string;
}

export interface NumberLiteralNode {
  kind: "number_literal";
  value: number;
}

export interface StringLiteralNode {
  kind: "string_literal";
  value: string;
}

export interface BooleanLiteralNode {
  kind: "boolean_literal";
  value: boolean;
}

export interface PrintNode {
  kind: "print";
  value: ASTNode;
}

export interface BlockNode {
  kind: "block";
  statements: ASTNode[];
}

export class ParseError extends Error {
  line: number;
  col: number;
  constructor(message: string, line: number, col: number) {
    super(message);
    this.line = line;
    this.col = col;
  }
}

export function parse(source: string): ProgramNode {
  const tokens = tokenize(source);
  let pos = 0;

  const peek = (): Token => tokens[pos] ?? { type: TokenType.EOF, value: "", line: 0, col: 0 };
  const advance = (): Token => tokens[pos++] ?? { type: TokenType.EOF, value: "", line: 0, col: 0 };
  const expect = (type: TokenType): Token => {
    const t = peek();
    if (t.type !== type) throw new ParseError(`Expected ${TokenType[type]}, got '${t.value}'`, t.line, t.col);
    return advance();
  };
  const match = (...types: TokenType[]): Token | null => {
    if (types.includes(peek().type)) return advance();
    return null;
  };

  const skipNewlines = () => { while (peek().type === TokenType.Newline) advance(); };
  const skipStatementSeparators = () => {
    while (peek().type === TokenType.Newline || peek().type === TokenType.Semicolon) {
      advance();
    }
  };

  function parseProgram(): ProgramNode {
    const statements: ASTNode[] = [];
    skipStatementSeparators();
    while (peek().type !== TokenType.EOF) {
      statements.push(parseStatement());
      skipStatementSeparators();
    }
    return { kind: "program", statements };
  }

  function parseStatement(): ASTNode {
    const t = peek();

    if (t.type === TokenType.Let || t.type === TokenType.Var) return parseLetDecl();
    if (t.type === TokenType.Fn) return parseFnDecl();
    if (t.type === TokenType.If) return parseIf();
    if (t.type === TokenType.For) return parseForIn();
    if (t.type === TokenType.While) return parseWhile();
    if (t.type === TokenType.Match) return parseMatch();
    if (t.type === TokenType.Return) return parseReturn();
    if (t.type === TokenType.Print) return parsePrint();

    return parseExpressionOrAssignment();
  }

  function parseLetDecl(): LetDeclNode {
    const keyword = advance();
    let mutable = keyword.type === TokenType.Var;
    if (!mutable && peek().type === TokenType.Mut) {
      advance();
      mutable = true;
    }
    const name = expect(TokenType.Identifier).value;
    let typeAnnotation: string | undefined;
    if (peek().type === TokenType.Colon) {
      advance();
      typeAnnotation = expect(TokenType.Identifier).value;
    }
    expect(TokenType.Assign);
    skipNewlines();
    const value = parseExpression();
    return { kind: "let_decl", mutable, name, typeAnnotation, value };
  }

  function parseFnDecl(): FnDeclNode {
    advance();
    const name = expect(TokenType.Identifier).value;
    expect(TokenType.LParen);
    const params: Array<{ name: string; typeAnnotation?: string }> = [];
    skipNewlines();
    if (peek().type !== TokenType.RParen) {
      do {
        skipNewlines();
        const pName = expect(TokenType.Identifier).value;
        let pType: string | undefined;
        if (peek().type === TokenType.Colon) {
          advance();
          pType = expect(TokenType.Identifier).value;
        }
        params.push({ name: pName, typeAnnotation: pType });
        skipNewlines();
      } while (match(TokenType.Comma));
    }
    expect(TokenType.RParen);
    let returnType: string | undefined;
    if (peek().type === TokenType.Arrow) {
      advance();
      returnType = expect(TokenType.Identifier).value;
    }

    if (peek().type === TokenType.FatArrow) {
      advance();
      skipNewlines();
      const body = parseExpression();
      return { kind: "fn_decl", name, params, returnType, body, isArrow: true };
    }

    skipNewlines();
    const body = parseBlock();
    return { kind: "fn_decl", name, params, returnType, body, isArrow: false };
  }

  function parseIf(): IfNode {
    advance();
    const condition = parseExpression();
    skipNewlines();
    const thenBranch = parseBlock();
    skipNewlines();
    let elseBranch: ASTNode | undefined;
    if (peek().type === TokenType.Else) {
      advance();
      skipNewlines();
      if (peek().type === TokenType.If) {
        elseBranch = parseIf();
      } else {
        elseBranch = parseBlock();
      }
    }
    return { kind: "if", condition, thenBranch, elseBranch };
  }

  function parseForIn(): ForInNode {
    advance();
    const variable = expect(TokenType.Identifier).value;
    expect(TokenType.In);
    skipNewlines();
    const iterable = parseExpression();
    skipNewlines();
    const body = parseBlock();
    return { kind: "for_in", variable, iterable, body };
  }

  function parseWhile(): WhileNode {
    advance();
    const condition = parseExpression();
    skipNewlines();
    const body = parseBlock();
    return { kind: "while", condition, body };
  }

  function parseMatch(): MatchNode {
    advance();
    const expression = parseExpression();
    skipNewlines();
    expect(TokenType.LBrace);
    skipNewlines();
    const arms: Array<{ pattern: MatchPattern; body: ASTNode }> = [];
    while (peek().type !== TokenType.RBrace && peek().type !== TokenType.EOF) {
      skipNewlines();
      let pattern: MatchPattern;
      if (peek().type === TokenType.Identifier && peek().value === "_") {
        advance();
        pattern = { kind: "wildcard" };
      } else if (peek().type === TokenType.Number) {
        const v = parseFloat(advance().value);
        pattern = { kind: "literal", value: v };
      } else if (peek().type === TokenType.Boolean) {
        const v = advance().value === "true";
        pattern = { kind: "literal", value: v };
      } else if (peek().type === TokenType.String) {
        const v = advance().value;
        pattern = { kind: "literal", value: v };
      } else if (peek().type === TokenType.Identifier) {
        const id = advance().value;
        if (peek().type === TokenType.FatArrow) {
          pattern = { kind: "identifier", name: id };
        } else {
          pattern = { kind: "literal", value: id };
        }
      } else if (peek().type === TokenType.Minus) {
        advance();
        const v = -parseFloat(expect(TokenType.Number).value);
        pattern = { kind: "literal", value: v };
      } else {
        throw new ParseError(`Invalid match pattern: '${peek().value}'`, peek().line, peek().col);
      }
      expect(TokenType.FatArrow);
      skipNewlines();
      const body = peek().type === TokenType.LBrace ? parseBlock() : parseExpression();
      arms.push({ pattern, body });
      match(TokenType.Comma);
      skipNewlines();
    }
    expect(TokenType.RBrace);
    return { kind: "match", expression, arms };
  }

  function parseReturn(): ReturnNode {
    advance();
    skipNewlines();
    const value = parseExpression();
    return { kind: "return", value };
  }

  function parsePrint(): PrintNode {
    advance();
    expect(TokenType.LParen);
    skipNewlines();
    const value = parseExpression();
    skipNewlines();
    expect(TokenType.RParen);
    return { kind: "print", value };
  }

  function parseExpressionOrAssignment(): ASTNode {
    const expr = parseExpression();
    const assignOps: Record<string, string> = {
      [TokenType.Assign]: "=",
      [TokenType.PlusAssign]: "+=",
      [TokenType.MinusAssign]: "-=",
      [TokenType.StarAssign]: "*=",
      [TokenType.SlashAssign]: "/=",
      [TokenType.PercentAssign]: "%=",
    };
    const op = assignOps[peek().type];
    if (op) {
      advance();
      skipNewlines();
      const value = parseExpression();
      return { kind: "assignment", target: expr, operator: op, value };
    }
    return expr;
  }

  function parseExpression(): ASTNode {
    return parseLogicalOr();
  }

  function parseLogicalOr(): ASTNode {
    let left = parseLogicalAnd();
    while (peek().type === TokenType.Or) {
      advance();
      skipNewlines();
      const right = parseLogicalAnd();
      left = { kind: "binary", operator: "||", left, right };
    }
    return left;
  }

  function parseLogicalAnd(): ASTNode {
    let left = parseEquality();
    while (peek().type === TokenType.And) {
      advance();
      skipNewlines();
      const right = parseEquality();
      left = { kind: "binary", operator: "&&", left, right };
    }
    return left;
  }

  function parseEquality(): ASTNode {
    let left = parseComparison();
    while (peek().type === TokenType.Eq || peek().type === TokenType.NotEq) {
      const op = advance().value;
      skipNewlines();
      const right = parseComparison();
      left = { kind: "binary", operator: op, left, right };
    }
    return left;
  }

  function parseComparison(): ASTNode {
    let left = parseAdditive();
    while ([TokenType.Lt, TokenType.Gt, TokenType.Lte, TokenType.Gte].includes(peek().type)) {
      const op = advance().value;
      skipNewlines();
      const right = parseAdditive();
      left = { kind: "binary", operator: op, left, right };
    }
    return left;
  }

  function parseAdditive(): ASTNode {
    let left = parseMultiplicative();
    while (peek().type === TokenType.Plus || peek().type === TokenType.Minus) {
      const op = advance().value;
      skipNewlines();
      const right = parseMultiplicative();
      left = { kind: "binary", operator: op, left, right };
    }
    return left;
  }

  function parseMultiplicative(): ASTNode {
    let left = parsePower();
    while (peek().type === TokenType.Star || peek().type === TokenType.Slash || peek().type === TokenType.Percent) {
      const op = advance().value;
      skipNewlines();
      const right = parsePower();
      left = { kind: "binary", operator: op, left, right };
    }
    return left;
  }

  function parsePower(): ASTNode {
    let left = parseUnary();
    while (peek().type === TokenType.Power) {
      advance();
      skipNewlines();
      const right = parseUnary();
      left = { kind: "binary", operator: "**", left, right };
    }
    return left;
  }

  function parseUnary(): ASTNode {
    if (peek().type === TokenType.Not) {
      advance();
      return { kind: "unary", operator: "!", operand: parseUnary() };
    }
    if (peek().type === TokenType.Minus) {
      advance();
      return { kind: "unary", operator: "-", operand: parseUnary() };
    }
    return parsePostfix();
  }

  function parsePostfix(): ASTNode {
    let expr = parsePrimary();
    while (true) {
      if (peek().type === TokenType.LParen) {
        advance();
        const args: ASTNode[] = [];
        skipNewlines();
        if (peek().type !== TokenType.RParen) {
          args.push(parseExpression());
          skipNewlines();
          while (match(TokenType.Comma)) {
            skipNewlines();
            args.push(parseExpression());
            skipNewlines();
          }
        }
        expect(TokenType.RParen);
        expr = { kind: "call", callee: expr, args };
      } else if (peek().type === TokenType.LBracket) {
        advance();
        skipNewlines();
        const index = parseExpression();
        skipNewlines();
        expect(TokenType.RBracket);
        expr = { kind: "index", object: expr, index };
      } else if (peek().type === TokenType.Dot) {
        advance();
        const prop = expect(TokenType.Identifier).value;
        expr = { kind: "call", callee: { kind: "identifier", name: prop }, args: [expr] };
      } else {
        break;
      }
    }
    return expr;
  }

  function parsePrimary(): ASTNode {
    const t = peek();

    if (t.type === TokenType.Number) {
      advance();
      return { kind: "number_literal", value: parseFloat(t.value) };
    }

    if (t.type === TokenType.String) {
      advance();
      if (t.value.includes("${")) return parseStringInterpolation(t.value);
      return { kind: "string_literal", value: t.value };
    }

    if (t.type === TokenType.Boolean) {
      advance();
      return { kind: "boolean_literal", value: t.value === "true" };
    }

    if (t.type === TokenType.Identifier) {
      advance();
      if (peek().type === TokenType.Range) {
        const start: ASTNode = { kind: "identifier", name: t.value };
        advance();
        skipNewlines();
        const end = parseAdditive();
        return { kind: "range", start, end };
      }
      return { kind: "identifier", name: t.value };
    }

    if (t.type === TokenType.LParen) {
      advance();
      skipNewlines();
      const expr = parseExpression();
      skipNewlines();
      expect(TokenType.RParen);
      return expr;
    }

    if (t.type === TokenType.LBracket) {
      advance();
      const elements: ASTNode[] = [];
      skipNewlines();
      if (peek().type !== TokenType.RBracket) {
        elements.push(parseExpression());
        skipNewlines();
        while (match(TokenType.Comma)) {
          skipNewlines();
          if (peek().type === TokenType.RBracket) break;
          elements.push(parseExpression());
          skipNewlines();
        }
      }
      expect(TokenType.RBracket);
      return { kind: "list", elements };
    }

    if (t.type === TokenType.LBrace) {
      return parseBlock();
    }

    if (t.type === TokenType.If) return parseIf();
    if (t.type === TokenType.Match) return parseMatch();

    throw new ParseError(`Unexpected token '${t.value}'`, t.line, t.col);
  }

  function parseBlock(): BlockNode {
    expect(TokenType.LBrace);
    skipStatementSeparators();
    const statements: ASTNode[] = [];
    while (peek().type !== TokenType.RBrace && peek().type !== TokenType.EOF) {
      statements.push(parseStatement());
      skipStatementSeparators();
    }
    expect(TokenType.RBrace);
    return { kind: "block", statements };
  }

  function parseStringInterpolation(raw: string): StringInterpNode {
    const parts: Array<string | ASTNode> = [];
    let i = 0;
    let literal = "";
    while (i < raw.length) {
      if (raw[i] === "$" && raw[i + 1] === "{") {
        if (literal) { parts.push(literal); literal = ""; }
        i += 2;
        let depth = 1;
        let expr = "";
        while (i < raw.length && depth > 0) {
          if (raw[i] === "{") depth++;
          else if (raw[i] === "}") depth--;
          if (depth > 0) expr += raw[i];
          i++;
        }
        try {
          parts.push(parse(expr));
        } catch {
          parts.push(expr);
        }
      } else {
        literal += raw[i];
        i++;
      }
    }
    if (literal) parts.push(literal);
    return { kind: "string_interp", parts };
  }

  return parseProgram();
}
