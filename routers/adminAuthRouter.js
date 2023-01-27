import express from "express"
import { getAdminLogin, adminLogin, adminLogout } from "../controllers/adminAuthController.js"
const router = express.Router()

router.get("/login", getAdminLogin)
router.post("/login", adminLogin)
router.get("/logout", adminLogout)

export default router