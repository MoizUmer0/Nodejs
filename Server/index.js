const http = require("http")
const os = require("os")
const fs =require("fs")
const url = require("url");
const express = require("express")
const app = express()

app.get("/",(req,res)=>{
    return res.send("Hello from Home Page")
})

app.get("/about",(req,res)=>{
    return res.send(`Hello ${req.query.name}`)
})
app.listen(8000,()=> console.log("Server Started"))

// const myServer =http.createServer(app)
// const myServer = http.createServer((req,res)=>{
//     if(req.url ==="/favicon.ico") return res.end()
//     const log=`${new Date().getDate().toLocaleString()}:${req.method}${req.url} New Status Required\n`
//     const myUrl = url.parse(req.url,true)
//     console.log(myUrl)
//     fs.appendFile(" log.txt",log,(err,result)=>{
//        switch(myUrl.pathname){
//         case"/":
//         res.end("homepage")
//         break;
//         case"/about":
//         const username = myUrl.query.myname;
//         res.end(`Hi ${username}`)
//         break;
//         case"/signup":
//         if(req.method==='GET') res.end("this is a signup form")
//         else if( req.method ==="POST"){
//         // DB Query
//         res.end("success")
//         }
//         default:
//             res.end("404 Not Found")
//        }
//     })
//     // console.log(req.socket.remoteAddress)
// });

// myServer.listen(8000, "0.0.0.0",()=>{
//     console.log("server started")
// //     console.log(networkinterfaces)
// })