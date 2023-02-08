import express from "express"
import { addAddress, addQuantity, addToCart, addToWishlist, applyCoupon, checkout, deleteAddress, editAddress, editProfile, getAddAddress, getCart, getCheckout, getCoupons, getEditAddress, getEditProfile, getHome, getOrderHistory, getOrderPlaced, getOrderProduct, getPayment, getProduct, getProductList, getUserProfile, getWishlist, minusQuantity, removeFromCart, removeFromWishlist } from "../controllers/userController.js"
import checkUser from "../middlewares/checkUser.js"
const router = express.Router()
import verifyUser from "../middlewares/verifyUser.js"

router.get("/", getHome)
router.get("/search", getProductList)
router.get("/product/:id",checkUser, getProduct)

router.use(verifyUser);
router.use(checkUser);

router.get("/wishlist", getWishlist)
router.get("/cart", getCart)
router.get("/orders", getOrderHistory)
router.get("/checkout", getCheckout)
router.get("/add-address", getAddAddress)
router.get("/profile", getUserProfile)
router.get("/coupons", getCoupons)
router.get("/payment", getPayment)
router.get("/edit-profile", getEditProfile)
router.get("/order-placed", getOrderPlaced)


router.get("/edit-address/:id", getEditAddress)
router.get("/order/:id", getOrderProduct)
router.get("/add-to-wishlist/:id", addToWishlist);
router.get("/remove-from-wishlist/:id", removeFromWishlist);
router.get("/add-to-cart/:id", addToCart);
router.get("/remove-from-cart/:id", removeFromCart);
router.get("/delete-address/:id", deleteAddress);
router.get("/add-quantity/:id", addQuantity);
router.get("/minus-quantity/:id", minusQuantity);

router.post("/add-address",addAddress)
router.post("/edit-address",editAddress)
router.post("/checkout",checkout)
router.post("/apply-coupon",applyCoupon)
router.post("/edit-profile",editProfile)




export default router