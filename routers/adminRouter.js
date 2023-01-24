import express from "express"
import { getAdminOrders, getAdminProduct } from "../controllers/adminController.js"
const router = express.Router()

router.get("/", getAdminOrders)
router.get("/product", getAdminProduct)

export default router