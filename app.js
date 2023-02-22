import 'dotenv/config'
import express from "express"
import path from 'path'
import adminAuth from "./routers/adminAuthRouter.js"
import userAuth from "./routers/userAuth.js"
import adminRouter from "./routers/adminRouter.js"
import userRouter from "./routers/userRouter.js"
import ejsLayout from 'express-ejs-layouts'
import dbConnect from './config/mongoose/dbConnect.js'
import session from 'express-session'
import verifyAdmin from './middlewares/verifyAdmin.js'
import pageNotFound from './middlewares/pageNotFound.js'
import MongoStore from 'connect-mongo'

const app = express();

app.get("/test", (req, res)=>{
    res.send("<h1> App Running... beta3</h1>")
})

app.set("view engine", "ejs");
const __dirname=path.resolve()

app.use(session({
    secret:"secretkey",
    saveUninitialized:true,
    resave:false,
    store: MongoStore.create({ mongoUrl: process.env.DB_CONFIG }),
    proxy: true,
    cookie:{
            sameSite:"none",
            secure:true,
            httpOnly:true,
            // domain:"cartgenie.store",
            maxAge:60*60*1000*24*7
    }

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



app.use(pageNotFound)


const port = process.env.PORT || 8080;
app.listen(port, ()=>{
    console.log("port running on port ", port)
});
