# First Node.js Program

## Creating the First Node.js Project

In this video, we create and run our first Node.js program.

A simple project structure can be:

```text
Node.js/
└── 01-Hello-World/
    └── hello.js
```

Keeping each example in a separate folder makes it easier to organize and track different Node.js concepts.

---

# Creating a JavaScript File

Create a file named:

```text
hello.js
```

The `.js` extension represents a **JavaScript file**.

Example:

```js
console.log("Hello");
```

---

# Running a JavaScript File with Node.js

Open the terminal inside your project folder.

Run:

```bash
node hello.js
```

Node.js will execute the JavaScript file.

Output:

```text
Hello
```

You can also omit the `.js` extension:

```bash
node hello
```

Node.js can identify the JavaScript file in this case.

---

# Node.js Is Different From Browser JavaScript

One important concept is that **Node.js does not provide all browser-specific objects and APIs**.

For example, this works in a browser:

```js
console.log(window);
```

But running the same code with Node.js gives an error similar to:

```text
ReferenceError: window is not defined
```

---

## Why is `window` Not Available?

The `window` object belongs to the **browser environment**.

For example, browsers provide objects and APIs such as:

```js
window
document
alert()
navigator
```

These are part of the browser environment.

Node.js is a different environment.

```text
Browser
   │
   ├── JavaScript Engine
   ├── window
   ├── document
   ├── navigator
   └── Browser APIs

Node.js
   │
   ├── V8 Engine
   ├── File System
   ├── Networking
   ├── Cryptography
   └── Server-side APIs
```

---

# Node.js Provides Server-Side Functionality

Node.js uses the V8 JavaScript engine but provides additional functionality required for server-side applications.

Some examples include:

- File handling
- Networking
- Cryptography
- Operating-system interaction
- Server functionality

At the same time, browser-specific APIs such as `window` and `document` are not available by default.

---

# Node.js Environment vs Browser Environment

Both environments can execute JavaScript, but they provide different APIs.

### Browser

```js
console.log(window);
```

Works because `window` is provided by the browser.

### Node.js

```js
console.log(window);
```

Produces an error because Node.js does not provide the browser's `window` object.

---

# What is npm?

**npm** stands for:

> **Node Package Manager**

npm is used to manage packages and dependencies in Node.js projects.

Check the npm version:

```bash
npm -v
```

---

# Creating a Node.js Project with npm

When starting a new Node.js project, we can initialize it using:

```bash
npm init
```

npm will ask several questions about the project.

For example:

```text
package name:
version:
description:
entry point:
test command:
git repository:
keywords:
author:
license:
```

After completing the setup, npm creates:

```text
package.json
```

---

# What is package.json?

`package.json` is an important configuration file for a Node.js project.

It contains information about the project and can contain:

- Project name
- Version
- Description
- Entry point
- Scripts
- Dependencies
- Development dependencies
- Author
- License

Example:

```json
{
  "name": "hello-world",
  "version": "1.0.0",
  "description": "My first Node.js project",
  "main": "hello.js",
  "scripts": {},
  "author": "",
  "license": "ISC"
}
```

---

# Why Do We Need package.json?

As our Node.js applications become larger, we will use external packages.

For example:

```text
Node.js Project
      │
      ├── JavaScript Files
      │
      ├── package.json
      │
      └── Dependencies
```

`package.json` helps keep track of the project's configuration and dependencies.

It also allows us to define commands that can be executed through npm.

---

# npm init -y

Instead of answering every question manually, we can use:

```bash
npm init -y
```

This creates a `package.json` file automatically using default values.

This is commonly useful when quickly starting a new project.

---

# npm Scripts

One of the useful features of `package.json` is the `scripts` section.

Example:

```json
{
  "scripts": {
    "start": "node hello.js"
  }
}
```

Now we can run:

```bash
npm start
```

This executes:

```bash
node hello.js
```

---

# Why Use npm Scripts?

Instead of repeatedly typing long commands, we can give them a simple name.

For example:

```json
{
  "scripts": {
    "start": "node hello.js"
  }
}
```

Then:

```bash
npm start
```

