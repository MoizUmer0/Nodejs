const jwt = require('jsonwebtoken')
const secret = "$uperMan@123"

function createTokenForUser(user){
    return jwt.sign({
        _id: user._id,
        fullName: user.fullName,
        email:user.email,
        profileImageURL:user.profileImageURL,
        role: user.role
    },secret)
}
function validateToken(token){
    if(!token) return null
    return jwt.verify(token,secret)
}

module.exports ={
    createTokenForUser,
    validateToken
}