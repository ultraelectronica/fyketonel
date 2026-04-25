export const kevlarReadmeRaw = `╔══════════════════════════════════════╗
║       Kevlar v2 — Language Shell      ║
╚══════════════════════════════════════╝

Kevlar v2: Rust-like syntax, Dart simplicity.
Full programming language with let, fn, if, loops, match.

Type 'kevlar' for expression help.
Type 'oxygen' to open the O₂ code editor.
Type 'cat kevlar/lesson.md' for the lesson index.
Type 'ls kevlar/lessons' to browse guided lessons.
Type 'cat kevlar/syntax.md' for syntax reference.
Type 'cat kevlar/examples.md' for examples.
`;

export const kevlarLessonRaw = `Kevlar Guided Lessons
=====================

Start with the tutorial (W3Schools-style):
  cat kevlar/tutorial/TUTORIAL.md
  oxygen kevlar/tutorial/01-hello-world.kv

Exercise lessons:
  cat kevlar/lessons/01-basics.kv
  cat kevlar/lessons/02-functions.kv
  cat kevlar/lessons/03-control-flow.kv
  cat kevlar/lessons/04-mini-project.kv

Open a lesson in Oxygen:
  oxygen kevlar/tutorial/01-hello-world.kv
  oxygen kevlar/lessons/01-basics.kv

Workflow:
  1. Read with cat
  2. Open in Oxygen
  3. Change the code
  4. Run with Ctrl+Enter
  5. Save your own copy with :save

Warm-up mission:
  - Read tutorial chapter 1
  - Run it in Oxygen
  - Add one extra variable
  - Add one extra print() call
  - Save it as practice-01.kv
`;

export const kevlarSyntaxRaw = `Kevlar v2 Syntax Reference
══════════════════════

Variables:
  let x = 42          // immutable
  let mut y = 0       // mutable
  var z = 10          // mutable (Dart-style)
  let name: string = "hazmat"  // typed

Functions:
  fn add(a, b) { a + b }
  fn double(n) => n * 2
  fn greet(name: string) -> string {
    "Hello, \${name}!"
  }

Control Flow:
  if x > 10 { ... } else { ... }
  if x > 10 { ... } else if x > 5 { ... }

Loops:
  for i in 0..10 { print(i) }
  for item in [1, 2, 3] { print(item) }
  while count < 5 { count += 1 }

Match:
  match x {
    0 => "zero"
    1 => "one"
    _ => "many"
  }

Lists:
  let nums = [1, 2, 3]
  nums[0]           // 1
  len(nums)         // 3
  push(nums, 4)    // [1, 2, 3, 4]

Strings:
  "Hello, \${name}!"
  // Escapes: \\n \\t \\\\ \\' \\"


Arithmetic:    +  -  *  /  %  **
Comparison:    == != <  >  <= >=
Logical:       && || !
Assignment:    =  += -= *= /= %=
Grouping:      ( )
Range:         0..10
Comments:      // like this

Constants: PI, E, PHI, TAU, LN2, LN10, SQRT2

Built-ins:
  print(x)      len(list)     push(l, v)   pop(l)
  str(x)        int(x)        float(x)     type(x)
  rand()        rand_int(a, b)
`;

export const kevlarMathRaw = `Kevlar Math Functions
──────────────────────

Basic:     sqrt(), abs(), ceil(), floor(), round(), sign(), trunc()
Trig:      sin(), cos(), tan(), asin(), acos(), atan(), atan2()
Exp/Log:   exp(), log(), log2(), log10(), pow(), cbrt()
Aggregate: min(), max(), hypot()

Usage: kevlar sqrt(16)       → 4
       kevlar pow(2, 10)     → 1024
       kevlar sin(PI / 2)    → 1
`;

export const kevlarExamplesRaw = `Kevlar v2 Examples
════════════════

// Simple expressions
kevlar 2 + 3 * 4          → 14
kevlar sqrt(144)           → 12
kevlar PI                  → 3.14159...

// Variables
kevlar let x = 42          → 42
kevlar let mut y = 0       → 0
kevlar y += 8              → 8

// Functions
kevlar fn square(n) => n * n
kevlar square(5)           → 25

// Lists and loops (use oxygen editor)
let fruits = ["apple", "banana", "cherry"]
for f in fruits {
  print(f)
}

// Match expression
match 3 {
  0 => "zero"
  1 => "one"
  _ => "many"
}

// String interpolation
let name = "Hazmat"
"Hello from \${name}!"

// Use 'oxygen' command to write multi-line programs
`;

