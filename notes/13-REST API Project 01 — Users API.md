# REST API Project 01 — Users API

This project is the **first REST API project** while learning Node.js and Express.js.

The goal is to design a RESTful API using **Express.js**, follow HTTP method best practices, work with JSON data, and understand dynamic route parameters.

---

## 🚀 Project Overview

In this project, we build a simple **Users REST API**.

The API supports:

- Getting all users
- Getting a single user by ID
- Creating a new user
- Updating a user
- Deleting a user

For now, users are stored in a local JSON file instead of a database.

---

# 📁 Project Setup

First, initialize a new Node.js project:

```bash
npm init
```

Then install Express:

```bash
npm install express
```

Example Express version:

```json
"express": "^4.18.2"
```

---

# 🏗️ Basic Express Server

The basic server structure looks like:

```javascript
const express = require("express");

const app = express();

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server started at PORT: ${PORT}`);
});
```

The server runs on:

```text
http://localhost:8000
```

---

# 📋 API Requirements

We are designing a RESTful API for users.

| HTTP Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/users` | Get all users |
| `GET` | `/api/users/:id` | Get a user by ID |
| `POST` | `/api/users` | Create a new user |
| `PATCH` | `/api/users/:id` | Update a user |
| `DELETE` | `/api/users/:id` | Delete a user |

---

# 📊 User Data

Because we are not using a database yet, we use fake users.

The data can be generated using a fake-data generator such as **Mockaroo**.

Example user:

```json
{
  "id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "gender": "male",
  "job_title": "Developer"
}
```

A large JSON file can contain hundreds or thousands of users.

---

# 📂 Project Structure

A simple structure can look like:

```text
project-01/
│
├── data/
│   └── users.json
│
├── index.js
├── package.json
└── package-lock.json
```

---

# 1️⃣ Get All Users

### Endpoint

```http
GET /api/users
```

### Purpose

Returns all users.

Example:

```javascript
app.get("/api/users", (req, res) => {
  return res.json(users);
});
```

The response is JSON:

```json
[
  {
    "id": 1,
    "first_name": "John"
  },
  {
    "id": 2,
    "first_name": "Sarah"
  }
]
```

---

# 2️⃣ Get User by ID

We need a dynamic ID because we don't know which user the client will request.

Instead of creating routes like:

```text
/api/users/1
/api/users/2
/api/users/3
/api/users/4
```

we use a **dynamic route parameter**:

```text
/api/users/:id
```

Example:

```javascript
app.get("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);

  const user = users.find((user) => user.id === id);

  return res.json(user);
});
```

---

# 🔹 Dynamic Route Parameters

In Express:

```javascript
/api/users/:id
```

`:id` is a dynamic route parameter.

For example:

```text
/api/users/1
```

Here:

```text
id = 1
```

And:

```text
/api/users/25
```

Here:

```text
id = 25
```

We can access it using:

```javascript
req.params.id
```

---

## 🔄 Dynamic Parameter Flow

```text
GET /api/users/10
        ↓
   :id = 10
        ↓
req.params.id
        ↓
Find user with id 10
        ↓
Return user
```

---

# ⚠️ ID is a String

Route parameters are received as strings.

For example:

```javascript
req.params.id
```

may contain:

```text
"10"
```

while the ID in our JSON data may be:

```javascript
10
```

Therefore, we can convert it to a number:

```javascript
const id = Number(req.params.id);
```

Then:

```javascript
const user = users.find((user) => user.id === id);
```

---

# 3️⃣ Create a New User

To create a new user, we use:

```http
POST /api/users
```

Example:

```javascript
app.post("/api/users", (req, res) => {
  return res.json({
    status: "pending"
  });
});
```

The purpose of this endpoint is:

```text
POST /api/users
       ↓
Create New User
```

The actual creation logic can be implemented later.

---

# 4️⃣ Update a User

For updating a user, we can use:

```http
PATCH /api/users/:id
```

Example:

```text
PATCH /api/users/10
```

Meaning:

> Update user with ID 10.

The route contains a dynamic ID because we need to know which user should be updated.

---

# 5️⃣ Delete a User

To delete a user:

```http
DELETE /api/users/:id
```

Example:

```text
DELETE /api/users/10
```

Meaning:

> Delete the user with ID 10.

---

# 🧩 Grouping Routes with `app.route()`

Instead of repeating the same route:

