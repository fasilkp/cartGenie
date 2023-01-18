import express from "express"
import { getHome, getProduct, getProductList } from "../controllers/userController.js"
const router = express.Router()

router.get("/", getHome)
router.get("/search", getProductList)
router.get("/product/:id", getProduct)

export default router