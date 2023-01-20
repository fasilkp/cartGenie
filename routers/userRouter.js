import express from "express"
import { getAddAddress, getCart, getCheckout, getEditAddress, getHome, getOrderHistory, getOrderProduct, getProduct, getProductList, getUserProfile, getWishlist } from "../controllers/userController.js"
const router = express.Router()

router.get("/", getHome)
router.get("/search", getProductList)
router.get("/product/:id", getProduct)
router.get("/wishlist", getWishlist)
router.get("/cart", getCart)
router.get("/orders", getOrderHistory)
router.get("/checkout", getCheckout)
router.get("/add-address", getAddAddress)
router.get("/edit-address", getEditAddress)
router.get("/ordered-product", getOrderProduct)
router.get("/profile", getUserProfile)

export default router