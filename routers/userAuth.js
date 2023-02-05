import express from "express"
import { changePassword, forgotPasswordEmail, forgotPasswordVerify, forgotResendOTP,  getForgotPassVerify, getForgotPassword, getUserLogin, getUserSignup, getVerifyEmail, userLogin, userLogout, userSignup, verifyEmail } from "../controllers/userAuthController.js"
import verifyNotLogin from "../middlewares/verifyNotLogin.js";
const router = express.Router()

router.use(function(req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});

router.get("/logout", userLogout)
router.get("/login",verifyNotLogin, getUserLogin)
router.get("/signup",verifyNotLogin, getUserSignup)
router.get("/verify-email",verifyNotLogin, getVerifyEmail)
router.get("/forgot-password",verifyNotLogin, getForgotPassword)
router.get("/forgot-pass-verify",verifyNotLogin, getForgotPassVerify)


router.post("/signup",verifyNotLogin, userSignup)
router.post("/verifyEmail",verifyNotLogin, verifyEmail)
router.post("/login",verifyNotLogin, userLogin)
router.post("/forgot-password-email",verifyNotLogin, forgotPasswordEmail)
router.post("/forgot-password-verify",verifyNotLogin, forgotPasswordVerify)
router.get("/resend-otp",verifyNotLogin, forgotResendOTP)
router.post("/change-password",verifyNotLogin, changePassword)


export default router