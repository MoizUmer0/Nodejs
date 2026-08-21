const express = require("express")
const {connectMongoDB} = require("./connection")
const {checkAuthentication,restrictTo} = require("./middleware/auth")
const cookieParser = require("cookie-parser")
const urls = require("./model/url")
const path = require("path")

const UrlRouter = require("./routers/Url")
const staticRouter = require("./routers/staticRouter");
const UserRouter = require("./routers/User")

const app = express()
const {handleVisitingHistory,handleGetAnalytics} = require("./controllers/url")
const Port = 8000

connectMongoDB("mongodb://127.0.0.1:27017/Short-url")
.then(()=> console.log("MongoDB connected"))
app.set("views", path.resolve("./view"))
app.set("view engine", "ejs")

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())
app.use(checkAuthentication)

app.use("/",staticRouter)
app.use('/url',restrictTo(["NORMAL","ADMIN"]),UrlRouter)
app.use('/user',UserRouter)
app.use("/analytics/:shortId",handleGetAnalytics)
app.use('/:shortId',handleVisitingHistory)



app.listen(Port,()=>console.log(`Server started at port ${Port}`))