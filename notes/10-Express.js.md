# Express.js — Node.js Revision Notes

## 1. What is Express.js?

**Express.js** is a fast, minimal, and flexible web framework for **Node.js**.

It makes building web servers and handling routes much easier.

```text
Node.js
   ↓
HTTP Module
   ↓
Express.js
   ↓
Easy Routing + Request Handling
```

Express does **not replace Node.js or the HTTP module**.

Instead:

> **Express internally uses Node.js's HTTP module and provides a simpler API on top of it.**

---

# 2. Why Do We Need Express?

Before Express, we can create a server using Node's built-in `http` module:

```js
const http = require("http");

const server = http.createServer((req, res) => {

    if (req.url === "/" && req.method === "GET") {
        res.end("Home Page");
    }

    else if (req.url === "/about" && req.method === "GET") {
        res.end("About Page");
    }

    else if (req.url === "/signup" && req.method === "POST") {
        res.end("Signup");
    }

});

server.listen(8000);
```

This works, but as the application grows, the code becomes difficult to manage.

### Problems

With the HTTP module, we may need to manually handle:

- Routes
- HTTP methods
- Query parameters
- Headers
- Request body
- JSON data
- Different types of requests
- Large numbers of `if/else` conditions

For example:

```text
Route
   ↓
Method
   ↓
GET / POST / PUT / PATCH / DELETE
   ↓
Request Handling
```

As the application grows, this can become messy.

---

# 3. Express Solves This Problem

Express gives us a clean routing system.

Instead of:

```js
if (req.url === "/" && req.method === "GET") {
    // ...
}
```

We can simply write:

```js
app.get("/", (req, res) => {
    res.send("Home Page");
});
```

For another route:

```js
app.get("/about", (req, res) => {
    res.send("About Page");
});
```

And for POST:

```js
app.post("/signup", (req, res) => {
    res.send("Signup");
});
```

Much cleaner.

---

# 4. Installing Express

Create your Node.js project:

```bash
npm init -y
```

Then install Express:

```bash
npm install express
```

Express will be added to your `package.json` dependencies.

Example:

```json
{
    "dependencies": {
        "express": "^4.18.2"
    }
}
```

> The exact version may differ depending on when you install it.

---

# 5. Import Express

Using CommonJS:

```js
const express = require("express");
```

Now Express is available in our application.

---

# 6. Create an Express App

```js
const express = require("express");

const app = express();
```

Here:

```js
const express = require("express");
```

imports Express.

And:

```js
const app = express();
```

creates an **Express application instance**.

Think of:

```js
app
```

as the main object through which we configure our server.

---

# 7. Basic Express Server

```js
const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("Hello from Home Page");
});

app.listen(8000, () => {
    console.log("Server started");
});
```

Open:

```text
http://localhost:8000
```

Response:

```text
Hello from Home Page
```

---

# 8. Express Routing

The basic Express route structure is:

```js
app.METHOD(PATH, HANDLER);
```

For example:

```js
app.get("/", (req, res) => {
    res.send("Home Page");
});
```

There are four important parts:

```text
app
 ↓
method
 ↓
path
 ↓
handler
```

### Example

```js
app.get("/about", (req, res) => {
    res.send("About Page");
});
```

Here:

| Part | Meaning |
|---|---|
| `app` | Express application |
| `get` | HTTP method |
| `/about` | Route/path |
| `(req, res) => {}` | Handler function |

---

# 9. Express HTTP Methods

Express provides methods for HTTP requests:

```js
app.get()
app.post()
app.put()
app.patch()
app.delete()
```

Example:

```js
app.get("/users", (req, res) => {
    res.send("Get Users");
});

app.post("/users", (req, res) => {
    res.send("Create User");
});

app.put("/users/:id", (req, res) => {
    res.send("Replace User");
});

app.patch("/users/:id", (req, res) => {
    res.send("Update User");
});

app.delete("/users/:id", (req, res) => {
    res.send("Delete User");
});
```

---

# 10. What is a Route?

A route defines:

> **Which code should execute when a specific HTTP method and path are requested.**

Example:

```js
app.get("/about", (req, res) => {
    res.send("About Page");
});
```

This means:

