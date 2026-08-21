# 🔐 Token-Based Authentication with JWT

This project demonstrates **Token-Based Authentication** using **JSON Web Tokens (JWT)** with Node.js and Express.js.

It explains how token-based authentication works, why it is considered **stateless**, how JWT stores user information, how tokens are signed and verified, and how they can be used to authenticate users without maintaining server-side session state.

---

## 🚀 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**
- **JWT (JSON Web Token)**
- **Cookie Parser**
- **EJS**

---

# 🔑 What is Token-Based Authentication?

Token-based authentication is an authentication approach where the server does **not maintain the user's login state in server memory**.

Instead, the required information is stored inside a **token**.

The server creates the token after successful login and sends it to the client.

```text
User
  ↓
Login
  ↓
Server
  ↓
Generate Token
  ↓
Send Token to Client
  ↓
Client stores Token
```

For future requests:

```text
Client
  ↓
Token
  ↓
Server
  ↓
Verify Token
  ↓
Authenticated User
```

---

# 🆚 Stateful vs Stateless Authentication

## Stateful Authentication

In stateful authentication, the server maintains session information.

```text
Session ID → User
```

For example:

```text
abc123 → User A
xyz789 → User B
```

The server needs to remember these sessions.

### Problem

If the server stores sessions in memory:

```text
Server Restart
      ↓
Session Store Lost
      ↓
Users Logged Out
```

It can also consume server memory when many sessions are maintained.

---

## Stateless Authentication

In stateless authentication, the server does not maintain the authentication state in memory.

Instead:

```text
User Information
      ↓
JWT Token
      ↓
Client
```

The token itself contains the required information.

When a request arrives, the server verifies the token.

```text
Request
   ↓
JWT
   ↓
Verify Signature
   ↓
Read Payload
   ↓
Identify User
```

---

# 🎫 Parking Ticket Analogy

A simple way to understand stateless authentication is with a parking ticket.

In a stateful system:

```text
Ticket: 24

Server:
24 → Your Car
```

The server has to maintain the mapping.

In a stateless system, the ticket contains information about the car/user itself.

The ticket is also protected with a **signature/stamp** so that someone cannot simply modify it and create a fake ticket.

```text
Ticket
 ├── User Information
 └── Signature
```

Anyone may be able to read the ticket, but modifying the ticket invalidates its signature.

This is the basic idea behind a signed JWT.

---

# 🧩 What is JWT?

JWT stands for:

> **JSON Web Token**

JWT is a compact format used to securely transmit information between parties.

A JWT generally contains three parts:

```text
HEADER.PAYLOAD.SIGNATURE
```

For example:

```text
xxxxx.yyyyy.zzzzz
```

---

# 🏗️ JWT Structure

## 1. Header

The header contains information about the token.

Example:

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

---

## 2. Payload

The payload contains claims/data.

For example:

```json
{
  "_id": "123",
  "email": "user@example.com"
}
```

The payload can contain information that the server needs to identify the user.

> **Important:** JWT payloads are encoded, not encrypted by default. Do not put passwords, secrets, or other sensitive information inside them.

---

## 3. Signature

The signature is used to verify that the token was created by a trusted party and has not been modified.

Conceptually:

```text
Header
+
Payload
+
Secret Key
      ↓
Signature
```

If someone modifies the payload:

```text
Original Token
      ↓
Modify Payload
      ↓
Signature no longer matches
      ↓
Token rejected
```

---

# 🔐 Secret Key

The secret key is extremely important.

When creating a JWT:

```js
jwt.sign(payload, secretKey);
```

The secret key is used to create the token signature.

When verifying:

```js
jwt.verify(token, secretKey);
```

The same secret is used to verify the signature.

Therefore:

```text
Secret Key
    ↓
Must remain private
```

Never expose your JWT secret in:

- GitHub
- Frontend code
- Public documentation
- Screenshots
- Client-side JavaScript

Use environment variables instead:

```env
JWT_SECRET=your-very-secret-key
```

---

# 📦 Installing JWT

Install the JSON Web Token package:

```bash
npm install jsonwebtoken
```

Then import it:

```js
const jwt = require("jsonwebtoken");
```

---

# 🪪 Creating a JWT

After successful login, create a payload:

```js
const payload = {
    _id: user._id,
    email: user.email,
};
```

Then create the token:

```js
const token = jwt.sign(
    payload,
    process.env.JWT_SECRET
);
```

