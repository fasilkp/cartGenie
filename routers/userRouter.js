import express from "express"
import { getCart, getHome, getProduct, getProductList, getWishlist } from "../controllers/userController.js"
const router = express.Router()

router.get("/", getHome)
router.get("/search", getProductList)
router.get("/product/:id", getProduct)
router.get("/wishlist", getWishlist)
router.get("/cart", getCart)

export default router