export const kevlarLesson01Raw = `// Kevlar Lesson 1: expressions, variables, and strings
// Open with: oxygen kevlar/lessons/01-basics.kv
// Run with Ctrl+Enter.

print("Lesson 1: basics")

let fuel = 12
let bonus = 3
let total = fuel + bonus * 2
print(total)

let pilot = "Orpheus"
print("Pilot: \${pilot}")

let tools = ["torch", "rope", "flare"]
print(len(tools))
print(tools[0])

// Drill 1:
// Change fuel and bonus, then run again.

// Drill 2:
// Uncomment the next two lines.
// push(tools, "mask")
// print(len(tools))

// Drill 3:
// Create let station = "bay-12" and print it.
`;

export const kevlarLesson02Raw = `// Kevlar Lesson 2: functions and reuse
// Open with: oxygen kevlar/lessons/02-functions.kv

print("Lesson 2: functions")

fn double(n) => n * 2

fn badge(name, score) {
  "Pilot \${name} scored \${score}"
}

let score = double(7)
print(score)
print(badge("Nova", score))

let values = [2, 4, 6]
for value in values {
  print(double(value))
}

// Drill 1:
// Write fn triple(n) => n * 3 and print(triple(5)).

// Drill 2:
// Make a fn greet(name) that returns a string.

// Drill 3:
// Replace "Nova" with your own name.
`;

export const kevlarLesson03Raw = `// Kevlar Lesson 3: control flow
// Open with: oxygen kevlar/lessons/03-control-flow.kv

print("Lesson 3: control flow")

let mut hp = 2

if hp > 2 {
  print("stable")
} else {
  print("repair")
}

let mut countdown = 3
while countdown > 0 {
  print(countdown)
  countdown -= 1
}
print("lift-off")

// Match practice:
// Uncomment and inspect the result.
// match hp {
//   0 => "offline"
//   1 => "critical"
//   _ => "ready"
// }

// Drill:
// Start hp at 5 and change the countdown length.
`;

export const kevlarLesson04Raw = `// Kevlar Lesson 4: mini project
// Goal: build a tiny scanner report.

print("Lesson 4: scanner report")

fn classify(temp) {
  if temp > 80 {
    "hot"
  } else if temp > 50 {
    "warm"
  } else {
    "cold"
  }
}

let readings = [42, 67, 91]
for reading in readings {
  print(classify(reading))
}

// Mission:
// 1. Add more readings.
// 2. Change the thresholds in classify().
// 3. Print a label before each result.
// 4. Save your version as scanner-report.kv.
`;

export const kevlarTutorialRaw = `╔══════════════════════════════════════╗
║    Kevlar Tutorial — Learn Kevlar     ║
╚══════════════════════════════════════╝

A step-by-step guide to programming in Kevlar v2.
Start from zero and build real programs.

Pick a chapter and open it in Oxygen:

  oxygen kevlar/tutorial/01-hello-world.kv

Or read it first:

  cat kevlar/tutorial/01-hello-world.kv

──────────────────────────────────────

  01 — Hello World        print(), comments, first program
  02 — Variables          let, let mut, var, types
  03 — Operators          + - * / %, comparisons, logic
  04 — Functions          fn, arrow syntax, reuse
  05 — Control Flow       if / else if / else
  06 — Loops              for, while, break, continue
  07 — Lists              [1,2,3], push, pop, len
  08 — Match              pattern matching
  09 — Strings            interpolation, escaping
  10 — Built-ins          math, types, random
  11 — Mini Project       build a temperature scanner!

──────────────────────────────────────

Workflow:
  1. cat kevlar/tutorial/01-hello-world.kv
  2. oxygen kevlar/tutorial/01-hello-world.kv
  3. Read the comments and code
  4. Run with Ctrl+Enter
  5. Try the exercises at the bottom
  6. Move to the next chapter

Quick reference:
  cat kevlar/syntax.md      — full syntax reference
  cat kevlar/examples.md    — more examples
  ls kevlar/tutorial        — list all chapters
`;

