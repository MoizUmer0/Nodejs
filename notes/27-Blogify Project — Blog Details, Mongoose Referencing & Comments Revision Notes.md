# Blogify Project — Final Features & Revision Notes

## 1. Blog Details Page

Previously, the home page listed all blogs, but clicking **View Blog** did not show the individual blog.

We create a dynamic route:

```js
router.get("/blog/:id", async (req, res) => {
  // fetch blog
  // render blog.ejs
});
```

### Dynamic ID

The blog ID comes from:

```js
req.params.id
```

For example:

```txt
/blog/64abc123
```

Then:

```js
req.params.id
```

gives:

```txt
64abc123
```

---

# 2. Fetching a Particular Blog

Use the ID to find the blog:

```js
const blog = await Blog.findById(req.params.id);
```

Then pass it to EJS:

```js
return res.render("blog", {
  blog,
});
```

Now `blog` becomes available inside `blog.ejs`.

---

# 3. Blog EJS Page

The blog page displays:

- Blog title
- Cover image
- Blog body
- Blog creator
- Comments
- Comment form

Example:

```ejs
<h1><%= blog.title %></h1>

<img src="<%= blog.coverImageURL %>" width="700px" />

<p><%= blog.body %></p>
```

## `<%= %>` in EJS

```ejs
<%= blog.title %>
```

means:

> Get the value of `blog.title` and render it as HTML text.

---

# 4. `<pre>` for Blog Content

Blog content can contain spaces and line breaks.

Using:

```html
<p>
```

may remove the original formatting.

Instead:

```html
<pre>
  <%= blog.body %>
</pre>
```

`<pre>` preserves:

- Spaces
- Line breaks
- Formatting

Useful when displaying text-based blog content.

---

# 5. Displaying Blog Creator

The Blog model has something like:

```js
createdBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "user"
}
```

Initially, `createdBy` contains only an ObjectId:

```js
createdBy: ObjectId("...")
```

But we want:

```js
createdBy.fullName
createdBy.profileImageURL
```

This is where **Mongoose populate** is used.

---

# 6. Mongoose `populate()`

Example:

```js
const blog = await Blog.findById(req.params.id)
  .populate("createdBy");
```

Because the schema contains:

```js
ref: "user"
```

Mongoose knows that `createdBy` refers to the User collection.

Instead of:

```js
createdBy: ObjectId("123...")
```

we get the complete user object:

```js
createdBy: {
  fullName: "Piyush Garg",
  profileImageURL: "...",
  email: "...",
  ...
}
```

Now EJS can use:

```ejs
<img src="<%= blog.createdBy.profileImageURL %>" width="50px">

<%= blog.createdBy.fullName %>
```

### Important Concept

```txt
ObjectId
   ↓
populate()
   ↓
Referenced MongoDB document
```

---

# 7. Why `ref` Is Important

Example:

```js
createdBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "user"
}
```

`ref` tells Mongoose:

> This ObjectId belongs to a document from the User model.

Without the correct `ref`, Mongoose cannot properly populate the relationship.

---

# 8. Comment Model

Now we add comments to blogs.

Create:

```txt
models/comment.js
```

A comment needs three important relationships/data fields:

```js
const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },

  blogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "blog"
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  }
}, {
  timestamps: true
});
```

Then:

```js
const Comment = mongoose.model("comment", commentSchema);

module.exports = Comment;
```

---

# 9. Comment Data Relationship

A comment belongs to:

### A User

```js
createdBy
```

and

### A Blog

```js
blogId
```

Conceptually:

```txt
User
 │
 │ createdBy
 ▼
Comment
 │
 │ blogId
 ▼
Blog
```

This allows us to know:

> Who wrote this comment?

and:

> Which blog does this comment belong to?

---

# 10. Comment Route

Create a POST route:

```js
router.post("/blog/:blogId/comment", async (req, res) => {
  
});
```

The URL contains the blog ID:

```txt
/blog/:blogId/comment
```

Example:

```txt
/blog/64abc123/comment
```

Then:

```js
req.params.blogId
```

gives the current blog's ID.

---

# 11. Creating a Comment

The comment is created using:

```js
const comment = await Comment.create({
  content: req.body.content,
  blogId: req.params.blogId,
  createdBy: req.user._id
});
```

### Where does each value come from?

| Field | Source |
|---|---|
| `content` | `req.body.content` |
| `blogId` | `req.params.blogId` |
| `createdBy` | `req.user._id` |

---

# 12. `req.body` vs `req.params`

This is very important.

## `req.body`

Used for data sent inside the request body.

Example:

```js
req.body.content
```

For a form:

```html
<input name="content">
```

the value is available through:

```js
req.body.content
```

---

## `req.params`

Used for dynamic values inside the URL.

Example:

```txt
/blog/123/comment
```

Route:

```js
/blog/:blogId/comment
```

Then:

```js
req.params.blogId
```

returns:

```txt
123
```

---

# 13. Redirect After Creating Comment

After creating the comment:

```js
return res.redirect(`/blog/${req.params.blogId}`);
```

