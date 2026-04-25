import { parse } from "./parser";
import type { ASTNode } from "./parser";
import { Environment, KevlarValue, KevlarList, KevlarFn, BUILTIN_FUNCTIONS, MATH_CONSTANTS, stringify } from "./builtins";

export class ReturnValue {
  constructor(public value: KevlarValue) {}
}

export class BreakSignal {}
export class ContinueSignal {}

export interface EvalResult {
  output: string[];
  value: KevlarValue;
}

export function evaluate(node: ASTNode, env: Environment): KevlarValue {
  switch (node.kind) {
    case "program":
      return evalProgram(node, env);
    case "let_decl":
      return evalLetDecl(node, env);
    case "fn_decl":
      return evalFnDecl(node, env);
    case "if":
      return evalIf(node, env);
    case "for_in":
      return evalForIn(node, env);
    case "while":
      return evalWhile(node, env);
    case "match":
      return evalMatch(node, env);
    case "return":
      throw new ReturnValue(evaluate(node.value, env));
    case "assignment":
      return evalAssignment(node, env);
    case "binary":
      return evalBinary(node, env);
    case "unary":
      return evalUnary(node, env);
    case "call":
      return evalCall(node, env);
    case "index":
      return evalIndex(node, env);
    case "list":
      return evalList(node, env);
    case "range":
      return evalRange(node, env);
    case "identifier":
      return env.get(node.name);
    case "number_literal":
      return node.value;
    case "string_literal":
      return node.value;
    case "boolean_literal":
      return node.value;
    case "string_interp":
      return evalStringInterp(node, env);
    case "print":
      return evalPrint(node, env);
    case "block":
      return evalBlock(node, env);
    default:
      throw new Error(`Unknown node kind: ${(node as { kind: string }).kind}`);
  }
}

function evalProgram(node: Extract<ASTNode, { kind: "program" }>, env: Environment): KevlarValue {
  let result: KevlarValue = null;
  for (const stmt of node.statements) {
    result = evaluate(stmt, env);
  }
  return result;
}

function evalLetDecl(node: Extract<ASTNode, { kind: "let_decl" }>, env: Environment): KevlarValue {
  const value = evaluate(node.value, env);
  env.declare(node.name, value, node.mutable);
  return value;
}

function evalFnDecl(node: Extract<ASTNode, { kind: "fn_decl" }>, env: Environment): KevlarValue {
  const paramNames = node.params.map(p => p.name);
  const fn: KevlarFn = {
    kind: "fn",
    name: node.name,
    params: paramNames,
    body: node.body,
    closure: env,
  };
  env.declare(node.name, fn, true);
  return fn;
}

function evalIf(node: Extract<ASTNode, { kind: "if" }>, env: Environment): KevlarValue {
  const condition = evaluate(node.condition, env);
  if (isTruthy(condition)) {
    return evaluate(node.thenBranch, env.child());
  } else if (node.elseBranch) {
    return evaluate(node.elseBranch, env.child());
  }
  return null;
}

function evalForIn(node: Extract<ASTNode, { kind: "for_in" }>, env: Environment): KevlarValue {
  const iterable = evaluate(node.iterable, env);
  const items = getIterableItems(iterable);
  let result: KevlarValue = null;
  for (const item of items) {
    const scope = env.child();
    scope.declare(node.variable, item, true);
    try {
      result = evaluate(node.body, scope);
    } catch (e) {
      if (e instanceof BreakSignal) break;
      if (e instanceof ContinueSignal) continue;
      throw e;
    }
  }
  return result;
}

function evalWhile(node: Extract<ASTNode, { kind: "while" }>, env: Environment): KevlarValue {
  let result: KevlarValue = null;
  let iterations = 0;
  const MAX_ITERATIONS = 10000;
  while (isTruthy(evaluate(node.condition, env))) {
    if (iterations++ > MAX_ITERATIONS) throw new Error("While loop exceeded maximum iterations");
    try {
      result = evaluate(node.body, env.child());
    } catch (e) {
      if (e instanceof BreakSignal) break;
      if (e instanceof ContinueSignal) continue;
      throw e;
    }
  }
  return result;
}

function evalMatch(node: Extract<ASTNode, { kind: "match" }>, env: Environment): KevlarValue {
  const value = evaluate(node.expression, env);
  for (const arm of node.arms) {
    if (matchPattern(arm.pattern, value, env)) {
      return evaluate(arm.body, env.child());
    }
  }
  return null;
}

