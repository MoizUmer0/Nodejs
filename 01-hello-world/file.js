const { error } = require('console');
const fs= require('fs');
const os = require("os")

console.log(os.cpus().length)
// sync
// fs.writeFileSync('./text.txt',"hey there")
// const results = fs.readFileSync("./contact.txt","utf-8")    
// console.log(results)


// Async
// fs.writeFile("./text.txt","heLLO there", (err)=>{})
// fs.readFile("./contact.txt","utf-8",(err,result) =>{
//     if(err) console.log("Error",err)
//     else console.log(result)    
// })


// const results = fs.readFileSync("./contact.txt","utf-8")    
// console.log(results)

// fs.appendFileSync("./text.txt",new Date().getDate().toLocaleString())