runs:

```bash
node hello.js
```

---

# Custom Scripts

We can create our own scripts.

Example:

```json
{
  "scripts": {
    "start": "node hello.js"
  }
}
```

Another example:

```json
{
  "scripts": {
    "dev": "node hello.js"
  }
}
```

Then run:

```bash
npm run dev
```

The general syntax for a custom npm script is:

```bash
npm run <script-name>
```

For example:

```bash
npm run dev
```

---

# npm Scripts in Real Projects

In a larger application, starting the project may require multiple steps.

For example:

```text
Start Application
       │
       ├── Connect Database
       ├── Load Configuration
       ├── Perform Setup
       ├── Run Server
       └── Start Application
```

Instead of manually running multiple commands, these tasks can be combined into npm scripts.

For example:

```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

Then:

```bash
npm start
```

can be used to start the application.

---

# Direct Node Command vs npm Script

### Direct execution

```bash
node hello.js
```

### npm script

```json
{
  "scripts": {
    "start": "node hello.js"
  }
}
```

Then:

```bash
npm start
```

Both can execute the same file.

The npm script becomes especially useful as the project grows.

---

# Basic Project Structure

After running:

```bash
npm init
```

a project might look like:

```text
01-Hello-World/
│
├── hello.js
│
└── package.json
```

### hello.js

Contains our JavaScript code.

### package.json

Contains project configuration, scripts, and dependency information.

---

# Important Commands

### Run a JavaScript file

```bash
node hello.js
```

### Check Node.js version

```bash
node -v
```

### Check npm version

```bash
npm -v
```

### Initialize a project

```bash
npm init
```

### Initialize with default settings

```bash
npm init -y
```

### Run a custom npm script

```bash
npm run <script-name>
```

### Run the start script

```bash
npm start
```

---

# Important Concepts

## `.js`

The `.js` extension represents a JavaScript file.

## Node.js

Executes JavaScript outside the browser.

## npm

Node Package Manager. It manages packages, dependencies, and project scripts.

## package.json

The main configuration file for a Node.js project.

## npm init

Creates a new Node.js project's `package.json`.

## npm scripts

Custom commands defined inside the `scripts` section of `package.json`.

---

# Browser vs Node.js

| Feature              | Browser            | Node.js      |
| -------------------- | ------------------ | ------------ |
| JavaScript execution | ✅                  | ✅            |
| V8 engine            | Depends on browser | ✅            |
| `window`             | ✅                  | ❌            |
| `document`           | ✅                  | ❌            |
| Browser DOM          | ✅                  | ❌            |
| File system access   | Restricted         | ✅            |
| Server development   | ❌                  | ✅            |
| Networking           | Browser APIs       | Node.js APIs |
| Cryptography APIs    | Browser APIs       | Node.js APIs |

---

# Quick Revision

### How do you run a JavaScript file with Node.js?

```bash
node hello.js
```

### What is npm?

npm stands for **Node Package Manager**.

### What does `npm init` do?

It initializes a Node.js project and creates a `package.json` file.

### What is package.json?

It is a configuration file that contains information about the Node.js project, scripts, and dependencies.

### How can you create package.json with default values?

```bash
npm init -y
```

### How do you create an npm script?

Add it inside the `scripts` section:

```json
{
  "scripts": {
    "start": "node hello.js"
  }
}
```

Then run:

```bash
npm start
```

### Is `window` available in Node.js?

No. `window` is a browser-specific object.

---

# Complete Flow

```text
Create Project Folder
        ↓
Create hello.js
        ↓
Write JavaScript
        ↓
node hello.js
        ↓
JavaScript Executes
        ↓
Initialize npm
        ↓
npm init
        ↓
package.json Created
        ↓
Add npm Scripts
        ↓
npm start / npm run <script>
```

---

# Key Takeaway

> **Node.js allows JavaScript to run outside the browser. npm is used to manage Node.js projects, packages, dependencies, and scripts, while package.json stores important project configuration.**

---

## Video

**Topic:** First Node.js Program\
**Playlist:** Master NodeJS\
**Status:** ✅ Completed
