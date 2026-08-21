# Authorization in Node.js & Express

## Authentication vs Authorization

Authentication and authorization are two different concepts:

### Authentication
**Authentication** means verifying **who the user is**.

For example:
- User logs in with email/password.
- Server verifies the credentials.
- Server generates a token/session.
- The user is now an **authenticated user**.

> **Authentication = Who are you?**

### Authorization
**Authorization** means checking **what an authenticated user is allowed to access**.

For example, a normal user may access their own URLs, while an admin can access URLs created by all users.

> **Authorization = What are you allowed to access?**

### Simple Example

Imagine a club:

- Your membership card proves **who you are** → Authentication.
- Being allowed to enter the members-only area proves **what you can access** → Authorization.
- Being denied entry to the admin-only area means you are authenticated but **not authorized**.

---

## Refactoring Authentication Middleware

Instead of repeating authentication logic in multiple places, create a reusable middleware function.

```js
function checkForAuthentication(req, res, next) {
    const authorizationHeaderValue = req.headers["authorization"];

    if (!authorizationHeaderValue) {
        return next();
    }

    if (!authorizationHeaderValue.startsWith("Bearer")) {
        return next();
    }

    const token = authorizationHeaderValue.split("Bearer ")[1];

    const user = getUser(token);

    if (!user) {
        return next();
    }

    req.user = user;

    return next();
}
```

The main responsibility of this middleware is:

1. Read the `Authorization` header.
2. Check whether a Bearer token exists.
3. Extract the token.
4. Validate the token.
5. Get the user associated with the token.
6. Attach the user to `req.user`.
7. Continue to the next middleware.

This keeps the authentication logic in one place.

---

## Why Middleware Refactoring Is Useful

Without refactoring, the same authentication code may be repeated across multiple routes.

That creates:

- Duplicate code
- Harder maintenance
- More chances for bugs
- Difficult updates

With middleware:

```js
app.use(checkForAuthentication);
```

Authentication can be checked automatically for incoming requests.

---

# Creating Authorization Middleware

Authentication alone does not determine whether a user can access a particular resource.

For authorization, we can create another middleware called `restrictTo`.

```js
function restrictTo(roles) {
    return function (req, res, next) {

        if (!req.user) {
            return res.redirect("/login");
        }

        if (!roles.includes(req.user.role)) {
            return res.end("Unauthorized");
        }

        return next();
    };
}
```

The important point here is that `restrictTo()` receives an array of allowed roles.

For example:

```js
restrictTo(["NORMAL"])
```

or:

```js
restrictTo(["ADMIN"])
```

or:

```js
restrictTo(["NORMAL", "ADMIN"])
```

This allows the same middleware to be reused for different routes.

---

# Adding Roles to the User Model

To implement role-based authorization, add a `role` field to the user schema.

```js
role: {
    type: String,
    required: true,
    default: "NORMAL"
}
```

Now every newly created user will automatically receive:

```text
role: "NORMAL"
```

unless another role is explicitly provided.

For example:

```js
{
    name: "John",
    email: "john@example.com",
    role: "NORMAL"
}
```

An administrator could have:

```js
{
    name: "Admin",
    email: "admin@example.com",
    role: "ADMIN"
}
```

---

# Applying Authorization to Routes

Authentication can be applied globally:

```js
app.use(checkForAuthentication);
```

Then individual routes can have their own authorization requirements.

For example:

```js
router.get(
    "/url",
    restrictTo(["NORMAL"]),
    handleGetAllURLs
);
```

The request flow becomes:

```text
Request
   ↓
Authentication Middleware
   ↓
Is user logged in?
   ↓
Yes
   ↓
Authorization Middleware
   ↓
Does user's role have permission?
   ↓
Yes
   ↓
Route Handler
```

---

# Important Difference

A user can be:

```text
Authenticated ✅
Authorized ❌
```

For example:

A normal user successfully logs in, so they are authenticated.

But if they try to access an admin-only route:

```text
Authenticated → Yes
Role → NORMAL
Required Role → ADMIN
Authorization → Failed
```

Therefore, the server should reject the request.

---

# Authorization Header and Cookies

Initially, authentication may be implemented using an `Authorization` header:

```http
Authorization: Bearer <token>
```

The middleware extracts the token:

