# URL & URL Components — Node.js Notes

This repository contains notes and practical examples from a Node.js lesson about **URLs, URL components, URL parsing, paths, and query parameters**.

## 📚 What is a URL?

**URL** stands for **Uniform Resource Locator**.

A URL is a human-friendly way to locate a resource on the internet.

Example:

```text
https://example.com/about?name=John&id=1
```

## 🔍 Major Components of a URL

```text
https://example.com/about?name=John&id=1
│      │           │       │
│      │           │       └── Query Parameters
│      │           └────────── Path
│      └────────────────────── Domain
└───────────────────────────── Protocol
```

### 1. Protocol

The protocol tells the browser/server **how communication should happen**.

Common examples:

- `http://` — HyperText Transfer Protocol
- `https://` — Secure HTTP
- `ws://` / `wss://` — WebSocket protocols

HTTPS provides encrypted communication between the client and server.

### 2. Domain

The domain is the human-readable name of a website.

Example:

```text
https://google.com
         └──────┘
         Domain
```

Domains are easier to remember than IP addresses.

### 3. Path

The path tells the server which resource or route the client wants.

Examples:

```text
/
```

Root/home page.

```text
/about
/contact
/projects
```

Different routes/pages.

### Nested Paths

Paths can also be nested:

```text
/projects/1
/projects/2
/projects/tiktok
```

For example:

```text
/projects/tiktok
```

is a nested path.

### 4. Query Parameters

Query parameters are extra information sent through the URL.

They start after a `?`.

Example:

```text
https://example.com/about?name=John&id=1
```

Here:

```text
?name=John&id=1
```

contains the query parameters.

Multiple parameters are separated using `&`:

```text
name=John&id=1
```

- `name` → key
- `John` → value
- `id` → key
- `1` → value

## 🔎 Real-World Example

A Google search URL can look similar to:

```text
https://www.google.com/search?q=javascript+interview+questions
```

Breakdown:

```text
https://
   ↓
Protocol

www.google.com
   ↓
Domain

/search
   ↓
Path

?q=javascript+interview+questions
   ↓
Query Parameter
```

The `q` parameter represents the search query.

Spaces in URLs may be encoded as `+` or `%20`.

## ▶️ YouTube Example

A YouTube search URL follows the same concept:

```text
https://www.youtube.com/results?search_query=javascript
```

Breakdown:

```text
Protocol
   ↓
https://

Domain
   ↓
www.youtube.com

Path
   ↓
/results

Query Parameter
   ↓
?search_query=javascript
```

The server can read the query parameter and use it to find the requested search results.

---

# 🟢 URL Handling in Node.js

Node.js provides the `http` module for creating servers.

A request URL can be accessed using:

```js
req.url
```

Example:

```js
const http = require("http");

const server = http.createServer((req, res) => {
  console.log(req.url);

  if (req.url === "/") {
    res.end("Home Page");
  } else if (req.url === "/about") {
    res.end("About Page");
  } else {
    res.end("404 Not Found");
  }
});

server.listen(8000, () => {
  console.log("Server started on port 8000");
});
```

## 📌 How the Request Flow Works

```text
Client / Browser
       ↓
     Request
       ↓
   Node.js Server
       ↓
    req.url
       ↓
 ┌───────────────┐
 │ Route / Path  │
 └───────┬───────┘
         ↓
   Handle Request
         ↓
      Response
         ↓
       Client
```

For example:

```text
http://localhost:8000/about
```

Node.js receives:

```js
req.url
```

as:

```text
/about
```

The server can then decide which response to send.

---

# 🧩 Parsing a URL

When a URL contains query parameters, simply using `req.url` gives the complete URL path.

Example:

```text
/about?name=John&id=1
```

To work with the different parts separately, Node.js provides the `URL` API.

Example:

```js
const myURL = new URL(
  "http://localhost:8000/about?name=John&id=1"
);

console.log(myURL);
```

Useful properties include:

```js
myURL.pathname
myURL.search
myURL.searchParams
myURL.hostname
myURL.protocol
```

### Get the Path

```js
console.log(myURL.pathname);
```

Output:

```text
/about
```

### Get Query Parameters

```js
console.log(myURL.searchParams);
```

You can retrieve an individual parameter:

```js
console.log(myURL.searchParams.get("name"));
```

Output:

```text
John
```

And:

```js
console.log(myURL.searchParams.get("id"));
```

Output:

```text
1
```

---

# 🛠️ Working with Query Parameters

Example URL:

```text
/about?name=John&id=1&search=javascript
```

The query parameters are:

```text
name=John
id=1
search=javascript
```

Using the `URL` API:

```js
const myURL = new URL(
  "http://localhost:8000/about?name=John&id=1&search=javascript"
);

console.log(myURL.searchParams.get("name"));
console.log(myURL.searchParams.get("id"));
console.log(myURL.searchParams.get("search"));
```

Output:

```text
John
1
javascript
```

You can also loop through all query parameters:

```js
for (const [key, value] of myURL.searchParams) {
  console.log(key, value);
}
```

---

# 📦 URL Package

The lesson also demonstrates the `url` package/API for parsing URLs.

Example:

```js
const url = require("url");

const myURL = url.parse(req.url, true);

console.log(myURL);
```

Using the second argument as `true` allows query parameters to be parsed.

You can then access:

```js
myURL.pathname
myURL.query
```

For example:

```text
/about?name=John&id=1
```

can be separated into:

```text
pathname → /about

query → {
  name: "John",
  id: "1"
}
```

> **Note:** Modern Node.js applications generally prefer the built-in WHATWG `URL` API for new code.

---

# 🧠 Important Concepts

## URL

```text
Uniform Resource Locator
```

A URL identifies the location of a resource.

## Protocol

Defines the communication rules.

```text
https://
```

## Domain

Human-readable website/server name.

```text
google.com
```

## Path

Identifies a route/resource.

```text
/about
/projects/1
```

## Query Parameters

Extra data sent with the request.

```text
?name=John&id=1
```

## `?`

Starts the query string.

## `&`

Separates multiple query parameters.

```text
?name=John&id=1
```

## Key / Value

```text
name=John
│    │
│    └── Value
└─────── Key
```

---

# 📁 Example Project Structure

```text
URL/
│
├── index.js
├── package.json
├── package-lock.json
├── node_modules/
└── README.md
```

---

# 🚀 Running the Project

Install dependencies if required:

```bash
npm install
```

Start the server:

```bash
npm start
```

Then open:

```text
http://localhost:8000
```

Try different routes:

```text
http://localhost:8000/
http://localhost:8000/about
http://localhost:8000/about?name=John&id=1
```

---

# 📝 Quick Revision

```text
URL
│
├── Protocol
│   └── https://
│
├── Domain
│   └── example.com
│
├── Path
│   └── /about
│
└── Query Parameters
    └── ?name=John&id=1
```

### Complete Example

```text
https://example.com/about?name=John&id=1
│       │           │       │
│       │           │       └── Query Parameters
│       │           └────────── Path
│       └────────────────────── Domain
└────────────────────────────── Protocol
```

---

## 🎯 Key Takeaway

A URL is made up of several important parts:

**Protocol → Domain → Path → Query Parameters**

In Node.js, the incoming request URL can be inspected and parsed so the server can determine:

- Which route the user requested
- Which query parameters were sent
- What data should be returned
- Which response should be sent to the client

These concepts are fundamental for building **Node.js servers, REST APIs, and backend applications**.
