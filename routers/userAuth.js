import express from "express"
import { getUserLogin, getUserSignup } from "../controllers/userAuthController.js"
const router = express.Router()

router.get("/login", getUserLogin)
router.get("/signup", getUserSignup)

export default router