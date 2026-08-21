# 🔗 Short URL Service with Stateful Authentication

A URL Shortener built with **Node.js, Express.js, MongoDB, Mongoose, EJS**, and **stateful authentication using sessions and cookies**.

This project allows users to:

- Create an account
- Log in securely
- Stay authenticated using cookies
- Create shortened URLs
- Access protected URL-shortening functionality only after login
- See only the URLs they created
- Track URL visit history and analytics
- Associate each shortened URL with the user who created it

---

## 🚀 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**
- **EJS**
- **UUID**
- **Cookie Parser**
- **Nanoid**

---

# 🔐 Authentication

Authentication is the process of verifying **who a user is**.

There are two common authentication patterns:

1. **Stateful Authentication**
2. **Stateless Authentication**

This project implements **Stateful Authentication**.

---

# 🧠 What is Stateful Authentication?

In stateful authentication, the server maintains information about the user's login session.

For example:

```text
User → Login → Server

Server creates:
Session ID = abc123

Server stores:

abc123 → User A
```

The server remembers which user belongs to which session ID.

When the user makes another request:

```text
User → Request + Session ID → Server
```

The server checks its stored session information and identifies the user.

---

# 🚗 Stateful Authentication Example

Imagine a car parking system.

You give your car to a parking attendant.

The attendant gives you a ticket:

```text
Ticket Number: 24
```

The parking attendant keeps a record:

```text
24 → Your Car
```

When you return, you provide ticket `24`.

The attendant checks the record and finds your car.

The ticket itself doesn't contain information about your car.

The **parking system/server maintains that information**.

This is similar to stateful authentication.

```text
Session ID → User
```

The session ID is like the parking ticket.

---

# 🔄 Authentication Flow

The authentication flow in this project works approximately like this:

```text
                    ┌──────────────┐
                    │    Client    │
                    └──────┬───────┘
                           │
                           │ Login
                           │ Email + Password
                           ▼
                    ┌──────────────┐
                    │    Server    │
                    └──────┬───────┘
                           │
                           │ Check User
                           ▼
                    ┌──────────────┐
                    │   MongoDB    │
                    └──────┬───────┘
                           │
                           │ User Found
                           ▼
                    Generate Session ID
                           │
                           ▼
                    ┌──────────────┐
                    │    Cookie    │
                    │  uid=abc123  │
                    └──────┬───────┘
                           │
                           ▼
                         Client
```

After login, the browser stores the cookie.

For future requests:

```text
Browser
   │
   │ Cookie: uid=abc123
   ▼
Express Server
   │
   │ Find session
   ▼
Session Store
   │
   │ abc123 → User
   ▼
Authenticated User
```

---

# 👤 User Model

A separate `User` model is created for authentication.

Example:

```js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
```

The model stores:

- User name
- Email
- Password

> **Production note:** Passwords should never be stored as plain text. Use a password-hashing algorithm such as `bcrypt` before deploying a real application.

---

# 📝 Signup

The signup route is responsible for creating a new user.

Example:

```text
POST /user
```

The client sends:

```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "123456"
}
```

The server creates the user in MongoDB.

---

# 🔑 Login

The login route receives:

```text
Email
Password
```

The server searches for a matching user.

Conceptually:

```js
const user = await User.findOne({
    email,
    password
});
```

If no user is found:

```text
Invalid username or password
```

If the credentials are correct:

```text
Generate Session ID
        ↓
Store Session ID + User
        ↓
Create Cookie
        ↓
Redirect to Home
```

---

# 🆔 Session ID

A unique session ID is generated after successful login.

The project uses UUID to generate unique IDs.

Example:

```js
const { v4: uuidv4 } = require("uuid");

const sessionId = uuidv4();
```

The session ID might look like:

```text
550e8400-e29b-41d4-a716-446655440000
```

This ID is associated with the logged-in user.

---

# 📖 Session Store

A simple `Map` can be used as an in-memory session store.

Example:

```js
const sessionIdToUserMap = new Map();
```

When a user logs in:

```js
sessionIdToUserMap.set(sessionId, user);
```

The map conceptually looks like:

```text
sessionId                         user
------------------------------------------------
abc123                            User A
xyz789                            User B
pqr456                            User C
```

