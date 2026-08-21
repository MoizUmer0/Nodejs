const express = require("express")
const {connectMonogoDb} = require("./connection")
const {logReqRes} =require("./middleware/index")
const UserRouter = require('./routers/user')
const app = express()
const Port =8000





// Connecting
connectMonogoDb("mongodb://127.0.0.1:27017/youtube-app-1").then(()=> console.log("MongoDB connected"))
// middleware-plugin
app.use(express.urlencoded({extended:false}))

app.use(logReqRes("log.txt"))

//Routes
app.use('/api/users',UserRouter)

app.listen(Port,()=> console.log(`Server Started at Port ${Port}`))