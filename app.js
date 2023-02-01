import 'dotenv/config'
import express from "express"
import path from 'path'
import adminAuth from "./routers/adminAuthRouter.js"
import userAuth from "./routers/userAuth.js"
import adminRouter from "./routers/adminRouter.js"
import userRouter from "./routers/userRouter.js"
import ejsLayout from 'express-ejs-layouts'
import dbConnect from "./config/dbConnect.js"
import session from 'express-session'
import verifyAdmin from './middlewares/verifyAdmin.js'

const app = express();
app.set("view engine", "ejs");
const __dirname=path.resolve()

app.use(session({
    secret:"secretkey",
    saveUninitialized:true,
    resave:false
}))
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static(__dirname+"/public"))
app.use(ejsLayout)
dbConnect();


//Routers
app.use("/", userAuth)
app.use("/admin/", adminAuth)
app.use("/admin/",verifyAdmin, adminRouter)
app.use("/", userRouter)




app.listen(4001);
