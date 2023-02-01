import offerModel from '../models/offerModel.js'
import productModel from '../models/productModel.js'
import categoryModel from '../models/categoryModel.js'
import UserModel from '../models/userModel.js'

export async function getHome(req, res){
    const offers= await offerModel.find().lean()
    const products= await productModel.find({unlist:false}).limit(8).lean()
    res.render("user/home", {offers, products, key:""})
}
export async function getProductList(req, res){
    const category=req.query.category ?? ""
    const key=req.query.key ?? ""
    const filter=req.query.filter ?? ""
    let products=[]
    if(filter==0){
        products= await productModel.find({
                name: new RegExp(key, 'i'),
                category: new RegExp(category, 'i'),
                unlist:false
        }).sort({uploadedAt:-1}).lean();
    }else{
        products= await productModel.find({
            name: new RegExp(key, 'i'),
            category: new RegExp(category, 'i'),
            unlist:false
        }).sort({price:filter}).lean(); 
    }
    const categories= await categoryModel.find().lean(); 

    return res.render("user/productList", {products, categories, key, category, filter})
} 

export async function getProduct(req, res){
    try{
        const proId=req.params.id;
        const product= await productModel.findOne({_id:proId, unlist:false});
        console.log(req.user)
        console.log(proId)
        if(req?.user?.wishlist?.includes(proId)){
            console.log("present")
            return res.render("user/product", {product, key:"", wish:true})
        }else{
            console.log("not")
            return res.render("user/product", {product, key:"", wish:false})
        }

    }catch(err){ 
        console.log(err)
        res.redirect("back")
    }
}
export async function getWishlist(req, res){

    res.render("user/wishlist", {key:""})
}
export function getCart(req, res){
    res.render("user/cart", {key:""}) 
}
export function getOrderHistory(req, res){
    res.render("user/orderHistory", {key:""})
}
export function getCheckout(req, res){ 
    res.render("user/checkout", {key:""})
} 
export function getAddAddress(req, res){
    res.render("user/addAddress", {key:""})
}
export function getEditAddress(req, res){
    res.render("user/editAddress", {key:""})
}
export function getOrderProduct(req, res){
    res.render("user/orderedProduct", {key:""})
}
export function getUserProfile(req, res){
    res.render("user/userProfile", {key:""})
}
export function getCoupons(req, res){
    res.render("user/coupons", {key:""}) 
}

export async function addToWishlist(req, res){
    const _id=req.session.user.id;
    const proId=req.params.id;
    await UserModel.updateOne({_id}, {$push:{
        wishlist:proId
    }})
    res.redirect("back")
}

export async function removeFromWishlist(req, res){
    const _id=req.session.user.id;
    const proId=req.params.id;
    await UserModel.updateOne({_id}, {$pull:{
        wishlist:proId
    }})
    res.redirect("back")
}



