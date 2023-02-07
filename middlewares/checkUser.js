import UserModel from "../models/userModel.js";

export default async function(req, res, next){
    if(req.session.user){
        const user= await UserModel.findOne({_id:req.session.user.id}, {password:0});
        req.user=user;
        if(user?.ban){
            req.session.user=null;
            return res.redirect("/login")
        }
    }
    next();
}
