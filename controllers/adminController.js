import categoryModel from "../models/categoryModel.js"
import UserModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import offerModel from "../models/offerModel.js";
import couponModel from "../models/couponModel.js";
import moment from "moment";

export function getAdminOrders(req,res){
    res.render("admin/adminOrders")
}
export function getDashboard(req,res){
    res.render("admin/adminDashboard")
} 
export async function getAdminProduct(req,res){
    const products = await productModel.find().lean()
    res.render("admin/adminProduct", {products})
} 
export async function getAdminUsers(req,res){
    const users= await UserModel.find({ban:false}).lean();
    res.render("admin/adminUsers", {users})
} 
export async function getBannedUsers(req,res){
    const users= await UserModel.find({ban:true}).lean();
    res.render("admin/bannedUsers", {users})
} 
export async function getAdminCategory(req,res){
    const categories= await categoryModel.find().lean();
    res.render("admin/adminCategory", {categories})
}
export async function getAddProduct(req,res){
    const categories= await categoryModel.find().lean();
    res.render("admin/addProduct", {error:false, categories})
} 
export async function getEditProduct(req,res){
    const _id=req.params.id;
    const product=await productModel.findOne({_id});
    const categories= await categoryModel.find().lean();
    res.render("admin/editProduct", {product, error:false, categories})
} 
export async function getAdminOffers(req,res){
    const offers= await offerModel.find().lean();
    res.render("admin/adminOffers", {offers})
} 
export function getAddOffers(req,res){
    res.render("admin/addOffers", {error:false})
} 
export function getAddCategory(req,res){
    res.render("admin/addCategory", {error:false})
} 
export async function getEditCategory(req,res){
    const category=await categoryModel.findOne({_id:req.params.id})
    res.render("admin/editCategory", {error:false, id:req.params.id, category:category.category})
} 

export async function addCategory(req, res){
    const categoryExist = await categoryModel.findOne({category:req.body.category})
    if(categoryExist){
        return res.render("admin/addCategory", {error:true, message:"'"+categoryExist.category+"' already found"})
    }else{
        const category=new categoryModel({category:req.body.category})
        category.save((err, data)=>{
            if(err){
                return res.redirect("/admin/add-category")
            } 
            res.redirect("/admin/category")
        })
    }

}

export async function editCategory(req, res){
    const categoryExist = await categoryModel.findOne({category:req.body.category})
    if(categoryExist){
        return res.render("admin/editCategory", {error:true, message:"'"+categoryExist.category+"' already found", id:categoryExist._id, category:categoryExist.category})
    }
    await categoryModel.updateOne({_id:req.body._id},{category:req.body.category});
    res.redirect("/admin/category")

}


export async function listCategory(req, res){
    const _id=req.params.id;
    await categoryModel.updateOne({_id},{$set:{unlist:false}});
    res.redirect("/admin/category")
}

export async function unListCategory(req, res){
    const _id=req.params.id;
    await categoryModel.updateOne({_id},{$set:{unlist:true}});
    res.redirect("/admin/category")
}


export async function banUser(req, res){
    const _id= req.params.id;
    await UserModel.findByIdAndUpdate(_id, {$set:{ban:true}})
    res.redirect("/admin/users")
}


export async function unBanUser(req, res){
    const _id= req.params.id;
    await UserModel.findByIdAndUpdate(_id, {$set:{ban:false}})
    res.redirect("/admin/banned-users")
}

export async function deleteUser(req, res){
    const _id=req.params.id;
    await UserModel.deleteOne({_id});
    res.redirect("/admin/users")
}

export async function addProduct(req, res){
    try{

        const {name, category, quantity, brand, MRP, price, description}=req.body;
        const categoryId= category.split(" ")[0]
        const categoryName= category.split(" ")[1]

        const product= new productModel({
            name, category:categoryName, categoryId, quantity, brand, MRP, price, description,
            mainImage:req.files.image[0],
            sideImages:req.files.images
            })

        product.save(async (err, data)=>{
            if(err){
                console.log(err)
                const categories= await categoryModel.find().lean();
                res.render('admin/addProduct',{error:true, message:"Fields validation failed", categories})
            }else{
                res.redirect("/admin/product")
                console.log("completed")
            }
        }) 
    }catch(err){
        console.log(err)
        const categories= await categoryModel.find().lean();
        res.render('admin/addProduct',{error:true, message:"Please fill all the fields", categories})
    }
}

export async function editProduct(req, res){
    try{
        const {name, category, quantity, brand, MRP, price, description, _id}=req.body;
        const categoryId= category.split(" ")[0]
        const categoryName= category.split(" ")[1]
        if(req.files.image && req.files.images){
            await productModel.findByIdAndUpdate(_id, {$set:{
                    name, category:categoryName,categoryId, quantity, brand, MRP, price, description,
                    mainImage:req.files.image[0],
                    sideImages:req.files.images
            }})
        return res.redirect("/admin/product");
        }
        if(!req.files.image && req.files.images){
            await productModel.findByIdAndUpdate(_id, {$set:{
                name, category, quantity, brand, MRP, price, description,
                sideImages:req.files.images
            }})
        return res.redirect("/admin/product");

        }
        if(req.files.image && !req.files.images){
            await productModel.findByIdAndUpdate(_id, {$set:{
                name, category, quantity, brand, MRP, price, description,
                mainImage:req.files.image[0]
            }})
        return res.redirect("/admin/product");

        } 
        if(!req.files.image && !req.files.images){
            await productModel.findByIdAndUpdate(_id, {$set:{
                name, category, quantity, brand, MRP, price, description
            }})
        return res.redirect("/admin/product");
        } 
        return res.redirect("/admin/product");
    }catch(err){
        console.log(err)
        const categories= await categoryModel.find().lean();
        res.render('admin/editProduct',{error:true, message:"Please fill all the fields", categories, product:req.body})
    }
}

