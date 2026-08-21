# Express.js Middleware

## 📌 Overview

Middleware is one of the most important concepts in **Express.js**.

Middleware functions run **between the incoming request and the final route handler**. They can process the request, modify the request or response, end the request-response cycle, or pass control to the next middleware.

---

## 🔄 Request-Response Flow

Without middleware:

```text
Client
  ↓
Request
  ↓
Express Server
  ↓
Route Handler
  ↓
Response
  ↓
Client
```

With middleware:

```text
Client
  ↓
Request
  ↓
Middleware 1
  ↓
Middleware 2
  ↓
Middleware 3
  ↓
Route Handler
  ↓
Response
  ↓
Client
```

---

## 🧩 What is Middleware?

An Express middleware function is a function that has access to:

- `req` → Request object
- `res` → Response object
- `next` → Function used to move to the next middleware

Basic structure:

```js
function middleware(req, res, next) {
    // middleware logic

    next();
}
```

The `next()` function tells Express:

> "My middleware has finished its work. Move to the next middleware."

---

## ⚙️ What Can Middleware Do?

Middleware can:

1. Execute any JavaScript code.
2. Modify the request object.
3. Modify the response object.
4. End the request-response cycle.
5. Call the next middleware.

```text
             Middleware
                  │
       ┌──────────┴──────────┐
       ↓                     ↓
   Process OK            Process Failed
       ↓                     ↓
   next()              Send Response
       ↓                     ↓
Next Middleware       Request Ends
```

---

## 🚦 `next()` Function

The `next()` function is extremely important.

Example:

```js
app.use((req, res, next) => {
    console.log("Hello from Middleware 1");

    next();
});
```

When a request arrives:

```text
Request
   ↓
Middleware 1
   ↓
next()
   ↓
Route
   ↓
Response
```

### ⚠️ What if `next()` is not called?

If middleware does not call `next()` and also does not send a response, the request can remain stuck.

```js
app.use((req, res, next) => {
    console.log("Hello from Middleware");
});
```

The request will not continue to the route.

```text
Request
   ↓
Middleware
   ↓
❌ Stuck
```

---

## 🛑 Middleware Can End the Request

Middleware does not always have to call `next()`.

It can directly send a response:

```js
app.use((req, res, next) => {
    return res.json({
        message: "Hello from Middleware"
    });
});
```

Now the request ends inside the middleware.

```text
Request
   ↓
Middleware
   ↓
Response
   ↓
❌ Route does not execute
```

This can be useful for:

- Authentication
- Authorization
- Validation
- Blocking unauthorized requests
- Error handling

---

## 🔗 Multiple Middleware Functions

An Express application can have multiple middleware functions.

```js
app.use((req, res, next) => {
    console.log("Hello from Middleware 1");
    next();
});

app.use((req, res, next) => {
    console.log("Hello from Middleware 2");
    next();
});

app.get("/users", (req, res) => {
    res.json({
        message: "All users"
    });
});
```

The execution order is:

```text
Request
   ↓
Middleware 1
   ↓
Middleware 2
   ↓
GET /users
   ↓
Response
```

### Important

Middleware generally executes in the order in which it is registered.

---

## 🛠️ Modifying the Request Object

Middleware can add custom properties to the request object.

Example:

```js
app.use((req, res, next) => {
    req.myUsername = "Piyush Garg";

    next();
});
```

The next middleware or route can access it:

```js
app.get("/users", (req, res) => {
    console.log(req.myUsername);

    res.json({
        username: req.myUsername
    });
});
```

Output:

```text
Piyush Garg
```

### Flow

```text
Middleware
    ↓
req.myUsername = "Piyush Garg"
    ↓
next()
    ↓
Route
    ↓
req.myUsername
```

This demonstrates how middleware can **modify the request object** and make information available to later middleware or routes.

---

## 📦 Express Built-in Middleware

One example is:

```js
app.use(express.urlencoded({ extended: false }));
```

This middleware processes URL-encoded form data.

Without the appropriate body-parsing middleware, you may get:

```js
req.body
// undefined
```

After using the middleware:

```js
app.use(express.urlencoded({ extended: false }));
```

the submitted form data becomes available through:

```js
req.body
```

For JSON requests, Express commonly uses:

```js
app.use(express.json());
```

---

## 📝 Example: Request Body Middleware

```js
app.use(express.urlencoded({ extended: false }));

app.post("/users", (req, res) => {
    console.log(req.body);

    res.json({
        message: "User received"
    });
});
```

