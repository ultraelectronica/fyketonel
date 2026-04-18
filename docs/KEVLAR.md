# Kevlar Language Reference

Kevlar is the built-in expression language for **Hazmat Shell**. It provides math, logic, comparisons, variable assignment, and string operations — all from a single command line.

---

## Invoking

```
kevlar <expression>
kevlar 2 + 3 * 4
kevlar sqrt(144)
kevlar x = 42
```

An empty `kevlar` call returns nothing.

---

## Types

| Type   | Literal examples          | Output label |
| ------ | ------------------------- | ------------ |
| int    | `42`, `-7`                | `int`        |
| float  | `3.14`, `0.5`             | `float`      |
| bool   | `true`, `false`           | `bool`       |
| string | `'hello'`, `"world"`      | `string`     |

Untyped tokens that don't match any expression pattern fall back to `string`.

---

## Operators

### Arithmetic

| Op | Meaning      | Example        |
| -- | ------------ | -------------- |
| `+`  | Add        | `kevlar 3 + 4` → 7  |
| `-`  | Subtract   | `kevlar 10 - 3` → 7 |
| `*`  | Multiply   | `kevlar 6 * 7` → 42 |
| `/`  | Divide     | `kevlar 22 / 7` → 3.1428… |
| `%`  | Modulo     | `kevlar 17 % 5` → 2 |
| `**` | Power      | `kevlar 2 ** 10` → 1024 |

### Comparison

| Op  | Meaning            |
| --- | ------------------ |
| `==` | Equal             |
| `!=` | Not equal         |
| `<`  | Less than         |
| `>`  | Greater than      |
| `<=` | Less or equal     |
| `>=` | Greater or equal  |

### Logical

| Op   | Meaning   |
| ---- | --------- |
| `&&` | AND       |
| `\|\|` | OR      |
| `!`  | NOT (unary) |

### Assignment

| Op  | Meaning                | Example                    |
| --- | ---------------------- | -------------------------- |
| `=` | Assign                 | `kevlar x = 10` → 10      |
| `+=`| Add and assign         | `kevlar x += 5` → 15      |
| `-=`| Subtract and assign    | `kevlar x -= 3` → 12      |
| `*=`| Multiply and assign    | `kevlar x *= 2` → 24      |
| `/=`| Divide and assign      | `kevlar x /= 4` → 6       |
| `%=`| Modulo and assign      | `kevlar x %= 5` → 1       |

Variables persist across invocations within the same session (stored in `window.__kevlarVars`).

---

## Constants

| Name   | Value                          |
| ------ | ------------------------------ |
| `PI`   | 3.141592653589793              |
| `E`    | 2.718281828459045              |
| `PHI`  | 1.618033988749895              |
| `TAU`  | 6.283185307179586              |
| `LN2`  | 0.6931471805599453             |
| `LN10` | 2.302585092994046              |
| `SQRT2`| 1.4142135623730951             |

---

## Math Functions

### Basic

| Function   | Description          |
| ---------- | -------------------- |
| `sqrt(n)`  | Square root          |
| `abs(n)`   | Absolute value       |
| `ceil(n)`  | Round up             |
| `floor(n)` | Round down           |
| `round(n)` | Round nearest        |
| `sign(n)`  | Sign (-1, 0, 1)     |
| `trunc(n)` | Truncate decimal     |

### Trigonometric

| Function    | Description        |
| ----------- | ------------------ |
| `sin(n)`    | Sine               |
| `cos(n)`    | Cosine             |
| `tan(n)`    | Tangent            |
| `asin(n)`   | Arc sine           |
| `acos(n)`   | Arc cosine         |
| `atan(n)`   | Arc tangent        |
| `atan2(y,x)`| Arc tangent (2-arg)|

### Exponential / Logarithmic

| Function     | Description             |
| ------------ | ----------------------- |
| `exp(n)`     | e^n                    |
| `log(n)`     | Natural log            |
| `log2(n)`    | Base-2 log             |
| `log10(n)`   | Base-10 log            |
| `pow(b,e)`   | b^e                    |
| `cbrt(n)`    | Cube root              |

### Aggregate

| Function          | Description              |
| ----------------- | ------------------------ |
| `min(a,b,...)`    | Minimum of arguments     |
| `max(a,b,...)`    | Maximum of arguments     |
| `hypot(a,b,...)`  | √(a² + b² + …)         |

---

## String Operations

Concatenation with `+`:

```
kevlar 'hello' + ' ' + 'world'  →  "hello world" (string)
```

---

## Precedence (low → high)

1. Assignment (`=`, `+=`, `-=`, `*=`, `/=`, `%=`)
2. Logical OR (`||`)
3. Logical AND (`&&`)
4. Equality (`==`, `!=`)
5. Comparison (`<`, `>`, `<=`, `>=`)
6. Addition / Subtraction (`+`, `-`)
7. Multiplication / Division / Modulo (`*`, `/`, `%`)
8. Power (`**`)
9. Unary (`!`, `-`)
10. Parentheses / Function calls

Parentheses override precedence:

```
kevlar (2 + 3) * 4   → 20
kevlar 2 + 3 * 4     → 14
```

---

## Error Handling

| Error               | Trigger                     |
| ------------------- | --------------------------- |
| Division by zero    | `x / 0`, `x /= 0`          |
| Modulo by zero      | `x % 0`, `x %= 0`          |
| Unexpected token    | Invalid syntax              |
| Missing parenthesis | Unclosed `( ` or `func(`    |

---

## Integration with Hazmat Shell

- **Pipes**: `ls | kevlar 'count: ' + length` (when piping outputs)
- **Variables**: Persist across the entire browser session
- **Aliases**: `alias k=kevlar` for quick access
- **Virtual files**: Syntax and examples available at `/home/orpheus/kevlar/`
  - `cat kevlar/README.kv`
  - `cat kevlar/syntax.kv`
  - `cat kevlar/math.kv`
  - `cat kevlar/examples.kv`

---

## Source

The Kevlar runtime is implemented in TypeScript at `lib/kevlar/types.ts` and consumed by Hazmat Shell via the `kevlar` command.