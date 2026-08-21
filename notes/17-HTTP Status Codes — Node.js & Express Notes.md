# HTTP Status Codes — Node.js & Express

## 📌 Overview

HTTP Status Codes are standard **three-digit codes** returned by a server to indicate the result of an HTTP request.

For example:

```text
200 → OK
201 → Created
400 → Bad Request
404 → Not Found
500 → Internal Server Error
```

Status codes help the client understand whether a request was successful, redirected, or failed.

---

# 🔢 HTTP Status Code Categories

HTTP status codes are divided into **5 major categories**:

| Range | Category | Meaning |
|---|---|---|
| `100–199` | Informational | Request is being processed / informational response |
| `200–299` | Success | Request was successfully processed |
| `300–399` | Redirection | Further action or another location is required |
| `400–499` | Client Error | Problem with the client's request |
| `500–599` | Server Error | Problem on the server side |

### Easy Way to Remember

```text
1xx → Information
2xx → Success
3xx → Redirection
4xx → Client Error
5xx → Server Error
```

---

# ✅ 2xx — Successful Responses

A `2xx` status code means the request was successfully processed.

## 200 OK

`200 OK` means:

> The request was successfully completed.

Example:

```http
GET /api/users
→ 200 OK
```

In Express, `200` is commonly the default status for a successful response.

```js
app.get("/api/users", (req, res) => {
    res.json(users)
})
```

You can also explicitly set it:

```js
res.status(200).json(users)
```

---

## 201 Created

`201 Created` means:

> The request was successful and a new resource was created.

This is commonly used with `POST` requests.

Example:

```http
POST /api/users
→ 201 Created
```

Express:

```js
app.post("/api/users", (req, res) => {
    // Create user

    res.status(201).json({
        message: "User created successfully"
    })
})
```

### 200 vs 201

```text
200 → Request successful
201 → Request successful + new resource created
```

For a `POST` request that creates a resource, `201` is generally the better status code.

---

## 202 Accepted

`202 Accepted` means:

> The request has been accepted for processing, but processing may not have completed yet.

Example:

```http
202 Accepted
```

This can be useful for tasks that are processed asynchronously.

---

## 204 No Content

`204 No Content` means:

> The request was successful, but there is no response body to return.

Example:

```http
204 No Content
```

This is commonly used when deleting a resource successfully.

---

# 🔀 3xx — Redirection Responses

`3xx` status codes indicate **redirection** or that additional action may be required to complete the request.

Examples:

```text
301 → Moved Permanently
302 → Found
304 → Not Modified
307 → Temporary Redirect
308 → Permanent Redirect
```

Redirection is commonly used when a resource is available at another URL.

For example:

```text
Short URL
    ↓
Redirect
    ↓
Original URL
```

URL shorteners are a common real-world example where redirects are important.

---

# ❌ 4xx — Client Error Responses

`4xx` status codes indicate that there is a problem with the request sent by the client.

```text
4xx → Client-side/request problem
```

---

## 400 Bad Request

`400 Bad Request` means:

> The server cannot process the request because the request is invalid.

For example, suppose creating a user requires:

```json
{
    "firstName": "Moiz",
    "lastName": "Umer",
    "email": "moiz@example.com",
    "gender": "Male",
    "jobTitle": "Developer"
}
```

If required information is missing, the server can return:

```http
400 Bad Request
```

Express example:

```js
if (!firstName || !lastName || !email || !gender || !jobTitle) {
    return res.status(400).json({
        message: "All fields are required"
    })
}
```

### Important

```text
400 → Request itself is invalid
```

---

# 🔐 401 Unauthorized

`401 Unauthorized` generally means:

> The request requires valid authentication credentials.

For example:

```http
Authorization: Bearer <token>
```

If the user is not properly authenticated:

```http
401 Unauthorized
```

Example:

```js
return res.status(401).json({
    message: "Authentication required"
})
```

### Remember

```text
401 → Authentication problem
```

---

# 💳 402 Payment Required

`402 Payment Required` was originally defined for payment-related situations.

It is not commonly used as a general-purpose status code and has historically had limited standardization.

Example use case:

```text
User's subscription has expired
        ↓
Payment required
        ↓
402 Payment Required
```

---

# 🚫 403 Forbidden

`403 Forbidden` means:

> The server understood the request, but the client does not have permission to perform the requested action.

For example:

```text
User is logged in
        ↓
But doesn't have admin permission
        ↓
403 Forbidden
```

Example:

```js
return res.status(403).json({
    message: "You do not have permission to perform this action"
})
```

### 401 vs 403

This distinction is important:

```text
401 → You are not properly authenticated
403 → You are authenticated, but don't have permission
```

---

# 🔎 404 Not Found

`404 Not Found` means:

> The requested resource could not be found.

This is one of the most commonly seen HTTP status codes.

Example:

```http
GET /api/users/99999
```

If user `99999` does not exist:

```http
404 Not Found
```

Express example:

```js
const user = users.find(
    user => user.id === Number(req.params.id)
)

if (!user) {
    return res.status(404).json({
        message: "User not found"
    })
}

return res.status(200).json(user)
```

### 404 can also happen when a route doesn't exist

```http
GET /api/unknown
```

If the route doesn't exist, Express can return:

```text
404 Not Found
```

---

# 🚫 405 Method Not Allowed

`405 Method Not Allowed` means:

> The HTTP method used is not supported for the requested resource.

For example, a route might support:

```text
GET /api/users
```

but not:

```text
DELETE /api/users
```

In that situation, `405` may be appropriate.

