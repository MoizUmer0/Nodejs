# 🔐 Authentication Architecture — JWT, Cookies & Authorization Header

> Revision notes based on the authentication architecture video.

---

## 1. Stateful vs Stateless Authentication

### Stateful Authentication

In **stateful authentication**, the server keeps track of the user's session.

Typical flow:

```text
Client
   ↓
Username + Password
   ↓
Server
   ↓
Database
   ↓
Create Session
   ↓
Store Session ID + User Information
   ↓
Client receives Session ID
```

The server stores something like:

```text
Session ID → User
```

### Problem with storing sessions in server memory

If sessions are stored in the server's memory:

```text
Server Memory
    ↓
Session ID → User
```

there are problems:

- Server restart can remove sessions.
- Memory is limited.
- Scaling to multiple servers becomes difficult.
- Session data must be shared between servers.

---

## 2. Sessions Stored in Database

One solution is to store sessions in a database:

```text
Session ID → User ID
```

When the user sends a request:

```text
Client
   ↓
Request + Session ID
   ↓
Server
   ↓
Database Query
   ↓
Find User
   ↓
Authenticate
```

### Problems

Every authenticated request may require a database lookup.

For example:

```text
Request 1 → DB Read
Request 2 → DB Read
Request 3 → DB Read
Request 4 → DB Read
...
```

This can cause:

- More database reads
- Higher latency
- Higher database costs
- Increased load on the database

Therefore, using a database lookup **on every request only for authentication** may not be ideal for many applications.

---

# 3. Stateless Authentication

JWT-based authentication is commonly used as a **stateless authentication** approach.

Instead of storing the session on the server, information is placed inside a signed token.

Flow:

```text
Client
   ↓
Username + Password
   ↓
Server
   ↓
Database
   ↓
Credentials Valid?
   ↓
Generate JWT
   ↓
Send JWT to Client
```

The JWT can contain information such as:

```json
{
  "_id": "123",
  "email": "user@example.com",
  "name": "John"
}
```

The token is **signed**, so the server can later verify whether it was modified.

---

# 4. JWT Authentication Flow

### Login

```text
Client
   ↓
POST /login
   ↓
email + password
   ↓
Server checks Database
   ↓
Credentials correct
   ↓
Generate JWT
   ↓
Send JWT to Client
```

After login, the client has a token:

```text
JWT = eyJhbGciOiJIUzI1NiIs...
```

For future requests:

```text
Client
   ↓
JWT
   ↓
Server
   ↓
Verify JWT
   ↓
Authenticated User
```

The server can extract user information from the verified JWT.

---

# 5. How Do We Send JWT to the Client?

There are two common approaches discussed in the video:

1. **Cookies**
2. **Response + Authorization Header**

---

# 6. Authentication Using Cookies

The server can send the JWT using a cookie.

Example:

```js
res.cookie("uid", token);
```

The cookie contains:

```text
Name: uid
Value: JWT_TOKEN
```

The browser stores the cookie.

---

## 7. Browser Automatically Sends Cookies

One major benefit of cookies is that browsers automatically attach applicable cookies to requests.

Example:

```text
Client
   ↓
GET /users
   ↓
Cookie: uid=JWT_TOKEN
   ↓
Server
```

The server can read:

```js
req.cookies.uid
```

Then verify the JWT:

```js
jwt.verify(token, secret);
```

---

# 8. Cookie Authentication Flow

```text
LOGIN

Client
   ↓
Email + Password
   ↓
Server
   ↓
Database
   ↓
Generate JWT
   ↓
Set Cookie
   ↓
Browser stores Cookie
```

Later:

```text
GET /profile

Browser
   ↓
Automatically sends Cookie
   ↓
Server
   ↓
Read Cookie
   ↓
Verify JWT
   ↓
Identify User
```

---

# 9. Cookie Domain

Cookies are associated with domains.

For example:

```text
facebook.com
```

can have cookies belonging to:

```text
facebook.com
```

Those cookies are not automatically sent to:

```text
example.com
```

This is important for security.

Otherwise, if cookies were sent everywhere:

```text
Facebook Cookie
      ↓
example.com
```

another website could potentially receive sensitive authentication information.

---

# 10. Cookie Domain Option

When creating a cookie, a domain can be specified.

Example:

```js
res.cookie("uid", token, {
    domain: "example.com"
});
```

The browser will only send the cookie according to the cookie's domain rules.

### Subdomain Example

Suppose the cookie belongs to:

```text
.example.com
```

It can be used across applicable subdomains such as:

```text
mail.example.com
youtube.example.com
app.example.com
```

This is useful when multiple services/subdomains need to share authentication.

---

# 11. Cookie Expiration

Cookies can have an expiration time.

Example:

```js
res.cookie("uid", token, {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
});
```

After the expiration time, the cookie is removed/invalid.

This can result in the user needing to log in again.

---

# 12. Important Cookie Options

Some important cookie options include:

```text
domain
expires
maxAge
httpOnly
secure
sameSite
path
```

### `domain`

Controls which domain can receive the cookie.