The generated token can then be sent to the client.

---

# 🍪 Storing JWT in a Cookie

The token can be stored inside a cookie.

Example:

```js
res.cookie("token", token);
```

The browser then stores:

```text
token = <JWT>
```

On future requests, the browser sends the cookie back to the server.

---

# 🔍 Reading the Token

Using `cookie-parser`:

```js
const cookieParser = require("cookie-parser");

app.use(cookieParser());
```

The token can then be accessed with:

```js
const token = req.cookies?.token;
```

---

# ✅ Verifying the Token

The server can verify the token using:

```js
const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET
);
```

If verification succeeds, the decoded payload can be used to identify the user.

Example:

```js
const user = jwt.verify(
    token,
    process.env.JWT_SECRET
);
```

---

# 🛡️ Authentication Middleware

Authentication middleware can verify the JWT before allowing access to protected routes.

Example:

```js
function restrictToLoggedinUserOnly(req, res, next) {

    const token = req.cookies?.token;

    if (!token) {
        return res.redirect("/login");
    }

    try {

        const user = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = user;

        next();

    } catch (error) {

        return res.redirect("/login");

    }
}
```

The flow is:

```text
Request
   ↓
Read Cookie
   ↓
Get JWT
   ↓
JWT Exists?
  /    \
No      Yes
 |       |
Login   Verify
         ↓
    Valid Token?
       /    \
     No      Yes
     |        |
   Login    req.user
              ↓
            next()
```

---

# 👤 `req.user`

After verifying the token, we can store the decoded user information in:

```js
req.user
```

For example:

```js
req.user = user;
```

A controller can then access:

```js
req.user._id
```

or:

```js
req.user.email
```

This allows the rest of the application to know who is making the request.

---

# 🔒 Protecting Routes

A route can be protected using authentication middleware.

For example:

```js
app.use(
    "/url",
    restrictToLoggedinUserOnly,
    URLRouter
);
```

Now the `/url` routes require a valid JWT.

```text
Not Logged In
      ↓
/url
      ↓
Redirect to /login
```

Whereas:

```text
Logged In
    ↓
Valid JWT
    ↓
/url
    ↓
Allowed
```

---

# 🔄 Complete JWT Authentication Flow

## 1. Signup

```text
User
 ↓
Signup Form
 ↓
POST /user
 ↓
Create User
 ↓
MongoDB
```

---

## 2. Login

```text
User
 ↓
Email + Password
 ↓
POST /user/login
 ↓
Find User
 ↓
Credentials Valid?
 ↓
Create JWT
 ↓
Set Cookie
 ↓
Home Page
```

---

## 3. Protected Request

```text
Browser
 ↓
Request + JWT Cookie
 ↓
Express
 ↓
Read JWT
 ↓
jwt.verify()
 ↓
Valid?
 ↓
req.user
 ↓
Protected Controller
```

---

# 🧠 Why is JWT Stateless?

With server-side sessions:

```text
Session ID
     ↓
Server Session Store
     ↓
User
```

The server must maintain the mapping.

With JWT:

```text
JWT
 ↓
Contains User Information
 ↓
Signature Verifies Authenticity
```

The server does not need an in-memory session map such as:

```js
const sessionIdToUserMap = new Map();
```

Therefore, restarting the server does not automatically invalidate every token merely because server memory was cleared.

---

# 🔄 Server Restart Example

### Stateful

```text
Login
 ↓
Session stored in memory
 ↓
Server Restart
 ↓
Session lost
 ↓
User must login again
```

### JWT

```text
Login
 ↓
JWT generated
 ↓
JWT stored by client
 ↓
Server Restart
 ↓
JWT still exists
 ↓
Server verifies JWT
 ↓
User remains authenticated
```

This is one of the major advantages of stateless authentication.

---

# 🌐 JWT and APIs

JWT is particularly useful when a frontend application communicates with a backend API.

For example:

```text
React Application
       ↓
       │ JWT
       ↓
Node.js / Express API
       ↓
MongoDB
```

The token can be sent with API requests.

A common approach is the `Authorization` header:

```http
Authorization: Bearer <token>
```

For browser-based applications, cookies can also be used.

---

# 🍪 Cookie vs Authorization Header

JWTs can be transported in different ways.

### Cookie

```text
Cookie: token=<JWT>
```

Useful for browser-based applications.

### Authorization Header

```http
Authorization: Bearer <JWT>
```

