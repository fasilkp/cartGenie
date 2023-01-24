import express from "express"
import { getAdminLogin } from "../controllers/adminAuthController.js"
const router = express.Router()

router.get("/", (req, res)=>{
    res.send("Admin Auth")
})
router.get("/login", getAdminLogin)

export default router