```text
GET
 ↓
/about
 ↓
Run this handler
```

So when the user visits:

```text
http://localhost:8000/about
```

the handler runs.

---

# 11. Request and Response

Express route handlers receive two important objects:

```js
(req, res)
```

### `req`

`req` means **request**.

It contains information about the incoming request.

For example:

```js
req.method
req.url
req.query
req.params
req.headers
```

### `res`

`res` means **response**.

It is used to send a response back to the client.

Example:

```js
res.send("Hello");
```

---

# 12. `res.send()`

Express provides:

```js
res.send()
```

to easily send a response.

Example:

```js
app.get("/", (req, res) => {
    res.send("Hello World");
});
```

You don't have to manually use:

```js
res.end();
```

for basic responses.

---

# 13. Query Parameters

Express makes query parameters easy to access.

Example URL:

```text
/about?name=Moiz
```

Access the query parameter:

```js
req.query.name
```

Example:

```js
app.get("/about", (req, res) => {

    res.send(`Hello ${req.query.name}`);

});
```

URL:

```text
http://localhost:8000/about?name=Moiz
```

Response:

```text
Hello Moiz
```

---

# 14. Multiple Query Parameters

Example:

```text
/about?name=Moiz&age=20
```

Access them:

```js
app.get("/about", (req, res) => {

    const name = req.query.name;
    const age = req.query.age;

    res.send(`Hello ${name}, your age is ${age}`);

});
```

Response:

```text
Hello Moiz, your age is 20
```

Express handles query parsing for us.

---

# 15. Express and Query Parameters

Without Express, we might need additional URL parsing logic.

With Express:

```js
req.query
```

is already available.

Example:

```js
req.query.name
req.query.age
```

This is one of the advantages of Express.

---

# 16. `app.listen()`

Express can also start the server for us.

Instead of:

```js
const http = require("http");

const server = http.createServer(app);

server.listen(8000, () => {
    console.log("Server started");
});
```

We can simply use:

```js
app.listen(8000, () => {
    console.log("Server started");
});
```

This is much simpler.

---

# 17. Does Express Replace HTTP?

**No.**

This is very important.

Express internally uses Node.js's HTTP functionality.

Conceptually:

```text
Your Application
       ↓
    Express
       ↓
 Node.js HTTP
       ↓
     Server
```

So Express is a **framework built on top of Node.js's HTTP capabilities**.

---

# 18. Express App as a Handler

The Express application:

```js
const app = express();
```

can itself act as a request handler.

For example:

```js
const http = require("http");
const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("Hello");
});

const server = http.createServer(app);

server.listen(8000);
```

Here:

```js
http.createServer(app)
```

passes the Express application as the handler.

---

# 19. Express Can Handle the Server Setup

Because Express provides:

```js
app.listen()
```

we usually don't need to manually create the HTTP server for a basic Express application.

Instead of:

```js
const http = require("http");

const server = http.createServer(app);

server.listen(8000);
```

we can simply use:

```js
app.listen(8000);
```

Express handles the underlying HTTP server setup.

---

# 20. Clean Express Code

A simple Express server can be:

```js
const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("Hello from Home Page");
});

app.get("/about", (req, res) => {
    res.send("Hello from About Page");
});

app.listen(8000, () => {
    console.log("Server started on port 8000");
});
```

Compare this with manually handling routes using `http`.

Express makes the application:

```text
Cleaner
Modular
Easier to Read
Easier to Maintain
Easier to Scale
```

---

# 21. Express Route Flow

When a request comes in:

```text
Client
   ↓
HTTP Request
   ↓
Express
   ↓
Find matching route
   ↓
Check HTTP method
   ↓
Run handler
   ↓
Response
   ↓
Client
```

Example:

```text
GET /about
     ↓
Express
     ↓
app.get("/about", ...)
     ↓
Handler executes
     ↓
res.send("About Page")
```

---

# 22. Core Express Routing Pattern

Remember this pattern:

```js
app.METHOD(PATH, HANDLER);
```

Example:

```js
app.get("/", (req, res) => {
    res.send("Home");
});
```

### Breakdown

