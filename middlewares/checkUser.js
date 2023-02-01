import UserModel from "../models/userModel.js";

export default async function(req, res, next){
    const user= await UserModel.findOne({_id:req.session.user.id}, {password:0});
    req.user=user;
    console.log(req.user)
    if(user.ban){
        return res.redirect("/login")
    }
    next();
}