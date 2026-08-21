const express = require("express")
const { model } = require("mongoose")
const {handleUserSignup,handleUserLogin} = require("../controllers/User")

const router = express.Router()


router.post('/',handleUserSignup)
router.post('/login',handleUserLogin)

module.exports = router