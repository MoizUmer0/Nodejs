# 🔗 URL Shortener — Node.js, Express & MongoDB

A simple **URL Shortening Service** built with **Node.js, Express.js, MongoDB, and Mongoose**.

This project was created for understanding how URL shortener services like Bitly work internally, including **short URL generation, redirection, visit tracking, and analytics**.

---

## 📌 What is a URL Shortener?

A URL shortener takes a long/original URL and generates a short URL.

### Example

```text
Original URL:
https://www.example.com/some/very/long/url

Short URL:
http://localhost:8000/abc12345
```

When a user visits the short URL:

```text
http://localhost:8000/abc12345
```

the server finds the original URL from the database and redirects the user to:

```text
https://www.example.com/some/very/long/url
```

---

## 🎯 Features

- Generate a unique short URL
- Store URLs in MongoDB
- Redirect users to the original URL
- Track total clicks/visits
- Store visit history with timestamps
- Get analytics for a particular short URL
- Use MongoDB with Mongoose
- Use Nano ID for short ID generation
- Express Router and Controllers structure

---

## 🛠️ Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**
- **Nano ID**
- **Postman** for API testing
- **Nodemon** for development

---

## 📁 Project Structure

```text
Short-url/
│
├── controllers/
│   └── url.js
│
├── models/
│   └── url.js
│
├── routes/
│   └── url.js
│
├── connect.js
├── index.js
├── package.json
└── package-lock.json
```

---

# ⚙️ Project Setup

## 1. Initialize Node Project

```bash
npm init
```

This creates:

```text
package.json
```

---

## 2. Install Dependencies

```bash
npm install express mongoose nanoid
```

Install Nodemon as a development dependency:

```bash
npm install --save-dev nodemon
```

---

# 🚀 Express Server Setup

`index.js`

```js
const express = require("express")

const app = express()
const PORT = 8000

app.listen(PORT, () => {
    console.log(`Server Started at PORT: ${PORT}`)
})
```

---

# 🗄️ MongoDB Connection

Create a `connect.js` file.

```js
const mongoose = require("mongoose")

async function connectToMongoDB(url) {
    return mongoose.connect(url)
}

module.exports = {
    connectToMongoDB,
}
```

Connect MongoDB from `index.js`:

```js
const { connectToMongoDB } = require("./connect")

connectToMongoDB("mongodb://localhost:27017/short-url")
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err))
```

### MongoDB Default Port

```text
27017
```

Database:

```text
short-url
```

---

# 🧱 URL Model

The URL model stores:

- Short ID
- Original URL
- Visit history

`models/url.js`

```js
const mongoose = require("mongoose")

const urlSchema = new mongoose.Schema(
    {
        shortId: {
            type: String,
            required: true,
            unique: true,
        },

        redirectURL: {
            type: String,
            required: true,
        },

        visitHistory: [
            {
                timestamp: {
                    type: Number,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
)

const URL = mongoose.model("URL", urlSchema)

module.exports = URL
```

---

# 🆔 Short ID Generation

A short ID is required to create the shortened URL.

For example:

```text
http://localhost:8000/Ab12Cd34
```

We can use **Nano ID** to generate a unique ID.

```js
const { nanoid } = require("nanoid")

const shortId = nanoid(8)
```

Example result:

```text
Ab12Cd34
```

---

# 📝 Creating a Short URL

### Endpoint

```http
POST /url
```

### Request Body

```json
{
    "url": "https://google.com"
}
```

### Controller Logic

```js
const { nanoid } = require("nanoid")
const URL = require("../models/url")

async function handleGenerateNewShortURL(req, res) {
    const body = req.body

    if (!body.url) {
        return res.status(400).json({
            error: "URL is required",
        })
    }

    const shortId = nanoid(8)

    await URL.create({
        shortId: shortId,
        redirectURL: body.url,
        visitHistory: [],
    })

    return res.json({
        id: shortId,
    })
}

module.exports = {
    handleGenerateNewShortURL,
}
```

---

# 🛣️ URL Router

`routes/url.js`

```js
const express = require("express")

const {
    handleGenerateNewShortURL,
    handleGetAnalytics,
} = require("../controllers/url")

const router = express.Router()

router.post("/", handleGenerateNewShortURL)

router.get("/analytics/:shortId", handleGetAnalytics)

module.exports = router
```

---

# 🔌 Connecting Router with Express

In `index.js`:

```js
const URLRouter = require("./routes/url")

app.use("/url", URLRouter)
```

Now:

```http
POST /url
```

becomes:

```text
http://localhost:8000/url
```

---

# 🔀 URL Redirection

The main purpose of the short URL is redirection.

### Request

```http
GET /:shortId
```

Example:

```text
http://localhost:8000/Ab12Cd34
```

The server should:

1. Get `shortId` from `req.params`
2. Find the URL in MongoDB
3. Increment/store visit information
4. Redirect the user to the original URL

---

## Redirect Controller

```js
async function handleRedirect(req, res) {
    const shortId = req.params.shortId

    const entry = await URL.findOneAndUpdate(
        {
            shortId,
        },
        {
            $push: {
                visitHistory: {
                    timestamp: Date.now(),
                },
            },
        },
        {
            new: true,
        }
    )

    return res.redirect(entry.redirectURL)
}
```

---

# 📊 Visit History

Every time someone visits a short URL, we store the timestamp.

Example:

```json
{
    "shortId": "Ab12Cd34",
    "redirectURL": "https://google.com",
    "visitHistory": [
        {
            "timestamp": 1750000000000
        },
        {
            "timestamp": 1750000050000
        }
    ]
}
```

