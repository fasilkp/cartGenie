import express from "express"
import { addCategory, addProduct, adminSearchProduct, banUser, deleteCategory, deleteUser, editProduct, getAddCategory, getAddOffers, getAddProduct, getAdminCategory, getAdminOffers, getAdminOrders, getAdminProduct, getAdminUsers, getBannedUsers, getEditProduct, unBanUser } from "../controllers/adminController.js"
import upload from "../middlewares/multer.js"
const router = express.Router()


router.get("/", getAdminOrders)
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


router.post("/add-category", addCategory)
router.post("/search-product", adminSearchProduct)
router.post("/add-product",upload.fields([{name:'images', maxCount:12},{name:'image', maxCount:"1"}]), addProduct)
router.post("/edit-product",upload.fields([{name:'images', maxCount:12},{name:'image', maxCount:"1"}]), editProduct)


export default router