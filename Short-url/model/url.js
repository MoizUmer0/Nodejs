const mongoose = require("mongoose")

const urlSchema = new mongoose.Schema({
    shortId: {
     type: String,
    required: true,
    unique: true
    },
    redirectURL: {
     type: String,
    required: true,
    },
    visitHistory:[{timestamps:{type:Number}}],

createdBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User"
}
},{timestamp:true})

const Url = mongoose.model("Url",urlSchema)

module.exports=Url