export const kevlarTutor01Raw = `// ============================================
// Kevlar Tutorial — Chapter 1: Hello World
// ============================================
// Kevlar is the built-in language of Hazmat Shell.
// It uses Rust-like syntax with Dart-like simplicity.
// Run this file with Ctrl+Enter in Oxygen,
// or type 'kevlar' followed by an expression.
//
// Comments start with // and are ignored.
// Let's write your first program!

print("Hello World!")

// print() sends text to the terminal.
// You can print numbers too:
print(42)

// You can print with single quotes too:
print('Kevlar is ready!')

// Try it: change the messages above and run again.
// Try it: add a new print() with your name.
`;

export const kevlarTutor02Raw = `// ============================================
// Kevlar Tutorial — Chapter 2: Variables
// ============================================
// Variables store values for later use.
// Kevlar has two variable styles: 'let' and 'var'.

// --- Immutable with let ---
// 'let' is the default. The value cannot change:
let name = "Orpheus"
print("Pilot: \${name}")

// --- Mutable with let mut ---
// Add 'mut' to allow the value to change:
let mut score = 0
print(score)

score = 10
print(score)

score += 5
print(score)

// --- Mutable with var ---
// 'var' is mutable by default (Dart-style):
var fuel = 100
fuel -= 20
print(fuel)

// --- Types (optional) ---
// You can add type annotations too:
let age: int = 21
let greeting: string = "hello"

// --- Try it: ---
// 1. Create a 'let mut' counter starting at 1
// 2. Add 3 to it and print it
// 3. Create a 'var' with your favorite number
`;

export const kevlarTutor03Raw = `// ============================================
// Kevlar Tutorial — Chapter 3: Operators
// ============================================
// Operators let you do math, compare values,
// and combine conditions.

// --- Arithmetic ---
print(5 + 3)     // 8   (addition)
print(10 - 4)    // 6   (subtraction)
print(3 * 7)     // 21  (multiplication)
print(20 / 4)    // 5   (division)
print(17 % 5)    // 2   (modulo / remainder)
print(2 ** 10)   // 1024 (exponentiation)

// --- Comparison ---
print(5 == 5)    // true
print(5 != 3)    // true
print(10 > 7)    // true
print(3 >= 3)    // true

// --- Logical ---
print(5 > 3 && 2 < 4)   // true (both true)
print(5 > 3 || 2 > 4)   // true (one true)
print(!true)             // false

// --- With variables ---
let a = 12
let b = 5
print(a + b)
print(a == b)
print(a > b)

// --- Try it: ---
// 1. Calculate (15 + 7) / 2 and print it
// 2. Check if 100 is greater than 99 AND 50
// 3. Use ** to calculate 3 to the power of 5
`;

export const kevlarTutor04Raw = `// ============================================
// Kevlar Tutorial — Chapter 4: Functions
// ============================================
// Functions package reusable logic.
// Two syntaxes: block body { ... } and arrow =>

// --- Arrow function (single expression) ---
fn double(n) => n * 2
print(double(5))      // 10
print(double(100))    // 200

// --- Block function (multiple lines) ---
fn greet(name) {
  print("Preparing greeting...")
  "Welcome back, \${name}!"
}
print(greet("Orpheus"))

// --- Functions with multiple parameters ---
fn add(a, b) => a + b
print(add(3, 7))      // 10

// --- Functions calling functions ---
fn triple(n) => n * 3
fn sixTimes(n) => triple(double(n))
print(sixTimes(4))    // 24

// --- Type annotations (optional) ---
fn square(x: int) -> int => x * x
print(square(9))      // 81

// --- Try it: ---
// 1. Write fn circleArea(r) that returns PI * r * r
// 2. Write fn isEven(n) that returns n % 2 == 0
// 3. Write fn shout(text) that returns text + "!"
`;

export const kevlarTutor05Raw = `// ============================================
// Kevlar Tutorial — Chapter 5: Control Flow
// ============================================
// if/else lets your code make decisions.

let fuel = 25

// --- Basic if ---
if fuel > 20 {
  print("Fuel is good")
}

// --- if / else ---
if fuel > 50 {
  print("Tank is full")
} else {
  print("Tank is getting low")
}

// --- if / else if / else ---
let status = 3
if status == 0 {
  print("Offline")
} else if status == 1 {
  print("Starting up")
} else if status == 2 {
  print("Warming up")
} else {
  print("Ready!")
}

// --- Nested if ---
let mut power = 80
let shields = 60
if power > 50 {
  if shields > 70 {
    print("All systems optimal")
  } else {
    print("Power good, shields low")
  }
}

// --- Try it: ---
// 1. Set fuel to 80 and run again
// 2. Add a new else if for status == 3
// 3. Write an if that checks if a number is negative
`;