```text
app
 ↓
Express application

get
 ↓
HTTP method

"/"
 ↓
Path

(req, res) => {}
 ↓
Handler
```

---

# 23. What is the Handler?

A handler is simply a function that runs when a route matches.

Example:

```js
(req, res) => {
    res.send("Hello");
}
```

The handler receives:

```text
Request
Response
```

and decides what response to send.

---

# 24. Important Express Benefits

### 1. Cleaner Routing

```js
app.get("/about", handler);
```

instead of manually checking:

```js
req.url
req.method
```

---

### 2. Easy HTTP Method Handling

```js
app.get()
app.post()
app.put()
app.patch()
app.delete()
```

---

### 3. Built-in Request Helpers

For example:

```js
req.query
req.params
req.headers
```

---

### 4. Easy Response Handling

```js
res.send()
```

and many other response methods are available.

---

### 5. Better Code Structure

Express makes large applications easier to organize.

---

# 25. Why Not Use Only Node HTTP?

Node's HTTP module is powerful, but manually managing everything can become painful.

For example:

```text
HTTP Module
   ↓
Route checking
   ↓
Method checking
   ↓
Query parsing
   ↓
Headers
   ↓
Body parsing
   ↓
Response handling
   ↓
More code...
```

Express provides abstractions that make many of these tasks easier.

---

# 26. Express vs Node HTTP

| Node HTTP | Express |
|---|---|
| Low-level | Higher-level framework |
| More manual work | Easier routing |
| Manually check routes | `app.get()`, `app.post()` etc. |
| More boilerplate | Less boilerplate |
| Built into Node.js | Installed separately |
| Express can use it internally | Built on Node's HTTP capabilities |

---

# 27. Removing Unnecessary Modules

Once Express handles the required functionality, some manual modules may no longer be necessary.

For example, if you previously used URL parsing manually:

```js
const url = require("url");
```

you may not need that approach for basic query handling because Express provides:

```js
req.query
```

The important idea is:

> **Express provides convenient abstractions so we don't have to manually handle every low-level detail.**

---

# 28. Complete Example

```js
const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("Hello from Home Page");
});

app.get("/about", (req, res) => {
    const name = req.query.name;

    res.send(`Hello ${name || "User"} from About Page`);
});

app.post("/signup", (req, res) => {
    res.send("Signup request received");
});

app.put("/users/:id", (req, res) => {
    res.send("User replaced");
});

app.patch("/users/:id", (req, res) => {
    res.send("User updated");
});

app.delete("/users/:id", (req, res) => {
    res.send("User deleted");
});

app.listen(8000, () => {
    console.log("Server started on port 8000");
});
```

---

# 29. Quick Revision

### Express

```text
Express = Node.js Web Framework
```

### Install

```bash
npm install express
```

### Import

```js
const express = require("express");
```

### Create App

```js
const app = express();
```

### Route

```js
app.get("/", (req, res) => {
    res.send("Hello");
});
```

### Start Server

```js
app.listen(8000, () => {
    console.log("Server started");
});
```

### Query Parameters

```js
req.query.name
```

---

# 30. One-Line Memory Notes

```text
Express
↓
Web framework for Node.js

app = express()
↓
Creates Express application

app.get()
↓
Handles GET route

app.post()
↓
Handles POST route

app.put()
↓
Handles PUT route

app.patch()
↓
Handles PATCH route

app.delete()
↓
Handles DELETE route

req
↓
Incoming request

res
↓
Outgoing response

req.query
↓
Query parameters

res.send()
↓
Send response

app.listen()
↓
Start server
```

---

# Final Mental Model

```text
                 EXPRESS
                    │
          ┌─────────┴─────────┐
          ↓                   ↓
       ROUTING            REQUEST/RESPONSE
          │                   │
    ┌─────┼─────┐             │
    ↓     ↓     ↓             ↓
   GET   POST  DELETE        req / res
    │     │      │             │
    └─────┴──────┴─────────────┘
                    │
                    ↓
                 HANDLER
                    │
                    ↓
                 RESPONSE
```

### ⭐ Most Important Concept

> **Express is a Node.js web framework that makes server-side development easier by providing clean routing, request/response helpers, and other useful functionality on top of Node.js's HTTP capabilities.**