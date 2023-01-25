export function getUserLogin(req, res){
    res.render("user/login")
}
export function getUserSignup(req, res){
    res.render("user/signup", {error:false})
}
export function getVerifyEmail(req, res){
    res.render("user/emailVerify")
}
export function getForgotPassword(req, res){
    res.render("user/forgotPassword")
}
export function getForgotPassVerify(req, res){
    res.render("user/forgotPassVerify")
}
export function getChanegPassword(req, res){
    res.render("user/changePassword")
}
export function getEditProfile(req, res){
    res.render("user/editProfile")
}

export async function userSignup(req, res){
    const {name, email, password} = req.body;
    if(email=="" || name=="" || password==""){
        return res.render("user/signup",{error:true, message:"all fields must be filled"})
    }
    res.render("user/emailVerify", {user:req.body})
} 