# 🖥️ Server-Side Rendering with EJS — URL Shortener

This section covers how to add a **frontend UI to a Node.js + Express URL Shortener** using **Server-Side Rendering (SSR)** and the **EJS templating engine**.

---

## 📌 What is Server-Side Rendering?

**Server-Side Rendering (SSR)** means that the server generates the HTML page and sends the final HTML to the browser.

### Basic Flow

```text
Browser
   ↓
HTTP Request
   ↓
Node.js + Express
   ↓
EJS Template
   ↓
HTML Generated on Server
   ↓
Browser
```

For example:

```js
app.get("/test", (req, res) => {
    return res.send("<h1>Hello from Server</h1>")
})
```

The HTML is generated on the server and sent to the browser.

---

# ❌ Why Not Write All HTML Inside Node.js?

You technically can do:

```js
res.send(`
    <html>
        <body>
            <h1>URL Shortener</h1>
        </body>
    </html>
`)
```

But this becomes difficult to maintain when your application has:

- Multiple pages
- Navigation bars
- Forms
- Tables
- Dynamic data
- CSS
- JavaScript
- Multiple routes

Therefore, we use a **Templating Engine**.

---

# 🧩 What is a Templating Engine?

A templating engine allows us to keep our HTML in separate files while still inserting dynamic data into those files.

Popular templating engines include:

- **EJS**
- Pug
- Handlebars

In this project, we use **EJS**.

---

# 📦 Install EJS

```bash
npm install ejs
```

Check `package.json`:

```json
{
    "dependencies": {
        "ejs": "^3.1.8"
    }
}
```

---

# ⚙️ Configure EJS with Express

Tell Express that we want to use EJS as our view engine:

```js
app.set("view engine", "ejs")
```

---

# 📁 Create Views Folder

Create a folder called:

```text
views/
```

Project structure:

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
│   ├── url.js
│   └── staticRouter.js
│
├── views/
│   └── home.ejs
│
├── connect.js
├── index.js
└── package.json
```

---

# 📄 Create an EJS File

Create:

```text
views/home.ejs
```

EJS files contain normal HTML.

```html
<!DOCTYPE html>
<html>
<head>
    <title>URL Shortener</title>
</head>

<body>
    <h1>URL Shortener</h1>
</body>
</html>
```

---

# 📂 Tell Express Where Views Are

Node.js provides the built-in `path` module.

```js
const path = require("path")
```

Then:

```js
app.set("views", path.resolve("./views"))
```

Now Express knows where your EJS files are located.

### Complete Configuration

```js
const express = require("express")
const path = require("path")

const app = express()

app.set("view engine", "ejs")
app.set("views", path.resolve("./views"))
```

---

# 🎨 `res.render()`

Instead of:

```js
res.send("<h1>Hello</h1>")
```

we can use:

```js
res.render("home")
```

Express will find:

```text
views/home.ejs
```

and render it.

---

# 🔄 `res.send()` vs `res.render()`

### `res.send()`

```js
res.send("<h1>Hello</h1>")
```

You manually provide the HTML.

### `res.render()`

```js
res.render("home")
```

Express loads:

```text
views/home.ejs
```

and generates the HTML.

---

# 📦 Passing Data to EJS

One of the biggest benefits of EJS is that we can send data from the backend to the frontend.

Example:

```js
app.get("/test", async (req, res) => {
    const urls = await URL.find()

    return res.render("home", {
        urls: urls
    })
})
```

Now `urls` is available inside `home.ejs`.

---

# 🔁 EJS Loops

EJS allows us to run JavaScript inside templates.

Example:

```ejs
<ul>
    <% urls.forEach((url) => { %>

        <li>
            <%= url.shortId %>
        </li>

    <% }) %>
