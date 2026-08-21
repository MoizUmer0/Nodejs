# Node.js Learning & Projects 🚀

This repository contains my **Node.js learning journey**, projects, revision notes, and practice work.

I'm learning Node.js, Express.js, MongoDB, Mongoose, authentication, REST APIs, MVC architecture, EJS, Discord bots, and backend development by building projects and documenting what I learn.

---

## 📁 Repository Structure

```text
Nodejs/
│
├── .gitignore
├── README.md
│
├── Server/
│   ├── index.js
│   ├── package.json
│   ├── package-lock.json
│   └── ...
│
├── Discord-Bot/
│   ├── command.js
│   ├── connection.js
│   ├── index.js
│   ├── model/
│   │   └── url.js
│   ├── package.json
│   └── package-lock.json
│
├── Project-01/
│   ├── MOCK_DATA.json
│   ├── connection.js
│   ├── index.js
│   ├── controllers/
│   │   └── user.js
│   ├── middleware/
│   │   └── index.js
│   ├── models/
│   │   └── user.js
│   ├── routers/
│   │   └── user.js
│   ├── package.json
│   └── package-lock.json
│
├── Short-url/
│   ├── connection.js
│   ├── index.js
│   ├── controllers/
│   │   ├── User.js
│   │   └── url.js
│   ├── middleware/
│   │   └── auth.js
│   ├── model/
│   │   ├── url.js
│   │   └── user.js
│   ├── routers/
│   │   ├── Url.js
│   │   ├── User.js
│   │   └── staticRouter.js
│   ├── service/
│   │   └── Auth.js
│   ├── view/
│   │   ├── home.ejs
│   │   ├── login.ejs
│   │   └── signup.ejs
│   ├── package.json
│   └── package-lock.json
│
├── Youtube-Blog/
│   ├── connection.js
│   ├── index.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── blog.js
│   │   └── comment.js
│   ├── routes/
│   │   ├── blog.js
│   │   └── user.js
│   ├── services/
│   │   └── auth.js
│   ├── public/
│   │   ├── images/
│   │   └── uploads/
│   ├── views/
│   │   ├── addBlog.ejs
│   │   ├── blog.ejs
│   │   ├── home.ejs
│   │   ├── signin.ejs
│   │   ├── signup.ejs
│   │   └── partials/
│   │       ├── head.ejs
│   │       ├── nav.ejs
│   │       └── scripts.ejs
│   ├── package.json
│   └── package-lock.json
│
└── notes/
    ├── 08-urls.md
    ├── 09-HTTP Methods.md
    ├── 10-Express.js.md
    ├── 11-NPM Package Versioning.md
    ├── 12-REST API & RESTful Architecture.md
    ├── 13-REST API Project 01 — Users API.md
    ├── 14-Postman API Testing.md
    ├── 15-Express.js Middleware.md
    ├── 16-HTTP Headers — Node.js Notes.md
    ├── 17-HTTP Status Codes — Node.js & Express Notes.md
    ├── 18-MongoDB + Mongoose Integration with Express.js.md
    ├── 19-MVC Architecture & Express.js Project Refactoring.md
    ├── 20-URL Shortener — Node.js, Express & MongoDB.md
    ├── 21-Server-Side Rendering with EJS — URL Shortener.md
    ├── 22-Short URL Service with Stateful Authentication.md
    ├── 23-Token-Based Authentication with JWT.md
    ├── 24-Authentication Architecture — JWT, Cookies & Authorization Header.md
    ├── 25-Discord Bot with Node.js — GitHub Revision Notes.md
    ├── 26-Authorization in Node.js & Express.md
    ├── 27-Blogify Project — Blog Details, Mongoose Referencing & Comments Revision Notes.md
    └── 28-Blogging Application — Backend Revision Notes.md
```

> **Note:** `node_modules/`, `.env` files, and other sensitive/local files are excluded using `.gitignore`.

---

## 🛠️ Technologies & Concepts

### Node.js

