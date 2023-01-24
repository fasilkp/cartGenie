import express from "express"
import { getAdminOrders, getAdminProduct, getAdminUsers } from "../controllers/adminController.js"
const router = express.Router()

router.get("/", getAdminOrders)
router.get("/product", getAdminProduct)
router.get("/users", getAdminUsers)

export default router