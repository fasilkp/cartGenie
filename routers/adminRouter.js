import express from "express"
import { addCategory, getAddCategory, getAddOffers, getAddProduct, getAdminCategory, getAdminOffers, getAdminOrders, getAdminProduct, getAdminUsers, getEditProduct } from "../controllers/adminController.js"
const router = express.Router()

router.get("/", getAdminOrders)
router.get("/product", getAdminProduct)
router.get("/users", getAdminUsers)
router.get("/category", getAdminCategory)
router.get("/add-product", getAddProduct)
router.get("/edit-product", getEditProduct)
router.get("/offers", getAdminOffers)
router.get("/add-offer", getAddOffers)
router.get("/add-category", getAddCategory)
router.post("/add-category", addCategory)





export default router