import express from "express"
import { getAdminLogin, adminLogin, adminLogout } from "../controllers/adminAuthController.js"
import verifyNotAdmin from "../middlewares/verifyNotAdmin.js"
const router = express.Router()


router.use(function(req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});

router.get("/login",verifyNotAdmin, getAdminLogin)
router.post("/login",verifyNotAdmin, adminLogin)
router.get("/logout", adminLogout)

export default router