</ul>
```

---

# 🧠 Important EJS Syntax

## `<% %>`

Used for JavaScript logic.

```ejs
<% urls.forEach((url) => { %>
```

It does **not directly output** anything.

---

## `<%= %>`

Used to output a value.

```ejs
<%= url.shortId %>
```

Example:

```ejs
<h1><%= url.shortId %></h1>
```

---

# 🏠 Creating the Home Page

The home page can contain a form that allows users to create a new short URL.

```html
<h1>URL Shortener</h1>

<form method="POST" action="/url">

    <label>
        Enter your original URL
    </label>

    <input
        type="text"
        name="url"
        placeholder="https://example.com"
    />

    <button type="submit">
        Generate
    </button>

</form>
```

---

# 📝 Why is `name` Important?

The input should have:

```html
name="url"
```

because this is the key that Express receives from the form.

For example:

```html
<input name="url">
```

The backend can access it using:

```js
req.body.url
```

---

# 📤 Handling Form Data

HTML forms send data as URL-encoded form data.

Therefore, Express needs:

```js
app.use(express.urlencoded({ extended: false }))
```

You may also have:

```js
app.use(express.json())
```

### Difference

```js
express.json()
```

handles JSON request bodies.

```js
express.urlencoded()
```

handles HTML form submissions.

---

# 🔗 URL Generation Flow

```text
User enters URL
      ↓
HTML Form
      ↓
POST /url
      ↓
Express Router
      ↓
URL Controller
      ↓
Generate shortId
      ↓
Save to MongoDB
      ↓
Render Home Page
      ↓
Show generated short URL
```

---

# 🔄 Rendering Data After URL Generation

Instead of returning JSON:

```js
return res.json({
    id: shortId
})
```

we can render the home page again:

```js
return res.render("home", {
    id: shortId
})
```

Now the EJS page receives the generated ID.

---

# 🧠 `locals` in EJS

When the backend sends:

```js
res.render("home", {
    id: shortId
})
```

the `id` becomes available inside the EJS template.

We can check whether it exists:

```ejs
<% if (id) { %>

    <p>
        URL Generated:
        http://localhost:8000/<%= id %>
    </p>

<% } %>
```

---

# 📊 Displaying URL Analytics

We can also display all shortened URLs in a table.

Backend:

```js
const urls = await URL.find()

return res.render("home", {
    urls: urls
})
```

Then in EJS:

```ejs
<table>
    <thead>
        <tr>
            <th>S.No</th>
            <th>Short ID</th>
            <th>Redirect URL</th>
            <th>Clicks</th>
        </tr>
    </thead>

    <tbody>

        <% urls.forEach((url, index) => { %>

            <tr>
                <td><%= index + 1 %></td>

                <td>
                    <%= url.shortId %>
                </td>

                <td>
                    <%= url.redirectURL %>
                </td>

                <td>
                    <%= url.visitHistory.length %>
                </td>
            </tr>

        <% }) %>

    </tbody>
</table>
```

---

# 📈 Click Calculation

Our schema contains:

```js
visitHistory: [
    {
        timestamp: Number
    }
]
```

Therefore:

```js
url.visitHistory.length
```

gives the total number of visits.

Example:

```text
visitHistory:
[
    { timestamp: ... },
    { timestamp: ... },
    { timestamp: ... }
]
```

Then:

```js
url.visitHistory.length
```

returns:

```text
3
```

---

# 🛣️ Static Router

It is useful to separate frontend/static pages into their own router.

Create:

```text
routes/staticRouter.js
```

```js
const express = require("express")

const router = express.Router()

router.get("/", async (req, res) => {
    return res.render("home")
})

module.exports = router
```

---

# 🔌 Connect Static Router

In `index.js`:

```js
const staticRouter = require("./routes/staticRouter")

app.use("/", staticRouter)
```

Now:

```text
GET /
```

renders:

```text
views/home.ejs
```

---

# 📊 Static Router with Database Data

Instead of rendering only the page:

```js
router.get("/", async (req, res) => {
    return res.render("home")
})
```

we can fetch URLs:

```js
router.get("/", async (req, res) => {

    const allURLs = await URL.find()

    return res.render("home", {
        urls: allURLs
    })
})
```

Now the page can display all URLs dynamically.

---

# 🧱 Complete Static Router Example

```js
const express = require("express")
const URL = require("../models/url")

const router = express.Router()

router.get("/", async (req, res) => {

    const allURLs = await URL.find()

    return res.render("home", {
        urls: allURLs
    })
})

module.exports = router
```

---

# 🔄 Complete Architecture

```text
                    Browser
                       │
                       ▼
                Express Server
                       │
          ┌────────────┴────────────┐
          │                         │
          ▼                         ▼
    Static Router              URL Router
          │                         │
          ▼                         ▼
      home.ejs                  Controller
                                    │
                                    ▼
                                MongoDB
```

---

# 🧩 EJS Dynamic Rendering

The important concept is:

```text
Backend Data
     ↓
res.render()
     ↓
EJS Template
     ↓
JavaScript + HTML
     ↓
Final HTML
     ↓
Browser
```

For example:

### Backend

```js
res.render("home", {
    urls: allURLs
})
```

### EJS

```ejs
<% urls.forEach((url) => { %>

    <p>
        <%= url.shortId %>
    </p>

<% }) %>
```

### Browser receives

```html
<p>Ab12Cd34</p>
<p>Xy45Zq78</p>
```

The browser receives the **final HTML**, not the EJS template.

---

# 🔍 Important: View Page Source

After EJS renders the page, if you inspect **View Page Source**, you see the final HTML.

You will not see:

```ejs
<% urls.forEach(...) %>
```

Instead, you see the generated HTML:

```html
<tr>
    <td>1</td>
    <td>Ab12Cd34</td>
    <td>https://google.com</td>
    <td>3</td>
</tr>
```

This is because EJS runs on the **server** before the HTML is sent to the browser.

---

# 🆚 SSR vs Client-Side Rendering

## Server-Side Rendering

```text
Browser
   ↓
Request
   ↓
Server
   ↓
EJS
   ↓
HTML
   ↓
Browser
```

## Client-Side Rendering

Commonly used with React:

```text
Browser
   ↓
Request
   ↓
Server
   ↓
JavaScript
   ↓
React
   ↓
UI
```

---

# 🧠 Key Things to Remember

### 1. Install EJS

```bash
npm install ejs
```

### 2. Set View Engine

```js
app.set("view engine", "ejs")
```

### 3. Set Views Directory

```js
app.set("views", path.resolve("./views"))
```

### 4. Create `.ejs` Files

```text
views/
└── home.ejs
```

### 5. Render a View

```js
res.render("home")
```

### 6. Pass Data

```js
res.render("home", {
    urls: allURLs
})
```

### 7. Display Data

```ejs
<%= url.shortId %>
```

### 8. Run JavaScript Logic

```ejs
<% urls.forEach((url) => { %>
<% }) %>
```

### 9. Handle HTML Forms

```js
app.use(express.urlencoded({ extended: false }))
```

---

# ⚡ Quick Revision

```text
EJS
│
├── npm install ejs
│
├── app.set("view engine", "ejs")
│
├── views/
│   └── home.ejs
│
├── res.render("home")
│
├── Pass data
│   └── res.render("home", { urls })
│
├── Display data
│   └── <%= urls %>
│
└── JavaScript logic
    └── <% ... %>
```

---

# 🎯 URL Shortener Frontend Flow

```text
User opens /
      ↓
Static Router
      ↓
Fetch URLs from MongoDB
      ↓
res.render("home", { urls })
      ↓
EJS generates HTML
      ↓
Home page displayed
      ↓
User enters original URL
      ↓
POST /url
      ↓
Generate shortId
      ↓
Save to MongoDB
      ↓
Render home.ejs again
      ↓
Show generated short URL
      ↓
User visits short URL
      ↓
Track visit
      ↓
Redirect to original URL
      ↓
Analytics updated
```

---

## ✅ Final Takeaway

The main purpose of **EJS** is to make Server-Side Rendering easier.

Instead of writing large amounts of HTML inside Express:

```js
res.send("<html>...</html>")
```

we create separate templates:

```text
views/home.ejs
```

and render them:

```js
res.render("home", {
    urls: allURLs
})
```

EJS then combines the **HTML template + backend data** and sends the final HTML to the browser.

### Core Concept

```text
Express
   +
EJS
   +
MongoDB Data
   ↓
Server-Side Rendered HTML
   ↓
Browser
```