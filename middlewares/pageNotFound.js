export default function(req, res, next){
    res.status(404).render("partials/error404")
}