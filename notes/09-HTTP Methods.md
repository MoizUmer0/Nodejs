# HTTP Methods — Node.js Revision Notes

HTTP methods define **what we want to do with a resource on a server**.

The most common HTTP methods are:

```text
GET     → Get data
POST    → Send/Create data
PUT     → Replace/Upload data
PATCH   → Update/Edit data
DELETE  → Delete data
```

---

## 1. GET

### What is GET?

`GET` is used when we want to **retrieve/read data from a server**.

```text
Client
  ↓
GET Request
  ↓
Server
  ↓
Database
  ↓
Data
  ↓
Client
```

### Example

When you enter a URL in your browser:

```text
https://youtube.com
```

The browser normally makes a **GET request**.

For example:

```text
GET /about
GET /movies
GET /users
```

The server receives the request and can return the requested data/page.

### Browser Example

Open Chrome DevTools:

```text
Right Click
   ↓
Inspect
   ↓
Network
   ↓
Refresh Page
```

You can see requests such as:

```text
Request Method: GET
```

### Important

Use `GET` when:

> **You want to get/read data from the server.**

---

# 2. POST

### What is POST?

`POST` is used when we want to **send data to the server**.

Usually, POST is used when we want to **create new data**.

For example:

```text
Signup
Login
Create Account
Submit Form
Create Post
Send Feedback
```

### Example

Suppose we have a signup form:

```text
Username: Moiz
Email: moiz@example.com
Password: 123456
```

When the user submits the form:

```text
Form
  ↓
POST Request
  ↓
Server
  ↓
Database
  ↓
Create/Insert Data
```

The form data is usually sent in the **request body**.

### Example

```http
POST /signup
```

Request body:

```json
{
  "username": "Moiz",
  "email": "moiz@example.com",
  "password": "123456"
}
```

The server can then insert this information into the database.

### Important

Use `POST` when:

> **You want to send data to the server, commonly to create something new.**

---

# 3. PUT

### What is PUT?

`PUT` is generally used to **replace/update a resource**.

Example:

```text
PUT /users/10
```

You might send:

```json
{
  "name": "Moiz",
  "email": "newemail@example.com"
}
```

PUT can replace the existing representation of that resource with the new representation.

### Example Use Cases

```text
Upload/replace a file
Replace user information
Replace an existing resource
```

### Important

Think:

```text
PUT → Replace / Update the resource
```

---

# 4. PATCH

### What is PATCH?

`PATCH` is used when we want to **partially update an existing resource**.

For example, a user has:

```json
{
  "name": "Moiz",
  "email": "moiz@example.com",
  "age": 20
}
```

If we only want to change the name:

```http
PATCH /users/10
```

```json
{
  "name": "Ali"
}
```

Only the required field is changed.

### PUT vs PATCH

```text
PUT
→ Replace the resource

PATCH
→ Partially update the resource
```

---

# 5. DELETE

### What is DELETE?

`DELETE` is used when we want to **remove a resource**.

Example:

```http
DELETE /users/10
```

The server can then remove that user from the database.

### Example

```text
Delete Account
Delete Post
Delete User
Delete Comment
```

### Important

Think:

```text
DELETE → Remove data
```

---

# HTTP Methods Summary

| Method | Main Purpose | Example |
|---|---|---|
| GET | Read/Get data | Get movies |
| POST | Create/Send data | Create account |
| PUT | Replace/Update resource | Replace profile |
| PATCH | Partially update | Change username |
| DELETE | Remove data | Delete account |

---

# CRUD and HTTP Methods

HTTP methods are commonly associated with CRUD operations.

```text
CRUD
```

means:

```text
C → Create
R → Read
U → Update
D → Delete
```

Common mapping:

```text
CREATE → POST
READ   → GET
UPDATE → PUT / PATCH
DELETE → DELETE
```

---

# Request Method in Node.js

In Node.js, we can check the HTTP method using:

```js
request.method
```

Example:

```js
const http = require("http");

const server = http.createServer((req, res) => {
    console.log(req.method);

    res.end("Hello World");
});

server.listen(8000, () => {
    console.log("Server started");
});
```

If you open:

```text
http://localhost:8000
```

You will normally see:

```text
GET
```

---

# Handling Different HTTP Methods

We can check the request method using:

```js
if (req.method === "GET") {
    // Handle GET
}

if (req.method === "POST") {
    // Handle POST
}
```

Example:

```js
const http = require("http");

const server = http.createServer((req, res) => {

    if (req.method === "GET") {
        res.end("GET Request");
    }

    else if (req.method === "POST") {
        res.end("POST Request");
    }

    else if (req.method === "PUT") {
        res.end("PUT Request");
    }

    else if (req.method === "PATCH") {
        res.end("PATCH Request");
    }

    else if (req.method === "DELETE") {
        res.end("DELETE Request");
    }

});

server.listen(8000, () => {
    console.log("Server started on port 8000");
});
```

---

# Handling Method + URL