This allows us to know:

- How many times the URL was visited
- When each visit happened

---

# 📈 Analytics

Analytics endpoint:

```http
GET /url/analytics/:shortId
```

Example:

```text
GET http://localhost:8000/url/analytics/Ab12Cd34
```

---

## Analytics Controller

```js
async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId

    const result = await URL.findOne({
        shortId,
    })

    return res.json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory,
    })
}
```

### Example Response

```json
{
    "totalClicks": 3,
    "analytics": [
        {
            "timestamp": 1750000000000
        },
        {
            "timestamp": 1750000050000
        },
        {
            "timestamp": 1750000100000
        }
    ]
}
```

---

# 🔄 Complete Request Flow

## 1️⃣ Generate Short URL

```text
Client
   ↓
POST /url
   ↓
Express Router
   ↓
Controller
   ↓
Generate nanoid()
   ↓
Save URL in MongoDB
   ↓
Return short ID
```

---

## 2️⃣ Visit Short URL

```text
User
   ↓
GET /:shortId
   ↓
Find shortId in MongoDB
   ↓
Add visit timestamp
   ↓
Get redirectURL
   ↓
res.redirect()
   ↓
Original Website
```

---

## 3️⃣ Get Analytics

```text
Client
   ↓
GET /url/analytics/:shortId
   ↓
Find URL in MongoDB
   ↓
Read visitHistory
   ↓
Calculate total clicks
   ↓
Return analytics
```

---

# 🧪 Testing with Postman

## Create Short URL

**Method:**

```http
POST
```

**URL:**

```text
http://localhost:8000/url
```

**Body → raw → JSON**

```json
{
    "url": "https://google.com"
}
```

Example response:

```json
{
    "id": "Ab12Cd34"
}
```

---

## Visit Short URL

Open:

```text
http://localhost:8000/Ab12Cd34
```

You should be redirected to:

```text
https://google.com
```

---

## Check Analytics

```text
GET http://localhost:8000/url/analytics/Ab12Cd34
```

Example:

```json
{
    "totalClicks": 2,
    "analytics": [
        {
            "timestamp": 1750000000000
        },
        {
            "timestamp": 1750000050000
        }
    ]
}
```

---

# 🧠 Important Concepts Learned

### `req.body`

Used to get data sent by the client.

```js
const { url } = req.body
```

Requires:

```js
app.use(express.json())
```

---

### `req.params`

Used to get dynamic values from the URL.

```js
const shortId = req.params.shortId
```

For:

```text
/Ab12Cd34
```

---

### `res.redirect()`

Redirects the user to another URL.

```js
res.redirect(entry.redirectURL)
```

---

### `$push`

Adds a new value to an array in MongoDB.

```js
{
    $push: {
        visitHistory: {
            timestamp: Date.now()
        }
    }
}
```

---

### `findOneAndUpdate()`

Finds a document and updates it in one database operation.

```js
URL.findOneAndUpdate(
    { shortId },
    { $push: { visitHistory: { timestamp: Date.now() } } },
    { new: true }
)
```

---

### `nanoid()`

Generates a short unique ID.

```js
const shortId = nanoid(8)
```

---

# 🗃️ Database Example

After creating:

```text
https://google.com
```

MongoDB may contain:

```json
{
    "_id": "...",
    "shortId": "Ab12Cd34",
    "redirectURL": "https://google.com",
    "visitHistory": [
        {
            "timestamp": 1750000000000
        },
        {
            "timestamp": 1750000050000
        }
    ],
    "createdAt": "...",
    "updatedAt": "..."
}
```

The important relationship is:

```text
shortId
   ↓
redirectURL
   ↓
visitHistory
   ↓
number of clicks
```

---

# 🏗️ MVC Architecture

This project follows a basic separation of responsibilities:

```text
Routes
  ↓
Controllers
  ↓
Models
  ↓
MongoDB
```

### Routes

Define API endpoints.

```text
routes/url.js
```

### Controllers

Contain application/business logic.

```text
controllers/url.js
```

### Models

Define MongoDB document structure.

```text
models/url.js
```

---

# 🔮 Future Improvements

The basic URL shortener can later be extended with:

- User authentication
- Authorization
- Login/Register
- User-specific URLs
- Custom short URLs
- URL expiration
- Click analytics dashboard
- IP address tracking
- User-agent tracking
- Geographic analytics
- Frontend UI
- Admin dashboard
- Rate limiting
- Better error handling
- Deployment

---

# 📌 Quick Revision

```text
URL Shortener
│
├── POST /url
│   └── Generate shortId
│       └── Save original URL
│
├── GET /:shortId
│   ├── Find shortId
│   ├── Record visit
│   └── Redirect to original URL
│
└── GET /url/analytics/:shortId
    ├── Find shortId
    ├── Read visitHistory
    └── Return total clicks + timestamps
```

### Core MongoDB Schema

```text
URL
├── shortId
├── redirectURL
└── visitHistory[]
    └── timestamp
```

### Core Technologies

```text
Node.js
   +
Express.js
   +
MongoDB
   +
Mongoose
   +
Nano ID
```

---

## ✅ Final Takeaway

The core idea behind a URL shortener is very simple:

```text
Long URL
   ↓
Generate Unique Short ID
   ↓
Store Both in Database
   ↓
Short URL
   ↓
Find Original URL
   ↓
Track Visit
   ↓
Redirect User
```

This project is a good practice project for understanding **Express routing, controllers, MongoDB, Mongoose, database updates, URL parameters, redirects, and analytics**.