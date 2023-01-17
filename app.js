import express from "express"
import ejs from 'ejs'
import path from 'path'
import  adminAuth from "./routers/adminAuthRouter.js"
import  userAuth from "./routers/userAuthRouter.js"
import adminRouter from "./routers/adminRouter.js"
import userRouter from "./routers/userRouter.js"
const app = express();

app.set("view engine", "ejs");

const __dirname=path.resolve()
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static(__dirname+"/public"))



//Routers
app.use("/", userRouter)
app.use("/admin/", adminRouter)
app.use("/admin/auth", adminAuth)
app.use("/user/auth", userAuth)



app.get("/",(req, res)=>{
  res.render("user/home")
})

app.get("/admin",(req, res)=>{
  res.render("admin/home")
})

app.listen(4000);