Common in APIs and applications where the client explicitly manages the token.

The important distinction is that **JWT is the token format**, while the cookie/header is the transport mechanism.

---

# 👀 Reading a JWT

A JWT payload can be decoded by anyone who has the token.

For example, a token might contain:

```json
{
    "_id": "123",
    "email": "user@example.com"
}
```

This does **not** mean the user can safely modify it.

Changing the payload without knowing the signing secret causes signature verification to fail.

```text
Read JWT
   ↓
Allowed

Modify JWT
   ↓
Signature changes
   ↓
Verification fails
```

---

# ⚠️ JWT Security

A JWT should be treated as sensitive authentication material.

If an attacker obtains a valid token:

```text
Attacker
   ↓
Stolen JWT
   ↓
Server
   ↓
Valid Signature
   ↓
Authenticated
```

Therefore:

> **Never intentionally share authentication tokens publicly.**

Use secure cookie settings where appropriate:

```js
res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
});
```

`secure: true` requires HTTPS.

---

# ⏳ JWT Expiration

JWTs can have an expiration time.

Example:

```js
const token = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    {
        expiresIn: "1h",
    }
);
```

After expiration:

```text
JWT
 ↓
Expired
 ↓
Verification fails
 ↓
User must authenticate again
```

This limits how long a stolen token remains useful.

---

# 🔑 JWT vs Session Authentication

| Feature | Stateful Session | JWT |
|---|---|---|
| Server stores session state | Yes | No |
| Authentication state in server memory | Usually | No |
| Token contains claims | Usually no | Yes |
| Server restart can clear in-memory sessions | Yes | No |
| Easy server-side revocation | Yes | More involved |
| Stateless | ❌ | ✅ |
| Useful for distributed APIs | Requires shared session store | Often convenient |
| Token expiration | Session configuration | Built into JWT claims |

---

# ⚠️ JWT Is Not Automatically More Secure

JWT and sessions solve authentication differently.

JWT does **not** automatically mean:

```text
JWT = More Secure
```

Security depends on implementation.

A secure application should consider:

- HTTPS
- Strong secrets
- Secure cookies
- `HttpOnly`
- `SameSite`
- Token expiration
- Password hashing
- CSRF protection where applicable
- XSS protection
- Rate limiting
- Proper logout/revocation strategy

---

# 🏗️ Project Architecture

A possible project structure:

```text
Short-url/
│
├── controllers/
│   ├── url.js
│   └── user.js
│
├── middleware/
│   └── auth.js
│
├── models/
│   ├── url.js
│   └── user.js
│
├── routes/
│   ├── staticRouter.js
│   ├── url.js
│   └── user.js
│
├── service/
│   └── auth.js
│
├── views/
│   ├── home.ejs
│   ├── login.ejs
│   └── signup.ejs
│
├── .env
├── index.js
├── package.json
└── README.md
```

---

# ⚙️ Authentication Service

A separate authentication service can contain JWT operations.

Example:

```js
const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;

function setUser(user) {
    return jwt.sign(
        {
            _id: user._id,
            email: user.email,
        },
        secret
    );
}

function getUser(token) {

    if (!token) {
        return null;
    }

    try {
        return jwt.verify(token, secret);
    } catch (error) {
        return null;
    }
}

module.exports = {
    setUser,
    getUser,
};
```

This keeps token generation and verification separate from controllers.

---

# 🧪 Example Login Controller

Conceptually:

```js
async function handleUserLogin(req, res) {

    const { email, password } = req.body;

    const user = await User.findOne({
        email,
        password,
    });

    if (!user) {
        return res.render("login", {
            error: "Invalid username or password",
        });
    }

    const token = setUser(user);

    res.cookie("token", token);

    return res.redirect("/");
}
```

> **For a production application, never compare or store plain-text passwords. Hash them with a suitable password-hashing algorithm.**

---

# 📊 User-Specific URLs

Authentication can also be used to associate URLs with users.

The URL model can contain:

```js
createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
}
```

When creating a URL:

```js
await URL.create({
    shortId,
    redirectURL,
    createdBy: req.user._id,
});
```

Now every URL belongs to a particular user.

---

# 🏠 Showing Only the Current User's URLs

Instead of:

```js
const urls = await URL.find({});
```

we can filter by the authenticated user:

```js
const urls = await URL.find({
    createdBy: req.user._id,
});
```

Therefore:

