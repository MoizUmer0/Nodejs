const {getUser} = require("../service/Auth")

function checkAuthentication(req,res,next){
    const tokenCookie = req.cookies?.token
    req.user =null
    if(!tokenCookie) return next()
    
    
    const token =tokenCookie
    const user = getUser(token)
    
    
    req.user =user
    next()

}
function restrictTo(roles =[]){
    return function(req,res,next){
                console.log("REQ.USER:", req.user);
        console.log("USER ROLE:", req.user?.role);
        console.log("ALLOWED ROLES:", roles);
        if(!req.user) return res.redirect("/login")

        if(!roles.includes(req.user.role)) return res.end("UnAuthorized")
            
        next()
    }
}
// async function restrictToLoginUserOnly(req,res,next) {
//     // const userUid = req.cookies?.uid
//     const userUid = req.headers["authorization"]

//     if(!userUid) return res.redirect("/login")
//         const token  = userUid.split("Bearer ",[1])
//         const  user = getUser(userUid)
//     if(!user) return res.redirect("/login")

//      req.user =user
//      next()   

// }

// async function checkAuth(req,res,next) {
//     // const userUid = req.cookies?.uid
//     const userUid = req.headers["authorization"]
//     const token  = userUid.split("Bearer ",[1])
  
//         const  user = getUser(userUid)
  

//      req.user =user
//      next() 
// }
module.exports ={
    checkAuthentication,
    restrictTo
}