### `expires`

Specifies when the cookie expires.

### `maxAge`

Specifies how long the cookie should remain valid.

### `httpOnly`

Prevents JavaScript from directly accessing the cookie.

```js
httpOnly: true
```

This is an important security option for authentication cookies.

### `secure`

Cookie should only be sent over HTTPS.

```js
secure: true
```

### `sameSite`

Controls when cookies can be sent in cross-site requests.

---

# 13. Cookie Authentication — Advantages

### ✅ Advantages

- Browser automatically sends cookies.
- Convenient for browser-based applications.
- Server does not need to manually extract a token from every custom header.
- Cookies can have security-related attributes.
- Can work across subdomains when configured appropriately.

### ❌ Limitations

Cookies are primarily a browser mechanism.

For mobile applications or other clients, using an Authorization header is often more convenient.

---

# 14. Sending JWT Directly in the Response

Another approach is to return the token as JSON.

Example:

```js
res.json({
    token
});
```

Response:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

Now the responsibility of storing the token belongs to the client.

---

# 15. Where Can the Client Store the Token?

For a browser application, one possible storage mechanism is:

```text
localStorage
```

Example:

```js
localStorage.setItem("token", token);
```

For a mobile application, the token can be stored using the platform's secure storage mechanism.

The important point is:

> The client must store the token and send it with future authenticated requests.

---

# 16. Authorization Header

Instead of using cookies, the client can send the JWT inside the HTTP `Authorization` header.

Example:

```http
Authorization: Bearer <JWT_TOKEN>
```

This is the standard pattern for Bearer token authentication.

---

# 17. What Does `Bearer` Mean?

The header has two parts:

```text
Authorization: Bearer TOKEN
```

### `Bearer`

This is the authentication scheme.

### `TOKEN`

This is the actual authentication credential.

Conceptually:

```text
Authorization
      ↓
Bearer
      ↓
JWT Token
```

---

# 18. Authorization Header Flow

```text
LOGIN

Client
   ↓
Email + Password
   ↓
Server
   ↓
Database
   ↓
Generate JWT
   ↓
JSON Response
   ↓
Client stores JWT
```

Later:

```text
Client
   ↓
GET /profile
   ↓
Authorization: Bearer JWT
   ↓
Server
   ↓
Extract JWT
   ↓
Verify JWT
   ↓
Authenticated
```

---

# 19. Reading Authorization Header in Node.js

Express provides request headers through:

```js
req.headers
```

The Authorization header can be accessed using:

```js
req.headers.authorization
```

Example:

```js
const authHeader = req.headers.authorization;
```

The value may look like:

```text
Bearer eyJhbGciOiJIUzI1NiIs...
```

---

# 20. Extracting the Token

You can split the header:

```js
const authHeader = req.headers.authorization;

const token = authHeader.split(" ")[1];
```

Why?

Because:

```text
Bearer eyJhbGciOiJIUzI1NiIs...
```

becomes:

```js
[
    "Bearer",
    "eyJhbGciOiJIUzI1NiIs..."
]
```

Therefore:

```js
authHeader.split(" ")[0]
```

gives:

```text
Bearer
```

and:

```js
authHeader.split(" ")[1]
```

gives:

```text
JWT_TOKEN
```

---

# 21. Verify the JWT

After extracting the token:

```js
const user = jwt.verify(token, secret);
```

If verification succeeds:

```text
JWT Valid
    ↓
User Authenticated
```

If verification fails:

```text
JWT Invalid
    ↓
Authentication Failed
```

---

# 22. Middleware Example

A typical authentication middleware can look like:

```js
function restrictToLoggedinUserOnly(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.redirect("/login");
    }

    const token = authHeader.split(" ")[1];

    try {
        const user = jwt.verify(token, secret);

        req.user = user;

        next();

    } catch (error) {
        return res.redirect("/login");
    }
}
```

> The exact implementation can vary depending on the application.

---

# 23. Cookie vs Authorization Header

| Feature | Cookie | Authorization Header |
|---|---|---|
| Browser support | Excellent | Excellent |
| Automatically sent | ✅ Yes | ❌ No |
| Mobile apps | Less convenient | ✅ Convenient |
| Manual handling | Less | More |
| Common browser auth | ✅ | ✅ |
| JWT possible | ✅ | ✅ |
| Storage responsibility | Browser | Client application |

---

# 24. Browser-Based React Application

For a browser-based React application, one possible approach is:

```text
React
   ↓
Login API
   ↓
Server
   ↓
JWT
   ↓
Store token
   ↓
Future API Requests
   ↓
Authorization: Bearer JWT
```

Example:

```js
const token = localStorage.getItem("token");

fetch("/api/profile", {
    headers: {
        Authorization: `Bearer ${token}`
    }
});
```

---

# 25. Mobile Application

For a mobile application:

```text
Mobile App
   ↓
Login
   ↓
JWT
   ↓
Secure Device Storage
   ↓
Authorization Header
   ↓
API
```

This is one reason Bearer-token authentication is useful for APIs consumed by multiple types of clients.

