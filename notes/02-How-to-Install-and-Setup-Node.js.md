# How to Install and Setup Node.js

## Installing Node.js

Node.js can be downloaded from its official website:

**https://nodejs.org/**

The Node.js website provides different versions for download.

The two important versions discussed in the video are:

- **LTS (Long Term Support)**
- **Current**

---

## LTS vs Current

### LTS — Long Term Support

LTS stands for **Long Term Support**.

The LTS version is:

- Stable
- Recommended for most users
- Suitable for production applications
- Supported for a longer period

When installing Node.js for normal development or production work, **LTS is the recommended choice**.

### Current

The Current version contains newer features and updates.

It can be useful when you want to test the latest Node.js features, but it may not be as stable as the LTS version.

```text
LTS
 ↓
Stable
 ↓
Recommended
 ↓
Production
```

```text
Current
 ↓
Latest Features
 ↓
Testing / Development
```

---

## Which Version Should You Download?

For most projects, choose:

> **LTS — Long Term Support**

You should generally use the LTS version unless you specifically need a feature available only in the Current release.

---

## Node.js Versioning

Node.js versions follow a versioning system.

The video explains the general pattern where:

- Even-numbered major versions become LTS releases.
- Odd-numbered major versions are Current releases.

Example from the video:

```text
18 → LTS
19 → Current
20 → Next LTS
21 → Current
```

The important idea is:

> **For normal development and production, prefer the LTS version.**

---

# Installing Node.js on Windows

After downloading Node.js:

1. Open the Node.js setup file.
2. Start the installer.
3. Accept the license agreement.
4. Click **Next** through the installation steps.
5. Complete the installation.

Once installation finishes, Node.js should be available on your system.

---

# Verify Node.js Installation

After installing Node.js, open your terminal.

Run:

```bash
node --version
```

or:

```bash
node -v
```

You should see a Node.js version number.

Example:

```text
v16.14.0
```

The exact version you see depends on the version of Node.js installed on your machine.

If a version number appears, Node.js has been installed successfully.

---

# Running JavaScript with Node.js

After installing Node.js, you can execute JavaScript directly from the terminal.

Start the Node.js REPL:

```bash
node
```

Then write JavaScript:

```js
2 + 3
```

Output:

```text
5
```

You can also use:

```js
console.log("Hello from Node.js");
```

Output:

```text
Hello from Node.js
```

This works because Node.js allows JavaScript to execute outside the browser.

---

# What is npm?

When Node.js is installed, **npm** is also installed automatically.

**npm** stands for:

> **Node Package Manager**

npm is used to manage packages for Node.js projects.

Packages can provide additional functionality that we can use in our applications.

For example, when building a Node.js server, we may need to install packages or libraries.

npm allows us to:

- Install packages
- Remove packages
- Update packages
- Manage project dependencies

---

## Check npm Version

To check the installed npm version:

```bash
npm -v
```

Example:

```text
8.5.0
```

The version number may be different depending on your Node.js installation.

---

# Node.js and npm

When you install Node.js, npm comes with it by default.

```text
Node.js
   │
   ├── V8 JavaScript Engine
   │
   └── npm
         │
         ├── Install Packages
         ├── Remove Packages
         ├── Update Packages
         └── Manage Dependencies
```

---

# Useful Commands

### Check Node.js version

```bash
node -v
```

or:

```bash
node --version
```

### Check npm version

```bash
npm -v
```

### Start Node.js REPL

```bash
node
```

### Exit Node.js REPL

```bash
.exit
```

---

# What is Versioning?

Versioning is a system used to identify different releases of software.

For example:

```text
18.0.0
```

A version usually contains:

```text
Major.Minor.Patch
```

For example:

```text
18.2.5
│  │ │
│  │ └── Patch
│  └──── Minor
└─────── Major
```

The video introduces **versioning and even/odd versioning**, which will be useful when understanding different Node.js releases.

---

# Important Points

1. Download Node.js from the official Node.js website.
2. **LTS** means Long Term Support.
3. LTS is the recommended version for most users.
4. Current releases contain newer features.
5. Node.js can execute JavaScript outside the browser.
6. `node -v` checks the Node.js version.
7. npm is installed automatically with Node.js.
8. npm stands for **Node Package Manager**.
9. `npm -v` checks the npm version.
10. npm is used to manage packages and dependencies.

---

# Quick Revision

### What does LTS mean?

**Long Term Support.**

### Which Node.js version should most users install?

**LTS.**

### How do you check the Node.js version?

```bash
node -v
```

### How do you check the npm version?

```bash
npm -v
```

### What is npm?

**npm (Node Package Manager)** is used to install and manage packages and dependencies in Node.js projects.

### Does npm come with Node.js?

Yes. npm is installed automatically with Node.js.

### How do you start the Node.js REPL?

```bash
node
```

---

# Complete Setup Flow

```text
Go to nodejs.org
       ↓
Choose LTS
       ↓
Download Node.js
       ↓
Run Installer
       ↓
Complete Installation
       ↓
Open Terminal
       ↓
node -v
       ↓
npm -v
       ↓
Node.js Setup Complete
```

---

## Key Takeaway

> **Install the LTS version of Node.js for stable development. After installation, use `node -v` and `npm -v` to verify that Node.js and npm are correctly installed.**

---

## Video

**Topic:** How to Install and Setup Node.js  
**Playlist:** Master NodeJS  
**Status:** ✅ Completed