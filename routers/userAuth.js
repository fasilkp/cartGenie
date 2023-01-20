import express from "express"
import { getForgotPassword, getUserLogin, getUserSignup, getVerifyEmail } from "../controllers/userAuthController.js"
const router = express.Router()

router.get("/login", getUserLogin)
router.get("/signup", getUserSignup)
router.get("/verify-email", getVerifyEmail)
router.get("/forgot-password", getForgotPassword)

export default router