import express from "express"
import { getAddAddress, getCart, getCheckout, getHome, getOrderHistory, getProduct, getProductList, getWishlist } from "../controllers/userController.js"
const router = express.Router()

router.get("/", getHome)
router.get("/search", getProductList)
router.get("/product/:id", getProduct)
router.get("/wishlist", getWishlist)
router.get("/cart", getCart)
router.get("/orders", getOrderHistory)
router.get("/checkout", getCheckout)
router.get("/add-address", getAddAddress)

export default router