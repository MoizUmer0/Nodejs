# HTTP Headers — Node.js

## 📌 Overview

HTTP Headers are an important part of **HTTP Requests and Responses**. They carry additional information (metadata) about the request or response.

A simple way to understand headers is:

> **HTTP Body = Actual Data**  
> **HTTP Headers = Information about that Data**

For example, headers can tell the server or client:

- What type of data is being sent
- How much data is being sent
- Which application/client is making the request
- What type of response the client accepts
- Authentication information
- Caching information
- Connection information

---

## 📦 Real-World Example

Think about sending a letter through a courier service.

The actual letter contains the **main message**, while information written on the package can include:

- Sender address
- Receiver address
- Package weight
- Package information

Similarly, in HTTP:

```text
Network Packet
│
├── Headers
│   ├── Additional Information
│   ├── Content-Type
│   ├── User-Agent
│   ├── Accept
│   └── Other Metadata
│
└── Body
    └── Actual Data
```

---

# 🌐 What are HTTP Headers?

HTTP Headers are **key-value pairs** that carry additional information about an HTTP request or response.

They are present in both:

- Request Headers
- Response Headers

### Request

```text
Client
   ↓
HTTP Request
   ├── Headers
   └── Body
   ↓
Server
```

### Response

```text
Server
   ↓
HTTP Response
   ├── Headers
   └── Body
   ↓
Client
```

---

# 📤 Request Headers

Request headers contain information sent from the **client to the server**.

Some common request headers are:

| Header | Purpose |
|---|---|
| `Host` | Specifies the server/host being requested |
| `User-Agent` | Identifies the client/application |
| `Accept` | Specifies what response formats the client can accept |
| `Content-Type` | Specifies the format of the request body |
| `Content-Length` | Specifies the size of the request body |
| `Authorization` | Contains authentication credentials/token |
| `Cookie` | Sends stored cookie information |

### Example

```http
GET /api/users HTTP/1.1
Host: localhost:8000
User-Agent: PostmanRuntime
Accept: */*
```

Here:

```text
Host        → localhost:8000
User-Agent  → PostmanRuntime
Accept      → */*
```

are request headers.

---

# 📥 Response Headers

Response headers contain information sent from the **server to the client**.

Some common response headers are:

| Header | Purpose |
|---|---|
| `Content-Type` | Specifies the response data format |
| `Content-Length` | Specifies response size |
| `Cache-Control` | Controls caching |
| `Set-Cookie` | Sends cookies to the client |
| `ETag` | Used for cache validation |
| `Date` | Specifies response date/time |
| `Connection` | Provides connection-related information |

Example:

```http
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 250
```

---

# 🔍 Viewing Headers in the Browser

You can inspect real HTTP headers using browser DevTools.

### Steps

1. Open Chrome
2. Open a website such as YouTube
3. Press `F12`
4. Open the **Network** tab
5. Refresh the page
6. Select a request
7. Open the **Headers** section

You will see:

```text
Request Headers
Response Headers
```

This is a great way to understand how headers work in real applications.

---

# 🧪 Headers in Postman

When testing an API with Postman, you can inspect both request and response headers.

Example:

```text
Request
GET http://localhost:8000/api/users

        ↓

Request Headers

        ↓

Express Server

        ↓

Response Headers
        +
Response Body
```

---

# 🚀 Common Headers in Postman

### User-Agent

```http
User-Agent: PostmanRuntime
```

This tells the server which client/application is making the request.

### Accept

```http
Accept: */*
```

`*/*` means:

> The client can accept any media type.

For example:

```http
Accept: application/json
```

means the client prefers JSON data.

---

# 📄 Content-Type

`Content-Type` is one of the most important headers.

It tells the server **what type of data is being sent**.

For JSON:

```http
Content-Type: application/json
```

For URL-encoded form data:

```http
Content-Type: application/x-www-form-urlencoded
```

For HTML:

```http
Content-Type: text/html
```

For plain text:

