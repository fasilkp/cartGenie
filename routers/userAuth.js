import express from "express"
import { changePassword, forgotPasswordEmail, forgotPasswordVerify, forgotResendOTP,  getForgotPassVerify, getForgotPassword, getUserLogin, getUserSignup, getVerifyEmail, userLogin, userLogout, userSignup, verifyEmail } from "../controllers/userAuthController.js"
const router = express.Router()

router.get("/login", getUserLogin)
router.get("/signup", getUserSignup)
router.get("/verify-email", getVerifyEmail)
router.get("/forgot-password", getForgotPassword)
router.get("/forgot-pass-verify", getForgotPassVerify)


router.post("/signup", userSignup)
router.post("/verifyEmail", verifyEmail)
router.post("/login", userLogin)
router.post("/forgot-password-email", forgotPasswordEmail)
router.post("/forgot-password-verify", forgotPasswordVerify)
router.get("/resend-otp", forgotResendOTP)
router.post("/change-password", changePassword)
router.get("/logout", userLogout)


export default router