import offerModel from '../models/offerModel.js'
import productModel from '../models/productModel.js'
import categoryModel from '../models/categoryModel.js'
import userModel from '../models/userModel.js'
import UserModel from '../models/userModel.js'
import createId from '../actions/createId.js'

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
            categoryId: new RegExp(category,'i'),
            unlist:false
        }).sort({uploadedAt:-1}).lean();
    }else{
        products= await productModel.find({
            name: new RegExp(key, 'i'),
            categoryId: new RegExp(category,'i'),
            unlist:false
        }).sort({price:filter}).lean(); 
    }
    const categories= await categoryModel.find().lean(); 
    console.log(products)

    return res.render("user/productList", {products, categories, key, category, filter})
} 

export async function getProduct(req, res){
    try{
        const proId=req.params.id;
        const product= await productModel.findOne({_id:proId, unlist:false});
        if(req?.user?.wishlist?.includes(proId)){
            return res.render("user/product", {product, key:"", wish:true})
        }else{

            return res.render("user/product", {product, key:"", wish:false})
        }

    }catch(err){ 
        console.log(err)
        res.redirect("back")
    }
}
export async function getWishlist(req, res){
    const wishlist=req?.user?.wishlist ?? [];
    const products= await productModel.find({_id:{$in:wishlist} , unlist:false}).lean()
    res.render("user/wishlist", {key:"", products})
}
export async function getCart(req, res){
    const cart=req?.user?.cart ?? [];
    const products= await productModel.find({_id:{$in:cart} , unlist:false}).lean()
    let totalPrice=0;
    products.forEach((item)=>{
        totalPrice=totalPrice+item.price;
    })
    let totalMRP=0
    products.forEach((item)=>{
        totalMRP=totalMRP+item.MRP;
    })
    res.render("user/cart", {key:"", products, totalPrice, totalMRP}) 
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
    console.log(req.user)
    res.render("user/userProfile", {key:"", user:req.user})
}
export function getCoupons(req, res){
    res.render("user/coupons", {key:""}) 
}

export async function addToWishlist(req, res){
    const _id=req.session.user.id;
    const proId=req.params.id;
    await UserModel.updateOne({_id}, {$addToSet:{
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

export async function addToCart(req, res){
    const _id=req.session.user.id;
    const proId=req.params.id;
    await UserModel.updateOne({_id}, {$addToSet:{
        cart:proId
    }})
    res.redirect("/cart")
}

export async function removeFromCart(req, res){
    const _id=req.session.user.id;
    const proId=req.params.id;
    await UserModel.updateOne({_id}, {$pull:{
        cart:proId
    }})
    res.redirect("/cart")
}

export async function addAddress(req, res){
    await userModel.updateOne({_id:req.session.user.id},{
        $addToSet:{
            address:{
                ...req.body,
                id: createId(),
            }
        }
    })
    res.redirect("/profile")
}
export async function deleteAddress(req, res){
    console.log(req.params.id)
    await userModel.updateOne({_id:req.session.user.id,address:{$elemMatch:{id:req.params.id}} },{
        $pull:{
            address:
                {
                    id:req.params.id
                }
            
        }
    })
    res.redirect("/profile")
}
