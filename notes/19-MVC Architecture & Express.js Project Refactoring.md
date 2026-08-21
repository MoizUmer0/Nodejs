# MVC Architecture & Express.js Project Refactoring

## 📌 Overview

In this project, we refactor our Express.js application using the **MVC (Model–View–Controller) architecture**.

Previously, most of our application code was inside `index.js`, which made the file difficult to maintain.

MVC helps us separate the application into different responsibilities:

```text
Model
View
Controller
```

This makes the project:

- Cleaner
- Easier to understand
- Easier to maintain
- Easier to scale
- Better for team development

---

# 🧩 What is MVC?

MVC stands for:

| Component | Responsibility |
|---|---|
| **Model** | Handles data and database interaction |
| **View** | Handles what is presented to the user |
| **Controller** | Contains application/business logic |

A simplified flow is:

```text
Request
   ↓
Route
   ↓
Controller
   ↓
Model
   ↓
Database
   ↓
Controller
   ↓
Response / View
```

The controller communicates with the model and decides what response should be returned.

---

# ❌ Problem With the Previous Structure

Previously, `index.js` contained:

- Express configuration
- MongoDB connection
- Routes
- Controllers
- CRUD operations
- Middleware
- Logging
- User model/schema

As the application grows, putting everything into one file becomes difficult to manage.

For example:

```text
index.js
│
├── MongoDB connection
├── Middleware
├── Routes
├── GET users
├── GET user by ID
├── POST user
├── PATCH user
├── DELETE user
└── Logging
```

This is known as a **large/monolithic entry file**.

---

# 🗂️ MVC Folder Structure

We separate the code into different folders:

```text
Project/
│
├── controllers/
│   └── user.js
│
├── models/
│   └── user.js
│
├── routes/
│   └── user.js
│
├── middlewares/
│   └── log.js
│
├── connection.js
│
├── index.js
│
├── package.json
└── package-lock.json
```

Each folder has a specific responsibility.

---

# 🧱 1. Model

The **Model** contains the MongoDB schema and model.

Create:

```text
models/user.js
```

Example:

```js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    gender: {
      type: String,
    },

    jobTitle: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
```

Now the model is completely separated from `index.js`.

---

# 🛣️ 2. Routes

Create:

```text
routes/user.js
```

First import Express:

```js
const express = require("express");

const router = express.Router();
```

The router handles the URL and HTTP method.

For example:

```js
router
  .route("/")
  .get(handleGetAllUsers)
  .post(handleCreateNewUser);

router
  .route("/:id")
  .get(handleGetUserById)
  .patch(handleUpdateUserById)
  .delete(handleDeleteUserById);
```

Export the router:

```js
module.exports = router;
```

---

# 🎮 3. Controller

The **Controller** contains the actual request-handling logic.

Create:

```text
controllers/user.js
```

Import the model:

```js
const User = require("../models/user");
```

---

## Get All Users

```js
async function handleGetAllUsers(req, res) {
  const allDbUsers = await User.find({});

  return res.json(allDbUsers);
}
```

---

## Get User By ID

```js
async function handleGetUserById(req, res) {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  return res.json(user);
}
```

---

## Create New User

```js
async function handleCreateNewUser(req, res) {
  const body = req.body;

  const result = await User.create({
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    gender: body.gender,
    jobTitle: body.jobTitle,
  });

  return res.status(201).json(result);
}
```

---

## Update User

```js
async function handleUpdateUserById(req, res) {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  return res.json(user);
}
```

---

## Delete User

```js
async function handleDeleteUserById(req, res) {
  await User.findByIdAndDelete(req.params.id);

  return res.json({
    message: "User deleted successfully",
  });
}
```

---

# 📤 Export Controllers

At the bottom of `controllers/user.js`:

```js
module.exports = {
  handleGetAllUsers,
  handleGetUserById,
  handleUpdateUserById,
  handleDeleteUserById,
  handleCreateNewUser,
};
```

Now the route file can import these functions.

---

# 🔗 Connecting Routes and Controllers

Inside:

```text
routes/user.js
```

Import the controller functions:

