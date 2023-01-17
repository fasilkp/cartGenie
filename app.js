import express from "express"
import ejs from 'ejs'
import path from 'path'
const app = express();

app.set("view engine", "ejs");

const __dirname=path.resolve()
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static(__dirname+"/public"))



app.get("/",(req, res)=>{
  res.render("user/home")
})

app.get("/admin",(req, res)=>{
  res.render("admin/home")
})

app.listen(4000);