To retrieve a user:

```js
const user = sessionIdToUserMap.get(sessionId);
```

---

# 🍪 Cookies

After generating the session ID, the server sends it to the browser using a cookie.

Example:

```js
res.cookie("uid", sessionId);
```

The browser stores:

```text
uid = abc123
```

On future requests, the browser automatically sends the cookie back to the server.

---

# 🍪 Cookie Parser

Express needs a way to easily read cookies.

Install:

```bash
npm install cookie-parser
```

Then:

```js
const cookieParser = require("cookie-parser");

app.use(cookieParser());
```

Now cookies can be accessed using:

```js
req.cookies
```

For example:

```js
const sessionId = req.cookies?.uid;
```

---

# 🛡️ Authentication Middleware

Authentication middleware checks whether the user is logged in.

The basic flow is:

```text
Request
   ↓
Read Cookie
   ↓
Get Session ID
   ↓
Find User
   ↓
User Found?
  /    \
Yes     No
 |       |
Next    Login
```

Example:

```js
function restrictToLoggedinUserOnly(req, res, next) {

    const userUid = req.cookies?.uid;

    if (!userUid) {
        return res.redirect("/login");
    }

    const user = getUser(userUid);

    if (!user) {
        return res.redirect("/login");
    }

    req.user = user;

    next();
}
```

The important part is:

```js
req.user = user;
```

This allows later controllers to access the currently authenticated user.

---

# 🔒 Protected Routes

Some routes should only be accessible to logged-in users.

For example, URL creation should require authentication.

Instead of:

```js
app.use("/url", URLRouter);
```

we can use authentication middleware:

```js
app.use(
    "/url",
    restrictToLoggedinUserOnly,
    URLRouter
);
```

Now:

```text
Logged in user
      ↓
/url
      ↓
Allowed ✅
```

But:

```text
Not logged in
      ↓
/url
      ↓
Redirect to /login ❌
```

---

# 👤 Optional Authentication Check

Sometimes authentication should not be mandatory.

For example, the home page might need to know whether the user is logged in, but it shouldn't necessarily reject the request.

For this, a separate middleware can check authentication without forcing it.

Conceptually:

```js
function checkAuth(req, res, next) {

    const userUid = req.cookies?.uid;

    if (!userUid) {
        return next();
    }

    const user = getUser(userUid);

    if (user) {
        req.user = user;
    }

    next();
}
```

Then:

```js
app.use(checkAuth);
```

Now controllers can check:

```js
if (!req.user) {
    return res.redirect("/login");
}
```

---

# 🔗 Associating URLs with Users

The URL model contains a `createdBy` field.

Example:

```js
createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
}
```

This creates a relationship between the URL and the user who created it.

Example:

```text
User
  │
  ├── User ID: 123
  │
  ├── URL A
  ├── URL B
  └── URL C
```

---

# 🧩 Creating a URL for the Logged-in User

When creating a shortened URL:

```js
await URL.create({
    shortId,
    redirectURL,
    createdBy: req.user._id,
});
```

Now MongoDB knows:

```text
Short URL
     ↓
createdBy
     ↓
User ID
```

---

# 🏠 Showing Only the Current User's URLs

Instead of retrieving every URL:

```js
const allUrls = await URL.find({});
```

we filter using the authenticated user's ID:

```js
const urls = await URL.find({
    createdBy: req.user._id,
});
```

This means User A sees only User A's URLs.

```text
User A
 ├── google.com
 ├── github.com
 └── youtube.com

User B
 ├── facebook.com
 └── twitter.com
```

User A cannot see User B's URLs through the normal dashboard.

---

# 📊 User-Specific Analytics

The same authentication system can be used for analytics.

A user should only be able to access analytics for URLs they own.

The basic idea is:

```text
Logged-in User
      ↓
Find URLs created by user
      ↓
Show analytics
      ↓
Clicks / Visit History
```

This prevents users from accessing another user's private analytics.

---

# 🗂️ Project Structure

