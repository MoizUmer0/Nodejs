# 📝 Blogging Application — Backend Revision Notes

A blogging application built with **Node.js, Express.js, MongoDB, Mongoose, and EJS**.

This project is designed to understand how a real-world full-stack application is structured, including authentication, password hashing, user management, reusable EJS components, and eventually blog creation and interaction.

---

## 🚀 What We Are Building

The application will eventually support:

- User signup
- User signin
- Authentication using tokens
- Password hashing
- User profiles
- Profile pictures
- Blog creation
- Reading blogs
- Comments
- User authorization
- Logout
- Deployment
- Production best practices

---

# 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- EJS
- Bootstrap
- `crypto` module
- Nodemon
- Later: Authentication Tokens
- Later: Multer for image uploads

---

# 📁 Project Structure

```text
Blogging-Application/
│
├── controllers/
│
├── models/
│   └── user.js
│
├── routes/
│   └── user.js
│
├── views/
│   ├── home.ejs
│   ├── signup.ejs
│   ├── signin.ejs
│   │
│   └── partials/
│       ├── head.ejs
│       ├── scripts.ejs
│       └── nav.ejs
│
├── public/
│   └── images/
│       └── default.png
│
├── index.js
├── package.json
└── package-lock.json
```

---

# 1. Initialize the Project

Create a new Node.js project:

```bash
npm init -y
```

Install Express:

```bash
npm install express
```

Install development dependency:

```bash
npm install -D nodemon
```

Install Mongoose:

```bash
npm install mongoose
```

---

# 2. Express Server

Basic Express setup:

```js
const express = require("express");

const app = express();

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server Started at PORT: ${PORT}`);
});
```

## Why use `process.env.PORT`?

Never assume that production will provide a specific port such as `8000`.

A cloud provider may assign the port dynamically.

Therefore:

```js
const PORT = process.env.PORT || 8000;
```

means:

> Use the environment-provided port if available; otherwise use `8000` locally.

---

# 3. Environment Variables

Environment variables allow configuration to change between environments.

Example:

```js
process.env.PORT
```

Later we can also store:

```text
MONGO_URI
JWT_SECRET
PORT
```

inside environment variables.

---

# 4. EJS Setup

Since this project uses server-side rendering, configure EJS:

```js
app.set("view engine", "ejs");
```

Set the views directory:

```js
const path = require("path");

app.set("views", path.resolve("./views"));
```

Now Express knows where to find:

```text
views/
```

---

# 5. Rendering an EJS Page

Example:

```js
app.get("/", (req, res) => {
    return res.render("home");
});
```

When the browser requests:

```text
GET /
```

Express renders:

```text
views/home.ejs
```

---

# 6. EJS Partials

As the application grows, copying the same HTML into every page is bad practice.

For example, the following code may be common to every page:

- HTML `<head>`
- Bootstrap CSS
- Bootstrap JavaScript
- Navbar
- Common scripts

Therefore we create reusable **partials**.

```text
views/
└── partials/
    ├── head.ejs
    ├── nav.ejs
    └── scripts.ejs
