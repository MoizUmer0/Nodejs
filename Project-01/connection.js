const mongoose = require("mongoose")


async function connectMonogoDb(url){
    return mongoose.connect(url)
}

module.exports ={
    connectMonogoDb,
};