export type KevlarValue = number | boolean | string;

export type KevlarOperator = "+" | "-" | "*" | "/" | "%" | "**" |
  "==" | "!=" | "<" | ">" | "<=" | ">=" |
  "&&" | "||" | "!" |
  "=" | "+=" | "-=" | "*=" | "/=" | "%=";

export interface KevlarResult {
  value: KevlarValue;
  type: "int" | "float" | "bool" | "string";
  isAssignment: boolean;
  varName?: string;
  varOp?: string;
  input: string;
}

export type KevlarError = {
  kind: "error";
  message: string;
};

export type KevlarEvalResult = KevlarResult | KevlarError;

const MATH_CONSTANTS: Record<string, number> = {
  PI: Math.PI,
  E: Math.E,
  PHI: 1.618033988749895,
  TAU: Math.PI * 2,
  LN2: Math.LN2,
  LN10: Math.LN10,
  SQRT2: Math.SQRT2,
};

const MATH_FUNCTIONS: Record<string, (...args: number[]) => number> = {
  sqrt: Math.sqrt,
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  log: Math.log,
  log2: Math.log2,
  log10: Math.log10,
  pow: Math.pow,
  abs: Math.abs,
  ceil: Math.ceil,
  floor: Math.floor,
  round: Math.round,
  min: Math.min,
  max: Math.max,
  exp: Math.exp,
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,
  atan2: Math.atan2,
  sign: Math.sign,
  trunc: Math.trunc,
  cbrt: Math.cbrt,
  hypot: Math.hypot,
};

export { MATH_CONSTANTS, MATH_FUNCTIONS };

export function getVariables(): Record<string, KevlarValue> {
  if (typeof window !== "undefined") {
    if (!(window as unknown as Record<string, unknown>).__kevlarVars) {
      (window as unknown as Record<string, Record<string, KevlarValue>>).__kevlarVars = {};
    }
    return (window as unknown as Record<string, Record<string, KevlarValue>>).__kevlarVars;
  }
  return {};
}

export function tokenize(expr: string): string[] {
  const tokens: string[] = [];
  let i = 0;
  while (i < expr.length) {
    if (/\s/.test(expr[i])) { i++; continue; }

    if (i + 1 < expr.length) {
      const twoChar = expr.slice(i, i + 2);
      if (["==", "!=", "<=", ">=", "&&", "||", "+=", "-=", "*=", "/=", "%=", "**"].includes(twoChar)) {
        tokens.push(twoChar);
        i += 2;
        continue;
      }
    }

    if (["+", "-", "*", "/", "%", "(", ")", "<", ">", "=", "!"].includes(expr[i])) {
      tokens.push(expr[i]);
      i++;
      continue;
    }

    if (expr[i] === '"' || expr[i] === "'") {
      const quote = expr[i];
      let str = quote;
      i++;
      while (i < expr.length && expr[i] !== quote) {
        if (expr[i] === '\\' && i + 1 < expr.length) {
          str += expr[i] + expr[i + 1];
          i += 2;
        } else {
          str += expr[i];
          i++;
        }
      }
      if (i < expr.length) { str += expr[i]; i++; }
      tokens.push(str);
      continue;
    }

    if (/\d/.test(expr[i]) || (expr[i] === "." && i + 1 < expr.length && /\d/.test(expr[i + 1]))) {
      let num = "";
      while (i < expr.length && (/\d/.test(expr[i]) || expr[i] === ".")) {
        num += expr[i]; i++;
      }
      tokens.push(num);
      continue;
    }

    if (/[a-zA-Z_]/.test(expr[i])) {
      let ident = "";
      while (i < expr.length && /[a-zA-Z0-9_]/.test(expr[i])) {
        ident += expr[i]; i++;
      }
      tokens.push(ident);
      continue;
    }

    i++;
  }
  return tokens;
}