```

---

## Including a Partial

Inside an EJS page:

```ejs
<%- include("partials/head") %>
```

Navbar:

```ejs
<%- include("partials/nav") %>
```

Scripts:

```ejs
<%- include("partials/scripts") %>
```

### Why use partials?

Instead of writing:

```html
Bootstrap code
```

on every page, we write it once and reuse it.

This follows the:

> **DRY — Don't Repeat Yourself**

principle.

---

# 7. Bootstrap

Bootstrap can be included using its CDN.

The common Bootstrap code can be placed inside:

```text
views/partials/head.ejs
```

and Bootstrap JavaScript inside:

```text
views/partials/scripts.ejs
```

This means every page automatically gets Bootstrap when the partials are included.

---

# 8. Navbar Partial

Create:

```text
views/partials/nav.ejs
```

The navbar contains common application navigation such as:

```text
Bloggify
Home
Add Blog
User
Logout
```

Later, the navbar can conditionally show:

### Logged-in user

```text
Username
Logout
```

### Logged-out user

```text
Sign In
Sign Up
```

This will be connected to authentication later.

---

# 9. Nodemon

Install:

```bash
npm install -D nodemon
```

Add scripts to `package.json`:

```json
{
  "scripts": {
    "dev": "nodemon index.js",
    "start": "node index.js"
  }
}
```

Run development server:

```bash
npm run dev
```

Run production server:

```bash
npm start
```

---

## `dev` vs `start`

### Development

```bash
npm run dev
```

Uses:

```text
nodemon
```

Nodemon automatically restarts the server when files change.

### Production

```bash
npm start
```

Uses:

```text
node index.js
```

We don't need Nodemon in production.

---

# 10. Dependencies vs Dev Dependencies

Normal dependency:

```bash
npm install express
```

Stored under:

```json
"dependencies"
```

Development dependency:

```bash
npm install -D nodemon
```

Stored under:

```json
"devDependencies"
```

### Dependencies

Required for the application to run.

Examples:

```text
express
mongoose
```

### Dev Dependencies

Only required while developing.

Example:

```text
nodemon
```

This helps keep production installations smaller.

---

# 👤 User Model

Create:

```text
models/user.js
```

The user schema contains:

```text
fullName
email
password
salt
profileImageURL
role
createdAt
updatedAt
```

---

# 11. Mongoose Schema

Basic example:

```js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    salt: {
        type: String
    },

    profileImageURL: {
        type: String,
        default: "/images/default.png"
    },

    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    }
}, {
    timestamps: true
});
```

---

# 12. `timestamps`

Using:

```js
timestamps: true
```

automatically creates:

```text
createdAt
updatedAt
```

for every user.

---

# 13. Default Profile Image

If the user doesn't upload a profile image:

```js
profileImageURL: {
    type: String,
    default: "/images/default.png"
}
```

The application automatically uses:

```text
public/images/default.png
```

---

# 14. User Roles

The role is restricted using `enum`:

```js
enum: ["USER", "ADMIN"]
```

Therefore valid values are:

```text
USER
ADMIN
```

An invalid role will cause Mongoose validation to fail.

Default:

```js
default: "USER"
```

So new users automatically become normal users.

---

# 🔐 Password Hashing

Never store passwords as plain text.

❌ Bad:

```text
password: "123456"
```

If the database is leaked, the attacker immediately knows the password.

Instead, store a **hashed password**.

---

# 15. Salt

A random salt is generated for each user.

Example:

```text
random salt
+
password
↓
hash
```

The database stores:

```text
salt
hashed password
```

rather than the original password.

---

# 16. Why Salt?

Suppose two users have the same password:

```text
user1 → password123
user2 → password123
```

If we hash them without a unique salt, they could produce the same hash.

With unique random salts:

```text
User 1:
salt + password → hash A

