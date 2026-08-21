# NPM Package Versioning

This project contains notes and examples about **NPM package versioning** and **Semantic Versioning (SemVer)** while learning Node.js and Express.js.

---

## 📌 What is Versioning?

When we install an NPM package, its version is usually written in this format:

```text
4.18.2

│  │  │
│  │  └── Patch
│  └───── Minor
└──────── Major
```

For example:

```json
"express": "^4.18.2"
```

The version has three parts:

- **Major** → `4`
- **Minor** → `18`
- **Patch** → `2`

---

## 🔢 Semantic Versioning

Semantic Versioning follows the format:

```text
MAJOR.MINOR.PATCH
```

### 1. Major Version

Example:

```text
4.18.2 → 5.0.0
```

A major version can contain **breaking changes**.

This means existing code may stop working after upgrading.

```text
4.x.x → 5.x.x
```

⚠️ Be careful when upgrading the major version of an existing project.

---

### 2. Minor Version

Example:

```text
4.17.2 → 4.18.0
```

Minor versions generally introduce:

- New features
- Improvements
- Functionality updates

while maintaining backward compatibility.

---

### 3. Patch Version

Example:

```text
4.18.1 → 4.18.2
```

Patch versions generally contain:

- Bug fixes
- Security fixes
- Small corrections

---

# ^ Caret Symbol

Example:

```json
"express": "^4.18.2"
```

The `^` allows compatible updates while keeping the **major version** unchanged.

Conceptually:

```text
^4.18.2

4.x.x  ✅
5.x.x  ❌
```

For example, newer compatible versions within the `4` major release may be installed.

---

# ~ Tilde Symbol

Example:

```json
"express": "~4.18.2"
```

The `~` is more restrictive and generally allows **patch-level updates**.

```text
4.18.2
4.18.3
4.18.4
```

But it does not normally move to:

```text
4.19.0
```

### Difference

```text
^4.18.2 → Compatible updates within Major 4

~4.18.2 → Patch updates within 4.18
```

---

# Exact Version

If we write:

```json
"express": "4.18.2"
```

npm will use the specified version instead of using a version range.

```text
4.18.2
```

---

# 📊 Versioning Quick Reference

| Version | Meaning |
|---|---|
| `4.18.2` | Exact version |
| `^4.18.2` | Compatible updates within Major 4 |
| `~4.18.2` | Patch updates within 4.18 |
| `4.x` | Versions within Major 4 |
| `latest` | Latest published version |

---

# 📦 Installing NPM Packages

### Install Latest Version

```bash
npm install express
```

### Install a Specific Version

```bash
npm install express@4.18.2
```

### Install Express 5

```bash
npm install express@5.2.1
```

### Uninstall a Package

```bash
npm uninstall express
```

---

# ⚠️ Why Versioning is Important

Versioning is important because updating a package can introduce:

- Breaking changes
- New features
- Bug fixes
- Security fixes
- Changes in existing APIs

For an existing project, blindly installing the latest version can sometimes break existing code.

Before making a major upgrade, it is important to check the package's:

- Release notes
- Documentation
- Breaking changes
- Known issues

---

# 🧠 Simple Way to Remember

```text
4.18.2

│  │  │
│  │  └── PATCH → Bug/Security fixes
│  └───── MINOR → Features/Improvements
└──────── MAJOR → Possible Breaking Changes
```

### Symbols

```text
^4.18.2

└── Keep Major Version 4,
    allow compatible updates
```

```text
~4.18.2

└── Keep Major and Minor versions,
    allow patch updates
```

---

# 🎯 Key Takeaways

1. NPM package versions commonly follow **Semantic Versioning**.
2. A version has three parts: **Major.Minor.Patch**.
3. **Major** releases can contain breaking changes.
4. **Minor** releases generally add features and improvements.
5. **Patch** releases generally fix bugs and security issues.
6. `^` allows compatible updates within the major version.
7. `~` allows more limited patch updates.
8. An exact version such as `4.18.2` specifies a particular version.
9. Always be careful when upgrading dependencies in an existing project.