```http
Content-Type: text/plain
```

---

# 🧩 Content-Type and Express Middleware

Express uses the `Content-Type` header to understand how it should process the request body.

For JSON requests:

```js
app.use(express.json())
```

For URL-encoded form data:

```js
app.use(express.urlencoded({ extended: false }))
```

For example:

```http
Content-Type: application/json
```

with:

```json
{
  "name": "Moiz",
  "age": 20
}
```

can be processed by:

```js
app.use(express.json())
```

The parsed data becomes available through:

```js
req.body
```

---

# 🛠️ Setting Custom Response Headers

Express allows us to create custom response headers.

Example:

```js
app.get("/api/users", (req, res) => {
    res.set("X-My-Name", "Piyush Garg")

    return res.json(users)
})
```

The response will contain:

```http
X-My-Name: Piyush Garg
```

---

# 🏷️ Custom Headers

Sometimes an application needs to send its own custom information.

Example:

```http
X-My-Name: Piyush Garg
```

Historically, custom HTTP headers were commonly prefixed with:

```text
X-
```

For example:

```http
X-User-ID: 123
X-App-Version: 1.0
X-Custom-Header: Hello
```

### Important Note

The `X-` convention is historical. Modern applications generally don't need to use `X-` for custom headers unless there is a specific reason.

For example:

```http
My-Name: Piyush
```

can be used as a custom header as well, provided the name doesn't conflict with a standardized header.

---

# 🔐 Headers and Authentication

Headers are also commonly used for authentication.

For example:

```http
Authorization: Bearer <token>
```

The server can read the token and determine which user is making the request.

Example:

```js
const token = req.headers.authorization
```

Authentication and authorization will make extensive use of headers.

---

# 📊 Important HTTP Headers

| Header | Used For |
|---|---|
| `Host` | Target server |
| `User-Agent` | Client information |
| `Accept` | Accepted response format |
| `Content-Type` | Data format |
| `Content-Length` | Data size |
| `Authorization` | Authentication |
| `Cookie` | Cookie information |
| `Cache-Control` | Caching behavior |
| `Set-Cookie` | Setting cookies |
| `ETag` | Cache validation |

---

# 🧠 Key Takeaways

### 1. What are HTTP Headers?

Headers are **additional information/metadata** associated with HTTP requests and responses.

### 2. Where are they used?

They are used in:

```text
HTTP Request
HTTP Response
```

### 3. Request Headers

Information sent from:

```text
Client → Server
```

### 4. Response Headers

Information sent from:

```text
Server → Client
```

### 5. Content-Type

Tells the server/client what type of data is being transferred.

Example:

```http
Content-Type: application/json
```

### 6. Custom Headers

Applications can create their own headers when needed.

Example:

```http
X-My-Name: Piyush Garg
```

### 7. Headers and Middleware

Express middleware can inspect headers such as `Content-Type` and process the request body accordingly.

---

# 🔄 HTTP Request/Response Flow

```text
Client
   │
   │ HTTP Request
   │
   ├── Request Headers
   └── Request Body
   │
   ▼
Express Server
   │
   │ Process Request
   │
   ▼
Server Response
   │
   ├── Response Headers
   └── Response Body
   │
   ▼
Client
```

---

# 🎯 Topics Covered

- [x] What are HTTP Headers?
- [x] Request Headers
- [x] Response Headers
- [x] Real-world example of Headers
- [x] Reading Headers
- [x] Setting Custom Headers
- [x] Built-in HTTP Headers
- [x] Custom Headers
- [x] `Content-Type`
- [x] `User-Agent`
- [x] `Accept`
- [x] `Content-Length`
- [x] Headers in Postman
- [x] Headers in Browser DevTools
- [x] Headers and Express Middleware
- [x] Basic idea of Headers in Authentication

---

## 📚 Learning Source

**Node.js / Express.js — Piyush Garg**

This README contains my notes and understanding of **HTTP Headers** while learning Node.js and Express.js.