```js
const token = authorizationHeaderValue.split("Bearer ")[1];
```

Later, if authentication is changed to use cookies, the middleware can be updated to read the token from the cookie instead.

For example:

```js
const token = req.cookies?.token;

if (!token) {
    return next();
}
```

The benefit of separating authentication into its own middleware is that the rest of the application does not need to care where the token comes from.

---

# Adding the Role to the Token

When generating a token, the user's role should also be included.

For example:

```js
const token = jwt.sign(
    {
        _id: user._id,
        email: user.email,
        role: user.role
    },
    secret
);
```

Now the decoded user information can contain:

```js
{
    _id: "...",
    email: "user@example.com",
    role: "NORMAL"
}
```

This allows authorization middleware to check the user's role.

---

# Database Migration

If the `role` field is added after users already exist in MongoDB, the existing documents will not automatically contain the new field.

A simple migration can be performed:

```js
db.users.updateMany(
    {},
    {
        $set: {
            role: "NORMAL"
        }
    }
);
```

Now existing users will have:

```text
role: "NORMAL"
```

An administrator can then be updated manually:

```js
db.users.updateOne(
    { email: "admin@example.com" },
    {
        $set: {
            role: "ADMIN"
        }
    }
);
```

---

# Why the Token Must Be Regenerated

If the user's role changes in the database from:

```text
NORMAL
```

to:

```text
ADMIN
```

an already-issued token may still contain the old role.

Therefore, the user should log out and log in again so that a new token is generated with the updated role.

```text
Database
NORMAL → ADMIN
       ↓
Old Token → NORMAL
       ↓
Logout
       ↓
Login
       ↓
New Token → ADMIN
```

---

# Example: Admin-Only Route

Suppose we want an admin-only route that returns all URLs:

```js
router.get(
    "/admin/urls",
    restrictTo(["ADMIN"]),
    async (req, res) => {
        const urls = await URL.find({});

        return res.render("home", {
            urls
        });
    }
);
```

A normal user attempting to access this route receives:

```text
Unauthorized
```

An admin can access the route successfully.

---

# Multiple Roles

Real-world applications usually have more than two roles.

For example:

```text
NORMAL
MODERATOR
ADMIN
SUPER_ADMIN
```

The same middleware can support multiple roles:

```js
restrictTo(["ADMIN", "SUPER_ADMIN"])
```

This means both administrators and super administrators can access the route.

Another route might allow:

```js
restrictTo(["NORMAL", "ADMIN"])
```

The authorization middleware becomes reusable across the entire application.

---

# Authentication vs Authorization Summary

| Authentication | Authorization |
|---|---|
| Identifies the user | Checks permissions |
| Login-related | Access-control-related |
| Verifies identity | Verifies allowed actions |
| Uses credentials/token/session | Usually uses roles/permissions |
| **Who are you?** | **What can you access?** |

---

# Request Flow

A typical application can follow this structure:

```text
Client Request
      ↓
Authentication Middleware
      ↓
Validate Token / Cookie
      ↓
Find User
      ↓
req.user = user
      ↓
Authorization Middleware
      ↓
Check User Role
      ↓
┌───────────────┐
│ Authorized?   │
└───────┬───────┘
        │
    Yes │ No
        │
        ↓
     Route       Unauthorized
     Handler
```

---

# Key Takeaways

- **Authentication** verifies the identity of a user.
- **Authorization** verifies whether that user has permission to access a resource.
- Authentication should be separated into reusable middleware.
- Authorization can be implemented using role-based middleware.
- A user's role can be stored in the database.
- Common roles include `NORMAL`, `ADMIN`, `MODERATOR`, and `SUPER_ADMIN`.
- `req.user` can be used to share authenticated user information with later middleware and route handlers.
- Tokens may contain role information.
- If a user's role changes, a new token may need to be generated.
- Middleware makes authentication and authorization code cleaner and reusable.
- Real-world authorization systems can become much more complex and may use multiple roles and permissions.

## Final Concept

```text
Authentication
     ↓
"Who are you?"
     ↓
User Identity
     ↓
Authorization
     ↓
"What are you allowed to do?"
     ↓
Resource / Route Access
```

This is the basic foundation of **authentication and role-based authorization in Node.js and Express.js**.