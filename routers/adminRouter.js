import express from "express"
import { getAddProduct, getAdminCategory, getAdminOrders, getAdminProduct, getAdminUsers, getEditProduct } from "../controllers/adminController.js"
const router = express.Router()

router.get("/", getAdminOrders)
router.get("/product", getAdminProduct)
router.get("/users", getAdminUsers)
router.get("/category", getAdminCategory)
router.get("/add-product", getAddProduct)
router.get("/edit-product", getEditProduct)

export default router