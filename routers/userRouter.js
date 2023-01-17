import express from "express"
import { getHome } from "../controllers/userController.js"
const router = express.Router()

router.get("/", getHome)

export default router