```text
User A
 ├── URL A
 ├── URL B
 └── URL C

User B
 ├── URL D
 └── URL E
```

User A only receives:

```text
URL A
URL B
URL C
```

---

# 📈 Authentication + Analytics

Authentication can also be used to protect analytics.

For example:

```text
User
 ↓
Valid JWT
 ↓
Find URLs created by user
 ↓
Show analytics
```

This prevents users from accessing another user's private URL analytics.

---

# 🧠 Important Concepts

The most important concepts from this implementation are:

### Stateful Authentication

```text
Session ID
     ↓
Server
     ↓
Session Store
     ↓
User
```

### Stateless Authentication

```text
JWT
 ↓
Payload
 ↓
Signature
 ↓
Client
```

### JWT Verification

```text
JWT
 ↓
Verify Signature
 ↓
Valid?
 ├── No → Reject
 └── Yes → Authenticate User
```

---

# 📌 Key Difference

The simplest way to remember the difference:

```text
STATEFUL

Client
  ↓
Session ID
  ↓
Server remembers
  ↓
User
```

```text
STATELESS

Client
  ↓
JWT
  ↓
Token contains claims
  ↓
Server verifies
  ↓
User
```

---

# ⚖️ When to Use Sessions vs JWT

There is no universal winner.

The correct choice depends on the application.

### Sessions can be useful when:

- You need easy server-side session invalidation
- You are building traditional browser applications
- You want the server to control session state
- Short-lived authentication sessions are appropriate

### JWT can be useful when:

- Building APIs
- Working with distributed services
- Multiple services need to verify the same token
- You want authentication information to travel with the request
- You want to avoid maintaining an in-memory session store

---

# 🧠 Important JWT Reminder

JWT payloads are **not encrypted by default**.

This means:

```text
Anyone with the token
        ↓
Can decode the payload
```

But they should not be able to create a valid modified token without the signing secret.

Therefore:

```text
JWT ≠ Encryption
JWT = Signed Token
```

---

# 📚 What I Learned

This implementation demonstrates:

- Token-based authentication
- Stateful vs stateless authentication
- JSON Web Tokens
- JWT header
- JWT payload
- JWT signature
- Secret keys
- JWT signing
- JWT verification
- Cookies
- Authentication middleware
- `req.user`
- Protected routes
- Token expiration
- User-specific resources
- Stateless backend architecture
- JWT security considerations

---

# 🎯 Final Authentication Flow

```text
                    ┌──────────────┐
                    │    Client    │
                    └──────┬───────┘
                           │
                    Email + Password
                           │
                           ▼
                    ┌──────────────┐
                    │    Server    │
                    └──────┬───────┘
                           │
                      Find User
                           │
                           ▼
                    Generate JWT
                           │
                  Sign with Secret
                           │
                           ▼
                    Send to Client
                           │
                           ▼
                     Store Token
                           │
                           │
               Future Requests
                           │
                           ▼
                    Send JWT
                           │
                           ▼
                    Verify Token
                           │
                     ┌─────┴─────┐
                     │           │
                   Invalid      Valid
                     │           │
                     ▼           ▼
                   Reject     req.user
                                 │
                                 ▼
                         Protected Resource
```

---

# 🏁 Conclusion

Token-based authentication provides a way to authenticate users without maintaining the authentication session in server memory.

With JWT:

```text
User Data
    ↓
JWT Payload
    ↓
Signed with Secret
    ↓
Client
    ↓
Server Verifies JWT
    ↓
Authenticated User
```

The key idea is:

> **The server does not need to remember the session in memory; the signed token carries the authentication claims and can be verified by the server.**

This makes JWT-based authentication particularly useful for APIs, distributed systems, and applications where stateless authentication is desirable.

---

## ⭐ Next Steps

Possible improvements for this project:

- [ ] Add JWT expiration
- [ ] Add logout functionality
- [ ] Hash passwords with bcrypt/Argon2
- [ ] Move JWT secret to `.env`
- [ ] Use secure HTTP-only cookies
- [ ] Add refresh tokens
- [ ] Add token revocation strategy
- [ ] Add role-based authorization
- [ ] Add email verification
- [ ] Add password reset functionality
- [ ] Protect user-specific analytics
- [ ] Connect the backend with a React frontend

---

## 👨‍💻 Purpose

This project is a learning implementation designed to understand **token-based authentication and JWT in Node.js/Express.js**, including how JWTs are generated, stored, verified, and used to protect backend routes.