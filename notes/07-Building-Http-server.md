# Node.js HTTP Server — Revision Notes

## 1. Creating a Node.js Project

```bash
npm init -y

This creates package.json.

Entry Point

Usually:

index.js

It is a common convention to use index.js as the main entry point of a project.

2. HTTP Module

Node.js provides a built-in http module.

const http = require("http");

No installation is required because it is built into Node.js.

3. Creating a Server
const http = require("http");

const server = http.createServer((req, res) => {
    console.log("New Request Received");

    res.end("Hello From Server");
});
http.createServer()

Creates an HTTP server.

The callback function handles incoming requests.

(req, res) => {}
req → Request object
res → Response object
4. Request Object

The req object contains information about the incoming request.

Examples:

req.url
req.method
req.headers
req.httpVersion
req.socket
Request URL
console.log(req.url);

If the user visits:

http://localhost:8000/about

Then:

req.url

returns:

/about
5. Response Object

The res object is used to send a response to the client.

res.end("Hello From Server");

Example:

const server = http.createServer((req, res) => {
    res.end("Hello From Server");
});
6. Starting the Server
server.listen(8000, () => {
    console.log("Server Started");
});
Port

A port can be thought of as a communication endpoint.

Example:

localhost:8000
localhost → Your computer
8000 → Port number

Open in browser:

http://localhost:8000
7. Complete Basic Server
const http = require("http");

const server = http.createServer((req, res) => {
    console.log("New Request Received");

    res.end("Hello From Server");
});

server.listen(8000, () => {
    console.log("Server Started");
});

Run:

node index.js

Or using package.json:

"scripts": {
    "start": "node index.js"
}

Then:

npm start
8. Request → Response Flow
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

Example:

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
9. Routing

We can send different responses depending on the URL.

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
Routes
/          → Home Page
/about     → About Page
/contact   → Contact Page
10. File System Module

Node.js provides the built-in fs module for working with files.

const fs = require("fs");

Used for:

Creating files
Reading files
Writing files
Appending files
Deleting files
Copying files
Creating directories
11. Synchronous vs Asynchronous
Synchronous

Synchronous operations are blocking.

const data = fs.readFileSync("./file.txt", "utf-8");

console.log(data);

console.log("Done");

Flow:

Read File
   ↓
WAIT
   ↓
File Complete
   ↓
Print Data
   ↓
Done
Asynchronous

Asynchronous operations are non-blocking.

fs.readFile("./file.txt", "utf-8", (err, data) => {

    if (err) {
        console.log(err);
        return;
    }

    console.log(data);
});

console.log("Done");

Flow:

Start File Read
      ↓
Continue Execution
      ↓
Print "Done"
      ↓
File Operation Complete
      ↓
Callback Executes
Important

For server applications, prefer non-blocking/asynchronous operations when appropriate.

12. File Operations
Write File
fs.writeFileSync("./test.txt", "Hello World");
Read File
const data = fs.readFileSync("./test.txt", "utf-8");
Append File
fs.appendFileSync("./test.txt", "\nNew Entry");
Delete File
fs.unlinkSync("./test.txt");
Copy File
fs.copyFileSync("./test.txt", "./copy.txt");
Create Directory
fs.mkdir("./docs", (err) => {
    if (err) console.log(err);
});
13. Creating a Request Log

For a server, we can record incoming requests.

const fs = require("fs");

const log = `${Date.now()}: New Request Received\n`;

fs.appendFile("./log.txt", log, (err) => {
    if (err) {
        console.log(err);
    }
});
Why asynchronous appendFile()?

Because using synchronous file operations inside a server can block execution.

14. Logging Request URL
const log = `${Date.now()}: ${req.url}\n`;

fs.appendFile("./log.txt", log, (err) => {
    if (err) {
        console.log(err);
    }
});

Example log.txt:

1755000000000: /
1755000005000: /about
1755000010000: /contact
15. Event Loop

Node.js uses an event-driven architecture.

Basic idea:

Client
   ↓
Request
   ↓
Event Queue
   ↓
Event Loop
   ↓
Process Task
   ↓
Response

The Event Loop allows Node.js to handle many operations without blocking the main JavaScript execution thread.

16. Blocking vs Non-Blocking
Blocking
Task 1
  ↓
WAIT
  ↓
Task 1 Complete
  ↓
Task 2
Non-Blocking
Task 1
  ↓
Continue
  ↓
Task 2
  ↓
Task 3
  ↓
Task 1 Complete
Remember
Blocking = Wait
Non-Blocking = Continue
17. Thread Pool

Node.js uses a libuv Thread Pool for certain operations that can be performed outside the main JavaScript thread.

Conceptually:

Event Loop
    ↓
Thread Pool
    ↓
Worker Thread
    ↓
Operation
    ↓
Result

The default libuv thread-pool size is generally:

4 workers

It can be configured using:

UV_THREADPOOL_SIZE
18. Why Blocking Is Bad

Imagine several expensive operations:

Worker 1 → User 1
Worker 2 → User 2
Worker 3 → User 3
Worker 4 → User 4

If resources are busy:

User 5
   ↓
WAIT
   ↓
Worker Available
   ↓
Process User 5

Too much blocking work can increase waiting time and reduce scalability.

19. Important Node.js Modules
HTTP
const http = require("http");

Used to create HTTP servers.

File System
const fs = require("fs");

Used to work with files and directories.

Operating System
const os = require("os");

Used to get information about the operating system.

Example:

console.log(os.cpus().length);
20. Important Concepts to Remember
http.createServer()

Creates an HTTP server.

req

Contains information about the incoming request.

res

Used to send a response.

server.listen()

Starts the server on a specified port.

req.url

Returns the requested URL/path.

req.headers

Contains request header information.

fs

Used for file-system operations.

Event Loop

Handles asynchronous work and coordinates execution.

Thread Pool

Handles certain operations outside the main JavaScript thread.

21. Complete Example with Routing + Logging
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
22. Final Architecture
                CLIENT
                   │
                   ▼
                REQUEST
                   │
                   ▼
             HTTP SERVER
                   │
                   ▼
          REQUEST HANDLER
             ┌─────┴─────┐
             │           │
             ▼           ▼
           req          res
             │           │
             │           ▼
             │       RESPONSE
             │           │
             └─────┬─────┘
                   ▼
                 CLIENT
23. Quick Revision
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
req → Request information
res → Send response
  ↓
server.listen(8000)
Most Important Rules
http is a built-in Node.js module.
createServer() creates the server.
req contains request information.
res sends the response.
server.listen() starts the server.
req.url tells which path was requested.
Use routing to return different responses.
fs handles file-system operations.
Prefer asynchronous/non-blocking operations in servers.
Blocking operations can reduce server performance.
The Event Loop coordinates asynchronous execution.
The Thread Pool handles certain expensive operations.