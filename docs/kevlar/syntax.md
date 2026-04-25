Kevlar v2 Syntax Reference
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
    "Hello, ${name}!"
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
  "Hello, ${name}!"
  // Escapes: \n \t \\ \' \"


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