function matchPattern(pattern: import("./parser").MatchPattern, value: KevlarValue, env: Environment): boolean {
  switch (pattern.kind) {
    case "wildcard": return true;
    case "literal": return pattern.value === value;
    case "identifier":
      env.declare(pattern.name, value, true);
      return true;
  }
}

function evalAssignment(node: Extract<ASTNode, { kind: "assignment" }>, env: Environment): KevlarValue {
  const value = evaluate(node.value, env);
  if (node.target.kind === "identifier") {
    if (node.operator === "=") {
      env.set(node.target.name, value);
    } else {
      const current = env.get(node.target.name);
      const computed = computeCompoundAssignment(node.operator, current, value);
      env.set(node.target.name, computed);
      return computed;
    }
    return value;
  }
  if (node.target.kind === "index") {
    const obj = evaluate(node.target.object, env);
    const idx = evaluate(node.target.index, env);
    if (obj && typeof obj === "object" && "kind" in obj && (obj as KevlarList).kind === "list") {
      const list = (obj as KevlarList).elements;
      const i = typeof idx === "number" ? idx : 0;
      if (node.operator === "=") {
        list[i] = value;
      } else {
        list[i] = computeCompoundAssignment(node.operator, list[i], value);
      }
      return value;
    }
  }
  throw new Error("Invalid assignment target");
}

function computeCompoundAssignment(op: string, current: KevlarValue, value: KevlarValue): KevlarValue {
  const a = typeof current === "number" ? current : 0;
  const b = typeof value === "number" ? value : 0;
  switch (op) {
    case "+=": return a + b;
    case "-=": return a - b;
    case "*=": return a * b;
    case "/=": if (b === 0) throw new Error("Division by zero"); return a / b;
    case "%=": if (b === 0) throw new Error("Modulo by zero"); return a % b;
    default: return value;
  }
}

function evalBinary(node: Extract<ASTNode, { kind: "binary" }>, env: Environment): KevlarValue {
  const left = evaluate(node.left, env);
  if (node.operator === "&&") return isTruthy(left) ? isTruthy(evaluate(node.right, env)) : false;
  if (node.operator === "||") return isTruthy(left) ? true : isTruthy(evaluate(node.right, env));

  const right = evaluate(node.right, env);

  if (node.operator === "+" && (typeof left === "string" || typeof right === "string")) {
    return stringify(left) + stringify(right);
  }

  const a = typeof left === "number" ? left : 0;
  const b = typeof right === "number" ? right : 0;

  switch (node.operator) {
    case "+": return a + b;
    case "-": return a - b;
    case "*": return a * b;
    case "/": if (b === 0) throw new Error("Division by zero"); return a / b;
    case "%": if (b === 0) throw new Error("Modulo by zero"); return a % b;
    case "**": return Math.pow(a, b);
    case "==": return left === right;
    case "!=": return left !== right;
    case "<": return a < b;
    case ">": return a > b;
    case "<=": return a <= b;
    case ">=": return a >= b;
    default: throw new Error(`Unknown operator: ${node.operator}`);
  }
}

function evalUnary(node: Extract<ASTNode, { kind: "unary" }>, env: Environment): KevlarValue {
  const operand = evaluate(node.operand, env);
  if (node.operator === "!") return !isTruthy(operand);
  if (node.operator === "-") return -(typeof operand === "number" ? operand : 0);
  throw new Error(`Unknown unary operator: ${node.operator}`);
}

function evalCall(node: Extract<ASTNode, { kind: "call" }>, env: Environment): KevlarValue {
  const args = node.args.map(a => evaluate(a, env));

  if (node.callee.kind === "identifier") {
    const name = node.callee.name;

    const builtin = BUILTIN_FUNCTIONS.find(f => f.name === name);
    if (builtin) return builtin.fn(...args);

    if (name in MATH_CONSTANTS) return MATH_CONSTANTS[name];

    if (name === "break") throw new BreakSignal();
    if (name === "continue") throw new ContinueSignal();

    const fn = env.get(name);
    if (fn && typeof fn === "object" && "kind" in fn && fn.kind === "fn") {
      return callFunction(fn as KevlarFn, args);
    }
  }

  const callee = evaluate(node.callee, env);
  if (callee && typeof callee === "object" && "kind" in callee && callee.kind === "fn") {
    return callFunction(callee as KevlarFn, args);
  }

  throw new Error(`Cannot call value: ${stringify(callee)}`);
}