```js
const express = require("express");

const {
  handleGetAllUsers,
  handleGetUserById,
  handleUpdateUserById,
  handleDeleteUserById,
  handleCreateNewUser,
} = require("../controllers/user");

const router = express.Router();
```

Then connect them:

```js
router
  .route("/")
  .get(handleGetAllUsers)
  .post(handleCreateNewUser);

router
  .route("/:id")
  .get(handleGetUserById)
  .patch(handleUpdateUserById)
  .delete(handleDeleteUserById);

module.exports = router;
```

---

# 🌐 Mounting the Router in `index.js`

Now `index.js` doesn't need to contain all the user routes.

Import the router:

```js
const UserRouter = require("./routes/user");
```

Then mount it:

```js
app.use("/api/users", UserRouter);
```

This means:

```text
/api/users
```

is the base path for the user router.

Therefore:

```text
GET    /api/users
POST   /api/users
GET    /api/users/:id
PATCH  /api/users/:id
DELETE /api/users/:id
```

---

# 🔍 How Route Mounting Works

Suppose we have:

```js
app.use("/api/users", UserRouter);
```

And inside `routes/user.js`:

```js
router.get("/", handleGetAllUsers);
```

The final URL becomes:

```text
/api/users
```

Because:

```text
/app prefix
      +
/router route
      =
final route
```

Example:

```text
/api/users
    +
    /
    =
/api/users
```

Similarly:

```js
router.get("/:id", handleGetUserById);
```

becomes:

```text
/api/users/:id
```

---

# 🗄️ 4. MongoDB Connection

We can also separate the MongoDB connection into its own file.

Create:

```text
connection.js
```

Example:

```js
const mongoose = require("mongoose");

async function connectMongoDB(url) {
  return mongoose.connect(url);
}

module.exports = {
  connectMongoDB,
};
```

Then in `index.js`:

```js
const { connectMongoDB } = require("./connection");

connectMongoDB("mongodb://127.0.0.1:27017/youtube-app-1")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error", err));
```

This keeps the database connection separate from the server setup.

---

# 📝 5. Middleware

Logging can also be separated.

Create:

```text
middlewares/log.js
```

Example:

```js
const fs = require("fs");

function logRequest(filename) {
  return function (req, res, next) {
    fs.appendFile(
      filename,
      `${Date.now()}: ${req.method} ${req.path}\n`,
      (err) => {
        if (err) {
          console.log(err);
        }

        next();
      }
    );
  };
}

module.exports = {
  logRequest,
};
```

Then use it in `index.js`:

```js
const { logRequest } = require("./middlewares/log");

app.use(logRequest("log.txt"));
```

This is another example of separation of concerns.

---

# 🧹 Clean `index.js`

After refactoring, `index.js` becomes much smaller.

Example:

```js
const express = require("express");

const { connectMongoDB } = require("./connection");
const { logRequest } = require("./middlewares/log");
const UserRouter = require("./routes/user");

const app = express();
const PORT = 8000;

connectMongoDB("mongodb://127.0.0.1:27017/youtube-app-1")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error", err));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(logRequest("log.txt"));

app.use("/api/users", UserRouter);

app.listen(PORT, () => {
  console.log(`Server started at PORT: ${PORT}`);
});
```

Now `index.js` mainly handles the application's overall configuration.

---

# 🔄 Complete Request Flow

Suppose the client sends:

```text
GET /api/users
```

The request follows this path:

```text
Client
   ↓
index.js
   ↓
/api/users
   ↓
UserRouter
   ↓
handleGetAllUsers()
   ↓
User Model
   ↓
MongoDB
   ↓
Users Data
   ↓
Controller
   ↓
JSON Response
```

---

# 🧠 Understanding Each Layer

### `index.js`

Responsible for:

- Creating Express application
- Connecting MongoDB
- Registering middleware
- Registering routers
- Starting the server

### `routes/user.js`

Responsible for:

- Defining endpoints
- Connecting HTTP methods to controllers

### `controllers/user.js`

Responsible for:

- Handling requests
- Calling models
- Processing results
- Sending responses

### `models/user.js`

Responsible for:

- Defining schema
- Creating the MongoDB model
- Database-level data interaction