---

# ❌ 406 Not Acceptable

`406 Not Acceptable` indicates that the server cannot provide a response matching the client's acceptable representations.

This is related to request headers such as:

```http
Accept: application/json
```

---

# 💥 5xx — Server Error Responses

`5xx` status codes indicate that something went wrong on the **server side**.

```text
5xx → Server-side problem
```

---

# 💥 500 Internal Server Error

`500 Internal Server Error` means:

> Something unexpected went wrong on the server.

Example:

```js
const user = users.find(
    user => user.id === Number(req.params.id)
)

// If user is undefined, this can cause an error
console.log(user.name)
```

If an unexpected server error occurs:

```http
500 Internal Server Error
```

Example response:

```js
return res.status(500).json({
    message: "Internal Server Error"
})
```

### Remember

```text
400 → Client/request problem
500 → Server problem
```

---

# 🚧 501 Not Implemented

`501 Not Implemented` means:

> The server does not support the functionality required to fulfill the request.

For example, a server may not implement a particular HTTP method or functionality.

---

# 🔧 503 Service Unavailable

`503 Service Unavailable` means:

> The server is currently unable to handle the request.

Possible reasons include:

- Server overload
- Maintenance
- Temporary service failure
- Dependency/service unavailable

Example:

```http
503 Service Unavailable
```

---

# 📊 Important Status Codes to Remember

| Status | Name | Meaning |
|---:|---|---|
| `200` | OK | Request successful |
| `201` | Created | New resource created |
| `202` | Accepted | Request accepted for processing |
| `204` | No Content | Successful request with no body |
| `301` | Moved Permanently | Resource permanently moved |
| `302` | Found | Temporary redirection |
| `304` | Not Modified | Cached version can be used |
| `400` | Bad Request | Invalid request |
| `401` | Unauthorized | Authentication required/failed |
| `402` | Payment Required | Payment-related requirement |
| `403` | Forbidden | No permission |
| `404` | Not Found | Resource doesn't exist |
| `405` | Method Not Allowed | HTTP method not supported |
| `500` | Internal Server Error | Server-side error |
| `501` | Not Implemented | Functionality not implemented |
| `503` | Service Unavailable | Server temporarily unavailable |

---

# 🛠️ Setting Status Codes in Express

Express provides:

```js
res.status()
```

Example:

```js
res.status(201).json({
    message: "User created"
})
```

Another example:

```js
res.status(404).json({
    message: "User not found"
})
```

You can also chain methods:

```js
res.status(200).json(users)
```

---

# 🧪 Example: Creating a User

```js
app.post("/api/users", (req, res) => {

    const {
        firstName,
        lastName,
        email,
        gender,
        jobTitle
    } = req.body

    if (!firstName || !lastName || !email || !gender || !jobTitle) {
        return res.status(400).json({
            message: "All fields are required"
        })
    }

    // Create user...

    return res.status(201).json({
        message: "User created successfully"
    })
})
```

Here:

```text
Missing required data
        ↓
400 Bad Request

Everything valid
        ↓
201 Created
```

---

# 🔎 Example: Finding a User

```js
app.get("/api/users/:id", (req, res) => {

    const user = users.find(
        user => user.id === Number(req.params.id)
    )

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        })
    }

    return res.status(200).json(user)
})
```

Flow:

```text
Request
   ↓
Find User
   ↓
┌─────────────────┐
│ User exists?    │
└────────┬────────┘
         │
    ┌────┴────┐
    ↓         ↓
   YES        NO
    ↓          ↓
  200        404
    ↓          ↓
 User       Not Found
```

---

# 🔄 Nodemon

During development, repeatedly restarting the Node.js server after every code change can be annoying.

**Nodemon** automatically restarts the server when files change.

Install it as a development dependency:

```bash
npm install --save-dev nodemon
```

Then configure your `package.json`:

```json
{
    "scripts": {
        "start": "nodemon index.js"
    }
}
```

Now run:

```bash
npm start
```

When you save changes, Nodemon automatically restarts the server.

---

# 🧠 Quick Memory Trick

```text
1xx → Information
2xx → Success
3xx → Redirect
4xx → Client Error
5xx → Server Error
```

The most important codes for everyday API development are:

```text
200 → OK
201 → Created
204 → No Content

400 → Bad Request
401 → Unauthorized
403 → Forbidden
404 → Not Found

500 → Internal Server Error
503 → Service Unavailable
```

---

# 🎯 Topics Covered

- [x] What are HTTP Status Codes?
- [x] Why Status Codes are important
- [x] HTTP Status Code categories
- [x] `1xx` Informational Responses
- [x] `2xx` Successful Responses
- [x] `200 OK`
- [x] `201 Created`
- [x] `202 Accepted`
- [x] `204 No Content`
- [x] `3xx` Redirection Responses
- [x] `4xx` Client Error Responses
- [x] `400 Bad Request`
- [x] `401 Unauthorized`
- [x] `402 Payment Required`
- [x] `403 Forbidden`
- [x] `404 Not Found`
- [x] `405 Method Not Allowed`
- [x] `5xx` Server Error Responses
- [x] `500 Internal Server Error`
- [x] `501 Not Implemented`
- [x] `503 Service Unavailable`
- [x] Setting status codes using `res.status()`
- [x] Using status codes in Express APIs
- [x] Nodemon for automatic server restart

---

## 📚 Learning Source

**Node.js / Express.js — Piyush Garg**

These are my notes and understanding of **HTTP Status Codes** while learning Node.js and Express.js.