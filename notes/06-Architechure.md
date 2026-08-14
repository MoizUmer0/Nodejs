Node.js — Event Loop, Thread Pool & File System

1. Node.js Request Flow

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
     ┌─────┴─────┐
     ↓           ↓
    NO          YES
     ↓           ↓
 Process      Thread Pool
 Directly         ↓
     ↓        Worker Thread
     │            ↓
     │         Result
     └──────┬─────┘
            ↓
         Response
            ↓
          Client

2. Client

A client can be:

Web browser

Mobile application

Another application

The client sends a request to the Node.js server.

Client → Server

3. Event Queue

When requests/tasks arrive, they can be placed into a queue for processing.

Example:

Request 1
Request 2
Request 3
Request 4

Generally, queue processing follows FIFO:

First In → First Out

First Request → First Processed

4. Event Loop

The Event Loop continuously manages work that needs to be processed.

Main responsibilities:

Pick a task/request.

Determine what type of operation it involves.

Handle non-blocking work.

Coordinate with the Thread Pool for certain operations.

Continue handling other work.

Event Queue
     ↓
Event Loop

5. Blocking vs Non-Blocking

This is one of the most important Node.js concepts.

🔴 Blocking / Synchronous

A blocking operation makes the current execution wait until the operation finishes.

Example

const fs = require("fs");

const data = fs.readFileSync("./contacts.txt", "utf-8");

console.log(data);
console.log("Done");

Execution

Read File
   ↓
 WAIT
   ↓
File Read Complete
   ↓
console.log(data)
   ↓
console.log("Done")

Remember

Blocking = Wait

The next code cannot execute until the operation finishes.

🟢 Non-Blocking / Asynchronous

A non-blocking operation allows other code to continue while the operation is being completed.

Example

const fs = require("fs");

fs.readFile("./contacts.txt", "utf-8", (err, data) => {
    if (err) {
        console.log(err);
        return;
    }

    console.log(data);
});

console.log("Done");

Execution

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

Remember

Non-Blocking = Don't Wait

6. Thread Pool 🧵

Node.js uses a Thread Pool for certain expensive operations.

Think of it as a collection of worker threads.

        Thread Pool
   ┌──────┬──────┬──────┬──────┐
   │  T1  │  T2  │  T3  │  T4  │
   └──────┴──────┴──────┴──────┘

When an operation requires a worker:

Event Loop
    ↓
Thread Pool
    ↓
Available Worker
    ↓
Perform Operation
    ↓
Return Result

7. Why Blocking Code Can Be a Problem

The Thread Pool has a limited number of workers.

Example:

Worker 1 → User 1
Worker 2 → User 2
Worker 3 → User 3
Worker 4 → User 4

If all workers are busy:

User 5
   ↓
 WAIT
   ↓
Worker becomes available
   ↓
User 5 is processed

With many users and expensive operations, this can:

Increase waiting time

Reduce scalability

Delay other requests

Rule to Remember

For server applications, prefer non-blocking/asynchronous APIs when appropriate.

8. Synchronous vs Asynchronous fs

Node.js provides synchronous and asynchronous versions of many fs functions.

Synchronous

fs.readFileSync()
fs.writeFileSync()
fs.appendFileSync()

Example:

const data = fs.readFileSync("./file.txt", "utf-8");

console.log(data);

Key idea

Operation → WAIT → Result → Continue

Asynchronous

fs.readFile()
fs.writeFile()
fs.appendFile()

They can use:

Callback

Promise

async/await

Example:

fs.readFile("./file.txt", "utf-8", (err, data) => {
    if (err) {
        console.log(err);
        return;
    }

    console.log(data);
});

Key idea

Start Operation
      ↓
Continue Other Work
      ↓
Operation Completes
      ↓
Handle Result

9. Important Node.js Built-in Modules

📁 fs — File System

const fs = require("fs");

Used for:

Creating files

Reading files

Writing files

Appending data

Deleting files

Copying files

Creating directories

Checking file information

💻 os — Operating System

const os = require("os");

Can provide information about:

Operating system

CPU

System information

Example:

console.log(os.cpus().length);

10. File System Examples

Write a File

fs.writeFileSync("./test.txt", "Hello World");

Read a File

const data = fs.readFileSync("./test.txt", "utf-8");

console.log(data);

Append to a File

fs.appendFileSync("./test.txt", "\nNew Entry");

Delete a File

fs.unlinkSync("./test.txt");

Copy a File

fs.copyFileSync("./test.txt", "./copy.txt");

Create a Directory

fs.mkdir("./docs", (err) => {
    if (err) console.log(err);
});

11. Thread Pool Size

The libuv Thread Pool has a default size of:

4 workers

It can be configured using:

UV_THREADPOOL_SIZE

CPU information can be checked using:

const os = require("os");

console.log(os.cpus().length);

Important: Thread Pool size and CPU core count are not the same thing.

12. Important Terms

Term

Meaning

Client

Sends requests to the server

Event Queue

Holds tasks/requests waiting to be handled

Event Loop

Manages tasks and asynchronous work

Blocking

Execution waits for an operation

Non-Blocking

Execution can continue while waiting

Synchronous

Operation completes before continuing

Asynchronous

Result is handled later

Thread Pool

Collection of worker threads

Worker Thread

Performs assigned work

Callback

Function executed when an async operation completes

13. Complete Architecture

                    CLIENT
                       │
                       ▼
                    REQUEST
                       │
                       ▼
                ┌─────────────┐
                │ Event Queue │
                └──────┬──────┘
                       │
                       ▼
                  ┌───────────┐
                  │ Event Loop│
                  └─────┬─────┘
                        │
              ┌─────────┴─────────┐
              │                   │
              ▼                   ▼
       Non-Blocking            Blocking
              │                   │
              ▼                   ▼
       Process/Callback       Thread Pool
                                  │
                                  ▼
                            Worker Thread
                                  │
                                  ▼
                               Result
              │                   │
              └─────────┬─────────┘
                        ▼
                    RESPONSE
                        │
                        ▼
                      CLIENT

14. ⭐ Main Takeaways

Remember these points:

Node.js uses an event-driven architecture.

Requests/tasks are managed through the Event Loop.

Blocking operations make execution wait.

Non-blocking operations allow other work to continue.

Certain expensive operations use the Thread Pool.

The default libuv Thread Pool size is generally 4.

fs is used for file-system operations.

os provides operating-system and CPU information.

Node.js provides both synchronous and asynchronous APIs.

For server applications, prefer non-blocking/asynchronous APIs when appropriate.

15. 📌 30-Second Revision

CLIENT
  ↓
REQUEST
  ↓
EVENT QUEUE
  ↓
EVENT LOOP
  ↓
Is operation blocking?
  ↓
 ┌─────────────┐
 │             │
NO            YES
 │             │
 ↓             ↓
Continue    Thread Pool
 │             ↓
 │          Worker
 │             ↓
 └──────→  Result
             ↓
          RESPONSE
             ↓
           CLIENT

🧠 Core Idea

Node.js is designed around event-driven, asynchronous, non-blocking I/O, allowing it to handle many concurrent requests efficiently.