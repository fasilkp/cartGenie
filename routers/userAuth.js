import express from "express"
import { getChanegPassword, getForgotPassVerify, getForgotPassword, getUserLogin, getUserSignup, getVerifyEmail } from "../controllers/userAuthController.js"
const router = express.Router()

router.get("/login", getUserLogin)
router.get("/signup", getUserSignup)
router.get("/verify-email", getVerifyEmail)
router.get("/forgot-password", getForgotPassword)
router.get("/forgot-pass-verify", getForgotPassVerify)
router.get("/change-password", getChanegPassword)

export default router