import categoryModel from "../models/categoryModel.js"
import UserModel from "../models/userModel.js";
import productModel from "../models/productModel.js";

export function getAdminOrders(req,res){
    res.render("admin/adminOrders")
} 
export function getAdminProduct(req,res){
    res.render("admin/adminProduct")
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
export function getEditProduct(req,res){
    res.render("admin/editProduct")
} 
export function getAdminOffers(req,res){
    res.render("admin/adminOffers")
} 
export function getAddOffers(req,res){
    res.render("admin/addOffers")
} 
export function getAddCategory(req,res){
    res.render("admin/addCategory")
} 

export function addCategory(req, res){
    if(req.body.category==""){
        return res.redirect("/admin/add-category")
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
export async function deleteCategory(req, res){
    const _id=req.params.id;
    await categoryModel.deleteOne({_id});
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
        const product= new productModel({
            name, category, quantity, brand, MRP, price, description,
            mainImage:req.files.image[0],
            sideImages:req.files.images
    })
    product.save(async (err, data)=>{
        if(err){
            const categories= await categoryModel.find().lean();
            res.render({error:true, message:"Fields validation failed", categories})
            console.log(err)
        }else{
            res.redirect("/admin/product")
            console.log("completed")
        }
    })
    }catch(err){
        const categories= await categoryModel.find().lean();
        res.render({error:true, message:"Something went wrong", categories})
    }
}