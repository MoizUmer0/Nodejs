# MongoDB + Mongoose Integration with Express.js

## 📌 Overview

In this project, we replace the previous **file-based data storage system** using `MOCK_DATA.json` with **MongoDB**.

We use:

- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**
- **Postman**

Mongoose allows our Express application to connect and interact with MongoDB using JavaScript models and schemas.

---

## 🔄 Previous Approach vs New Approach

### Previous: File-Based Storage

We were storing users inside:

```text
MOCK_DATA.json
```

For example:

```js
const users = require("./MOCK_DATA.json");
```

We used `fs.readFile()` and `fs.writeFile()` to read and modify the data.

### New: MongoDB

Now the data is stored inside MongoDB.

The basic flow is:

```text
Express.js
     ↓
Mongoose
     ↓
MongoDB
     ↓
Users Collection
```

---

# 🧩 Mongoose

Mongoose is an ODM (**Object Data Modeling**) library for MongoDB and Node.js.

Install it using:

```bash
npm install mongoose
```

Check the installed version:

```bash
npm list mongoose
```

Example:

```text
mongoose 6.8.4
```

---

# 🔗 Connecting MongoDB with Node.js

First, import Mongoose:

```js
const mongoose = require("mongoose");
```

Then connect to MongoDB:

```js
mongoose
  .connect("mongodb://127.0.0.1:27017/youtube-app-1")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error", err));
```

### Connection URL

```text
mongodb://127.0.0.1:27017/youtube-app-1
```

Breakdown:

| Part | Meaning |
|---|---|
| `mongodb://` | MongoDB protocol |
| `127.0.0.1` | Local machine |
| `27017` | Default MongoDB port |
| `youtube-app-1` | Database name |

The database can be given any suitable name.

---

# 🏗️ Schema

A **Schema** defines the structure of documents stored in MongoDB.

For example, our user data contains:

```text
firstName
lastName
email
gender
jobTitle
```

Create a schema:

```js
const userSchema = new mongoose.Schema({
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
});
```

---

# 📋 Schema Properties

## `type`

Defines the type of data.

```js
firstName: {
  type: String
}
```

Other common types include:

```js
String
Number
Boolean
Date
Array
Object
```

---

## `required`

Makes a field mandatory.

```js
firstName: {
  type: String,
  required: true
}
```

This means every user must have a `firstName`.

---

## `unique`

Ensures that duplicate values are not allowed for a field.

```js
email: {
  type: String,
  required: true,
  unique: true
}
```

Therefore, two users should not have the same email address.

Example:

```text
piyush@gmail.com
```

If another user tries to register using the same email, MongoDB will return a duplicate-key error.

> **Note:** `unique` creates a unique index; it is not the same thing as Mongoose validation.

---

# 🧱 Model

After creating the schema, we create a **Model**.

```js
const User = mongoose.model("User", userSchema);
```

The model allows us to interact with the MongoDB collection.

Conceptually:

```text
Schema
   ↓
Model
   ↓
MongoDB Collection
```

For example:

```js
const User = mongoose.model("User", userSchema);
```

Mongoose will normally create/use a collection named:

```text
users
```

Mongoose pluralizes the model name automatically.

---

# 🔨 CRUD Operations

Using the `User` model, we can perform:

```text
Create
Read
Update
Delete
```

---

# ➕ CREATE — Add a User

Instead of writing data into `MOCK_DATA.json`, we create a Mongoose document.

```js
app.post("/api/users", async (req, res) => {
  const body = req.body;

  const result = await User.create({
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    gender: body.gender,
    jobTitle: body.jobTitle,
  });

  return res.status(201).json({
    message: "User created successfully",
    user: result,
  });
});
```

Example JSON request:

```json
{
  "firstName": "Piyush",
  "lastName": "Garg",
  "email": "piyushgarg@gmail.com",
  "gender": "Male",
  "jobTitle": "Software Engineer"
}
```

The document is stored directly in MongoDB.

---

# 📖 READ — Get All Users

Previously, we read users from the JSON file.

Now we use:

```js
const allDbUsers = await User.find({});
```

Example:

```js
app.get("/api/users", async (req, res) => {
  const allDbUsers = await User.find({});

  return res.json(allDbUsers);
});
```

### `User.find({})`

An empty filter:

```js
User.find({})
```

means:

> Find all users.

---

# 🌐 Render Users in HTML

If the application has a route that renders users:

```js
app.get("/users", async (req, res) => {
  const allDbUsers = await User.find({});

  const html = allDbUsers
    .map(
      (user) =>
        `<li>${user.firstName} - ${user.email}</li>`
    )
    .join("");

  return res.send(html);
});
```

