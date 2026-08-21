# Postman API Testing

## 📌 Overview

In this part of the Node.js project, **Postman** is used to test and interact with the REST API.

Since a browser is mainly convenient for sending `GET` requests, Postman makes it easy to test different HTTP methods such as:

```text
GET
POST
PATCH
DELETE
```

## 🚀 Why Postman?

Postman is an API development and testing tool that helps us:

- Send API requests
- Test different HTTP methods
- Send data through the request body
- View API responses
- Check HTTP status codes
- Check response time
- Check response size
- Debug APIs during development

## 🔄 Basic Request Flow

```text
Postman
   ↓
HTTP Request
   ↓
Express Server
   ↓
Route
   ↓
Server Logic
   ↓
HTTP Response
   ↓
Postman
```

## 🟢 GET Request

A `GET` request is used to retrieve data.

Example:

```http
GET http://localhost:8000/users
```

Or:

```http
GET http://localhost:8000/api/users
```

After clicking **Send**, Postman displays the server response.

### Response Information

Postman shows useful information such as:

```text
Status: 200 OK
Time: 6 ms
Size: 14 KB
```

### Common Status Code

```text
200 OK
```

means the request was successfully processed.

---

## 🟡 POST Request

A `POST` request is used to send data to the server and create a new resource.

Example:

```http
POST http://localhost:8000/api/users
```

### Sending Data

In Postman:

```text
Body
  ↓
x-www-form-urlencoded
```

Example fields:

| Key | Value |
|---|---|
| first_name | John |
| last_name | Doe |
| email | john@example.com |
| gender | Male |
| job_title | Software Developer |

The submitted data is received in Express through:

```js
req.body
```

---

## 🧩 Express Middleware and `req.body`

Initially, `req.body` may be:

```js
undefined
```

because Express does not automatically understand every type of incoming request body.

For URL-encoded form data, middleware can be added:

```js
app.use(express.urlencoded({ extended: false }));
```

Now the submitted data becomes available through:

```js
req.body
```

### Request Flow

```text
Postman
   ↓
x-www-form-urlencoded data
   ↓
Express Middleware
   ↓
req.body
   ↓
Route Handler
```

---

## 📝 Sending JSON with Postman

Postman can also send JSON data.

Select:

```text
Body
  ↓
raw
  ↓
JSON
```

Example:

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "gender": "Male",
  "job_title": "Software Developer"
}
```

For JSON requests, Express commonly uses:

```js
app.use(express.json());
```

This allows JSON request data to be accessed through:

```js
req.body
```

---

## 🔵 PATCH Request

A `PATCH` request is used to update an existing resource.

Example:

```http
PATCH http://localhost:8000/api/users/1001
```

The user ID is provided in the URL.

```text
/api/users/:id
```

In Express:

```js
req.params.id
```

can be used to access the ID.

Example:

```js
const { id } = req.params;
```

---

## 🔴 DELETE Request

A `DELETE` request is used to remove a resource.

Example:

```http
DELETE http://localhost:8000/api/users/1001
```

The ID can again be accessed using:

```js
req.params.id
```

---

## 📊 Postman Response Details

Postman provides several useful pieces of information after sending a request.

### Status

Example:

```text
200 OK
```

### Response Time

Example:

```text
6 ms
```

Response time tells us approximately how long the request took to complete.

In real-world applications, reducing unnecessary response time is important because users have to wait for the server response.

### Response Size

Example:

```text
135.9 KB
```

This tells us how much data was returned by the server.

---

## 🧪 Postman Request Types

```text
┌─────────────────────────┐
│        Postman          │
├─────────────────────────┤
│ GET                     │
│ POST                    │
│ PATCH                   │
│ DELETE                  │
├─────────────────────────┤
│ Params                  │
│ Headers                 │
│ Body                    │
│ Response                │
└─────────────────────────┘
```

---

## 🛠️ Local API Testing

The Express server is running locally:

```text
http://localhost:8000
```

Postman can send requests directly to this local server.

Example:

```text
Postman
   ↓
http://localhost:8000/api/users
   ↓
Local Express Server
```

For local development, use:

```text
http://
```

rather than:

```text
https://
```

unless HTTPS has specifically been configured for the local server.

---

## 🎯 Key Concepts

### GET

Retrieve data.

```text
GET → Read
```

### POST

Create new data.

```text
POST → Create
```

### PATCH

Modify existing data.

```text
PATCH → Update
```

### DELETE

Remove data.

```text
DELETE → Delete
```

---

## 📚 What I Learned

- What Postman is
- Why Postman is useful for API testing
- How to send `GET` requests
- How to send `POST` requests
- How to send `PATCH` requests
- How to send `DELETE` requests
- How to send form data
- How to send JSON data
- How `req.body` works
- Why Express middleware is required for request bodies
- How to check response status codes
- How to check response time
- How to check response size
- How Postman communicates with a local Express server

## 📝 Practice Assignment

After implementing the `POST` request, the next practice tasks are:

- [ ] Implement `PATCH` to edit a user
- [ ] Implement `DELETE` to remove a user
- [ ] Test both requests using Postman
- [ ] Check the returned status codes
- [ ] Verify the updated data in `MOCK_DATA.json`

---

## 🔗 API Testing Summary

```text
             POSTMAN
                │
       ┌────────┼────────┐
       ↓        ↓        ↓
      GET      POST    PATCH
       │        │        │
       ↓        ↓        ↓
     READ     CREATE   UPDATE
       │        │        │
       └────────┼────────┘
                ↓
             DELETE
                ↓
              DELETE
```

> **Postman makes it possible to test APIs without needing a frontend or browser-based form.**