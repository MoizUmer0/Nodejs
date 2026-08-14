# Node.js — Modules

## What are Modules?

A **module** is a separate file that contains related code which can be reused in other files.

In real-world applications, we don't keep all our code inside one file.

Instead, we divide our application into smaller modules.

This approach is called **Modular Programming**.

```text
Large Application
       ↓
 ┌─────┼─────┐
 ↓     ↓     ↓
Math  User  Server
Module Module Module
```

---

## Why Use Modules?

Modules help us:

- Organize code
- Reuse code
- Keep files smaller
- Separate different functionalities
- Make applications easier to maintain

For example, instead of keeping all mathematical functions inside `hello.js`, we can create a separate file:

```text
project
│
├── hello.js
└── math.js
```

`math.js` can contain mathematical functions, while `hello.js` can use those functions.

---

# Creating a Module

Create a file called:

```text
math.js
```

Add a function:

```js
function add(a, b) {
    return a + b;
}
```

The function belongs to the `math.js` module.

However, other files cannot automatically use this function.

We need to **export** it.

---

# module.exports

Node.js provides:

```js
module.exports
```

to export something from a module.

For example:

```js
function add(a, b) {
    return a + b;
}

module.exports = add;
```

Now the `add` function can be used by another file.

---

# require()

Node.js provides the built-in:

```js
require()
```

function to import a module.

For example, inside `hello.js`:

```js
const add = require("./math");
```

The `./` means:

```text
Current Directory
```

So:

```js
require("./math")
```

means:

> Find the `math` module in the current directory.

---

# Why `./` is Important

If we write:

```js
require("math");
```

Node.js will look for a package/module named `math` in its module/package locations.

But if we write:

```js
require("./math");
```

Node.js knows that `math` is a local module in the current directory.

```text
./
 ↓
Current Directory
 ↓
math.js
```

---

# Using an Exported Function

### math.js

```js
function add(a, b) {
    return a + b;
}

module.exports = add;
```

### hello.js

```js
const add = require("./math");

console.log(add(2, 4));
```

### Output

```text
6
```

The `add()` function was created in `math.js` but used inside `hello.js`.

---

# Exporting Multiple Functions

A module can contain multiple functions.

For example:

```js
function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}
```

We can export both functions using an object:

```js
module.exports = {
    add,
    subtract
};
```

Now the module exports:

```text
math.js
   │
   ├── add()
   └── subtract()
```

---

# Importing Multiple Functions

Inside `hello.js`:

```js
const math = require("./math");
```

Now we can access both functions:

```js
console.log(math.add(2, 4));

console.log(math.subtract(2, 4));
```

### Output

```text
6
-2
```

---

# Destructuring Imported Functions

Instead of writing:

```js
math.add()
math.subtract()
```

we can use destructuring:

```js
const { add, subtract } = require("./math");
```

Now we can directly call:

```js
console.log(add(2, 4));

console.log(subtract(2, 4));
```

---

# Single Export

When a module exports one main value, we can use:

```js
module.exports = value;
```

Example:

```js
module.exports = add;
```

This is a single/default-style export in CommonJS.

---

# Multiple Exports

When we want to export multiple values, we can use:

```js
module.exports = {
    add,
    subtract
};
```

This creates an object containing multiple exported values.

```text
math.js
   │
   └── module.exports
          │
          ├── add
          └── subtract
```

---

# Another Way to Export

Instead of:

```js
module.exports = {
    add,
    subtract
};
```

we can also write:

```js
exports.add = (a, b) => {
    return a + b;
};

exports.subtract = (a, b) => {
    return a - b;
};
```

Now both functions are available as properties of the exported object.

---

# module.exports vs exports

Both are related to exporting values from a CommonJS module.

Example:

```js
exports.add = add;
exports.subtract = subtract;
```

is commonly used for multiple exports.

Another approach is:

```js
module.exports = {
    add,
    subtract
};
```

The important concept is that the module exposes values through `module.exports`.

---

# Important Difference

Be careful when doing this multiple times:

```js
module.exports = add;

module.exports = subtract;
```

The second assignment replaces the first one.

So only `subtract` will be exported.

For multiple values, use an object:

