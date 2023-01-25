import adminModel from "../models/adminModel.js";
import bcrypt from 'bcryptjs'
var salt = bcrypt.genSaltSync(10);

export function getAdminLogin(req, res){
    res.render("admin/adminLogin", {error:false})
}
export async function adminLogin(req, res){
    const { email, password } = req.body;
    if (email == "" || password == "") {
        return res.render("admin/adminLogin", {
            error: true,
            message: "all fields must be filled",
        });
    }
    const admin = await adminModel.findOne({email});
    if(!admin){
        return res.render("admin/adminLogin", {
            error: true,
            message: "No admin found",
        });
    }
    if(bcrypt.compareSync(password, admin.password)){
        return res.redirect("/admin/")
    }else{
        return res.render("admin/adminLogin",{
            error:true,
            message:"invalid email or password" 
        })
    }
}