---

# 26. Important Architecture Difference

### Cookie-Based

```text
Server
   ↓
Set-Cookie
   ↓
Browser stores cookie
   ↓
Browser automatically sends cookie
   ↓
Server verifies JWT
```

### Bearer Token

```text
Server
   ↓
JSON Response
   ↓
Client stores JWT
   ↓
Client manually adds Authorization header
   ↓
Server verifies JWT
```

---

# 27. Important Request Example

### Login Response

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
    "token": "JWT_TOKEN"
}
```

### Authenticated Request

```http
GET /api/profile HTTP/1.1
Authorization: Bearer JWT_TOKEN
```

The server extracts:

```text
JWT_TOKEN
```

and verifies it.

---

# 28. Why Use a Standard Header?

You could create your own header:

```http
Token: JWT_TOKEN
```

but it is better to follow established standards.

Use:

```http
Authorization: Bearer JWT_TOKEN
```

This makes your API more predictable and compatible with existing tools, libraries, and clients.

---

# 29. Authentication vs Authorization

### Authentication

> **Who are you?**

Example:

```text
JWT → User ID → User identified
```

### Authorization

> **What are you allowed to do?**

Example:

```text
User is authenticated
        ↓
Is user an admin?
        ↓
Yes → Allow DELETE
No  → Deny DELETE
```

JWT is commonly used as part of the authentication process, while authorization determines access to specific resources/actions.

---

# 30. Complete JWT Authentication Architecture

```text
                 LOGIN
                   │
                   ▼
              ┌─────────┐
              │ Client  │
              └────┬────┘
                   │
            Email + Password
                   │
                   ▼
              ┌─────────┐
              │ Server  │
              └────┬────┘
                   │
              Check User
                   │
                   ▼
              ┌─────────┐
              │Database │
              └────┬────┘
                   │
              Valid User
                   │
                   ▼
              Generate JWT
                   │
          ┌────────┴────────┐
          │                 │
          ▼                 ▼
       Cookie          JSON Response
          │                 │
          ▼                 ▼
      Browser          Client Storage
          │                 │
          │                 │
          ▼                 ▼
       Automatic      Authorization Header
        Cookie        Bearer JWT
          │                 │
          └────────┬────────┘
                   ▼
                Server
                   │
              Verify JWT
                   │
                   ▼
             Authenticated
                User
```

---

# 31. Key Things to Remember

### JWT

- JWT is a signed token.
- It can contain user-related claims.
- The server can verify its signature.
- JWT verification can happen without querying the database for every request.

### Cookies

- Created/set by the server.
- Stored by the browser.
- Browser automatically sends applicable cookies.
- Cookies are associated with domains.
- Cookies can have expiration and security attributes.

### Authorization Header

Standard format:

```http
Authorization: Bearer <token>
```

- `Authorization` → HTTP header
- `Bearer` → authentication scheme
- `<token>` → actual credential

### Client Responsibility

With Bearer authentication:

```text
Server → gives token
Client → stores token
Client → sends token with requests
Server → verifies token
```

---

# 🧠 Quick Revision

```text
Stateful
   ↓
Server remembers session
   ↓
Session ID → User
```

```text
Stateless
   ↓
Server doesn't need to maintain session state
   ↓
JWT contains claims
   ↓
Server verifies JWT
```

```text
Cookie Authentication
   ↓
Server sets cookie
   ↓
Browser stores cookie
   ↓
Browser automatically sends it
```

```text
Bearer Authentication
   ↓
Server returns JWT
   ↓
Client stores JWT
   ↓
Client sends:
Authorization: Bearer JWT
   ↓
Server verifies JWT
```

---

## ⭐ Interview Questions

### 1. What is stateful authentication?

Authentication where the server maintains session state for the user.

### 2. What is stateless authentication?

Authentication where each request contains enough information for the server to authenticate the request without relying on stored session state.

### 3. Why can database-backed sessions increase database load?

Because authenticated requests may require database lookups to retrieve session/user information.

### 4. What is a cookie?

A small piece of data stored by the browser and associated with a domain/path.

### 5. Who normally creates authentication cookies?

The server sends them using the `Set-Cookie` response header.

### 6. Why are cookies automatically sent?

The browser automatically attaches applicable cookies to matching requests.

### 7. What is the standard Bearer token format?

```http
Authorization: Bearer <token>
```

### 8. What does `Bearer` mean?

It identifies the authentication scheme being used for the credential.

### 9. How do you read the Authorization header in Express?

```js
req.headers.authorization
```

### 10. How do you extract the JWT?

```js
const token = req.headers.authorization.split(" ")[1];
```

### 11. How do you verify the JWT?

```js
jwt.verify(token, secret);
```

### 12. Why is the Authorization header useful?

It works well for APIs consumed by different clients such as:

- React applications
- Mobile applications
- Desktop applications
- Other backend services

---

# 🔑 One-Line Summary

> **Cookies let browsers automatically carry authentication credentials, while Bearer authentication makes the client explicitly send the token through the `Authorization` header.**