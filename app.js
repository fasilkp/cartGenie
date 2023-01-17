import express from "express"
import ejs from 'ejs'
import path from 'path'
import  adminAuth from "./routers/adminAuthRouter.js"
import  userAuth from "./routers/userAuth.js"
import adminRouter from "./routers/adminRouter.js"
import userRouter from "./routers/userRouter.js"
import ejsLayout from 'express-ejs-layouts'
const app = express();

app.set("view engine", "ejs");

const __dirname=path.resolve()
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static(__dirname+"/public"))
app.use(ejsLayout)


//Routers
app.use("/", userRouter)
app.use("/", userAuth)
app.use("/admin/", adminRouter)
app.use("/admin/auth", adminAuth)




app.listen(4000);