export const kevlarTutor06Raw = `// ============================================
// Kevlar Tutorial — Chapter 6: Loops
// ============================================
// Loops repeat code. Kevlar has three loop styles.

// --- for over a range ---
// 0..5 means from 0 to 4 (exclusive end):
for i in 0..5 {
  print("Counting: \${i}")
}

// --- for over a list ---
let fruits = ["durian", "mango", "rambutan"]
for fruit in fruits {
  print("I like \${fruit}")
}

// --- while loop ---
let mut count = 3
while count > 0 {
  print("T-minus \${count}")
  count -= 1
}
print("Liftoff!")

// --- break and continue ---
let nums = [1, 3, 5, 7, 9]
for n in nums {
  if n == 5 {
    continue    // skip 5
  }
  if n == 7 {
    break       // stop at 7
  }
  print(n)      // prints 1, 3
}

// --- Try it: ---
// 1. Loop from 1 to 10 and print each number
// 2. Use while to count down from 5 to 0
// 3. Loop over a list of your favorite foods
`;

export const kevlarTutor07Raw = `// ============================================
// Kevlar Tutorial — Chapter 7: Lists
// ============================================
// Lists hold multiple values in order.

// --- Creating lists ---
let empty = []
let nums = [10, 20, 30, 40]
let mixed = [1, "hello", true, 3.14]

// --- Accessing by index (0-based) ---
print(nums[0])    // 10 (first item)
print(nums[2])    // 30 (third item)

// --- Length ---
print(len(nums))  // 4

// --- push() adds to the end ---
let mut items = ["shield", "sword"]
push(items, "potion")
print(items)      // ["shield", "sword", "potion"]

// --- pop() removes and returns the last item ---
let mut stack = ["A", "B", "C"]
let top = pop(stack)
print(top)        // "C"
print(stack)      // ["A", "B"]
print(len(stack)) // 2

// --- try_pop() removes and returns last item safely ---
let mut sparse = [3, 7]
let result = try_pop(sparse)
print(result)     // 7
print(sparse)     // [3]

// --- Looping over lists ---
let tools = ["hammer", "wrench", "drill"]
for tool in tools {
  print("Tool: \${tool}")
}

// --- Try it: ---
// 1. Create a list of 5 numbers
// 2. Push a 6th number and print the list
// 3. Pop the last item and print both it and the list
// 4. Loop and print each item multiplied by 2
`;

export const kevlarTutor08Raw = `// ============================================
// Kevlar Tutorial — Chapter 8: Match Expressions
// ============================================
// Match is like a supercharged if/else.
// It compares a value against multiple patterns.

// --- Basic match ---
let signal = 2
let meaning = match signal {
  0 => "no signal"
  1 => "weak"
  2 => "moderate"
  3 => "strong"
  _ => "unknown"
}
print(meaning)    // "moderate"

// --- The _ wildcard catches everything ---
let code = 999
let result = match code {
  200 => "OK"
  404 => "Not Found"
  _ => "Unknown code: \${code}"
}
print(result)     // "Unknown code: 999"

// --- Match with calculations ---
fn describe(hp) {
  match hp {
    0 => "offline"
    1 => "critical"
    2 => "low"
    3 | 4 => "OK"     // | means "or"
    _ => "healthy"
  }
}
print(describe(0))   // "offline"
print(describe(3))   // "OK"
print(describe(10))  // "healthy"

// --- Match as expression ---
// match returns a value, so you can use it inline:
let level = 3
print(match level {
  1 => "Rookie"
  2 => "Explorer"
  3 => "Veteran"
  _ => "Legend"
})

// --- Try it: ---
// 1. Write a match that converts 1→"Mon", 2→"Tue", etc.
// 2. Add a wildcard that says "Invalid day"
// 3. Use match to return a grade letter for a score
`;

