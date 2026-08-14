const http = require("http")
const os = require("os")
const fs =require("fs")
const myServer = http.createServer((req,res)=>{
    const log=`${new Date().getDate().toLocaleString()}:${req.url} nEW REQUEST rECIVED\n`
    fs.appendFile(" log.txt",log,(err,result)=>{
       switch(req.url){
        case"/":
        res.end("homepage")
        break;
        case"/about":
        res.end("This is the about page")
        break;
        default:
            res.end("404 Not Found")
       }
    })
    // console.log(req.socket.remoteAddress)
  
});

myServer.listen(8000, "0.0.0.0",()=>{
   
    console.log("server started")
//     console.log(networkinterfaces)
})