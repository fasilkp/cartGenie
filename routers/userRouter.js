import express from "express"
import { addAddress, addQuantity, addRating, addReview, addToCart, addToWishlist, applyCoupon, cancelOrder, checkout, checkQuantity, deleteAddress, editAddress, editProfile, getAddAddress, getCart, getCheckout, getCoupons, getEditAddress, getEditProfile, getHome, getOrderHistory, getOrderPlaced, getOrderProduct, getPayment, getProduct, getProductList, getProductListApi, getUserProfile, getWishlist, minusQuantity, payNow, removeFromCart, removeFromWishlist, returnOrder, returnURL } from "../controllers/userController.js"
import checkUser from "../middlewares/checkUser.js"
const router = express.Router()
import verifyUser from "../middlewares/verifyUser.js"

router.get("/", getHome)
router.get("/search", getProductList)
router.get("/product-list",getProductListApi)
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
router.get("/payment/:id", getPayment)
router.get("/edit-profile", getEditProfile)
router.get("/order-placed", getOrderPlaced)
router.get("/cancel-order/:id", cancelOrder)
router.get("/return-order/:id", returnOrder)


router.get("/edit-address/:id", getEditAddress)
router.get("/order/:id", getOrderProduct)
router.get("/add-to-wishlist/:id", addToWishlist);
router.get("/remove-from-wishlist/:id", removeFromWishlist);
router.get("/add-to-cart/:id", addToCart);
router.get("/remove-from-cart/:id", removeFromCart);
router.get("/delete-address/:id", deleteAddress);
router.get("/add-quantity/:id", addQuantity);
router.get("/minus-quantity/:id", minusQuantity);
router.get("/return", returnURL)

router.post("/add-address",addAddress)
router.post("/edit-address",editAddress)
router.post("/check-quantity", checkQuantity)
router.post("/checkout",checkout)
router.post("/apply-coupon",applyCoupon)
router.post("/edit-profile",editProfile)
router.post("/add-rating",addRating)
router.post("/add-review",addReview)
router.post("/pay-now",payNow)




export default router