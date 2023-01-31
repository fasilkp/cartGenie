export default function(req, res, next){
    if(req.session.admin){
        res.redirect("/admin/")
    }else{
        next()
    }
}