This sends the user back to the same blog page.

Flow:

```txt
Submit Comment
      ↓
POST /blog/:blogId/comment
      ↓
Create Comment
      ↓
Redirect
      ↓
/blog/:blogId
      ↓
Blog page loads again
```

---

# 14. Comment Form in EJS

On `blog.ejs`:

```ejs
<form method="POST" action="/blog/<%= blog._id %>/comment">

  <input
    type="text"
    name="content"
    placeholder="Enter your comment"
  >

  <button type="submit">
    Add
  </button>

</form>
```

The important parts are:

```html
method="POST"
```

and:

```html
name="content"
```

The `name` becomes the key inside:

```js
req.body
```

Therefore:

```html
name="content"
```

becomes:

```js
req.body.content
```

---

# 15. Only Logged-In Users Can Comment

The comment form should only appear when a user is logged in.

Use:

```ejs
<% if (locals.user) { %>

  <!-- Comment form -->

<% } %>
```

This means:

> If `user` exists in EJS locals, show the comment form.

If the user is logged out:

```js
locals.user
```

does not exist, so the form is hidden.

---

# 16. What Is `locals` in EJS?

EJS receives variables from the server.

For example:

```js
res.render("blog", {
  blog,
  user
});
```

Those values become available to the EJS template.

EJS stores them inside its local variables object.

You can safely check:

```ejs
<% if (locals.user) { %>
```

This prevents an error if `user` was not passed.

---

# 17. Why Use `locals.user`?

Suppose the backend does not send:

```js
user
```

and you write:

```ejs
<% if (user) { %>
```

EJS may produce:

```txt
user is not defined
```

Using:

```ejs
<% if (locals.user) { %>
```

allows you to safely check whether the variable exists.

---

# 18. Comments Should Be Visible to Everyone

Important distinction:

### Logged-in users

Can:

- See comments
- Add comments

### Logged-out users

Can:

- See comments
- Cannot add comments

Therefore, only the **comment form** should be inside:

```ejs
<% if (locals.user) { %>
```

The comments themselves should be outside it.

---

# 19. Fetching Comments

When fetching a particular blog:

```js
const comments = await Comment.find({
  blogId: req.params.id
})
.populate("createdBy");
```

This finds all comments where:

```js
blogId === current blog ID
```

and populates the user who created each comment.

---

# 20. Send Comments to EJS

Render:

```js
return res.render("blog", {
  blog,
  comments
});
```

Now the EJS file can access:

```ejs
comments
```

---

# 21. Display Comments Using EJS Loop

Use:

```ejs
<% comments.forEach(comment => { %>

  <div>
    <img
      src="<%= comment.createdBy.profileImageURL %>"
      width="50px"
    >

    <strong>
      <%= comment.createdBy.fullName %>
    </strong>

    <p>
      <%= comment.content %>
    </p>
  </div>

<% }) %>
```

This loops over every comment.

---

# 22. EJS Loop Syntax

### JavaScript code

```ejs
<% comments.forEach(comment => { %>
```

### Display a value

```ejs
<%= comment.content %>
```

### Close the loop

```ejs
<% }) %>
```

Remember:

```txt
<%  → Execute JavaScript
<%= → Execute + print value
```

---

# 23. Display Number of Comments

You can display the number of comments using:

```ejs
Comments <%= comments.length %>
```

For example:

```txt
Comments 3
```

if the array contains three comments.

---

# 24. Complete Blog Request Flow

When someone visits:

```txt
/blog/64abc123
```

the backend performs:

```txt
Request
  ↓
Get blog ID from req.params.id
  ↓
Find Blog
  ↓
populate("createdBy")
  ↓
Find Comments using blogId
  ↓
populate("createdBy")
  ↓
Send blog + comments to EJS
  ↓
Render blog.ejs
```

---

# 25. Complete Comment Flow

When a logged-in user submits a comment:

```txt
Comment Form
     ↓
POST /blog/:blogId/comment
     ↓
req.body.content
     ↓
req.params.blogId
     ↓
req.user._id
     ↓
Comment.create()
     ↓
Comment stored in MongoDB
     ↓
Redirect to blog
     ↓
Comments fetched again
     ↓
New comment displayed
```

---

# 26. MongoDB Relationships

This project demonstrates an important MongoDB/Mongoose concept:

## Referencing

Instead of storing the complete user object inside every blog/comment, we store the user's ObjectId.

Example:

```js
createdBy: ObjectId("...")
```

Then Mongoose can retrieve the user using:

```js
.populate("createdBy")
```

---

# 27. Blog → User Relationship

Blog:

```js
createdBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "user"
}
```

Query:

```js
Blog.findById(id).populate("createdBy");
```

Result:

```txt
Blog
 └── createdBy
      ├── fullName
      ├── profileImageURL
      └── email
```

---

# 28. Comment → User Relationship

Comment:

```js
createdBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "user"
}
```

Query:

```js
Comment.find().populate("createdBy");
```

Result:

```txt
Comment
 └── createdBy
      ├── fullName
      └── profileImageURL
```

---

# 29. Comment → Blog Relationship

