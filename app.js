const express = require("express");
let ejs = require("ejs");
const app = express();

app.set("view engine", "ejs");


app.get("/",(req, res)=>{
  res.render("user/home")
})

app.get("/admin",(req, res)=>{
  res.render("admin/home")
})

app.listen(4000);
