# Node.js — HTTP Server & Request Handling

Revision notes covering the Node.js `http` module, HTTP requests/responses, routing, File System operations, request logging, Event Loop, blocking/non-blocking operations, and Thread Pool.

---

## 📚 Table of Contents

* [1. Creating a Node.js Project](#1-creating-a-nodejs-project)
* [2. HTTP Module](#2-http-module)
* [3. Creating a Server](#3-creating-a-server)
* [4. Request Object](#4-request-object)
* [5. Response Object](#5-response-object)
* [6. Starting the Server](#6-starting-the-server)
* [7. Complete Basic Server](#7-complete-basic-server)
* [8. Request → Response Flow](#8-request--response-flow)
* [9. Routing](#9-routing)
* [10. File System Module](#10-file-system-module)
* [11. Synchronous vs Asynchronous](#11-synchronous-vs-asynchronous)
* [12. File Operations](#12-file-operations)
* [13. Creating a Request Log](#13-creating-a-request-log)
* [14. Logging the Request URL](#14-logging-the-request-url)
* [15. Event Loop](#15-event-loop)
* [16. Blocking vs Non-Blocking](#16-blocking-vs-non-blocking)
* [17. Thread Pool](#17-thread-pool)
* [18. Why Blocking Can Be a Problem](#18-why-blocking-can-be-a-problem)
* [19. Important Node.js Modules](#19-important-nodejs-modules)
* [20. Important Concepts](#20-important-concepts)
* [21. Complete Example](#21-complete-example)
* [22. Final Architecture](#22-final-architecture)
* [23. Quick Revision](#23-quick-revision)

---

# 1. Creating a Node.js Project

Create a new Node.js project:

```bash
npm init -y
```

This creates:

```text
package.json
```

A common project structure:

```text
project/
│
├── index.js
├── package.json
└── log.txt
```

## Entry Point

A common entry point is:

```text
index.js
```

For example:

```json
{
  "scripts": {
    "start": "node index.js"
  }
}
```

Run the application with:

```bash
npm start
```

Or directly:

```bash
node index.js
```

---

# 2. HTTP Module

Node.js provides a built-in `http` module.

```js
const http = require("http");
```

No installation is required because `http` is built into Node.js.

The `http` module can be used to:

* Create HTTP servers
* Receive requests
* Send responses
* Handle HTTP methods
* Implement basic routing

---

# 3. Creating a Server

Use:

```js
http.createServer()
```

Example:

```js
const http = require("http");

const server = http.createServer((req, res) => {
    console.log("New Request Received");

    res.end("Hello From Server");
});
```

## `http.createServer()`

Creates an HTTP server.

The callback function runs when a request is received.

```js
(req, res) => {}
```

Where:

```text
req → Request object
res → Response object
```

---

# 4. Request Object

The `req` object contains information about the incoming HTTP request.

Common properties include:

```js
req.url
req.method
req.headers
req.httpVersion
req.socket
```

---

## `req.url`

Returns the requested URL/path.

Example:

```js
console.log(req.url);
```

If the user visits:

```text
http://localhost:8000/about
```

Then:

```js
req.url
```

will contain:

```text
/about
```

---

## `req.method`

Returns the HTTP method.

Example:

```js
console.log(req.method);
```

For a normal browser request, it will commonly be:

```text
GET
```

Other HTTP methods include:

```text
GET
POST
PUT
PATCH
DELETE
```

---

## `req.headers`

Contains HTTP request headers.

Example:

```js
console.log(req.headers);
```

Headers can contain information such as:

* Host
* User-Agent
* Accept
* Content-Type
* Cookies

---

# 5. Response Object

The `res` object is used to send a response to the client.

The simplest way to finish a response is:

```js
res.end("Hello From Server");
```

Example:

```js
const server = http.createServer((req, res) => {
    res.end("Hello From Server");
});
```

Flow:

```text
Client
   ↓
Request
   ↓
Node.js Server
   ↓
Request Handler
   ↓
res.end()
   ↓
Response
   ↓
Client
```

---

# 6. Starting the Server

Creating a server is not enough.

We must tell the server to listen for incoming connections.

Use:

```js
server.listen()
```

Example:

```js
server.listen(8000, () => {
    console.log("Server Started");
});
```

---

## Port

A port can be thought of as a communication endpoint on a computer.

Example:

```text
localhost:8000
```

Where:

```text
localhost → Your computer
8000      → Port number
```

Open the server in a browser:

```text
http://localhost:8000
```

---

# 7. Complete Basic Server

```js
const http = require("http");

const server = http.createServer((req, res) => {
    console.log("New Request Received");

    res.end("Hello From Server");
});

server.listen(8000, () => {
    console.log("Server Started");
});
```

Run:

```bash
node index.js
```

Or:

```bash
npm start
```

if `package.json` contains:

```json
{
  "scripts": {
    "start": "node index.js"
  }
}
```

---

# 8. Request → Response Flow

A basic HTTP request follows this pattern:

```text
Client
   ↓
Request
   ↓
HTTP Server
   ↓
Request Handler
   ↓
Process Request
   ↓
Response
   ↓
Client
```

Example:

```text
Browser
   ↓
GET /about
   ↓
Node.js Server
   ↓
(req, res)
   ↓
res.end("About Page")
   ↓
Browser
```

---

# 9. Routing

Routing means returning different responses depending on the requested path.

Example:

```js
const http = require("http");

const server = http.createServer((req, res) => {

    switch (req.url) {

        case "/":
            res.end("Home Page");
            break;

        case "/about":
            res.end("About Page");
            break;

        case "/contact":
            res.end("Contact Page");
            break;

        default:
            res.end("404 Not Found");
    }
});

server.listen(8000);
```

### Routes

```text
/          → Home Page
/about     → About Page
/contact   → Contact Page
anything   → 404 Not Found
```

---

## Routing Diagram

```text
                    Request
                       │
                       ▼
                    req.url
                       │
              ┌────────┼────────┐
              ↓        ↓        ↓
              /      /about   /contact
              │        │        │
              ▼        ▼        ▼
           Home      About    Contact
```

---

# 10. File System Module

Node.js provides the built-in `fs` module for working with files and directories.

```js
const fs = require("fs");
```

It can be used for:

* Creating files
* Reading files
* Writing files
* Appending data
* Deleting files
* Copying files
* Creating directories

---

# 11. Synchronous vs Asynchronous

Understanding synchronous and asynchronous operations is important when working with Node.js servers.

## Synchronous

Synchronous operations are blocking.

Example:

```js
const data = fs.readFileSync("./file.txt", "utf-8");

console.log(data);

console.log("Done");
```

Flow:

```text
Read File
   ↓
 WAIT
   ↓
File Complete
   ↓
Print Data
   ↓
Done
```

The JavaScript execution waits for the synchronous operation to finish.

---

## Asynchronous

Asynchronous operations allow JavaScript execution to continue while the operation is pending.

Example:

```js
fs.readFile("./file.txt", "utf-8", (err, data) => {

    if (err) {
        console.log(err);
        return;
    }

    console.log(data);
});

console.log("Done");
```

Flow:

```text
Start File Read
      ↓
Continue Execution
      ↓
Print "Done"
      ↓
File Operation Complete
      ↓
Callback Executes
```

### Important

For server applications, prefer **non-blocking/asynchronous APIs when appropriate**.

---

# 12. File Operations

## Write File

```js
fs.writeFileSync("./test.txt", "Hello World");
```

---

## Read File

```js
const data = fs.readFileSync("./test.txt", "utf-8");

console.log(data);
```

---

## Append File

```js
fs.appendFileSync("./test.txt", "\nNew Entry");
```

---

## Delete File

```js
fs.unlinkSync("./test.txt");
```

---

## Copy File

```js
fs.copyFileSync("./test.txt", "./copy.txt");
```

---

## Create Directory

```js
fs.mkdir("./docs", (err) => {
    if (err) {
        console.log(err);
    }
});
```

---

# 13. Creating a Request Log

A server can record incoming requests in a log file.

Example:

```js
const fs = require("fs");

const log = `${Date.now()}: New Request Received\n`;

fs.appendFile("./log.txt", log, (err) => {
    if (err) {
        console.log(err);
    }
});
```

Each request can add a new line to:

```text
log.txt
```

Example:

```text
1755000000000: New Request Received
1755000005000: New Request Received
1755000010000: New Request Received
```

---

## Why Use `appendFile()`?

Using asynchronous `appendFile()` allows the JavaScript execution to continue while the file operation is pending.

Using a synchronous file operation inside a busy server can block the JavaScript thread.

Therefore, asynchronous APIs are generally preferred for request logging.

---

# 14. Logging the Request URL

We can log the URL requested by the client.

```js
const log = `${Date.now()}: ${req.url}\n`;

fs.appendFile("./log.txt", log, (err) => {
    if (err) {
        console.log(err);
    }
});
```

Example `log.txt`:

```text
1755000000000: /
1755000005000: /about
1755000010000: /contact
```

This can help with:

* Debugging
* Monitoring
* Tracking requests
* Understanding application usage

---

# 15. Event Loop

Node.js uses an **event-driven architecture**.

A simplified model:

```text
Client
   ↓
Request
   ↓
Node.js
   ↓
Event Loop
   ↓
Process / Coordinate Work
   ↓
Response
```

The Event Loop coordinates JavaScript callbacks and asynchronous operations so that Node.js can continue handling other work while asynchronous operations are pending.

> **Note:** The real Node.js architecture is more complex than a single Event Queue → Event Loop model.

---

# 16. Blocking vs Non-Blocking

## 🔴 Blocking

A blocking operation makes the current JavaScript execution wait.

```text
Task 1
  ↓
WAIT
  ↓
Task 1 Complete
  ↓
Task 2
```

Remember:

```text
Blocking = WAIT
```

---

## 🟢 Non-Blocking

A non-blocking asynchronous operation allows other JavaScript work to continue while the operation is pending.

```text
Task 1 ─────────────────→ Result
  │
  ├──→ Task 2
  │
  └──→ Task 3
```

Remember:

```text
Non-Blocking = CONTINUE
```

---

# 17. Thread Pool

Node.js uses **libuv** and its Thread Pool for certain operations that can be performed outside the main JavaScript execution thread.

Conceptually:

```text
Event Loop
    ↓
Thread Pool
    ↓
Worker Thread
    ↓
Operation
    ↓
Result
    ↓
Callback / Promise
```

The default libuv Thread Pool size is generally:

```text
4 workers
```

It can be configured using:

```text
UV_THREADPOOL_SIZE
```

### Important

Not every blocking operation is moved to the Thread Pool.

For example:

```js
fs.readFileSync()
```

is synchronous and blocks JavaScript execution.

The Thread Pool is used for certain operations implemented through libuv.

---

# 18. Why Blocking Can Be a Problem

Imagine a server handling several expensive operations.

Conceptually:

```text
Worker 1 → Operation 1
Worker 2 → Operation 2
Worker 3 → Operation 3
Worker 4 → Operation 4
```

If available resources are busy:

```text
Operation 5
    ↓
  WAIT
    ↓
Worker Available
    ↓
Process Operation 5
```

Too much expensive or blocking work can:

* Increase response time
* Increase waiting time
* Reduce throughput
* Reduce scalability

### Important distinction

Blocking the JavaScript thread is particularly problematic because it prevents the Event Loop from progressing with other JavaScript work.

---

# 19. Important Node.js Modules

## HTTP

```js
const http = require("http");
```

Used to create HTTP servers.

---

## File System

```js
const fs = require("fs");
```

Used to work with files and directories.

---

## Operating System

```js
const os = require("os");
```

Used to get information about the operating system.

Example:

```js
console.log(os.cpus().length);
```

This returns the number of logical CPUs reported by the operating system.

---

# 20. Important Concepts

## `http.createServer()`

Creates an HTTP server.

```js
http.createServer();
```

---

## `req`

Contains information about the incoming request.

```js
req.url
req.method
req.headers
```

---

## `res`

Used to send a response.

```js
res.end("Hello");
```

---

## `server.listen()`

Starts the server on a specified port.

```js
server.listen(8000);
```

---

## `req.url`

Returns the requested URL/path.

```js
console.log(req.url);
```

---

## `req.headers`

Contains HTTP request header information.

```js
console.log(req.headers);
```

---

## `fs`

Used for File System operations.

```js
const fs = require("fs");
```

---

## Event Loop

Coordinates JavaScript callbacks and asynchronous work.

---

## Thread Pool

A libuv worker pool used for certain operations outside the main JavaScript execution thread.

---

# 21. Complete Example — Routing + Logging

```js
const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {

    const log = `${Date.now()}: ${req.url}\n`;

    fs.appendFile("./log.txt", log, (err) => {
        if (err) {
            console.log(err);
        }
    });

    switch (req.url) {

        case "/":
            res.end("Home Page");
            break;

        case "/about":
            res.end("I am a Developer");
            break;

        case "/contact":
            res.end("Contact Page");
            break;

        default:
            res.end("404 Not Found");
    }
});

server.listen(8000, () => {
    console.log("Server Started");
});
```

### What happens?

```text
Browser
   ↓
Request
   ↓
Node.js HTTP Server
   ↓
(req, res)
   │
   ├──────────────→ Log req.url
   │                    ↓
   │                appendFile()
   │
   ↓
Routing
   │
   ├── "/"        → Home Page
   ├── "/about"   → About Page
   ├── "/contact" → Contact Page
   └── Other      → 404
   │
   ↓
Response
   ↓
Browser
```

---

# 22. Final Architecture

A simplified HTTP server architecture:

```text
                         CLIENT
                            │
                            ▼
                         REQUEST
                            │
                            ▼
                     ┌─────────────┐
                     │ HTTP SERVER │
                     └──────┬──────┘
                            │
                            ▼
                    REQUEST HANDLER
                            │
                  ┌─────────┴─────────┐
                  │                   │
                  ▼                   ▼
                 req                 res
                  │                   │
                  │                   ▼
                  │              RESPONSE
                  │                   │
                  └─────────┬─────────┘
                            ▼
                          CLIENT
```

With file logging:

```text
                         CLIENT
                            │
                            ▼
                         REQUEST
                            │
                            ▼
                     ┌─────────────┐
                     │ HTTP SERVER │
                     └──────┬──────┘
                            │
                     ┌──────┴──────┐
                     │             │
                     ▼             ▼
                  Routing       Logging
                     │             │
                     │         fs.appendFile()
                     │             │
                     ▼             ▼
                  Response      log.txt
                     │
                     ▼
                   CLIENT
```

---

# 23. Quick Revision

```text
Node.js
   ↓
HTTP Module
   ↓
createServer()
   ↓
Request Handler
   ↓
(req, res)
   ↓
┌──────────────┬──────────────┐
│ req          │ res          │
│              │              │
│ Request      │ Send         │
│ information  │ response     │
└──────────────┴──────────────┘
   ↓
server.listen(8000)
```

## Most Important Rules

* `http` is a built-in Node.js module.
* `http.createServer()` creates an HTTP server.
* `req` contains request information.
* `res` is used to send the response.
* `server.listen()` starts the server.
* `req.url` tells you which path was requested.
* `req.method` tells you the HTTP method.
* `req.headers` contains request headers.
* Routing allows different responses for different URLs.
* `fs` handles file-system operations.
* `fs.appendFile()` can be used for asynchronous request logging.
* Prefer asynchronous/non-blocking operations in servers when appropriate.
* Synchronous operations can block JavaScript execution.
* The Event Loop coordinates asynchronous JavaScript work.
* The libuv Thread Pool handles certain operations outside the main JavaScript execution thread.
* CPU core count and Thread Pool size are separate concepts.

---

## 🧠 30-Second Revision

```text
CLIENT
   ↓
HTTP REQUEST
   ↓
Node.js HTTP SERVER
   ↓
(req, res)
   ↓
Check req.url
   ↓
ROUTING
   ├── /          → Home
   ├── /about     → About
   ├── /contact   → Contact
   └── Other      → 404
   ↓
RESPONSE
   ↓
CLIENT
```

### With Logging

```text
REQUEST
   ↓
req.url
   ↓
fs.appendFile()
   ↓
log.txt
```

### Core Idea

> **Node.js's `http` module lets us create HTTP servers that receive requests through `req` and send responses through `res`. The `fs` module can be used for operations such as request logging, while asynchronous APIs help avoid unnecessarily blocking the JavaScript execution thread.**
