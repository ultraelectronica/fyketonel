import { Environment, KevlarValue, stringify, getType } from "./builtins";
import { runKevlar } from "./evaluator";

export { TokenType } from "./lexer";
export type { ProgramNode, LetDeclNode, FnDeclNode, IfNode, ForInNode, WhileNode, MatchNode, ReturnNode, AssignmentNode, BinaryExprNode, UnaryExprNode, CallNode, IndexNode, ListNode, StringInterpNode, RangeNode, IdentifierNode, NumberLiteralNode, StringLiteralNode, BooleanLiteralNode, PrintNode, BlockNode } from "./parser";
export type { EvalResult } from "./evaluator";
export { Environment } from "./builtins";
export type { KevlarValue as KevlarV2Value, KevlarList as KevlarListType, KevlarFn as KevlarFnType } from "./builtins";
export { stringify, getType } from "./builtins";
export { parse as parseKevlar } from "./parser";
export { evaluate as evaluateKevlar } from "./evaluator";
export { runKevlar } from "./evaluator";

let globalEnv: Environment | null = null;

function getGlobalEnv(): Environment {
  if (!globalEnv) {
    globalEnv = new Environment();
    if (typeof window !== "undefined") {
      (window as unknown as Record<string, unknown>).__kevlarEnvV2 = globalEnv;
    }
  }
  return globalEnv;
}

export function kevlarRun(source: string): { output: string[]; value: KevlarValue; type: string } {
  const env = getGlobalEnv();
  try {
    const result = runKevlar(source, env);
    const typeLabel = getType(result.value);
    return { output: result.output, value: result.value, type: typeLabel };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    throw new Error(message);
  }
}

export function kevlarRunSingle(expression: string): { output: string[]; value: KevlarValue; type: string } {
  const env = getGlobalEnv();
  try {
    const result = runKevlar(expression, env);
    const typeLabel = getType(result.value);
    return { output: result.output, value: result.value, type: typeLabel };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    throw new Error(message);
  }
}

export function resetKevlarEnv(): void {
  globalEnv = new Environment();
  if (typeof window !== "undefined") {
    (window as unknown as Record<string, unknown>).__kevlarEnvV2 = globalEnv;
  }
}



export type KevlarResult = {
  value: string | number | boolean | null;
  type: "int" | "float" | "bool" | "string" | "list" | "fn" | "null";
  isAssignment: boolean;
  varName?: string;
  varOp?: string;
  input: string;
};

export type KevlarError = {
  kind: "error";
  message: string;
};

export type KevlarEvalResult = KevlarResult | KevlarError;

export function isKevlarError(result: KevlarEvalResult): result is KevlarError {
  return result !== undefined && "kind" in result && result.kind === "error";
}

export function getVariables(): Record<string, KevlarValue> {
  if (typeof window !== "undefined") {
    const env = (window as unknown as Record<string, unknown>).__kevlarEnvV2 as Environment | undefined;
    if (env) return {};
  }
  return {};
}