export async function adminSearchProduct(req, res){
    const products = await productModel.find({$or:[{name: new RegExp(req.body.name, 'i')},{category: new RegExp(req.body.name, 'i')}]}).lean();
    res.render("admin/adminProduct", {products})
}

export async function adminSearchUser(req, res){
    const users = await UserModel.find({$or:[{name: new RegExp(req.body.name, 'i')},{email: new RegExp(req.body.name, 'i')}], ban:false}).lean();
    res.render("admin/adminUsers", {users})
}

export async function adminSearchBanUser(req, res){
    const users = await UserModel.find({$or:[{name: new RegExp(req.body.name, 'i')},{email: new RegExp(req.body.name, 'i')}], ban:true}).lean();
    res.render("admin/bannedUsers", {users})
}


export async function unListProduct(req, res){
        const _id= req.params.id;
        await productModel.findByIdAndUpdate(_id, {
            $set:{
                unlist:true
            }
        })
        res.redirect("/admin/product")
}

export async function listProduct(req, res){
        const _id= req.params.id;
        await productModel.findByIdAndUpdate(_id, {
            $set:{
                unlist:false
            }
        })
        res.redirect("/admin/product")
}

export async function getEditOffer(req, res){
        const {name, url}=req.body;
        const offer= await offerModel.findOne({_id:req.params.id});
        res.render("admin/editOffer", {offer, error:false}) 
}

export async function addOffer(req, res){
    try{
        const {name, url}=req.body;
        const offer= new offerModel({name, url, image:req.file.filename});
        offer.save((err, data)=>{
            if(err){
                return res.render("adminOffer", {error:true, message:"Offer adding failed"})
            }
            return res.redirect("/admin/offers")
        })

        
    }catch(err){
        return res.render("admin/addOffer", {error:true, message:"Offer adding failed"})
    }
}

export async function editOffer(req, res){
    try{
        const {name, _id, url}=req.body;
        if(req.file){
            await offerModel.findByIdAndUpdate(_id, {$set:{name, url, image:req.file.filename}})
        }
        else{
            await offerModel.findByIdAndUpdate(_id, {$set:{name, url}})
        }
        return res.redirect("/admin/offers")

    }catch(err){
        return res.redirect("/admin/offers")
    }
}

export async function deleteOffer(req, res){
    try{
        const _id=req.params.id
        await offerModel.deleteOne({_id});
        return res.redirect("/admin/offers")
    }catch(err){
        return res.redirect("/admin/offers")
    }
}

export async function getCouponsPage(req, res){
    const coupons= await couponModel.find().lean();
    res.render("admin/adminCoupons", {coupons}) 
}

export async function getAddCoupon(req, res){
    res.render("admin/addCoupon") 
}

export async function addCoupon(req, res){
    try{
        const {name, discount, maxDiscountAmount, minAmount, expiry, code }=req.body
        const coupon= new couponModel({name, discount, maxDiscountAmount, minAmount, expiry, code});
        coupon.save((err, data)=>{
            if(err){
                console.log(err)
            }
            res.redirect("/admin/coupons")
        })
    }catch(err){
        console.log(err)
        res.redirect("/admin/coupons")
    }
}

export async function getEditCoupon(req, res){
        const _id=req.params.id
        let coupon= await couponModel.findOne({_id});
        const expiry=moment(coupon.expiry).utc().format('YYYY-MM-DD')
        const {name, code, discount, maxDiscountAmount, minAmount}=coupon;
        res.render("admin/editCoupon", {coupon:{name,_id, code, discount, maxDiscountAmount, minAmount, expiry}})
}

export async function editCoupon(req, res){
    try{
        const {name, discount, maxDiscountAmount, minAmount, expiry, code, _id }=req.body
        
        await couponModel.findByIdAndUpdate(_id, {
            $set:{
                name, discount, maxDiscountAmount, minAmount, expiry, code
            }
        })
        res.redirect("/admin/coupons")
    }catch(err){
        console.log(err)
        res.redirect("/admin/coupons")
    }
}

export async function listCoupon(req, res){
    try{
        const _id=req.params.id
        await couponModel.updateOne({_id}, {$set:{unlist:false}})
        res.redirect("/admin/coupons")
    }catch(err){
        console.log(err)
        res.redirect("/admin/coupons")
    }
}
export async function unListCoupon(req, res){
    try{
        const _id=req.params.id
        await couponModel.updateOne({_id}, {$set:{unlist:true}})
        res.redirect("/admin/coupons")
    }catch(err){
        console.log(err)
        res.redirect("/admin/coupons")
    }
}