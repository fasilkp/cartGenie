export function getUserLogin(req, res){
    res.render("user/login")
}
export function getUserSignup(req, res){
    res.render("user/signup")
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