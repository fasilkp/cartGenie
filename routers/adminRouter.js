import express from "express"
import { addCategory, addOffer, addProduct, adminSearchBanUser, adminSearchProduct, adminSearchUser, banUser, deleteCategory, deleteOffer, deleteUser, editProduct, getAddCategory, getAddOffers, getAddProduct, getAdminCategory, getAdminOffers, getAdminOrders, getAdminProduct, getAdminUsers, getBannedUsers, getDashboard, getEditProduct, listProduct, unBanUser, unListProduct } from "../controllers/adminController.js"
import upload from "../middlewares/multer.js"
import verifyAdmin from "../middlewares/verifyAdmin.js"
const router = express.Router()

router.use(verifyAdmin)

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


router.get("/delete-category/:id", deleteCategory)
router.get("/ban-user/:id", banUser)
router.get("/unban-user/:id", unBanUser)
router.get("/delete-user/:id", deleteUser)
router.get("/unlist-product/:id", unListProduct)
router.get("/list-product/:id", listProduct)
router.get("/delete-offer/:id", deleteOffer)


router.post("/add-category", addCategory)
router.post("/search-product", adminSearchProduct)
router.post("/search-user", adminSearchUser)
router.post("/search-ban-user", adminSearchBanUser)
router.post("/add-product",upload.fields([{name:'images', maxCount:12},{name:'image', maxCount:"1"}]), addProduct)
router.post("/edit-product",upload.fields([{name:'images', maxCount:12},{name:'image', maxCount:"1"}]), editProduct)
router.post("/add-offer",upload.single('image'), addOffer)




export default router