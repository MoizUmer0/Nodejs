const express = require('express');
const cookieParser = require("cookie-parser")
const path = require("path")
const {connectMongoDB} = require("./connection")


const userRouter = require("./routes/user");
const blogRouter = require("./routes/blog");
const { CheckForAuthenticationCookie } = require('./middleware/auth');
const Blog = require('./models/blog');

const app =express()
const Port = 8000;

connectMongoDB('mongodb://127.0.0.1:27017/Youtube-Blog')
.then(()=> console.log("MongoDB connected"))

app.set('view engine','ejs')
app.set('views',path.resolve('./views'))
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(express.json());

app.use(CheckForAuthenticationCookie("token"))
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
})

app.get('/',async(req,res)=>{
    const allBlogs = await Blog.find({})
    return res.render("home",{
        user:req.user,
        blogs:allBlogs
    })
})

app.use("/user",userRouter)
app.use("/blog",blogRouter)

app.listen(Port,()=>console.log(`Server started at Port: ${Port}`))
