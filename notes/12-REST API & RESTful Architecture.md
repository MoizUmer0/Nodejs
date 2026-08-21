# REST API & RESTful Architecture

This project contains notes about **REST APIs**, **RESTful architecture**, HTTP methods, server-client communication, and Server-Side vs Client-Side Rendering while learning Node.js and Express.js.

---

## 🌐 What is REST?

**REST** stands for **Representational State Transfer**.

REST is an architectural style that provides a set of principles and best practices for designing APIs.

A **RESTful API** follows these principles to create predictable and consistent communication between a client and a server.

---

# 🖥️ Client-Server Architecture

REST APIs follow a **Client-Server Architecture**.

```text
┌──────────────┐          Request          ┌──────────────┐
│    Client    │ ────────────────────────> │    Server    │
│              │                           │              │
│ Browser      │                           │ API          │
│ Mobile App   │ <──────────────────────── │ Database     │
│ React App    │          Response         │              │
└──────────────┘                           └──────────────┘
```

### Client

The client can be:

- Web Browser
- Mobile Application
- React Application
- Smart Device
- Any application that can send HTTP requests

### Server

The server:

- Receives requests
- Processes the request
- Communicates with the database
- Sends a response to the client

---

# 🔄 Request-Response Cycle

The basic communication looks like:

```text
Client
   ↓
HTTP Request
   ↓
Server
   ↓
Database
   ↓
Server
   ↓
HTTP Response
   ↓
Client
```

The client and server should remain **independent** of each other.

---

# 1️⃣ Server-Client Separation

One important REST principle is **separation between the client and server**.

The client and server should be independent.

For example:

```text
Client                         Server

React App  ───── Request ────> Express API
React App  <──── Response ──── Express API
```

The server should focus on:

- Business logic
- Database operations
- Authentication
- Sending data

The client should focus on:

- User interface
- Displaying data
- User interactions

---

# 📦 Response Formats

A server can return different types of responses:

- HTML
- JSON
- Text
- Images
- Files

For example:

```text
HTML Response
JSON Response
Image Response
File Response
```

The appropriate response depends on the type of client and application.

---

# ❌ Server-Side Rendering Example

Suppose the client requests:

```http
GET /blogs
```

The server gets blogs from the database and creates an HTML document:

```text
Client
   ↓
GET /blogs
   ↓
Server
   ↓
Database
   ↓
Get Blogs
   ↓
Generate HTML
   ↓
Send HTML
   ↓
Client
```

This is **Server-Side Rendering (SSR)**.

The server generates the HTML before sending it to the client.

---

# ⚠️ Problem with Server-Generated HTML

HTML works very well when the client is a browser.

But imagine the client is:

- Mobile application
- Alexa
- Smart device
- React application

These clients may not want an HTML document.

For example:

```text
Server
   ↓
HTML
   ↓
Mobile App
```

The mobile application would have to process the HTML instead of receiving raw data.

This creates unnecessary dependency between the server and client.

---

# ✅ Sending JSON Data

Instead of generating HTML on the server, the server can return raw data in JSON format.

```text
Client
   ↓
GET /blogs
   ↓
Server
   ↓
Database
   ↓
Get Blogs
   ↓
JSON
   ↓
Client
```

Example:

```json
{
  "blogs": [
    {
      "id": 1,
      "title": "Node.js"
    },
    {
      "id": 2,
      "title": "REST API"
    }
  ]
}
```

Now the client decides how to display the data.

---

# 🎯 Client Independence

Once the server sends JSON, different clients can use the same API.

```text
                 ┌── React App
                 │
                 ├── Mobile App
REST API ────────┤
                 ├── Web App
                 │
                 └── Smart Device
```

The server only provides the data.

Each client decides how that data should be displayed.

This is one of the important ideas behind RESTful APIs.

---

# 🌍 When Should We Send HTML?

If we already know that the client will always be a browser, sending HTML can be a good approach.

For example:

```text
Browser
   ↓
Server
   ↓
HTML
   ↓
Browser renders the page
```

This can reduce the amount of processing required on the client.

However, when an API needs to support multiple types of clients, returning structured data such as JSON is usually more flexible.

---

# 2️⃣ Respect HTTP Methods

RESTful APIs should use HTTP methods according to their intended purpose.

Common HTTP methods are:

| Method | Purpose |
|---|---|
| `GET` | Retrieve data |
| `POST` | Create data |
| `PUT` | Replace/update data |
| `PATCH` | Partially update data |
| `DELETE` | Delete data |

---

## GET

`GET` is used to retrieve data.

Example:

```http
GET /users
```

Meaning:

> Get users.

The server should return the requested user data.

---

## POST

`POST` is generally used to create new data.

Example:

```http
POST /users
```

Meaning:

> Create a new user.

Example request body:

