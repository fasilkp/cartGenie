
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
export function getAddAddress(req, res){
    res.render("user/addAddress")
}
export function getEditAddress(req, res){
    res.render("user/editAddress")
}
export function getOrderProduct(req, res){
    res.render("user/orderedProduct")
}
export function getUserProfile(req, res){
    res.render("user/userProfile")
}
export function getCoupons(req, res){
    res.render("user/coupons")
}