### `connection.js`

Responsible for:

- Connecting to MongoDB

### `middlewares/log.js`

Responsible for:

- Request logging

---

# 🔗 MVC Relationship

The architecture can be visualized as:

```text
             Request
                │
                ▼
             Routes
                │
                ▼
           Controllers
                │
                ▼
              Model
                │
                ▼
            MongoDB
                │
                ▼
              Model
                │
                ▼
           Controller
                │
                ▼
             Response
```

For applications with HTML rendering, the **View** layer is also involved:

```text
Controller
    ↓
Model
    ↓
Database
    ↓
Model
    ↓
Controller
    ↓
View
    ↓
User
```

For a REST API, the response is commonly JSON rather than a traditional server-rendered view.

---

# 🧪 Testing with Postman

## Get All Users

```text
GET http://localhost:8000/api/users
```

Expected response:

```json
[
  {
    "_id": "...",
    "firstName": "Piyush",
    "lastName": "Garg",
    "email": "piyush@gmail.com"
  }
]
```

---

## Create User

```text
POST http://localhost:8000/api/users
```

Body:

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@gmail.com",
  "gender": "Male",
  "jobTitle": "Software Engineer"
}
```

---

## Get User By ID

```text
GET http://localhost:8000/api/users/:id
```

---

## Update User

```text
PATCH http://localhost:8000/api/users/:id
```

Body:

```json
{
  "lastName": "Changed"
}
```

---

## Delete User

```text
DELETE http://localhost:8000/api/users/:id
```

---

# 🚀 Advantages of MVC

## 1. Separation of Concerns

Each file has a specific responsibility.

```text
Model       → Data
Controller  → Logic
Routes      → Endpoints
```

---

## 2. Easier Maintenance

If there is a problem with users, you know where to look:

```text
models/user.js
controllers/user.js
routes/user.js
```

---

## 3. Better Team Collaboration

Different developers can work on different parts of the application without modifying one giant file.

---

## 4. Easier Scaling

If the application later has:

```text
Users
Products
Orders
Payments
Comments
Posts
```

we can create separate models, controllers, and routes.

Example:

```text
models/
├── user.js
├── product.js
├── order.js
└── post.js

controllers/
├── user.js
├── product.js
├── order.js
└── post.js

routes/
├── user.js
├── product.js
├── order.js
└── post.js
```

---

## 5. Easier Route Changes

Because routes are isolated, changing:

```text
/api/users
```

to:

```text
/api/v1/users
```

can be done at the router mounting level without rewriting every user endpoint.

---

# 📌 Important Concepts to Remember

### Model

The Model represents the application's data structure and provides methods for database interaction.

```js
const User = mongoose.model("User", userSchema);
```

### Controller

Controllers contain the functions that handle requests.

```js
async function handleGetAllUsers(req, res) {
  const users = await User.find({});
  return res.json(users);
}
```

### Router

Routers connect URLs and HTTP methods to controllers.

```js
router.get("/", handleGetAllUsers);
```

### Middleware

Middleware runs during the request-response cycle.

```js
app.use(logRequest("log.txt"));
```

### Entry Point

`index.js` acts as the application's main entry point and wires everything together.

---

# 🏆 Final Architecture

```text
Project/
│
├── controllers/
│   └── user.js
│
├── models/
│   └── user.js
│
├── routes/
│   └── user.js
│
├── middlewares/
│   └── log.js
│
├── connection.js
├── index.js
├── package.json
└── package-lock.json
```

The final request flow is:

```text
HTTP Request
     ↓
index.js
     ↓
Middleware
     ↓
Router
     ↓
Controller
     ↓
Model
     ↓
MongoDB
     ↓
Controller
     ↓
HTTP Response
```

---

# 🎯 Key Takeaway

The main purpose of refactoring into MVC is **not just creating more folders**.

The goal is to give every part of the application a clear responsibility:

```text
Routes       → Where does the request go?
Controllers  → What should happen?
Models       → How do we interact with data?
Database     → Where is the data stored?
Middleware   → What should happen during the request?
index.js     → How are all components connected?
```

This separation makes the application easier to understand, maintain, test, scale, and work on as a team.