function parseExpression(
  tokens: string[],
  variables: Record<string, KevlarValue>
): KevlarValue {
  let pos = 0;

  const peek = (): string | null => pos < tokens.length ? tokens[pos] : null;
  const consume = (): string | null => pos < tokens.length ? tokens[pos++] : null;

  const parsePrimary = (): KevlarValue => {
    const token = peek();
    if (token === null) throw new Error("Unexpected end of expression");

    if (token === "(") {
      consume();
      const result = parseAssignment();
      if (peek() !== ")") throw new Error("Missing closing parenthesis");
      consume();
      return result;
    }

    if (/^-?\d+\.?\d*$/.test(token) || /^\.\d+$/.test(token)) {
      consume();
      return parseFloat(token);
    }

    if (token.toLowerCase() === "true") { consume(); return true; }
    if (token.toLowerCase() === "false") { consume(); return false; }

    if ((token.startsWith('"') && token.endsWith('"')) ||
        (token.startsWith("'") && token.endsWith("'"))) {
      consume();
      let str = token.slice(1, -1);
      str = str.replace(/\\n/g, '\n');
      str = str.replace(/\\t/g, '\t');
      str = str.replace(/\\"/g, '"');
      str = str.replace(/\\'/g, "'");
      str = str.replace(/\\\\/g, '\\');
      return str;
    }

    if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(token)) {
      if (token in MATH_FUNCTIONS && pos + 1 < tokens.length && tokens[pos + 1] === "(") {
        consume();
        consume();
        const args: KevlarValue[] = [];
        if (peek() !== ")") {
          args.push(parseAssignment());
          while (peek() === ",") { consume(); args.push(parseAssignment()); }
        }
        if (peek() !== ")") throw new Error(`Missing closing parenthesis for ${token}()`);
        consume();
        const numArgs = args.map(a => typeof a === "number" ? a : parseFloat(String(a)) || 0);
        const fn = MATH_FUNCTIONS[token];
        return fn(...numArgs);
      }

      if (token in MATH_CONSTANTS) { consume(); return MATH_CONSTANTS[token]; }

      consume();
      if (token in variables) return variables[token];
      return 0;
    }

    throw new Error(`Unexpected token: ${token}`);
  };

  const parseUnary = (): KevlarValue => {
    if (peek() === "!") { consume(); return !Boolean(parseUnary()); }
    if (peek() === "-") {
      consume();
      const operand = parseUnary();
      const numOperand = typeof operand === "number" ? operand : parseFloat(String(operand)) || 0;
      return -numOperand;
    }
    return parsePrimary();
  };

  const parsePower = (): KevlarValue => {
    let left = parseUnary();
    while (peek() === "**") {
      consume();
      const right = parseUnary();
      const numLeft = typeof left === "number" ? left : parseFloat(String(left)) || 0;
      const numRight = typeof right === "number" ? right : parseFloat(String(right)) || 0;
      left = Math.pow(numLeft, numRight);
    }
    return left;
  };

  const parseMultiplicative = (): KevlarValue => {
    let left = parsePower();
    while (peek() === "*" || peek() === "/" || peek() === "%") {
      const op = consume();
      const right = parsePower();
      const numLeft = typeof left === "number" ? left : parseFloat(String(left)) || 0;
      const numRight = typeof right === "number" ? right : parseFloat(String(right)) || 0;
      if (op === "*") left = numLeft * numRight;
      else if (op === "/") { if (numRight === 0) throw new Error("Division by zero"); left = numLeft / numRight; }
      else { if (numRight === 0) throw new Error("Modulo by zero"); left = numLeft % numRight; }
    }
    return left;
  };

  const parseAdditive = (): KevlarValue => {
    let left = parseMultiplicative();
    while (peek() === "+" || peek() === "-") {
      const op = consume();
      const right = parseMultiplicative();

      if (op === "+" && (typeof left === "string" || typeof right === "string")) {
        left = String(left) + String(right);
      } else {
        const numLeft = typeof left === "number" ? left : parseFloat(String(left)) || 0;
        const numRight = typeof right === "number" ? right : parseFloat(String(right)) || 0;
        left = op === "+" ? numLeft + numRight : numLeft - numRight;
      }
    }
    return left;
  };

  const parseComparison = (): KevlarValue => {
    let left = parseAdditive();
    while (["<", ">", "<=", ">="].includes(peek() || "")) {
      const op = consume();
      const right = parseAdditive();
      const numLeft = typeof left === "number" ? left : parseFloat(String(left)) || 0;
      const numRight = typeof right === "number" ? right : parseFloat(String(right)) || 0;
      switch (op) {
        case "<": left = numLeft < numRight; break;
        case ">": left = numLeft > numRight; break;
        case "<=": left = numLeft <= numRight; break;
        case ">=": left = numLeft >= numRight; break;
      }
    }
    return left;
  };

  const parseEquality = (): KevlarValue => {
    let left = parseComparison();
    while (peek() === "==" || peek() === "!=") {
      const op = consume();
      const right = parseComparison();
      left = op === "==" ? left === right : left !== right;
    }
    return left;
  };

  const parseLogicalAnd = (): KevlarValue => {
    let left = parseEquality();
    while (peek() === "&&") { consume(); left = Boolean(left) && Boolean(parseEquality()); }
    return left;
  };

  const parseLogicalOr = (): KevlarValue => {
    let left = parseLogicalAnd();
    while (peek() === "||") { consume(); left = Boolean(left) || Boolean(parseLogicalAnd()); }
    return left;
  };

  const parseAssignment = (): KevlarValue => {
    if (pos + 1 < tokens.length) {
      const varName = tokens[pos];
      const op = tokens[pos + 1];
      if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(varName) && ["=", "+=", "-=", "*=", "/=", "%="].includes(op)) {
        pos += 2;
        const value = parseAssignment();
        let finalValue: KevlarValue;
        if (op === "=") {
          finalValue = value;
        } else {
          const numCurrent = typeof variables[varName] === "number" ? variables[varName] as number : 0;
          const numValue = typeof value === "number" ? value : parseFloat(String(value)) || 0;
          switch (op) {
            case "+=": finalValue = numCurrent + numValue; break;
            case "-=": finalValue = numCurrent - numValue; break;
            case "*=": finalValue = numCurrent * numValue; break;
            case "/=":
              if (numValue === 0) throw new Error("Division by zero");
              finalValue = numCurrent / numValue; break;
            case "%=":
              if (numValue === 0) throw new Error("Modulo by zero");
              finalValue = numCurrent % numValue; break;
            default: finalValue = value;
          }
        }
        variables[varName] = finalValue;
        return finalValue;
      }
    }
    return parseLogicalOr();
  };

  return parseAssignment();
}

