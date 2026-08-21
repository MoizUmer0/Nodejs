const mongoose = require("mongoose")
const {createHmac,randomBytes} = require("crypto");
const {createTokenForUser} = require("../services/auth")
const  userSchema = mongoose.Schema({
    fullName:{
        type: String,
        required:true
    },
    email:{
        type: String,
        required: true,
        unique:true
    },
    salt:{
        type:String,
       
    },
    password:{
        type:String,
        required:true,
    },
    profileImageURL:{
        type:String,
        default:'/images/profile avatar.png'
    },
    role:{
        type:String,
        enum:["USER","ADMIN"],
        default:"USER",
    }
},{timestamps:true})

userSchema.pre('save',function(){
    const user =this

    if(!user.isModified("password")) return 
    const salt = randomBytes(16).toString('hex')
    const hashPassword =createHmac('sha256',salt)
    .update(user.password)
    .digest('hex')

    this.salt =salt
    this.password =hashPassword

})

userSchema.statics.matchPasswordAndGenerateToken = async function(email,password){
    const user = await this.findOne({email})
    if(!user)  throw new Error('User Not Found') 
    const salt = user.salt
    const hashPassword = user.password

    const userProvidedHash = createHmac('sha256',salt)
    .update(password)
    .digest('hex')

    if(hashPassword !==userProvidedHash)throw new Error('Incorrect Password') 
        
     const token = createTokenForUser(user)   
    return token
} 

const User = mongoose.model("User",userSchema)

module.exports = User