Flow:

```text
Postman / Client
       ↓
Form Data
       ↓
express.urlencoded()
       ↓
req.body
       ↓
POST /users
```

---

## 🧾 Practical Example: Request Logger

Middleware can be used to log every incoming request.

```js
const fs = require("fs");

app.use((req, res, next) => {
    const log = `${Date.now()}: ${req.method} ${req.path}\n`;

    fs.appendFile("log.txt", log, (err) => {
        if (err) {
            console.log(err);
        }

        next();
    });
});
```

Now every request can be recorded in:

```text
log.txt
```

Example:

```text
1755260000000: GET /api/users
1755260005000: GET /api/users/1004
1755260010000: POST /api/users
```

---

## 🌐 Getting the Client IP

The request object also contains information about the client.

```js
app.use((req, res, next) => {
    console.log(req.ip);

    next();
});
```

In local development, you may see a local/loopback address.

After deployment, the application can receive information associated with real client requests, subject to the server/proxy configuration.

---

## 🔐 Real-World Uses of Middleware

Middleware is useful for separating different responsibilities.

### Authentication

```text
Request
   ↓
Authentication Middleware
   ↓
Is user logged in?
   ↓
Yes → next()
No  → Response
```

### Authorization

```text
Request
   ↓
Authorization Middleware
   ↓
Is user allowed?
   ↓
Yes → next()
No  → Response
```

### Validation

```text
Request
   ↓
Validation Middleware
   ↓
Is data valid?
   ↓
Yes → next()
No  → Error Response
```

### Logging

```text
Request
   ↓
Logger Middleware
   ↓
Write request information
   ↓
next()
   ↓
Route
```

---

## 🧹 Why Middleware Makes Code Cleaner

Instead of putting logging, authentication, validation, etc. inside every route:

```js
app.get("/users", ...);
app.post("/users", ...);
app.patch("/users/:id", ...);
app.delete("/users/:id", ...);
```

we can create reusable middleware.

```text
                Request
                   ↓
              Middleware
          ┌────────┼────────┐
          ↓        ↓        ↓
       Logging   Auth   Validation
          └────────┼────────┘
                   ↓
                Route
```

Each middleware can have its own responsibility.

---

## 🏗️ Middleware as a Pipeline

A useful way to think about middleware is as a pipeline:

```text
Request
   ↓
┌─────────────────┐
│ Logger          │
└────────┬────────┘
         ↓
┌─────────────────┐
│ Authentication  │
└────────┬────────┘
         ↓
┌─────────────────┐
│ Validation      │
└────────┬────────┘
         ↓
┌─────────────────┐
│ Route Handler   │
└────────┬────────┘
         ↓
      Response
```

Every middleware performs its job and then decides whether to:

```text
next()
```

or:

```text
res.json(...)
res.send(...)
res.end(...)
```

---

## 🎯 Key Points

### Middleware is:

> A function that has access to the request object, response object, and the next middleware function in the request-response cycle.

### The three important parameters are:

```js
(req, res, next)
```

### `req`

Contains information about the incoming request.

```js
req.body
req.params
req.method
req.ip
```

### `res`

Used to send a response.

```js
res.json(...)
res.send(...)
res.end(...)
```

### `next`

Passes control to the next middleware.

```js
next();
```

---

## 📚 Important Middleware Concepts

| Concept | Purpose |
|---|---|
| `req` | Access request information |
| `res` | Send response |
| `next()` | Continue to next middleware |
| `app.use()` | Register middleware |
| `req.body` | Access parsed request body |
| `req.params` | Access route parameters |
| `req.method` | Get HTTP method |
| `req.ip` | Get request IP information |

---

## 🔑 Final Summary

```text
Client
  ↓
Request
  ↓
Middleware 1
  │
  ├── Process Request
  │
  └── next()
        ↓
Middleware 2
  │
  ├── Modify Request/Response
  │
  └── next()
        ↓
Middleware 3
  │
  └── next()
        ↓
Route Handler
        ↓
Response
        ↓
Client
```

Middleware acts as a **middle layer between the request and the final route handler**.

It allows us to:

- Process requests
- Validate data
- Authenticate users
- Log requests
- Modify request/response objects
- Handle common logic
- Stop requests when necessary
- Pass requests to the next middleware

> **The most important rule to remember: if a middleware neither sends a response nor calls `next()`, the request can get stuck.**