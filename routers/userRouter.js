import express from "express"
const router = express.Router()

router.get("/g", (req, res)=>{
    res.render("user/login")
})

export default router