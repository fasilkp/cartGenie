import express from "express"
import { getAdminLogin, adminLogin } from "../controllers/adminAuthController.js"
const router = express.Router()

router.get("/login", getAdminLogin)
router.post("/login", adminLogin)

export default router