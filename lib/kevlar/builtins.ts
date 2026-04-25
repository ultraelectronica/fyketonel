export const MATH_CONSTANTS: Record<string, number> = {
  PI: Math.PI,
  E: Math.E,
  PHI: 1.618033988749895,
  TAU: Math.PI * 2,
  LN2: Math.LN2,
  LN10: Math.LN10,
  SQRT2: Math.SQRT2,
};

export type KevlarValue = number | boolean | string | KevlarList | KevlarFn | null;

export interface KevlarList {
  kind: "list";
  elements: KevlarValue[];
}

export interface KevlarFn {
  kind: "fn";
  name: string;
  params: string[];
  body: import("./parser").ASTNode;
  closure: Environment;
}

export class Environment {
  private vars: Map<string, { value: KevlarValue; mutable: boolean }>;
  private parent: Environment | null;

  constructor(parent?: Environment) {
    this.vars = new Map();
    this.parent = parent ?? null;
  }

  get(name: string): KevlarValue {
    if (this.vars.has(name)) return this.vars.get(name)!.value;
    if (this.parent) return this.parent.get(name);
    return 0;
  }

  set(name: string, value: KevlarValue, mutable = true): void {
    const existing = this.find(name);
    if (existing) {
      const entry = existing.vars.get(name)!;
      if (!entry.mutable) throw new Error(`Cannot assign to immutable variable '${name}'`);
      entry.value = value;
    } else {
      this.vars.set(name, { value, mutable });
    }
  }

  declare(name: string, value: KevlarValue, mutable: boolean): void {
    this.vars.set(name, { value, mutable });
  }

  has(name: string): boolean {
    if (this.vars.has(name)) return true;
    if (this.parent) return this.parent.has(name);
    return false;
  }

  private find(name: string): Environment | null {
    if (this.vars.has(name)) return this;
    if (this.parent) return this.parent.find(name);
    return null;
  }

  child(): Environment {
    return new Environment(this);
  }
}

export interface BuiltinFn {
  name: string;
  fn: (...args: KevlarValue[]) => KevlarValue;
}

export const BUILTIN_FUNCTIONS: BuiltinFn[] = [
  { name: "sqrt", fn: (a) => Math.sqrt(a as number) },
  { name: "abs", fn: (a) => Math.abs(a as number) },
  { name: "ceil", fn: (a) => Math.ceil(a as number) },
  { name: "floor", fn: (a) => Math.floor(a as number) },
  { name: "round", fn: (a) => Math.round(a as number) },
  { name: "sign", fn: (a) => Math.sign(a as number) },
  { name: "trunc", fn: (a) => Math.trunc(a as number) },
  { name: "sin", fn: (a) => Math.sin(a as number) },
  { name: "cos", fn: (a) => Math.cos(a as number) },
  { name: "tan", fn: (a) => Math.tan(a as number) },
  { name: "asin", fn: (a) => Math.asin(a as number) },
  { name: "acos", fn: (a) => Math.acos(a as number) },
  { name: "atan", fn: (a) => Math.atan(a as number) },
  { name: "atan2", fn: (a, b) => Math.atan2(a as number, b as number) },
  { name: "exp", fn: (a) => Math.exp(a as number) },
  { name: "log", fn: (a) => Math.log(a as number) },
  { name: "log2", fn: (a) => Math.log2(a as number) },
  { name: "log10", fn: (a) => Math.log10(a as number) },
  { name: "pow", fn: (a, b) => Math.pow(a as number, b as number) },
  { name: "cbrt", fn: (a) => Math.cbrt(a as number) },
  { name: "min", fn: (...args) => Math.min(...(args as number[])) },
  { name: "max", fn: (...args) => Math.max(...(args as number[])) },
  { name: "hypot", fn: (...args) => Math.hypot(...(args as number[])) },
  { name: "len", fn: (a) => {
    if (a && typeof a === "object" && "kind" in a && a.kind === "list") return (a as KevlarList).elements.length;
    if (typeof a === "string") return a.length;
    return 0;
  }},
  { name: "push", fn: (list, val) => {
    if (list && typeof list === "object" && "kind" in list && list.kind === "list") {
      (list as KevlarList).elements.push(val);
      return list;
    }
    throw new Error("push() requires a list");
  }},
  { name: "pop", fn: (list) => {
    if (list && typeof list === "object" && "kind" in list && list.kind === "list") {
      return (list as KevlarList).elements.pop() ?? null;
    }
    throw new Error("pop() requires a list");
  }},
  { name: "str", fn: (a) => stringify(a) },
  { name: "int", fn: (a) => {
    if (typeof a === "boolean") return a ? 1 : 0;
    if (typeof a === "number") return Math.trunc(a);
    if (typeof a === "string") return parseInt(a, 10) || 0;
    return 0;
  }},
  { name: "float", fn: (a) => {
    if (typeof a === "boolean") return a ? 1.0 : 0.0;
    if (typeof a === "number") return a;
    if (typeof a === "string") return parseFloat(a) || 0;
    return 0;
  }},
  { name: "type", fn: (a) => getType(a) },
  { name: "rand", fn: () => Math.random() },
  { name: "rand_int", fn: (a, b) => Math.floor(Math.random() * ((b as number) - (a as number) + 1)) + (a as number) },
];

export function stringify(v: KevlarValue): string {
  if (v === null) return "null";
  if (typeof v === "boolean") return v ? "true" : "false";
  if (typeof v === "number") return Number.isInteger(v) ? v.toString() : v.toString();
  if (typeof v === "string") return v;
  if (v && typeof v === "object" && "kind" in v) {
    if (v.kind === "list") return `[${(v as KevlarList).elements.map(stringify).join(", ")}]`;
    if (v.kind === "fn") return `<fn ${(v as KevlarFn).name}>`;
  }
  return String(v);
}

export function getType(v: KevlarValue): string {
  if (v === null) return "null";
  if (typeof v === "number") return Number.isInteger(v) ? "int" : "float";
  if (typeof v === "boolean") return "bool";
  if (typeof v === "string") return "string";
  if (v && typeof v === "object" && "kind" in v) {
    if ((v as { kind: string }).kind === "list") return "list";
    if ((v as { kind: string }).kind === "fn") return "fn";
  }
  return "unknown";
}