export const kevlarTutor09Raw = `// ============================================
// Kevlar Tutorial — Chapter 9: Strings
// ============================================
// Strings hold text. Kevlar supports interpolation,
// concatenation, and escaping.

// --- String interpolation ---
// Use \${variable} inside a string:
let pilot = "Orpheus"
let ship = "Voidrunner"
print("Pilot \${pilot} aboard \${ship}")

// --- Expressions in interpolation ---
let a = 5
let b = 3
print("Sum: \${a + b}")

// --- Single vs double quotes ---
print('single quoted string')
print("double quoted string")
print("It's a fine day")
print('She said "hello"')

// --- Concatenation ---
let first = "Hello"
let second = "World"
print(first + " " + second + "!")

// --- Escape sequences ---
print("Line 1\\nLine 2\\nLine 3")  // \\n = newline
print("Column A\\tColumn B")      // \\t = tab
print("She said \\"wow\\"")        // \\" = literal quote
print("Backslash: \\\\")           // \\\\ = literal backslash

// --- Built-in string functions ---
// str() converts anything to a string:
print(str(42))
print(str(true))
print(str(3.14159))

// --- Try it: ---
// 1. Create a string with your name and age using interpolation
// 2. Print a message with a newline in the middle
// 3. Convert a number to a string with str() and concatenate
`;

export const kevlarTutor10Raw = `// ============================================
// Kevlar Tutorial — Chapter 10: Built-in Functions
// ============================================
// Kevlar comes with many built-in functions for math,
// type conversion, and randomization.

// --- Math ---
print(sqrt(16))        // 4
print(abs(-42))        // 42
print(ceil(3.1))       // 4
print(floor(3.9))      // 3
print(round(3.5))      // 4
print(pow(2, 10))      // 1024
print(min(5, 3, 9))    // 3
print(max(5, 3, 9))    // 9

// --- Trigonometry ---
print(sin(PI / 2))     // 1
print(cos(0))          // 1

// --- Logarithms ---
print(log(E))          // 1
print(log10(100))      // 2

// --- Type conversion ---
print(str(42))         // "42"
print(int("42"))       // 42
print(float("3.14"))   // 3.14
print(type(42))        // int
print(type("hello"))   // string
print(type(true))      // bool

// --- Random ---
print(rand())          // random float 0-1
print(rand_int(1, 6))  // random int between 1 and 6 (inclusive)

// --- Constants ---
print(PI)              // 3.141592653589793
print(E)               // 2.718281828459045
print(TAU)             // 6.283185307179586
print(SQRT2)           // 1.4142135623730951

// --- Try it: ---
// 1. Round 7.8 and print it
// 2. Generate a random number between 1 and 100
// 3. Use sqrt and pow together to verify sqrt(pow(5,2)) == 5
// 4. Print PI * 2 and compare it with TAU
`;

export const kevlarTutor11Raw = `// ============================================
// Kevlar Tutorial — Chapter 11: Mini Project
// ============================================
// Let's build a temperature converter and report.
// You'll use variables, functions, loops, and lists!

print("=== Temperature Scanner v1.0 ===")

// Step 1: Write a converter function
fn celsiusToFahrenheit(c) => c * 9 / 5 + 32
fn fahrenheitToCelsius(f) => (f - 32) * 5 / 9

// Step 2: Write a classifier
fn classify(temp) {
  if temp > 35 {
    "HOT! Stay hydrated"
  } else if temp > 25 {
    "Warm — nice weather"
  } else if temp > 15 {
    "Mild — bring a jacket"
  } else {
    "Cold! Bundle up"
  }
}

// Step 3: Process a list of readings
let celsiusReadings = [12, 18, 24, 28, 33, 40]

for reading in celsiusReadings {
  let f = celsiusToFahrenheit(reading)
  let label = classify(reading)
  print("\${reading}°C / \${f}°F — \${label}")
}

// Step 4: Find min and max
let lowest = min(12, 18, 24, 28, 33, 40)
let highest = max(12, 18, 24, 28, 33, 40)
print("")
print("Range: \${lowest}°C to \${highest}°C")
print("Readings processed: \${len(celsiusReadings)}")

// --- Try it: ---
// 1. Add more readings to the list
// 2. Change the thresholds in classify()
// 3. Add a function that converts to Kelvin (K = C + 273.15)
// 4. Save your version as my-scanner.kv with :save

print("")
print("=== Congratulations! ===")
print("You've completed the Kevlar tutorial!")
print("")
print("Next steps:")
print("  cat kevlar/syntax.md    — full syntax reference")
print("  cat kevlar/examples.md  — more examples")
print("  kevlar let x = 42       — try expressions live")
`;
