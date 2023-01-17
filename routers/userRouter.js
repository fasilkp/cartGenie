import express from "express"
import { getHome, getProductList } from "../controllers/userController.js"
const router = express.Router()

router.get("/", getHome)
router.get("/search", getProductList)

export default router