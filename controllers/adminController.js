import categoryModel from "../models/categoryModel.js"
import UserModel from "../models/userModel.js";
import productModel from "../models/productModel.js";

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

export async function addOffer(req, res){
    try{

        const {name, url}=req.body;
        console.log(req.body)
        console.log(req.file)

        
    }catch(err){
        console.log(err)
    }
}


export async function editProduct(req, res){
    try{
        const {name, category, quantity, brand, MRP, price, description, _id}=req.body;
        console.log(req.files)
        if(req.files.image && req.files.images){
            await productModel.findByIdAndUpdate(_id, {$set:{
                    name, category, quantity, brand, MRP, price, description,
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