function callFunction(fn: KevlarFn, args: KevlarValue[]): KevlarValue {
  const scope = fn.closure.child();
  for (let i = 0; i < fn.params.length; i++) {
    scope.declare(fn.params[i], args[i] ?? null, true);
  }
  try {
    const result = evaluate(fn.body, scope);
    return result;
  } catch (e) {
    if (e instanceof ReturnValue) return e.value;
    throw e;
  }
}

function evalIndex(node: Extract<ASTNode, { kind: "index" }>, env: Environment): KevlarValue {
  const obj = evaluate(node.object, env);
  const idx = evaluate(node.index, env);
  if (obj && typeof obj === "object" && "kind" in obj && (obj as KevlarList).kind === "list") {
    const list = (obj as KevlarList).elements;
    const i = typeof idx === "number" ? idx : 0;
    return list[i] ?? null;
  }
  if (typeof obj === "string") {
    const i = typeof idx === "number" ? idx : 0;
    return obj[i] ?? null;
  }
  throw new Error("Cannot index this value");
}

function evalList(node: Extract<ASTNode, { kind: "list" }>, env: Environment): KevlarValue {
  const elements = node.elements.map(e => evaluate(e, env));
  return { kind: "list", elements } as KevlarList;
}

function evalRange(node: Extract<ASTNode, { kind: "range" }>, env: Environment): KevlarValue {
  const start = evaluate(node.start, env);
  const end = evaluate(node.end, env);
  const s = typeof start === "number" ? start : 0;
  const e = typeof end === "number" ? end : 0;
  const elements: KevlarValue[] = [];
  for (let i = s; i < e; i++) elements.push(i);
  return { kind: "list", elements } as KevlarList;
}

function evalStringInterp(node: Extract<ASTNode, { kind: "string_interp" }>, env: Environment): KevlarValue {
  let result = "";
  for (const part of node.parts) {
    if (typeof part === "string") {
      result += part;
    } else {
      result += stringify(evaluate(part, env));
    }
  }
  return result;
}

function evalPrint(node: Extract<ASTNode, { kind: "print" }>, env: Environment): KevlarValue {
  const value = evaluate(node.value, env);
  const output = stringify(value);
  if (typeof window !== "undefined") {
    const arr = (window as unknown as Record<string, string[]>).__kevlarOutput ?? [];
    arr.push(output);
    (window as unknown as Record<string, string[]>).__kevlarOutput = arr;
  }
  return value;
}

function evalBlock(node: Extract<ASTNode, { kind: "block" }>, env: Environment): KevlarValue {
  const scope = env.child();
  let result: KevlarValue = null;
  for (const stmt of node.statements) {
    result = evaluate(stmt, scope);
  }
  return result;
}

function isTruthy(v: KevlarValue): boolean {
  if (v === null) return false;
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v !== 0;
  if (typeof v === "string") return v.length > 0;
  if (v && typeof v === "object" && "kind" in v) {
    if ((v as { kind: string }).kind === "list") return (v as KevlarList).elements.length > 0;
  }
  return true;
}

function getIterableItems(v: KevlarValue): KevlarValue[] {
  if (v && typeof v === "object" && "kind" in v && (v as { kind: string }).kind === "list") {
    return (v as KevlarList).elements;
  }
  if (typeof v === "string") {
    return v.split("").map(c => c as KevlarValue);
  }
  throw new Error("Cannot iterate over this value");
}

export function runKevlar(source: string, env?: Environment): EvalResult {
  const output: string[] = [];
  const environment = env ?? new Environment();

  if (typeof window !== "undefined") {
    (window as unknown as Record<string, string[]>).__kevlarOutput = [];
  }

  try {
    const ast = parse(source);
    const value = evaluate(ast, environment);

    if (typeof window !== "undefined") {
      const stored = (window as unknown as Record<string, string[]>).__kevlarOutput;
      if (stored) output.push(...stored);
    }

    return { output, value };
  } catch (e) {
    if (typeof window !== "undefined") {
      const stored = (window as unknown as Record<string, string[]>).__kevlarOutput;
      if (stored) output.push(...stored);
    }

    const message = e instanceof Error ? e.message : String(e);
    throw new Error(message);
  }
}