export function kevlarEval(input: string): KevlarEvalResult {
  const tokens = tokenize(input);

  const hasOperators = /[+\-*/%<>=!&|]/.test(input);
  const isNumber = /^-?\d+\.?\d*$/.test(input.trim());
  const isQuotedString = /^["'].*["']$/.test(input.trim());
  const isBooleanLiteral = /^(true|false)$/i.test(input.trim());
  const isAssignment = /^[a-zA-Z_][a-zA-Z0-9_]*\s*[+\-*/%]?=/.test(input);
  const looksLikeExpression = hasOperators || isNumber || isQuotedString || isBooleanLiteral || isAssignment;

  if (tokens.length > 0 && looksLikeExpression) {
    try {
      const variables = getVariables();
      const result = parseExpression(tokens, variables);

      let resultType: KevlarResult["type"];
      if (typeof result === "boolean") resultType = "bool";
      else if (typeof result === "number") resultType = Number.isInteger(result) ? "int" : "float";
      else resultType = "string";

      const assignmentMatch = input.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*([+\-*/%]?=)\s*/);
      if (assignmentMatch) {
        return {
          value: result,
          type: resultType,
          isAssignment: true,
          varName: assignmentMatch[1],
          varOp: assignmentMatch[2],
          input,
        };
      }

      return { value: result, type: resultType, isAssignment: false, input };
    } catch (error) {
      if (error instanceof Error && (
        error.message.includes("Division by zero") ||
        error.message.includes("Modulo by zero")
      )) {
        return { kind: "error", message: error.message };
      }
      // Fall through for non-expression inputs
    }
  }

  // Plain text fallback
  if (!looksLikeExpression && tokens.length > 0) {
    return { value: input, type: "string", isAssignment: false, input };
  }

  // Type detection fallback
  if (input.toLowerCase() === "true" || input.toLowerCase() === "false") {
    return { value: input.toLowerCase() === "true", type: "bool", isAssignment: false, input };
  }
  if (/^-?\d+$/.test(input)) {
    return { value: parseInt(input, 10), type: "int", isAssignment: false, input };
  }
  if (/^-?\d+\.\d+$/.test(input)) {
    return { value: parseFloat(input), type: "float", isAssignment: false, input };
  }
  if (input.toLowerCase() === "null") {
    return { value: "null", type: "string", isAssignment: false, input };
  }
  if (input.toLowerCase() === "undefined") {
    return { value: "undefined", type: "string", isAssignment: false, input };
  }
  if (/^\[.*\]$/.test(input)) {
    return { value: input, type: "string", isAssignment: false, input };
  }
  if (/^\{.*\}$/.test(input)) {
    return { value: input, type: "string", isAssignment: false, input };
  }

  return { value: input, type: "string", isAssignment: false, input };
}

export function isKevlarError(result: KevlarEvalResult): result is KevlarError {
  return result !== undefined && "kind" in result && result.kind === "error";
}