# Node.js — Event Loop, Thread Pool & File System

Understanding how Node.js handles requests, asynchronous operations, the Event Loop, Thread Pool, and File System.

---

## 📚 Table of Contents

* [1. Node.js Request Flow](#1-nodejs-request-flow)
* [2. Client](#2-client)
* [3. Event Queue](#3-event-queue)
* [4. Event Loop](#4-event-loop)
* [5. Blocking vs Non-Blocking](#5-blocking-vs-non-blocking)
* [6. Thread Pool](#6-thread-pool)
* [7. Why Blocking Code Can Be a Problem](#7-why-blocking-code-can-be-a-problem)
* [8. Synchronous vs Asynchronous FS](#8-synchronous-vs-asynchronous-fs)
* [9. Important Node.js Modules](#9-important-nodejs-modules)
* [10. File System Examples](#10-file-system-examples)
* [11. Thread Pool Size](#11-thread-pool-size)
* [12. Important Terms](#12-important-terms)
* [13. Complete Architecture](#13-complete-architecture)
* [14. Main Takeaways](#14-main-takeaways)
* [15. 30-Second Revision](#15-30-second-revision)

---

# 1. Node.js Request Flow

A simplified view of how a request is handled:

```text
Client
  ↓
Request
  ↓
Event Queue
  ↓
Event Loop
  ↓
┌──────────────────────┐
│  Blocking Operation? │
└──────────┬───────────┘
           │
      ┌────┴────┐
      ↓         ↓
     NO        YES
      ↓         ↓
 Process     Thread Pool
 Directly        ↓
      ↓      Worker Thread
      │          ↓
      │        Result
      └─────┬────┘
            ↓
         Response
            ↓
          Client
```

> **Note:** This is a simplified learning diagram. Node.js does not literally place every request into one simple "Event Queue" before the Event Loop.

---

# 2. Client

A **client** is something that sends a request to a server.

Examples:

* 🌐 Web browser
* 📱 Mobile application
* 💻 Another application
* 🔌 API client

```text
Client
   ↓
Request
   ↓
Node.js Server
```

Example:

```text
Browser → GET /users → Node.js Server
```

---

# 3. Event Queue

When asynchronous work needs to be handled, callbacks and other tasks are scheduled to be processed by Node.js.

A simplified example:

```text
Request 1
Request 2
Request 3
Request 4
```

A queue is commonly described using:

```text
FIFO
↓
First In → First Out
```

However, Node.js's actual event-loop behavior is more complex than a single FIFO queue because it has different phases and queues for different types of work.

---

# 4. Event Loop

The **Event Loop** is one of the most important parts of Node.js.

It continuously checks for work that can be processed.

### Main responsibilities

* Handle callbacks
* Coordinate asynchronous operations
* Process timers and I/O-related callbacks
* Continue executing JavaScript while asynchronous work is pending
* Coordinate with the underlying system and libuv

Simplified:

```text
Event Queue
     ↓
  Event Loop
     ↓
Process Work
```

The main idea is:

> **The Event Loop allows Node.js to handle asynchronous operations without blocking the JavaScript thread for every operation.**

---

# 5. Blocking vs Non-Blocking

This is one of the most important Node.js concepts.

## 🔴 Blocking / Synchronous

A blocking operation makes the current JavaScript execution wait until the operation finishes.

### Example

```js
const fs = require("fs");

const data = fs.readFileSync("./contacts.txt", "utf-8");

console.log(data);
console.log("Done");
```

### Execution

```text
readFileSync()
     ↓
   WAIT
     ↓
File Read Complete
     ↓
console.log(data)
     ↓
console.log("Done")
```

### Remember

```text
Blocking = WAIT
```

The next JavaScript statement cannot execute until the synchronous operation returns.

---

## 🟢 Non-Blocking / Asynchronous

A non-blocking operation allows JavaScript execution to continue while the operation is being completed.

### Example

```js
const fs = require("fs");

fs.readFile("./contacts.txt", "utf-8", (err, data) => {
    if (err) {
        console.log(err);
        return;
    }

    console.log(data);
});

console.log("Done");
```

### Simplified execution

```text
readFile()
     ↓
Continue execution
     ↓
console.log("Done")
     ↓
File operation completes
     ↓
Callback executes
     ↓
console.log(data)
```

### Remember

```text
Non-Blocking = DON'T WAIT
```

---

# 6. Thread Pool 🧵

Node.js uses **libuv**, which provides a Thread Pool for certain operations that cannot be handled entirely by the operating system's asynchronous APIs.

A simplified view:

```text
             Thread Pool
       ┌──────┬──────┬──────┬──────┐
       │  T1  │  T2  │  T3  │  T4  │
       └──────┴──────┴──────┴──────┘
```

When an operation uses the Thread Pool:

```text
Event Loop
     ↓
Thread Pool
     ↓
Available Worker
     ↓
Perform Operation
     ↓
Result
     ↓
Callback / Promise
```

Examples of operations that can use the libuv Thread Pool include certain:

* File System operations
* `crypto` operations
* DNS operations
* Compression operations

---

# 7. Why Blocking Code Can Be a Problem

The JavaScript execution thread should avoid unnecessary blocking work, especially in a server.

For example:

```text
Request 1
   ↓
Long Blocking Operation
   ↓
JavaScript execution is blocked
   ↓
Other requests have to wait
```

This can:

* Increase response time
* Reduce throughput
* Make the application less responsive
* Reduce scalability

### Important distinction

Do not think of the Thread Pool as meaning that **all blocking JavaScript automatically moves to another thread**.

For example:

```js
fs.readFileSync()
```

is synchronous and blocks the JavaScript thread.

Using a Thread Pool does not magically make synchronous JavaScript non-blocking.

### Rule to Remember

> For server applications, prefer non-blocking/asynchronous APIs when appropriate.

---

# 8. Synchronous vs Asynchronous FS

Node.js provides synchronous and asynchronous versions of many `fs` operations.

## Synchronous

Examples:

```js
fs.readFileSync()
fs.writeFileSync()
fs.appendFileSync()
```

Example:

```js
const fs = require("fs");

const data = fs.readFileSync("./file.txt", "utf-8");

console.log(data);
```

### Key idea

```text
Start Operation
      ↓
    WAIT
      ↓
   Result
      ↓
Continue
```

---

## Asynchronous

Examples:

```js
fs.readFile()
fs.writeFile()
fs.appendFile()
```

They can be used with:

* Callbacks
* Promises
* `async/await`

Example:

```js
const fs = require("fs");

fs.readFile("./file.txt", "utf-8", (err, data) => {
    if (err) {
        console.log(err);
        return;
    }

    console.log(data);
});
```

### Key idea

```text
Start Operation
      ↓
Continue Other Work
      ↓
Operation Completes
      ↓
Handle Result
```

---

# 9. Important Node.js Built-in Modules

## 📁 `fs` — File System

```js
const fs = require("fs");
```

The `fs` module is used for file-system operations.

It can be used for:

* Creating files
* Reading files
* Writing files
* Appending data
* Deleting files
* Copying files
* Creating directories
* Getting file information

---

## 💻 `os` — Operating System

```js
const os = require("os");
```

The `os` module provides information about the operating system.

It can provide information about:

* CPU
* Platform
* Architecture
* Memory
* Hostname
* Operating system

Example:

```js
console.log(os.cpus().length);
```

---

# 10. File System Examples

## Write a File

```js
const fs = require("fs");

fs.writeFileSync("./test.txt", "Hello World");
```

---

## Read a File

```js
const fs = require("fs");

const data = fs.readFileSync("./test.txt", "utf-8");

console.log(data);
```

---

## Append to a File

```js
const fs = require("fs");

fs.appendFileSync("./test.txt", "\nNew Entry");
```

---

## Delete a File

```js
const fs = require("fs");

fs.unlinkSync("./test.txt");
```

---

## Copy a File

```js
const fs = require("fs");

fs.copyFileSync("./test.txt", "./copy.txt");
```

---

## Create a Directory

Asynchronous example:

```js
const fs = require("fs");

fs.mkdir("./docs", (err) => {
    if (err) {
        console.log(err);
        return;
    }

    console.log("Directory created");
});
```

---

# 11. Thread Pool Size

The **libuv Thread Pool** has a default size of:

```text
4 workers
```

The size can be configured using:

```text
UV_THREADPOOL_SIZE
```

Example:

```bash
UV_THREADPOOL_SIZE=8 node index.js
```

> On Windows, the syntax for setting an environment variable is different depending on the shell.

---

## CPU Cores vs Thread Pool

These are **not the same thing**.

CPU information:

```js
const os = require("os");

console.log(os.cpus().length);
```

This tells you the number of logical CPU processors reported by the operating system.

The libuv Thread Pool size is a separate setting.

```text
CPU Cores ≠ libuv Thread Pool Size
```

---

# 12. Important Terms

| Term              | Meaning                                                           |
| ----------------- | ----------------------------------------------------------------- |
| **Client**        | Sends requests to the server                                      |
| **Event Queue**   | Simplified concept for work waiting to be processed               |
| **Event Loop**    | Coordinates JavaScript callbacks and asynchronous work            |
| **Blocking**      | Execution waits for an operation                                  |
| **Non-Blocking**  | Execution can continue while asynchronous work is pending         |
| **Synchronous**   | Operation completes before the next statement continues           |
| **Asynchronous**  | Result is handled later                                           |
| **Thread Pool**   | Collection of worker threads used by libuv for certain operations |
| **Worker Thread** | Performs work assigned through the Thread Pool                    |
| **Callback**      | Function executed after an asynchronous operation completes       |

---

# 13. Complete Architecture

A simplified architecture:

```text
                         CLIENT
                            │
                            ▼
                         REQUEST
                            │
                            ▼
                    ┌──────────────┐
                    │ Event Loop / │
                    │ Node Runtime │
                    └───────┬──────┘
                            │
                   ┌────────┴────────┐
                   │                 │
                   ▼                 ▼
            Non-Blocking        Thread Pool
               Work                 │
                   │                ▼
                   │          Worker Thread
                   │                │
                   │                ▼
                   │             Result
                   │                │
                   └────────┬───────┘
                            ▼
                       Callback /
                        Promise
                            │
                            ▼
                        RESPONSE
                            │
                            ▼
                          CLIENT
```

> This is a simplified model for learning. The real Node.js architecture includes V8, libuv, OS-level asynchronous I/O, event-loop phases, and multiple internal queues.

---

# 14. ⭐ Main Takeaways

Remember these points:

* Node.js uses an **event-driven architecture**.
* JavaScript execution runs primarily on a **single main thread**.
* The **Event Loop** coordinates asynchronous JavaScript work.
* **Blocking operations** make the current JavaScript execution wait.
* **Non-blocking operations** allow JavaScript to continue while asynchronous work is pending.
* Some operations use the **libuv Thread Pool**.
* The default libuv Thread Pool size is generally **4**.
* `fs` is used for **File System operations**.
* `os` provides **Operating System information**.
* Node.js provides both **synchronous and asynchronous APIs**.
* For server applications, prefer **non-blocking/asynchronous APIs when appropriate**.
* **CPU core count and Thread Pool size are separate concepts.**

---

# 15. 📌 30-Second Revision

```text
CLIENT
   ↓
REQUEST
   ↓
NODE.JS
   ↓
EVENT LOOP
   ↓
┌──────────────────────┐
│ Asynchronous Work?   │
└──────────┬───────────┘
           │
      ┌────┴────┐
      ↓         ↓
    Direct    Thread Pool
      │           ↓
      │        Worker
      │           ↓
      │         Result
      └─────┬─────┘
            ↓
         CALLBACK
            ↓
         RESPONSE
            ↓
          CLIENT
```

## 🧠 Core Idea

> **Node.js is designed around an event-driven, asynchronous model. It uses the Event Loop to coordinate JavaScript execution and asynchronous work, while libuv can use a Thread Pool for certain operations.**

---

## 🔥 Easy Memory Trick

```text
fs.readFileSync()
      ↓
    BLOCKING
      ↓
     WAIT

fs.readFile()
      ↓
 NON-BLOCKING
      ↓
 DON'T WAIT

Event Loop
      ↓
 Coordinates Work

Thread Pool
      ↓
 Worker Threads
      ↓
 Certain Operations
```

**Node.js = Event Loop + Asynchronous I/O + libuv + Thread Pool (for certain operations)**
