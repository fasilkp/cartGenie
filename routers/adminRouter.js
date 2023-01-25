import express from "express"
import { addCategory, banUser, deleteCategory, deleteUser, getAddCategory, getAddOffers, getAddProduct, getAdminCategory, getAdminOffers, getAdminOrders, getAdminProduct, getAdminUsers, getBannedUsers, getEditProduct, unBanUser } from "../controllers/adminController.js"
const router = express.Router()

router.get("/", getAdminOrders)
router.get("/product", getAdminProduct)
router.get("/users", getAdminUsers)
router.get("/category", getAdminCategory)
router.get("/add-product", getAddProduct)
router.get("/edit-product", getEditProduct)
router.get("/offers", getAdminOffers)
router.get("/banned-users", getBannedUsers)
router.get("/add-offer", getAddOffers)
router.get("/add-category", getAddCategory)
router.post("/add-category", addCategory)
router.get("/delete-category/:id", deleteCategory)
router.get("/ban-user/:id", banUser)
router.get("/unban-user/:id", unBanUser)
router.get("/delete-user/:id", deleteUser)


export default router