```javascript
app.get("/api/users/:id", ...);

app.patch("/api/users/:id", ...);

app.delete("/api/users/:id", ...);
```

we can group them using `app.route()`:

```javascript
app
  .route("/api/users/:id")
  .get((req, res) => {
    // Get user
  })
  .patch((req, res) => {
    // Update user
  })
  .delete((req, res) => {
    // Delete user
  });
```

This is cleaner and avoids repeating the same path.

---

# 🌐 Hybrid Server

A server can support both:

### Browser / HTML

```text
GET /users
      ↓
HTML Response
```

### API / JSON

```text
GET /api/users
      ↓
JSON Response
```

This creates a **hybrid server**.

```text
                  ┌── /users
                  │     ↓
Client ── Server ─┤    HTML
                  │
                  └── /api/users
                        ↓
                       JSON
```

This allows:

- Browsers to receive HTML
- React applications to receive JSON
- Mobile applications to receive JSON
- Other clients to consume the API

---

# 🖥️ HTML Route

A browser can request:

```http
GET /users
```

The server can generate an HTML page containing the users.

Conceptually:

```javascript
const html = `
  <ul>
    ${users
      .map((user) => `<li>${user.first_name}</li>`)
      .join("")}
  </ul>
`;

res.send(html);
```

The browser receives:

```html
<ul>
  <li>John</li>
  <li>Sarah</li>
  <li>David</li>
</ul>
```

This is **server-side rendering**.

---

# 📱 API Route

A mobile app or React application can request:

```http
GET /api/users
```

The server returns:

```json
[
  {
    "id": 1,
    "first_name": "John"
  },
  {
    "id": 2,
    "first_name": "Sarah"
  }
]
```

The client can then decide how to display the data.

---

# 🔥 REST API Flow

The overall API flow looks like:

```text
                    REST API
                       │
                       ↓
              ┌─────────────────┐
              │  Express Server  │
              └────────┬────────┘
                       │
              ┌────────┴────────┐
              ↓                 ↓
       GET /api/users     GET /api/users/:id
              │                 │
              ↓                 ↓
        All Users          Single User
              │                 │
              └────────┬────────┘
                       ↓
                     JSON
```

For mutations:

```text
POST   /api/users
   ↓
Create User

PATCH  /api/users/:id
   ↓
Update User

DELETE /api/users/:id
   ↓
Delete User
```

---

# 🧠 Important Concepts Learned

### RESTful API

An API designed around REST principles.

### HTTP Methods

```text
GET     → Read
POST    → Create
PUT     → Replace
PATCH   → Partial Update
DELETE  → Delete
```

### Dynamic Route Parameter

```javascript
/api/users/:id
```

Access it with:

```javascript
req.params.id
```

### JSON Response

```javascript
res.json(users);
```

### HTML Response

```javascript
res.send(html);
```

### Route Grouping

```javascript
app.route("/api/users/:id")
```

---

# 🧪 Testing

The `GET` endpoints can be tested directly in a browser:

```text
http://localhost:8000/api/users
```

and:

```text
http://localhost:8000/api/users/1
```

For `POST`, `PATCH`, and `DELETE`, a tool such as **Postman** can be used to send and test different HTTP requests.

---

# 📌 API Quick Reference

```text
GET     /api/users
        → Get all users

GET     /api/users/:id
        → Get one user

POST    /api/users
        → Create a new user

PATCH   /api/users/:id
        → Update a user

DELETE  /api/users/:id
        → Delete a user
```

---

# 🎯 Key Takeaways

1. A REST API should use HTTP methods according to their intended purpose.
2. `/api/users` represents the users resource.
3. `/api/users/:id` represents a specific user.
4. `:id` is a dynamic route parameter.
5. `req.params.id` is used to access the route parameter.
6. Route parameters are received as strings.
7. `res.json()` is useful for returning JSON data.
8. `res.send()` can be used to send HTML or other responses.
9. `app.route()` can group multiple HTTP methods for the same route.
10. A hybrid server can provide HTML to browsers and JSON to API clients.
11. A JSON API allows React, mobile apps, and other clients to consume the same data.
12. A local JSON file can be used as temporary data before connecting a real database.

---

## 🚀 Next Step

The next part of the project is to use **Postman** to test the `POST`, `PATCH`, and `DELETE` endpoints and learn how to send requests to the REST API.