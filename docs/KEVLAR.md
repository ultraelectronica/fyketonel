# Kevlar v2 Language Reference

Kevlar v2 is the built-in programming language for **Hazmat Shell**. It features **Rust-like syntax with Dart-like simplicity** — full control flow, functions, pattern matching, and more — all from a single command line or the **Oxygen (O₂)** code editor.

---

## Invoking

```
kevlar <expression>
kevlar 2 + 3 * 4;
kevlar let x = 42;
kevlar fn square(n) => n * n;
oxygen              # Open the O₂ code editor
oxygen program.kv   # Open a file in O₂
```

---

## The Oxygen Editor (O₂)

Oxygen is the built-in code editor for Kevlar v2 inside Hazmat Shell.

- **Open**: `oxygen` or `oxygen filename.kv`
- **Commands**: `:run` (execute), `:save [f]` (save file), `:quit` (exit), `:clear` (clear output), `:help`
- **Shortcuts**: `Ctrl+Enter` (run), `Ctrl+S` (save), `Escape` (command mode), `Enter` (smart indent), `Tab` (indent)

Statements can end with `;`. Newlines still separate statements too, but the reference examples use semicolons for readability.

---

## Variables

| Syntax | Meaning | Example |
|--------|---------|---------|
| `let x = val;` | Immutable binding | `let x = 42;` |
| `let mut x = val;` | Mutable binding | `let mut y = 0;` |
| `var x = val;` | Mutable (Dart shorthand) | `var count = 0;` |
| `let x: type = val;` | Typed binding | `let name: string = "hazmat";` |

---

## Functions

```kevlar
fn add(a, b) {
    a + b;
}

fn double(n) => n * 2;

fn greet(name: string) -> string {
    "Hello, ${name}!";
}

fn factorial(n) {
    if n <= 1 {
        return 1;
    }
    n * factorial(n - 1);
}
```

---

## Types

| Type | Literal examples | Output label |
|------|-----------------|--------------|
| int | `42`, `-7` | `int` |
| float | `3.14`, `0.5` | `float` |
| bool | `true`, `false` | `bool` |
| string | `"hello"`, `'world'` | `string` |
| list | `[1, 2, 3]` | `list` |
| fn | `<fn name>` | `fn` |

---

## Control Flow

### if / else if / else

```kevlar
if x > 10 {
    print("big");
} else if x > 5 {
    print("medium");
} else {
    print("small");
}
```

### for ... in

```kevlar
for i in 0..10 {
    print(i);
}

for item in [1, 2, 3] {
    print(item);
}
```

### while

```kevlar
while count < 5 {
    count += 1;
}
```

---

## Match Expressions

```kevlar
match x {
    0 => "zero"
    1 => "one"
    _ => "many"
}
```

---

## Lists

```kevlar
let nums = [1, 2, 3];
nums[0]          // 1
len(nums)        // 3
push(nums, 4);   // [1, 2, 3, 4]
pop(nums);       // removes and returns last
```

---

## String Interpolation

```kevlar
let name = "Hazmat";
let msg = "Hello, ${name}!";
// Escapes: \n \t \\ \' \"
```

---

## Operators

### Arithmetic

| Op | Meaning | Example |
|----|---------|---------|
| `+` | Add | `3 + 4` → 7 |
| `-` | Subtract | `10 - 3` → 7 |
| `*` | Multiply | `6 * 7` → 42 |
| `/` | Divide | `22 / 7` → 3.1428… |
| `%` | Modulo | `17 % 5` → 2 |
| `**` | Power | `2 ** 10` → 1024 |

### Comparison

| Op | Meaning |
|----|---------|
| `==` | Equal |
| `!=` | Not equal |
| `<` | Less than |
| `>` | Greater than |
| `<=` | Less or equal |
| `>=` | Greater or equal |

### Logical

| Op | Meaning |
|----|---------|
| `&&` | AND |
| `||` | OR |
| `!` | NOT |

### Assignment

| Op | Meaning | Example |
|----|---------|---------|
| `=` | Assign | `x = 10` |
| `+=` | Add and assign | `x += 5` |
| `-=` | Subtract and assign | `x -= 3` |
| `*=` | Multiply and assign | `x *= 2` |
| `/=` | Divide and assign | `x /= 4` |
| `%=` | Modulo and assign | `x %= 5` |

---

## Constants

| Name | Value |
|------|-------|
| `PI` | 3.141592653589793 |
| `E` | 2.718281828459045 |
| `PHI` | 1.618033988749895 |
| `TAU` | 6.283185307179586 |
| `LN2` | 0.6931471805599453 |
| `LN10` | 2.302585092994046 |
| `SQRT2` | 1.4142135623730951 |

---

## Built-in Functions

### Math

| Function | Description |
|----------|-------------|
| `sqrt(n)` | Square root |
| `abs(n)` | Absolute value |
| `ceil(n)` | Round up |
| `floor(n)` | Round down |
| `round(n)` | Round nearest |
| `sign(n)` | Sign (-1, 0, 1) |
| `trunc(n)` | Truncate decimal |
| `sin(n)`, `cos(n)`, `tan(n)` | Trigonometric |
| `asin(n)`, `acos(n)`, `atan(n)`, `atan2(y,x)` | Inverse trig |
| `exp(n)`, `log(n)`, `log2(n)`, `log10(n)` | Exponential/Log |
| `pow(b,e)`, `cbrt(n)` | Power/Root |
| `min(a,b,...)`, `max(a,b,...)`, `hypot(a,b,...)` | Aggregate |

### Utility

| Function | Description |
|----------|-------------|
| `print(x)` | Output a value |
| `len(x)` | Length of list/string |
| `push(list, val)` | Append to list |
| `pop(list)` | Remove last element |
| `str(x)` | Convert to string |
| `int(x)` | Convert to int |
| `float(x)` | Convert to float |
| `type(x)` | Get type name |
| `rand()` | Random 0–1 |
| `rand_int(a, b)` | Random int a–b |

---

## Comments

```kevlar
// This is a line comment
let x = 42;  // inline comment
```

---

## Error Handling

| Error | Trigger |
|-------|---------|
| Division by zero | `x / 0`, `x /= 0` |
| Modulo by zero | `x % 0`, `x %= 0` |
| Unexpected token | Invalid syntax |
| Missing parenthesis | Unclosed `( ` or `{` |
| Cannot assign to immutable | `let x = 5; x = 10` |
| Maximum iterations | While loop exceeds 10,000 |

---

## Integration with Hazmat Shell

- **Oxygen Editor**: `oxygen` or `oxygen filename.kv`
- **Pipes**: `ls | kevlar len`
- **Variables**: Persist across the entire browser session
- **Aliases**: `alias k=kevlar` for quick access
- **Virtual files**: Syntax and examples at `/home/orpheus/kevlar/`
  - `cat kevlar/README.md`
  - `cat kevlar/lesson.md`
  - `ls kevlar/lessons`
  - `cat kevlar/lessons/01-basics.kv`
  - `cat kevlar/syntax.md`
  - `cat kevlar/examples.md`

---

## Source

The Kevlar v2 runtime is implemented in TypeScript at `lib/kevlar/`:
- `lexer.ts` — Tokenizer
- `parser.ts` — Parser (produces AST)
- `evaluator.ts` — Evaluator (interprets AST)
- `builtins.ts` — Built-in functions and constants
- `oxygen.tsx` — Oxygen (O₂) code editor component
- `index.ts` — Public API
- `types.ts` — Legacy expression evaluator (backward compatible)
