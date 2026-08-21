const Url = require("../model/url")
const {nanoid} = require("nanoid")
async function handleGenerateNewShortURl(req,res){
    const body = req.body
    if(!body.url) return res.status(400).json({error: 'url is required'})
    const shortID = nanoid(8)
    await Url.create({
        shortId:shortID,
        redirectURL:body.url,
        visitHistory:[],
        createdBy:req.user._id
    })
    console.log("USER:", req.user)
console.log("USER ID:", req.user?._id)
    return res.redirect('/')
}
async function handleVisitingHistory(req,res) {
        const shortId = req.params.shortId
   const entry =  await Url.findOneAndUpdate({
        shortId
    },{$push:{visitHistory:{
        timestamp: Date.now()
    }}})
        if (!entry) {
        return res.status(404).send("Short URL not found")
    }
    res.redirect(entry.redirectURL)
}
async function handleGetAnalytics(req,res) {
    const shortId = req.params.shortId
    const result = await Url.findOne({shortId})
    return res.json({totalClicks: result.visitHistory.length,
        analytics: result.visitHistory,
    })
}
module.exports ={
    handleGenerateNewShortURl,
    handleVisitingHistory,
    handleGetAnalytics
}