* Node.js fundamentals
* HTTP server
* Request & Response
* File System (`fs`)
* URL handling
* HTTP methods
* NPM
* NPM package versioning

### Express.js

* Express server
* Routing
* Route parameters
* Middleware
* REST APIs
* HTTP status codes
* HTTP headers
* MVC architecture

### MongoDB & Mongoose

* MongoDB
* Mongoose
* Schemas
* Models
* CRUD operations
* Referencing documents
* MongoDB integration with Express

### Authentication & Authorization

* Authentication
* Authorization
* Cookies
* JWT
* Authorization headers
* Password hashing
* Authentication middleware
* Stateful authentication

### Other Technologies

* Postman
* EJS
* Discord.js
* REST API development

---

## 📚 Projects

### 1. Server

A basic Node.js/Express server project used to understand the fundamentals of:

* HTTP requests
* HTTP responses
* Routing
* Express.js
* Middleware
* REST API concepts

---

### 2. Project-01 — Users REST API

A REST API project built while learning Express.js.

Features include:

* Users API
* CRUD operations
* Route parameters
* Controllers
* Routers
* Middleware
* MongoDB/Mongoose integration

---

### 3. Short URL

A URL-shortening application built with:

* Node.js
* Express.js
* MongoDB
* Mongoose
* EJS

Features include:

* Generate short URLs
* Redirect using short IDs
* URL analytics
* User signup/login
* Authentication
* Cookies
* JWT/stateful authentication concepts
* Server-side rendering with EJS

---

### 4. Discord Bot

A Discord bot project built using Node.js and Discord.js.

The project helped me understand:

* Discord.js
* Discord bot setup
* Commands
* Bot authentication
* Node.js modules
* MongoDB integration

> Bot tokens and other secrets are stored locally using environment variables and are not committed to GitHub.

---

### 5. Blogify — Blogging Application

A full blogging application built while learning Node.js and Express.js.

Technologies/concepts include:

* Node.js
* Express.js
* MongoDB
* Mongoose
* EJS
* Authentication
* Authorization
* Cookies
* Blog creation
* Blog details
* Comments
* User profiles
* Mongoose document referencing
* File uploads
* Multer
* Static files

---

## 📝 Learning Notes

The `notes/` directory contains my revision notes from my Node.js learning journey.

The notes cover topics from basic Node.js concepts through Express.js, REST APIs, MongoDB, authentication, authorization, Discord bots, and the Blogify project.

### Topics Covered

1. URLs
2. HTTP Methods
3. Express.js
4. NPM Package Versioning
5. REST API & RESTful Architecture
6. Users REST API
7. Postman API Testing
8. Express.js Middleware
9. HTTP Headers
10. HTTP Status Codes
11. MongoDB & Mongoose
12. MVC Architecture
13. URL Shortener
14. Server-Side Rendering with EJS
15. Stateful Authentication
16. JWT Authentication
17. Authentication Architecture
18. Discord Bot
19. Authorization
20. Blogify
21. Blogging Application Backend

---

## 🔐 Environment Variables

Sensitive information such as:

* Discord bot tokens
* MongoDB credentials
* JWT secrets
* API keys

should be stored in `.env` files.

Example:

```env
DISCORD_TOKEN=your_discord_token
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret
```

`.env` files are excluded from Git using `.gitignore`.

---

## 📌 Purpose of This Repository

This repository is mainly for:

* Learning Node.js
* Practicing backend development
* Building real projects
* Revising concepts
* Tracking my progress
* Keeping organized technical notes
* Building a portfolio of backend projects

---

## 🚀 Learning Journey

My goal is to move from understanding the fundamentals of Node.js and Express.js to building complete backend applications with:

```text
Node.js
   ↓
Express.js
   ↓
REST APIs
   ↓
MongoDB
   ↓
Mongoose
   ↓
Authentication
   ↓
Authorization
   ↓
Real-world Projects
```

This repository will continue to grow as I learn and build more projects.

---

## 👨‍💻 Author

**Moiz Umer**

Learning and building with **Node.js, Express.js, MongoDB, and JavaScript**.