User 2:
different salt + password → hash B
```

This makes password hashes harder to attack.

---

# 17. `pre("save")` Middleware

Mongoose provides middleware that runs before saving a document.

Example:

```js
userSchema.pre("save", function(next) {
    // password hashing
    next();
});
```

Important:

Use a **normal function**, not an arrow function.

Correct:

```js
function(next) {
}
```

Not:

```js
(next) => {
}
```

Why?

Because we need:

```js
this
```

to refer to the current user document.

---

# 18. `this` in Mongoose Middleware

Inside:

```js
userSchema.pre("save", function(next) {
```

`this` refers to the current user.

Therefore:

```js
this.password
```

means:

> The password belonging to the user currently being saved.

---

# 19. Check Whether Password Changed

We don't want to hash an already-hashed password every time the user document is saved.

Use:

```js
if (!this.isModified("password")) {
    return next();
}
```

Meaning:

> If the password wasn't changed, don't hash it again.

---

# 20. Generate Salt

Node.js provides the built-in:

```js
crypto
```

module.

Example:

```js
const crypto = require("crypto");
```

Generate random bytes:

```js
const salt = crypto.randomBytes(16).toString("hex");
```

Then:

```js
this.salt = salt;
```

---

# 21. Create Password Hash

Using SHA-256:

```js
const hash = crypto
    .createHmac("sha256", salt)
    .update(this.password)
    .digest("hex");
```

Then replace the plain password:

```js
this.password = hash;
```

Finally:

```js
next();
```

So the process becomes:

```text
Plain Password
      ↓
Generate Random Salt
      ↓
SHA-256 Hash
      ↓
Store Hash + Salt
```

---

# 22. Complete Password Middleware Concept

```js
userSchema.pre("save", function(next) {

    if (!this.isModified("password")) {
        return next();
    }

    const salt = crypto
        .randomBytes(16)
        .toString("hex");

    const hash = crypto
        .createHmac("sha256", salt)
        .update(this.password)
        .digest("hex");

    this.salt = salt;
    this.password = hash;

    next();
});
```

> Note: For production authentication systems, prefer a password-specific KDF such as Argon2id or bcrypt rather than SHA-256 alone.

---

# 🔑 Signup Flow

The signup process:

```text
User opens /user/signup
        ↓
Signup form
        ↓
POST /user/signup
        ↓
req.body
        ↓
Create User
        ↓
pre("save") middleware
        ↓
Generate salt
        ↓
Hash password
        ↓
Save user in MongoDB
        ↓
Redirect to /
```

---

# 23. User Router

Create:

```text
routes/user.js
```

Basic setup:

```js
const express = require("express");

const router = express.Router();

module.exports = router;
```

---

# 24. Signup GET Route

```js
router.get("/signup", (req, res) => {
    return res.render("signup");
});
```

URL:

```text
GET /user/signup
```

renders:

```text
views/signup.ejs
```

---

# 25. Signup POST Route

```js
router.post("/signup", async (req, res) => {

    const { fullName, email, password } = req.body;

    await User.create({
        fullName,
        email,
        password
    });

    return res.redirect("/");
});
```

---

# 26. Register Router

In `index.js`:

```js
const userRouter = require("./routes/user");

app.use("/user", userRouter);
```

Now:

```text
GET  /user/signup
POST /user/signup
```

are handled by the user router.

---

# 27. Important Middleware for Forms

HTML forms usually submit data as:

```text
application/x-www-form-urlencoded
```

Therefore Express needs:

```js
app.use(express.urlencoded({
    extended: false
}));
```

Without this middleware:

```js
req.body
```

may be:

```text
undefined
```

---

# 28. Why `express.urlencoded()`?

Example form:

```html
<form method="POST" action="/user/signup">
```

Data:

```text
fullName=Moiz
email=example@gmail.com
password=123456
```

Express needs to parse this form data.

That's what:

```js
express.urlencoded()
```

does.

---

# 29. Signup Form

Example:

```html
<form
    action="/user/signup"
    method="POST"
>
```

Inputs:

```html
<input
    type="text"
    name="fullName"
>

<input
    type="email"
    name="email"
>

<input
    type="password"
    name="password"
>
```

The `name` attribute is important because it becomes the key in:

```js
req.body
```

For example:

```js
req.body.fullName
req.body.email
req.body.password
```

---

# 🔐 Sign In Flow

Signin is different from signup.

### Signup

```text
Create a new user
```

### Signin

```text
Verify an existing user
```

Flow:

```text
Email + Password
       ↓
Find user by email
       ↓
Get stored salt
       ↓
Hash entered password using same salt
       ↓
Compare hashes
       ↓
Match?
  ↓       ↓
Yes      No
 ↓        ↓
Login    Error
```

---

# 30. Mongoose Static Method

We can create a custom static method:

```js
userSchema.statics.matchPassword = async function(email, password) {
    // authentication logic
};
```

Then call:

```js
User.matchPassword(email, password);
```

---

# 31. Why Static Method?

A static method belongs to the **Model**, not an individual document.

Example:

```js
User.matchPassword(...)
```

This is useful because we're trying to find a user based on their email and verify their password.

---

# 32. Find User

Inside `matchPassword`:

```js
const user = await this.findOne({ email });
```

If the user doesn't exist:

```js
if (!user) {
    throw new Error("User not found");
}
```

---

# 33. Hash the Provided Password Again

Get the stored salt:

```js
const salt = user.salt;
```

Create the hash:

```js
const hashedPassword = crypto
    .createHmac("sha256", salt)
    .update(password)
    .digest("hex");
```

Now compare:

```js
if (hashedPassword !== user.password) {
    throw new Error("Incorrect Password");
}
```

---

# 34. Successful Password Match

If the hashes match:

```js
user.password = undefined;
user.salt = undefined;

return user;
```

This prevents the password and salt from being returned unnecessarily.

---

# 35. Important Debugging Lesson: `await`

If a function is asynchronous:

```js
async function matchPassword() {
}
```

you need:

```js
await User.matchPassword(...)
```

Otherwise you may receive a Promise instead of the actual user object.

Correct:

```js
const user = await User.matchPassword(
    email,
    password
);
```

---

# 36. Common Error: Incorrect Password

If you intentionally enter the wrong password:

```text
Error: Incorrect Password
```

this is **expected behavior**.

It means the password verification logic is working.

For example:

```text
Stored password → 123456
Entered password → abc123

Hashes don't match
        ↓
Incorrect Password
```

So don't treat this error as a bug if you deliberately entered the wrong password.

---

# 37. MongoDB Connection

Example:

```js
mongoose.connect(
    "mongodb://127.0.0.1:27017/blogify"
)
.then(() => {
    console.log("MongoDB Connected");
})
.catch((err) => {
    console.log("MongoDB Error:", err);
});
```

Database:

```text
blogify
```

Collection:

```text
users
```

---

# 38. MongoDB Data Flow

```text
Signup Form
     ↓
Express
     ↓
User Router
     ↓
User Model
     ↓
Mongoose
     ↓
MongoDB
```

---

# 🐛 Important Debugging Problems From This Project

## Problem 1 — `req.body` is undefined

### Cause

Missing:

```js
app.use(express.urlencoded({
    extended: false
}));
```

### Fix

Add it before routes.

---

## Problem 2 — `Failed to lookup view "signup"`

### Cause

Express cannot find:

```text
views/signup.ejs
```

### Check

Make sure the structure is:

```text
views/
└── signup.ejs
```

and:

```js
app.set("view engine", "ejs");
```

is configured.

---

## Problem 3 — `salt is required`

### Cause

Schema had:

```js
salt: {
    type: String,
    required: true
}
```

but the salt is generated inside:

```js
pre("save")
```

Depending on validation/middleware behavior, requiring a field generated during save can cause validation issues.

Simpler approach for this project:

```js
salt: {
    type: String
}
```

and generate the salt in the save middleware.

---

## Problem 4 — Salt is undefined during signin

If:

```js
user.salt
```

is undefined, password verification cannot recreate the same hash.

Check the database and make sure signup actually stored:

```text
salt
password hash
```

---

## Problem 5 — Forgot `await`

Incorrect:

```js
const user = User.matchPassword(email, password);
```

Correct:

```js
const user = await User.matchPassword(email, password);
```

Otherwise `user` may be a Promise.

---

## Problem 6 — Wrong password

Error:

```text
Incorrect Password
```

This is expected when the entered password does not match the stored password.

---

# 🧠 Most Important Concepts Learned

## 1. Environment Variables

```js
process.env.PORT
```

Allows production platforms to assign ports dynamically.

---

## 2. EJS

Server-side rendering:

```js
res.render("home");
```

---

## 3. EJS Partials

Reusable components:

```ejs
<%- include("partials/nav") %>
```

---

## 4. Nodemon

Automatically restarts the development server.

```bash
npm run dev
```

---

## 5. Dev Dependencies

Development-only packages:

```bash
npm install -D nodemon
```

---

## 6. Mongoose Schema

Defines the structure of MongoDB documents.

---

## 7. Mongoose Middleware

```js
schema.pre("save", ...)
```

Runs logic before saving.

---

## 8. Password Hashing

Never store plain-text passwords.

```text
Password
   ↓
Salt
   ↓
Hash
   ↓
Database
```

---

## 9. Salt

A unique random value used during password hashing.

---

## 10. Static Methods

Custom model-level functions:

```js
User.matchPassword()
```

---

## 11. Authentication

Signin verifies:

```text
Email
+
Password
```

against stored credentials.

---

## 12. Middleware

Express middleware such as:

```js
express.urlencoded()
```

processes incoming requests before they reach routes.

---

# 🔄 Complete Current Architecture

```text
                    Browser
                       │
                       ▼
                ┌─────────────┐
                │   Express   │
                └──────┬──────┘
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
       Routes        EJS          Middleware
          │            │            │
          ▼            ▼            ▼
     User Router    Views       Body Parser
          │
          ▼
      User Model
          │
          ▼
       Mongoose
          │
          ▼
       MongoDB
```

---

# 🔐 Authentication Architecture

### Signup

```text
POST /user/signup
        ↓
req.body
        ↓
User.create()
        ↓
pre("save")
        ↓
Generate Salt
        ↓
Hash Password
        ↓
MongoDB
        ↓
Redirect /
```

### Signin

```text
POST /user/signin
        ↓
Email + Password
        ↓
User.matchPassword()
        ↓
Find User
        ↓
Get Salt
        ↓
Hash Provided Password
        ↓
Compare Hashes
        ↓
Match?
   ┌────┴────┐
   ↓         ↓
  YES        NO
   ↓         ↓
 User      Error
   ↓
Token Authentication
```

---

# 📌 Routes Learned

| Method | Route | Purpose |
|---|---|---|
| GET | `/` | Home page |
| GET | `/user/signup` | Signup page |
| POST | `/user/signup` | Create user |
| GET | `/user/signin` | Signin page |
| POST | `/user/signin` | Verify user |

---

# 📚 Key Revision Questions

Before moving to the next video, make sure you can answer these:

### Express

- Why do we use `process.env.PORT`?
- What is middleware?
- Why do we use `express.urlencoded()`?
- What is the difference between `app.use()` and `app.get()`?

### EJS

- What is EJS?
- Why use server-side rendering?
- What are EJS partials?
- What does this do?

```ejs
<%- include("partials/nav") %>
```

### Mongoose

- What is a Schema?
- What is a Model?
- What does `pre("save")` do?
- What is `isModified()`?
- What is a static method?

### Authentication

- Why should passwords never be stored directly?
- What is hashing?
- What is a salt?
- Why does every user need a different salt?
- Why do we hash the password again during signin?
- Why do we need `await` in `matchPassword()`?

### Project

- What happens when `/user/signup` is requested?
- How does form data reach `req.body`?
- How does the user reach MongoDB?
- Where is the password hashed?
- How is the password verified during signin?

---

# ⚠️ Important Security Note

The video demonstrates hashing with SHA-256 + salt for learning purposes.

For a real production authentication system, use a password-specific password hashing/KDF algorithm such as:

- Argon2id
- bcrypt
- scrypt

Also, never commit secrets such as:

```text
.env
JWT_SECRET
database passwords
API keys
```

to GitHub.

---

# ⏭️ Next Video

The next part will implement:

- Authentication tokens
- Login sessions
- User authentication
- Protected routes
- Blog functionality

The important concept to understand next is:

```text
Authentication
      ↓
Token
      ↓
Cookie
      ↓
Middleware
      ↓
Authenticated User
```

---

# 💡 One-Line Project Summary

> A Node.js + Express blogging application using MongoDB/Mongoose and EJS, implementing user signup, signin, password hashing, reusable EJS partials, and the foundation for token-based authentication and blogging features.