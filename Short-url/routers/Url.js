const express = require("express")
const {handleGenerateNewShortURl,handleVisitingHistory,handleGetAnalytics} = require("../controllers/url")
const router = express.Router()


router.post("/",handleGenerateNewShortURl)
router.get("/:shortId",handleVisitingHistory)
router.get("/analytics/:shortId",handleGetAnalytics)

module.exports =router