A typical project structure can look like:

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
├── index.js
├── package.json
└── README.md
```

---

# ⚙️ Main Authentication Components

| Component | Responsibility |
|---|---|
| `User Model` | Stores user information |
| `Signup Route` | Creates new users |
| `Login Route` | Verifies credentials |
| `UUID` | Generates session IDs |
| `Session Store` | Maps session IDs to users |
| `Cookie` | Sends session ID to browser |
| `cookie-parser` | Reads cookies |
| `Auth Middleware` | Protects routes |
| `req.user` | Stores current authenticated user |
| `createdBy` | Associates URLs with users |

---

# 🔄 Complete Flow

### 1. Signup

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

### 2. Login

```text
User
 ↓
Email + Password
 ↓
POST /user/login
 ↓
Find User
 ↓
Generate Session ID
 ↓
Store Session ID → User
 ↓
Set Cookie
 ↓
Home Page
```

### 3. Protected Request

```text
Browser
 ↓
Request + Cookie
 ↓
cookie-parser
 ↓
Get Session ID
 ↓
Find User
 ↓
req.user = user
 ↓
Authentication Middleware
 ↓
next()
 ↓
Protected Controller
```

### 4. URL Creation

```text
Logged-in User
       ↓
POST /url
       ↓
Authentication Middleware
       ↓
req.user
       ↓
Create Short URL
       ↓
createdBy = req.user._id
       ↓
MongoDB
```

### 5. Dashboard

```text
User
 ↓
GET /
 ↓
Authentication Check
 ↓
req.user
 ↓
URL.find({
    createdBy: req.user._id
})
 ↓
Show User's URLs
```

---

# ⚠️ Important Limitation

The simple `Map` session store:

```js
const sessionIdToUserMap = new Map();
```

stores sessions **in server memory**.

Therefore, if the server restarts:

```text
Server Restart
      ↓
Map is cleared
      ↓
Sessions disappear
      ↓
Users must log in again
```

This is expected behavior for this basic implementation.

For production applications, sessions should be stored in a persistent/shared session store such as Redis or a database.

---

# 🔐 Security Improvements for Production

This project demonstrates the **basic concept of stateful authentication**. A production authentication system should additionally consider:

- Hash passwords with `bcrypt` or Argon2
- Use secure cookies
- Use `httpOnly` cookies
- Enable `secure` cookies when using HTTPS
- Configure `sameSite` appropriately
- Validate email addresses
- Enforce strong passwords
- Add rate limiting to login endpoints
- Regenerate sessions after login
- Implement logout/session invalidation
- Use HTTPS
- Avoid exposing sensitive user information
- Use a persistent session store

---

# 🧪 Example Authentication Test

### Signup

```http
POST /user
```

```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "123456"
}
```

### Login

```http
POST /user/login
```

```json
{
    "email": "john@example.com",
    "password": "123456"
}
```

### Cookie

After successful login:

```text
uid = <session-id>
```

### Protected URL Creation

```http
POST /url
```

The browser automatically sends the authentication cookie.

---

# 📚 What I Learned

This authentication implementation demonstrates several important backend concepts:

- Stateful authentication
- Stateless vs stateful architecture
- Sessions
- Session IDs
- Cookies
- Middleware
- Protected routes
- User authorization
- MongoDB relationships
- Mongoose ObjectId references
- User-specific data
- Authentication-aware controllers
- URL ownership
- Basic analytics authorization

---

# 🎯 Key Concept

The most important concept in this implementation is:

```text
Cookie
   ↓
Session ID
   ↓
Session Store
   ↓
User
   ↓
req.user
   ↓
Protected Resource
```

The cookie identifies the session, while the server-side session store keeps track of **which user that session belongs to**.

---

# 📌 Project Status

✅ User Signup  
✅ User Login  
✅ UUID Session IDs  
✅ Cookie-based Authentication  
✅ Authentication Middleware  
✅ Protected URL Routes  
✅ User-specific URLs  
✅ URL Ownership  
✅ User-specific Analytics  
⚠️ In-memory session storage  

---

## 👨‍💻 Purpose

This project was created as a learning project to understand how **stateful authentication works in Node.js and Express.js**, and how authentication can be integrated into a real-world URL shortener.

---

## ⭐ If You Found This Useful

Feel free to explore the code, experiment with the authentication middleware, and improve the project with password hashing, persistent sessions, logout functionality, and better security.