We can check both:

```js
req.url
```

and:

```js
req.method
```

Example:

```js
const http = require("http");

const server = http.createServer((req, res) => {

    if (req.url === "/" && req.method === "GET") {
        res.end("Home Page");
    }

    else if (req.url === "/about" && req.method === "GET") {
        res.end("About Page");
    }

    else if (req.url === "/signup" && req.method === "GET") {
        res.end("Signup Form");
    }

    else if (req.url === "/signup" && req.method === "POST") {
        res.end("Signup Successful");
    }

});

server.listen(8000, () => {
    console.log("Server started");
});
```

---

# Same URL, Different Methods

An important concept is that **the same route can handle different HTTP methods**.

For example:

```text
/signup
```

### GET

```text
GET /signup
```

Could mean:

> Show the signup form.

### POST

```text
POST /signup
```

Could mean:

> Submit the signup form and create the user.

So:

```text
GET  /signup → Show signup page
POST /signup → Create/signup user
```

The URL is the same, but the **HTTP method tells the server what operation is being requested**.

---

# GET vs POST

This is one of the most important things to remember.

### GET

```text
GET /users
```

Means:

> Give me the users.

```text
Client → GET → Server → Data → Client
```

### POST

```text
POST /users
```

Means:

> Here is some data. Create a new user.

```text
Client → POST + Data → Server → Database
```

---

# Request Body

When sending data using methods such as POST, the data can be sent in the **request body**.

Example:

```json
{
    "username": "Moiz",
    "email": "moiz@example.com"
}
```

Conceptually:

```text
POST Request
     ↓
Request Body
     ↓
Server
     ↓
Database
```

---

# HTTP Request Structure

A request can contain:

```text
HTTP Request
│
├── Method
│   └── GET / POST / PUT / PATCH / DELETE
│
├── URL
│   └── /users
│
├── Headers
│   └── Content-Type, Authorization, etc.
│
└── Body
    └── Data sent to server
```

For example:

```text
POST /users

Content-Type: application/json

{
    "name": "Moiz"
}
```

---

# Testing HTTP Methods in Browser DevTools

You can inspect requests using:

```text
Browser
   ↓
Inspect
   ↓
Network
   ↓
Make a request
```

Then check:

```text
Request URL
Request Method
Status Code
Request Headers
Request Payload
Response
```

For a form submission, you may see:

```text
Request Method: POST
```

And the submitted data can appear in the request payload/body.

---

# Why Express.js?

Handling everything manually with Node's `http` module can become difficult.

For example, a large application might have:

```text
GET
POST
PUT
PATCH
DELETE
```

for many different routes.

Manually checking:

```js
if (req.url === ...)
```

and:

```js
if (req.method === ...)
```

can make the code difficult to maintain.

That's one reason frameworks such as **Express.js** are commonly used.

Express makes routing much cleaner.

For example:

```js
app.get("/users", (req, res) => {
    res.send("Get Users");
});

app.post("/users", (req, res) => {
    res.send("Create User");
});

app.put("/users/:id", (req, res) => {
    res.send("Update User");
});

app.patch("/users/:id", (req, res) => {
    res.send("Partially Update User");
});

app.delete("/users/:id", (req, res) => {
    res.send("Delete User");
});
```

This is much easier to manage than a large collection of nested `if` statements.

---

# Quick Revision

Remember these five words:

```text
GET
↓
READ

POST
↓
CREATE / SEND

PUT
↓
REPLACE

PATCH
↓
PARTIAL UPDATE

DELETE
↓
REMOVE
```

### Easy Memory Trick

```text
GET     → Give me data
POST    → Here is new data
PUT     → Replace this
PATCH   → Change this part
DELETE  → Remove this
```

---

# Real-World Example — User System

Suppose we have:

```text
/users
```

### Get all users

```http
GET /users
```

### Create a user

```http
POST /users
```

### Replace a user

```http
PUT /users/10
```

### Update part of a user

```http
PATCH /users/10
```

### Delete a user

```http
DELETE /users/10
```

---

# Final Cheat Sheet

```text
┌──────────┬─────────────────────────────┐
│ Method   │ Purpose                     │
├──────────┼─────────────────────────────┤
│ GET      │ Read / Get data             │
│ POST     │ Create / Send data          │
│ PUT      │ Replace / Update resource   │
│ PATCH    │ Partial update              │
│ DELETE   │ Delete resource             │
└──────────┴─────────────────────────────┘
```

## Most Important Points

- `GET` → Used to retrieve data.
- `POST` → Used to send/create data.
- `PUT` → Used to replace/update a resource.
- `PATCH` → Used to partially update a resource.
- `DELETE` → Used to remove a resource.
- `req.method` tells Node.js which HTTP method was used.
- `req.url` tells Node.js which URL/path was requested.
- POST/PUT/PATCH requests can carry data in the request body.
- The same URL can behave differently depending on the HTTP method.
- Express.js makes handling routes and HTTP methods much easier.