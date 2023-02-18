import express from "express"
import { addCategory, addCoupon, addOffer, addProduct, adminSearchBanUser, adminSearchProduct, adminSearchUser, banUser,  deleteOffer, deleteUser, editCategory, editCoupon, editOffer, editOrder, editProduct, getAddCategory, getAddCoupon, getAddOffers, getAddProduct, getAdminCategory, getAdminOffers, getAdminOrders, getAdminProduct, getAdminUsers, getBannedUsers, getCouponsPage, getDashboard, getEditCategory, getEditCoupon, getEditOffer, getEditOrder, getEditProduct, getOrderDetails, getSalesReport, listCategory, listCoupon, listProduct, unBanUser, unListCategory, unListCoupon, unListProduct } from "../controllers/adminController.js"
import upload from "../middlewares/multer.js"
const router = express.Router()


router.get("/", getDashboard)
router.get("/orders", getAdminOrders)
router.get("/product", getAdminProduct)
router.get("/users", getAdminUsers)
router.get("/category", getAdminCategory)
router.get("/add-product", getAddProduct)
router.get("/edit-product/:id", getEditProduct)
router.get("/offers", getAdminOffers)
router.get("/banned-users", getBannedUsers)
router.get("/add-offer", getAddOffers)
router.get("/add-category", getAddCategory)
router.get("/coupons", getCouponsPage)
router.get("/add-coupon", getAddCoupon)
router.get("/sales-report", getSalesReport)


router.get("/list-category/:id", listCategory)
router.get("/unlist-category/:id",unListCategory)
router.get("/ban-user/:id", banUser)
router.get("/unban-user/:id", unBanUser)
router.get("/delete-user/:id", deleteUser)
router.get("/unlist-product/:id", unListProduct)
router.get("/list-product/:id", listProduct)
router.get("/delete-offer/:id", deleteOffer)
router.get("/edit-offer/:id", getEditOffer)
router.get("/edit-coupon/:id", getEditCoupon)
router.get("/list-coupon/:id", listCoupon)
router.get("/unlist-coupon/:id", unListCoupon)
router.get("/edit-category/:id", getEditCategory)
router.get("/order-details/:id", getOrderDetails)
router.get("/edit-order/:id", getEditOrder)


router.post("/add-category", addCategory)
router.post("/edit-category", editCategory)
router.post("/search-product", adminSearchProduct)
router.post("/search-user", adminSearchUser)
router.post("/search-ban-user", adminSearchBanUser)
router.post("/add-product",upload.fields([{name:'images', maxCount:12},{name:'image', maxCount:"1"}]), addProduct)
router.post("/edit-product",upload.fields([{name:'images', maxCount:12},{name:'image', maxCount:"1"}]), editProduct)
router.post("/add-offer",upload.single('image'), addOffer)
router.post("/edit-offer",upload.single('image'), editOffer)
router.post("/add-coupon", addCoupon)
router.post("/edit-coupon", editCoupon)
router.post("/edit-order", editOrder)




export default router