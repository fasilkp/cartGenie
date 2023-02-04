import offerModel from '../models/offerModel.js'
import productModel from '../models/productModel.js'
import categoryModel from '../models/categoryModel.js'
import userModel from '../models/userModel.js'
import UserModel from '../models/userModel.js'
import createId from '../actions/createId.js'
import orderModel from '../models/orderModel.js'

export async function getHome(req, res){
    const offers= await offerModel.find().lean()
    const products= await productModel.find({unlist:false}).limit(8).lean()
    res.render("user/home", {offers, products, key:""})
}
export async function getProductList(req, res){
    const category=req.query.category ?? ""
    const key=req.query.key ?? ""
    const filter=req.query.filter ?? ""
    const page=req.query.page ?? 0
    let count=0;
    let products=[]
    if(filter==0){
        count=products= await productModel.find({
            name: new RegExp(key, 'i'),
            categoryId: new RegExp(category,'i'),
            unlist:false
        }).count()
        products= await productModel.find({
            name: new RegExp(key, 'i'),
            categoryId: new RegExp(category,'i'),
            unlist:false
        }).sort({uploadedAt:-1}).skip(page*10).limit(10).lean();
    }else{
        count= await productModel.find({
            name: new RegExp(key, 'i'),
            categoryId: new RegExp(category,'i'),
            unlist:false
        }).count()
        products= await productModel.find({
            name: new RegExp(key, 'i'),
            categoryId: new RegExp(category,'i'),
            unlist:false
        }).sort({price:filter}).skip(page*10).limit(10).lean(); 
    }
    const categories= await categoryModel.find().lean(); 
    let pageCount=Math.floor(count/10)
    console.log(pageCount )
    return res.render("user/productList", {products, categories, key, category, filter, pageCount, page})
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
    const cartList=cart.map(item=>{
        return item.id;
    })
    const products= await productModel.find({_id:{$in:cartList} , unlist:false}).lean()
    let totalPrice=0;
    products.forEach((item, index)=>{
        totalPrice=(totalPrice+item.price)* cart[index].quantity;
    })
    let totalMRP=0
    products.forEach((item, index)=>{
        totalMRP=(totalMRP+item.MRP)* cart[index].quantity;
    })
    res.render("user/cart", {key:"", products, totalPrice,cart, totalMRP}) 
}
export async function getOrderHistory(req, res){
    const orders= await orderModel.find({userId:req.session.user.id}).lean()
    res.render("user/orderHistory", {key:"", orders})
}
export function getCheckout(req, res){
    let address= req.user.address
    res.render("user/checkout", {key:"", address})
} 
export function getAddAddress(req, res){
    res.render("user/addAddress", {key:""})
}
export async function getEditAddress(req, res){
    let {address}= await userModel.findOne({"address.id":req.params.id},{_id:0,address:{$elemMatch:{id:req.params.id}} })

    res.render("user/editAddress", {key:"", address:address[0]})
}
export async function getOrderProduct(req, res){
    const order= await orderModel.findOne({_id:req.params.id, userId:req.session.user.id})
    res.render("user/orderedProduct", {key:"", order})
}
export function getUserProfile(req, res){

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
        cart:{
            id:proId,
            quantity:1
        }
    }})
    res.redirect("/cart")
}

export async function removeFromCart(req, res){
    const _id=req.session.user.id;
    const proId=req.params.id;
    await UserModel.updateOne({_id}, {$pull:{
        cart:{id:proId}
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

export async function editAddress(req, res){
    await userModel.updateOne({_id:req.session.user.id,address:{$elemMatch:{id:req.body.id}} },{
        $set:{
            "address.$":req.body
        }
    })
    res.redirect("/profile")
}

export async function addQuantity(req, res){
    await userModel.updateOne({_id:req.session.user.id,cart:{$elemMatch:{id:req.params.id}} },{
        $inc:{
            "cart.$.quantity":1
        }
    })
    res.redirect("/cart")
}

export async function minusQuantity(req, res){
    let {cart}= await userModel.findOne({"cart.id":req.params.id},{_id:0,cart:{$elemMatch:{id:req.params.id}} })
    if(cart[0].quantity<=1){
        return res.redirect("/cart") 
    }
    await userModel.updateOne({_id:req.session.user.id,cart:{$elemMatch:{id:req.params.id}} },{
        $inc:{
            "cart.$.quantity":-1
        }
    })
    return res.redirect("/cart")
}

export async function checkout(req, res){
    const {payment, address:addressId}=req.body
    if(!payment==="cod"){
        return res.send("online")
    }
    const cart=req?.user?.cart ?? [];
    const cartList=cart.map(item=>item.id)
    let {address}= await userModel.findOne({"address.id":addressId},{_id:0,address:{$elemMatch:{id:addressId}} })
    let products= await productModel.find({_id:{$in:cartList} , unlist:false}).lean()
    let orders=[]
    let i=0
    for(let item of products) {
        await productModel.updateOne({_id:item._id}, {
            $inc:{
                quantity:(-1 * cart[i].quantity)
            }
            })
        orders.push({
            address:address[0],
            product:item,
            userId:req.session.user.id,
            quantity:cart[i].quantity,
            total:cart[i].quantity*item.price,
        })
        i++;
    }

    await orderModel.create(orders)
    await userModel.findByIdAndUpdate(req.session.user.id,{
        $set:{cart:[]}
    })
    res.redirect("/orders")
} 