Comment:

```js
blogId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "blog"
}
```

This tells us which blog the comment belongs to.

Example:

```txt
Blog A
 ├── Comment 1
 ├── Comment 2
 └── Comment 3

Blog B
 ├── Comment 4
 └── Comment 5
```

The `blogId` separates the comments.

---

# 30. Bootstrap Blog Cards

To display multiple blog cards in a row, Bootstrap's grid system can be used.

Example:

```html
<div class="row row-cols-4">
```

Each blog can be placed inside:

```html
<div class="col">
```

Concept:

```txt
Row
 ├── Column
 ├── Column
 ├── Column
 └── Column
```

This allows four cards per row.

---

# 31. Important EJS Concepts From This Video

### Print a variable

```ejs
<%= variable %>
```

### Execute JavaScript

```ejs
<% JavaScript %>
```

### Conditional rendering

```ejs
<% if (locals.user) { %>
  ...
<% } %>
```

### Loop

```ejs
<% comments.forEach(comment => { %>
  ...
<% }) %>
```

### Array length

```ejs
<%= comments.length %>
```

---

# 32. Important Express Concepts

### URL parameters

```js
req.params.id
```

### Request body

```js
req.body.content
```

### Logged-in user

```js
req.user
```

### Redirect

```js
res.redirect(`/blog/${id}`);
```

### Render EJS

```js
res.render("blog", {
  blog,
  comments
});
```

---

# 33. Important Mongoose Concepts

### Find one document

```js
Blog.findById(id)
```

### Find multiple documents

```js
Comment.find({
  blogId: id
})
```

### Create document

```js
Comment.create({
  content,
  blogId,
  createdBy
})
```

### Populate referenced document

```js
.populate("createdBy")
```

### ObjectId reference

```js
{
  type: mongoose.Schema.Types.ObjectId,
  ref: "user"
}
```

---

# 34. The Most Important Concept: `populate()`

Remember this pattern:

```js
createdBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "user"
}
```

Then:

```js
.populate("createdBy")
```

Think of it as:

```txt
ObjectId
   ↓
Reference
   ↓
populate()
   ↓
Actual document
```

Without populate:

```js
blog.createdBy
```

might be:

```txt
ObjectId("...")
```

With populate:

```js
blog.createdBy.fullName
```

works because `createdBy` is now the user document.

---

# 35. Final Architecture

The project now contains:

```txt
User
 │
 ├──────────────┐
 │              │
 ▼              ▼
Blog          Comment
 │              │
 │              │
 └───────┬──────┘
         │
       User
```

More specifically:

```txt
User
 │
 ├── creates Blog
 │
 └── creates Comment

Blog
 │
 └── has many Comments

Comment
 │
 ├── belongs to User
 └── belongs to Blog
```

---

# 36. What You Learned From This Project

## Authentication

- User signup
- User signin
- Password hashing
- Login/logout
- Authentication middleware

## MongoDB / Mongoose

- Schemas
- Models
- CRUD operations
- ObjectId
- References
- `populate()`
- Relationships between collections

## Express

- Routes
- Dynamic routes
- `req.params`
- `req.body`
- Middleware
- Redirects
- Rendering views

## EJS

- Variables
- Conditions
- Loops
- `locals`
- Dynamic rendering

## Blog Functionality

- Create blogs
- List blogs
- View individual blog
- Show blog author
- Add comments
- Display comments
- Count comments
- Restrict commenting to authenticated users

---

# 37. Quick Revision Cheat Sheet

```js
// Get URL parameter
req.params.id

// Get form data
req.body.content

// Get logged-in user
req.user

// Find blog
Blog.findById(id)

// Find comments
Comment.find({ blogId: id })

// Create comment
Comment.create({
  content,
  blogId,
  createdBy
})

// Populate user
.populate("createdBy")

// Render EJS
res.render("blog", {
  blog,
  comments
})

// Redirect
res.redirect(`/blog/${id}`)
```

### EJS

```ejs
<%= value %>
```

Print value.

```ejs
<% code %>
```

Execute code.

```ejs
<% if (locals.user) { %>
```

Check whether user exists.

```ejs
<% comments.forEach(comment => { %>
```

Loop through comments.

```ejs
<%= comments.length %>
```

Count comments.

---

# 38. Final Mental Model

Whenever you build a feature like comments, think in this order:

```txt
1. MODEL
   ↓
What data needs to be stored?

2. ROUTE
   ↓
What URL and HTTP method will handle it?

3. CONTROLLER / LOGIC
   ↓
How will the data be created/fetched?

4. DATABASE
   ↓
Where is the data stored?

5. EJS / FRONTEND
   ↓
How will the data be displayed?

6. AUTHENTICATION
   ↓
Who is allowed to perform the action?
```

For comments:

```txt
Comment Model
     ↓
POST /blog/:blogId/comment
     ↓
Comment.create()
     ↓
MongoDB
     ↓
Redirect to blog
     ↓
Fetch comments
     ↓
populate("createdBy")
     ↓
EJS displays comments
```

**This is the core architecture to remember.**