```json
{
  "name": "Moiz",
  "email": "moiz@example.com"
}
```

---

## PATCH

`PATCH` is generally used for partial updates.

Example:

```http
PATCH /users/10
```

Meaning:

> Update information for user `10`.

For example:

```json
{
  "name": "New Name"
}
```

---

## PUT

`PUT` is generally used to replace a resource with a new representation.

Example:

```http
PUT /users/10
```

---

## DELETE

`DELETE` is used to remove data.

Example:

```http
DELETE /users/10
```

Meaning:

> Delete user `10`.

---

# ❌ Avoid Using POST for Everything

A common but less RESTful approach is:

```http
GET  /getUsers
POST /createUser
POST /updateUser
POST /deleteUser
```

This hides the operation inside the URL.

Instead, use HTTP methods to describe the operation:

```http
GET    /users
POST   /users
PATCH  /users/10
DELETE /users/10
```

Now the HTTP method itself communicates the intended operation.

---

# ✅ RESTful Example

A RESTful user API could look like:

```text
GET     /users
        ↓
        Get all users

GET     /users/10
        ↓
        Get user 10

POST    /users
        ↓
        Create a user

PATCH   /users/10
        ↓
        Update user 10

DELETE  /users/10
        ↓
        Delete user 10
```

This makes the API easier to understand and maintain.

---

# ⚛️ REST API with React

When using a frontend framework such as React, the server can return JSON.

```text
React
  ↓
GET /users
  ↓
Express API
  ↓
Database
  ↓
JSON Response
  ↓
React
  ↓
Render UI
```

The React application decides how the data should appear on the screen.

The same API could also be used by:

```text
React
Mobile App
Flutter App
Vue
Angular
Other Clients
```

---

# 🟢 Express.js JSON Response

In Express.js, JSON can be returned using:

```javascript
res.json({
  name: "Moiz",
  age: 20
});
```

Express automatically sends the object as a JSON response.

---

# 🖥️ HTML Response in Express

HTML can be sent using:

```javascript
res.send("<h1>Hello World</h1>");
```

Or HTML can be rendered using:

```javascript
res.render("index");
```

---

# ⚡ Server-Side Rendering vs Client-Side Rendering

## Server-Side Rendering (SSR)

In SSR, the server generates the HTML.

```text
Client
   ↓
Request
   ↓
Server
   ↓
Database
   ↓
Generate HTML
   ↓
HTML Response
   ↓
Client
```

The client receives an already-generated page.

### Advantages

- Initial page can be displayed quickly
- Less rendering work for the client
- Useful for traditional websites
- Can be beneficial for SEO

---

## Client-Side Rendering (CSR)

In CSR, the client receives data and generates the UI.

```text
Client
   ↓
Request
   ↓
Server
   ↓
Database
   ↓
JSON Response
   ↓
Client
   ↓
Render UI
```

React commonly uses this approach.

### Example

```text
API
 ↓
JSON
 ↓
React
 ↓
Components
 ↓
UI
```

---

# 🔥 SSR vs CSR

| Feature | SSR | CSR |
|---|---|---|
| HTML generated by | Server | Client |
| Server sends | HTML | Data/JSON |
| Client processing | Less | More |
| Common with | Traditional websites | React/SPA |
| API flexibility | Lower | Higher |

Neither approach is universally better. The appropriate choice depends on the application's requirements.

---

# 🧠 RESTful API Mental Model

Remember these two important ideas:

```text
1. Separate Client and Server

2. Respect HTTP Methods
```

### Client-Server

```text
Client
   ↓ Request
Server
   ↓
Database
   ↓
Server
   ↓ Response
Client
```

### HTTP Methods

```text
GET     → Read
POST    → Create
PUT     → Replace
PATCH   → Update partially
DELETE  → Delete
```

---

# 🎯 Key Takeaways

1. **REST** stands for **Representational State Transfer**.
2. REST is an architectural style for designing networked applications and APIs.
3. RESTful APIs commonly follow a **client-server architecture**.
4. Client and server should remain independent.
5. APIs can return different representations such as HTML or JSON.
6. JSON is commonly used when APIs need to serve different types of clients.
7. HTTP methods should be used according to their intended semantics.
8. `GET` is used to retrieve resources.
9. `POST` is generally used to create resources.
10. `PUT` is generally used to replace a resource.
11. `PATCH` is generally used for partial updates.
12. `DELETE` is used to remove resources.
13. Avoid using `POST` for every operation when standard HTTP methods communicate the intended action more clearly.
14. **SSR** generates HTML on the server.
15. **CSR** generates the UI on the client.
16. RESTful practices make APIs more predictable, consistent, and easier to maintain.

---

## 🚀 Next Step

The next step is to start building a server using **Node.js and Express.js** and apply these RESTful principles in actual projects.