The important change is:

```js
const allDbUsers = await User.find({});
```

Instead of:

```js
const users = require("./MOCK_DATA.json");
```

---

# 🔍 READ — Get One User

To find a specific user by MongoDB's `_id`:

```js
const user = await User.findById(req.params.id);
```

Example route:

```js
app.get("/api/users/:id", async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  return res.json(user);
});
```

Request:

```text
GET /api/users/:id
```

Example:

```text
GET /api/users/64f123abc456...
```

---

# ✏️ UPDATE — Edit a User

MongoDB allows us to update a document using:

```js
User.findByIdAndUpdate()
```

Example:

```js
app.patch("/api/users/:id", async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  return res.json({
    message: "User updated successfully",
    user,
  });
});
```

### Important

The first parameter is the user's ID:

```js
req.params.id
```

The second parameter contains the changes:

```js
req.body
```

Example request body:

```json
{
  "lastName": "Changed"
}
```

---

# 🗑️ DELETE — Remove a User

Use:

```js
User.findByIdAndDelete()
```

Example:

```js
app.delete("/api/users/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);

  return res.json({
    message: "User deleted successfully",
  });
});
```

Request:

```text
DELETE /api/users/:id
```

---

# 🕒 Timestamps

Mongoose can automatically track when a document was created and updated.

Add:

```js
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
```

Now Mongoose automatically adds:

```text
createdAt
updatedAt
```

Example:

```json
{
  "createdAt": "2026-08-16T10:00:00.000Z",
  "updatedAt": "2026-08-16T10:00:00.000Z"
}
```

---

# 🆔 MongoDB `_id`

MongoDB automatically generates an `_id` for every document.

Example:

```json
{
  "_id": "64f123abc456...",
  "firstName": "Piyush",
  "lastName": "Garg",
  "email": "piyushgarg@gmail.com"
}
```

This `_id` is used to uniquely identify documents.

For example:

```js
User.findById(req.params.id);
```

---

# 🧪 Testing with Postman

## Create User

```text
POST http://localhost:8000/api/users
```

Body → `raw` → `JSON`

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@gmail.com",
  "gender": "Male",
  "jobTitle": "Developer"
}
```

---

## Get All Users

```text
GET http://localhost:8000/api/users
```

---

## Get One User

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

# 🔄 Complete MongoDB CRUD Flow

```text
                Express.js
                    │
                    ▼
                 Router
                    │
                    ▼
                Mongoose
                    │
                    ▼
                  Model
                    │
                    ▼
                 Schema
                    │
                    ▼
                 MongoDB
                    │
                    ▼
               users collection
```

---

# 🧠 Important Concepts

### Schema

Defines the structure of the data.

```js
const userSchema = new mongoose.Schema({...});
```

### Model

Provides an interface for interacting with the collection.

```js
const User = mongoose.model("User", userSchema);
```

### Database Connection

Connects Node.js/Mongoose to MongoDB.

```js
mongoose.connect("mongodb://127.0.0.1:27017/youtube-app-1");
```

### CRUD

```text
Create → User.create()
Read   → User.find()
Update → User.findByIdAndUpdate()
Delete → User.findByIdAndDelete()
```

---

# 📁 Basic Project Structure

A simple version of the project can look like:

```text
Project/
│
├── index.js
├── package.json
├── package-lock.json
│
└── models/
    └── user.js
```

Later, when implementing the **MVC pattern**, the project can be organized further:

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
├── views/
│
├── index.js
├── package.json
└── package-lock.json
```

---

# 🏆 Key Takeaways

- MongoDB is used to store application data.
- Mongoose connects Node.js applications with MongoDB.
- A **Schema** defines the structure of documents.
- A **Model** is created from a Schema.
- Models are used to perform CRUD operations.
- MongoDB automatically generates `_id` values.
- `timestamps: true` automatically creates `createdAt` and `updatedAt`.
- `required: true` makes a field mandatory.
- `unique: true` creates a unique index for a field.
- `find({})` retrieves all matching documents.
- `findById()` retrieves one document by `_id`.
- `findByIdAndUpdate()` updates a document.
- `findByIdAndDelete()` deletes a document.
- Mongoose normally pluralizes model names when determining collection names.

---

## 🚀 Next Step

The current code can become difficult to maintain when everything is placed inside `index.js`.

The next step is to refactor the application using the **MVC (Model–View–Controller) architecture**.

```text
Routes
   ↓
Controllers
   ↓
Models
   ↓
MongoDB
```

This makes the project cleaner, easier to maintain, and closer to an industry-standard Express.js application.