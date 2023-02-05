export default function(req, res, next){
    if(req.session.user){
        res.redirect("/")
    }else{
        next()
    }
}