```js
module.exports = {
    add,
    subtract
};
```

---

# Built-in Node.js Modules

Node.js also provides many **built-in modules**.

These modules are already included with Node.js.

They don't need to be installed separately.

Examples include:

- `http`
- `fs`
- `path`
- `crypto`
- `buffer`

---

# The `fs` Module

`fs` stands for:

```text
File System
```

It can be used for working with files and directories.

For example:

```js
const fs = require("fs");
```

The `fs` module provides functionality for file handling.

---

# The `http` Module

The `http` module can be used to create web servers.

```js
const http = require("http");
```

It is one of Node.js's built-in modules.

---

# The `crypto` Module

Node.js also provides the `crypto` module.

It can be used for cryptographic operations such as:

- Hashing
- Encryption-related operations
- Generating secure values

Example:

```js
const crypto = require("crypto");
```

---

# Local Modules vs Built-in Modules

There is an important difference between:

```js
require("./math");
```

and:

```js
require("fs");
```

## Local Module

```js
require("./math");
```

Node.js looks in the current project directory.

```text
Project
   ↓
math.js
```

## Built-in Module

```js
require("fs");
```

Node.js looks for the built-in Node.js module.

```text
Node.js
   ↓
Built-in Modules
   ↓
fs
```

---

# Module Resolution

When using:

```js
require("./math");
```

the `./` tells Node.js that this is a local module.

When using:

```js
require("fs");
```

Node.js knows that `fs` is a built-in module.

When using an external package, Node.js looks for it in the project's installed packages.

---

# Modular Programming Example

A project can be organized like this:

```text
project
│
├── hello.js
│
├── math.js
│
├── user.js
│
└── server.js
```

Each file can have a specific responsibility.

```text
             Application
                  │
       ┌──────────┼──────────┐
       ↓          ↓          ↓
     Math        User      Server
    Module      Module     Module
```

This makes the application easier to understand and maintain.

---

# CommonJS Modules

The module system demonstrated in this video uses **CommonJS**.

CommonJS commonly uses:

```js
require()
```

to import modules.

And:

```js
module.exports
```

to export modules.

## Basic Structure

```text
Module A
   │
   │ module.exports
   ↓
Exported Code
   │
   │ require()
   ↓
Module B
```

---

# Important Concepts

## Module

A separate file containing related code.

## Modular Programming

Dividing a large application into smaller, manageable modules.

## require()

Used to import a module in CommonJS.

## module.exports

Used to export values from a CommonJS module.

## exports

A convenient way to add properties to the module's exports object.

## `./`

Represents the current directory when requiring a local module.

## Built-in Module

A module provided by Node.js that does not need to be installed separately.

---

# Key Takeaways

- A module is a separate file containing related code.
- Modular programming divides large applications into smaller modules.
- Node.js uses CommonJS modules with `require()` and `module.exports`.
- `module.exports` is used to expose code from a module.
- `require()` is used to load a module.
- `./` is used when importing a local module.
- A module can export one value or multiple values.
- Multiple values can be exported using an object.
- Node.js provides many built-in modules.
- Common built-in modules include `fs`, `http`, `path`, `crypto`, and `buffer`.

---

# Quick Revision

### Q: What is a module?

**A:** A separate file containing related and reusable code.

### Q: What is modular programming?

**A:** Dividing a large application into smaller modules.

### Q: How do we export code in CommonJS?

**A:**

```js
module.exports = value;
```

### Q: How do we import a module?

**A:**

```js
const module = require("./module");
```

### Q: What does `./` mean?

**A:** It refers to the current directory.

### Q: Can we export multiple functions?

**A:** Yes.

```js
module.exports = {
    add,
    subtract
};
```

### Q: What are some Node.js built-in modules?

**A:**

```text
fs
http
path
crypto
buffer
```

---

# Video Progress

**Topic:** Node.js — Modules  
**Playlist:** Master NodeJS  
**Status:** ✅ Completed

## Covered

- Modules
- Modular Programming
- `require()`
- `module.exports`
- `exports`
- Single Export
- Multiple Exports
- Destructuring
- Local Modules
- Built-in Modules
- `fs`
- `http`
- `crypto`
- Module Resolution
- CommonJS Modules