# What is Node.js?

## What is Node.js?

**Node.js is a JavaScript runtime environment that allows us to execute JavaScript outside the browser.**

Node.js is **not**:

- ❌ A programming language
- ❌ A framework
- ❌ A library

Node.js is:

- ✅ A runtime environment for JavaScript

---

## JavaScript and the Browser

JavaScript is commonly used inside web browsers to make websites interactive.

To execute JavaScript, a browser uses a **JavaScript engine**.

```text
JavaScript Code
      ↓
JavaScript Engine
      ↓
Browser
      ↓
Output
```

---

## JavaScript Engines

Different browsers use different JavaScript engines.

| Browser | JavaScript Engine |
|---|---|
| Chrome / Chromium | V8 |
| Firefox | SpiderMonkey |
| Safari | JavaScriptCore |

### V8 Engine

**V8** is Google's JavaScript engine and is used by Chrome and Chromium-based browsers.

---

## Why Was Node.js Needed?

JavaScript was traditionally executed inside the browser because the browser provided the JavaScript engine.

Without a JavaScript runtime, JavaScript could not simply be executed directly in a normal terminal.

```text
Browser
   ↓
JavaScript Engine
   ↓
JavaScript Code
   ↓
Output
```

---

## How Node.js Works

Node.js uses the **V8 JavaScript engine** outside the browser.

```text
JavaScript
    ↓
Node.js
    ↓
V8 Engine
    ↓
Execute JavaScript
    ↓
Terminal / Server
```

This allows us to execute JavaScript directly on a computer or server.

---

## Node.js and C++

Node.js uses technologies including **C++**, and the V8 engine itself is implemented in C++.

This helps Node.js provide JavaScript with access to capabilities that are not normally available to browser JavaScript.

For example, Node.js can interact with:

- File system
- Operating system
- Network
- Processes
- Server resources

---

## Running JavaScript with Node.js

Create a JavaScript file:

```text
app.js
```

Add:

```js
console.log("Hello from JavaScript");
```

Run it using:

```bash
node app.js
```

The JavaScript code will execute in the terminal instead of inside a browser.

---

## Node.js REPL

Node.js provides an interactive environment called **REPL**.

REPL stands for:

```text
Read
Evaluate
Print
Loop
```

Start the Node.js REPL:

```bash
node
```

Then you can directly execute JavaScript:

```js
2 + 5
```

Output:

```text
7
```

Another example:

```js
console.log("Hello");
```

Output:

```text
Hello
```

REPL is useful for quickly testing JavaScript code.

---

## What Can We Build With Node.js?

Node.js can be used for backend development.

```text
             Node.js
                │
       ┌────────┼────────┐
       ↓        ↓        ↓
   Web Server  APIs   Backend
       │        │        │
       └────────┼────────┘
                ↓
             Database
```

With Node.js, we can build:

- Web servers
- REST APIs
- Backend applications
- Command-line applications
- Applications that interact with files and the operating system

---

## Node.js Features

Node.js is:

- Open source
- Cross-platform
- Based on JavaScript
- Powered by the V8 engine
- Used for server-side/backend development

Node.js can run on:

- Windows
- macOS
- Linux

---

## Important Concepts

### JavaScript

A programming language used to create interactive web applications and other types of software.

### JavaScript Engine

Software that executes JavaScript code.

### V8

Google's JavaScript engine used by Chrome and Node.js.

### Node.js

A runtime environment that allows JavaScript to run outside the browser.

---

## Node.js vs Browser

```text
              JavaScript
                   │
          ┌────────┴────────┐
          ↓                 ↓
       Browser           Node.js
          │                 │
      JS Engine          V8 Engine
          │                 │
          ↓                 ↓
    Browser JavaScript   JavaScript
                         Outside Browser
                              │
                   ┌──────────┼──────────┐
                   ↓          ↓          ↓
                 Server      APIs    File System
```

---

## Most Important Points

1. **JavaScript is a programming language.**
2. **A JavaScript engine executes JavaScript code.**
3. **V8 is Google's JavaScript engine.**
4. **Node.js uses V8 to execute JavaScript outside the browser.**
5. **Node.js is a runtime environment, not a framework or programming language.**

---

## Quick Revision

### What is Node.js?

Node.js is a runtime environment that allows JavaScript to run outside the browser.

### Is Node.js a framework?

No. Node.js is a runtime environment.

### Is Node.js a programming language?

No. **JavaScript** is the programming language.

### Which JavaScript engine does Node.js use?

**V8.**

### What is REPL?

REPL stands for:

**Read → Evaluate → Print → Loop**

It provides an interactive environment for executing JavaScript.

### Why is Node.js useful?

Node.js allows JavaScript to run outside the browser and provides capabilities needed for backend development, servers, APIs, file handling, networking, and more.

---

## Key Takeaway

> **Node.js is a JavaScript runtime environment built around the V8 JavaScript engine that allows us to execute JavaScript outside the browser.**

---

## Video

**Topic:** What is Node.js?  
**Status:** ✅ Completed