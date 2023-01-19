export function getHome(req, res){
    res.render("user/home")
}
export function getProductList(req, res){
    res.render("user/productList")
}
export function getProduct(req, res){
    res.render("user/product")
}
export function getWishlist(req, res){
    res.render("user/wishlist")
}
export function getCart(req, res){
    res.render("user/cart")
}
export function getOrderHistory(req, res){
    res.render("user/orderHistory")
}
export function getCheckout(req, res){
    res.render("user/checkout")
}