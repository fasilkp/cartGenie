import express from "express"
import { getAdminCategory, getAdminOrders, getAdminProduct, getAdminUsers } from "../controllers/adminController.js"
const router = express.Router()

router.get("/", getAdminOrders)
router.get("/product", getAdminProduct)
router.get("/users", getAdminUsers)
router.get("/category", getAdminCategory)

export default router