import express from "express"
import { getAdminOrders } from "../controllers/adminController.js"
const router = express.Router()

router.get("/", getAdminOrders)

export default router