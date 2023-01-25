import categoryModel from "../models/categoryModel.js"

export function getAdminOrders(req,res){
    res.render("admin/adminOrders")
} 
export function getAdminProduct(req,res){
    res.render("admin/adminProduct")
} 
export function getAdminUsers(req,res){
    res.render("admin/adminUsers")
} 
export async function getAdminCategory(req,res){
    const categories= await categoryModel.find().lean();
    res.render("admin/adminCategory", {categories})
} 
export function getAddProduct(req,res){
    res.render("admin/addProduct")
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