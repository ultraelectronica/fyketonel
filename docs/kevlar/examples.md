Kevlar v2 Examples
════════════════

// Simple expressions
kevlar 2 + 3 * 4;         → 14
kevlar sqrt(144);         → 12
kevlar PI;                → 3.14159...

// Variables
kevlar let x = 42;         → 42
kevlar let mut y = 0;      → 0
kevlar y += 8;             → 8

// Functions
kevlar fn square(n) => n * n;
kevlar square(5);          → 25

// Lists and loops (use oxygen editor)
let fruits = ["apple", "banana", "cherry"];
for f in fruits {
  print(f);
}

// Match expression
match 3 {
  0 => "zero"
  1 => "one"
  _ => "many"
}

// String interpolation
let name = "Hazmat";
"Hello from ${name}!";

// Use 'oxygen' command to write multi-line programs
