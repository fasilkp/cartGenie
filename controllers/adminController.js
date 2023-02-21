import categoryModel from "../models/categoryModel.js";
import UserModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import offerModel from "../models/offerModel.js";
import couponModel from "../models/couponModel.js";
import orderModel from "../models/orderModel.js";
import sharp from "sharp";
import moment from "moment";
import fs from 'fs'
import { promisify } from 'util'
import cloudinary from "../config/cloudinary/cloudinary.js";
const unlinkAsync = promisify(fs.unlink)

export async function getAdminOrders(req, res) {
  let page= req.query.page ?? 0;
  let name= req.query.name ?? "";
  let filter= req.query.filter ?? "";
  let pageCount=await orderModel.find().count()
  let orders
  if(req.query.name){

    if(isNaN(name)){
      orders = await orderModel.find({"address.name":new RegExp(name, 'i')}).sort({ createdAt: -1 }).skip(page*10).limit(10)
      .lean();
    }else{
      orders = await orderModel.find({orderId:name}).sort({ createdAt: -1 }).skip(page*10).limit(10)
      .lean();
    }
  }
  else{
    orders = await orderModel.find({orderStatus:new RegExp(filter, 'i')}).sort({ createdAt: -1 }).skip(page*10).limit(10)

  }
  pageCount=Math.floor(pageCount/10);
  res.render("admin/adminOrders", { orders, page, pageCount, name });
}

export async function getDashboard(req, res) {
  const orders = await orderModel.find().lean();
  const monthlyDataArray= await orderModel.aggregate([{$match:{orderStatus:"delivered"}},{$group:{_id:{$month:"$createdAt"}, sum:{$sum:"$total"}}}])
  let totalOrders = orders.length;
  let totalRevenue = 0;
  let totalPending = 0;
  let deliveredOrders = orders.filter((item) => {
    if (item.orderStatus == "pending" || item.orderStatus == 'outForDelivery') {
      totalPending++;
    }
    if(item.orderStatus == "delivered"){
        totalRevenue = totalRevenue + item.total;
    }
    return item.orderStatus=='delivered';
  });
  let totalDispatch = deliveredOrders.length;
  let 
  monthlyDataObject={}
  monthlyDataArray.map(item=>{
    monthlyDataObject[item._id]=item.sum
  })
  let monthlyData=[]
  for(let i=1; i<=12; i++){
      monthlyData[i-1]= monthlyDataObject[i] ?? 0
    }

 

  res.render("admin/adminDashboard", {
    totalOrders,
    totalRevenue,
    totalDispatch,
    totalPending,
    monthlyData,
    
  });
}

export async function getAdminProduct(req, res) {
  const name=req.query.name ?? "";
  let page= req.query.page ?? 0;
  let pageCount=await productModel.find().count()
  const products = await productModel.find({$or:[{name: new RegExp(name, 'i')}, {category: new RegExp(name, 'i')}]})
  .sort({createdAt:-1}).skip(page*10).limit(10).lean();
  pageCount=Math.floor(pageCount/10);
  res.render("admin/adminProduct", { products, name, pageCount, page });
}

export async function getAdminUsers(req, res) {
  const name=req.query.name ?? "";
  let page= req.query.page ?? 0;
  let pageCount=await UserModel.find().count()
  const users = await UserModel.find(
      {$or:[{name: new RegExp(name, 'i'), ban:false}, {email: new RegExp(name, 'i'), ban:false}]}
    )
  .skip(page*10).limit(10).lean();
  pageCount=Math.floor(pageCount/10);
  res.render("admin/adminUsers", { users, pageCount, page, name });
}

export async function getBannedUsers(req, res) {
  const name=req.query.name ?? "";
  const users = await UserModel.find(
    {$or:[{name: new RegExp(name, 'i'), ban:true}, {email: new RegExp(name, 'i'), ban:true}]}
  )
  res.render("admin/bannedUsers", { users, name });
}

export async function getAdminCategory(req, res) {
  const categories = await categoryModel.find().lean();
  res.render("admin/adminCategory", { categories });
}

export async function getAddProduct(req, res) {
  const categories = await categoryModel.find().lean();
  res.render("admin/addProduct", { error: false, categories });
}

export async function getEditProduct(req, res) {
  const _id = req.params.id;
  const product = await productModel.findOne({ _id });
  const categories = await categoryModel.find().lean();
  res.render("admin/editProduct", { product, error: false, categories });
}

export async function getAdminOffers(req, res) {
  const offers = await offerModel.find().lean();
  res.render("admin/adminOffers", { offers });
}

export function getAddOffers(req, res) {
  res.render("admin/addOffers", { error: false });
}

export function getAddCategory(req, res) {
  res.render("admin/addCategory", { error: false });
}

export async function getEditCategory(req, res) {
  const category = await categoryModel.findOne({ _id: req.params.id });
  res.render("admin/editCategory", {
    error: false,
    id: req.params.id,
    category: category.category,
  });
}

export async function getOrderDetails(req, res) {
  const order = await orderModel.findOne({ _id: req.params.id });
  res.render("admin/adminOrderDetails", { order });
}

export async function getEditOrder(req, res) {
  const order = await orderModel.findOne({ _id: req.params.id });
  res.render("admin/editOrder", { order, error: false });
}

export async function getSalesReport(req, res) {

    let startDate = new Date(new Date().setDate(new Date().getDate() - 8))
    let endDate = new Date()
    
    if(req.query.startDate){
        startDate = new Date(req.query.startDate)
        startDate.setHours(0, 0, 0, 0);
    }
    if(req.query.endDate){
        endDate = new Date(req.query.endDate)
        endDate.setHours(24, 0, 0, 0);
    }
    if(req.query.filter=='thisYear'){
      let currentDate= new Date()
      startDate= new Date(currentDate.getFullYear(), 0, 1);
      startDate.setHours(0, 0, 0, 0);
      endDate= new Date(new Date().setDate(new Date().getDate() +1 ))
      endDate.setHours(0, 0, 0, 0);
    }
    if(req.query.filter=='lastYear'){
      let currentDate= new Date()
      startDate= new Date(currentDate.getFullYear()-1, 0, 1);
      startDate.setHours(0, 0, 0, 0);
      endDate= new Date(currentDate.getFullYear()-1, 11, 31);
      endDate.setHours(0, 0, 0, 0);
    }
    if(req.query.filter=='thisMonth'){
      let currentDate= new Date()
      startDate= new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      startDate.setHours(0, 0, 0, 0);
      endDate= new Date(currentDate.getFullYear(), currentDate.getMonth()+1, 1);
      endDate.setHours(0, 0, 0, 0);
    }
    if(req.query.filter=='lastMonth'){
      let currentDate= new Date()
      startDate= new Date(currentDate.getFullYear(), currentDate.getMonth()-1, 1);
      startDate.setHours(0, 0, 0, 0);
      endDate= new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      endDate.setHours(0, 0, 0, 0);
    }

  const orders = await orderModel
    .find({createdAt: { $gt: startDate, $lt: endDate }})
    .sort({ createdAt: -1 })
    .lean();
  let totalOrders = orders.length;
  let totalRevenue = 0;
  let totalPending = 0;
  let deliveredOrders = orders.filter((item) => {

    if (item.orderStatus == "pending" || item.orderStatus == 'outForDelivery') {
      totalPending++;
    }

    totalRevenue = totalRevenue + item.product.price;
    return item.paid;
  });
  let totalDispatch = deliveredOrders.length;

  let orderTable=[]
  orders.map(item=>{
    orderTable.push([item.product.name, item.total, item.orderStatus, item.quantity, item.createdAt.toLocaleDateString() ])
  })
  let byCategory= await orderModel.aggregate([{$match:{createdAt: { $gt: startDate, $lt: endDate }}},{$group:{_id:"$product.categoryId", count:{$sum:1}, price:{$sum:"$product.price"}}}])
  let byBrand= await orderModel.aggregate([{$match:{createdAt: { $gt: startDate, $lt: endDate}}},{$group:{_id:"$product.brand", count:{$sum:1}, profit:{$sum:"$product.price"}}}])

  let category={}
  let categoryIds= byCategory.map(item=>{
    category[item._id]={count:item.count, total:item.price}
    return item._id
  });
  let categories= await categoryModel.find({_id:{$in:categoryIds}}, {category:1}).lean()
  categories.forEach((item, index)=>{
    categories[index].count= category[item._id].count
    categories[index].profit= category[item._id].total
  })
  let filter=req.query.filter ?? "";
  if(!req.query.filter && !req.query.startDate){
    filter="lastWeek"
  }
  res.render("admin/salesReport", {
    orders,
    totalDispatch,
    totalOrders,
    totalPending,
    totalRevenue,
    startDate:moment(new Date(startDate).setDate(new Date(startDate).getDate() + 1)).utc().format('YYYY-MM-DD'),
    endDate:moment(endDate).utc().format('YYYY-MM-DD'),
    orderTable,
    categories,
    byBrand,
    filter
  });
}

export async function addCategory(req, res) {
  const categoryExist = await categoryModel.findOne({
    category: req.body.category,
  });
  if (categoryExist) {
    return res.render("admin/addCategory", {
      error: true,
      message: "'" + categoryExist.category + "' already found",
    });
  } else {
    const category = new categoryModel({ category: req.body.category });
    category.save((err, data) => {
      if (err) {
        return res.redirect("/admin/add-category");
      }
      res.redirect("/admin/category");
    });
  }
}

export async function editCategory(req, res) {
  const categoryExist = await categoryModel.findOne({
    category: req.body.category,
  });
  if (categoryExist) {
    return res.render("admin/editCategory", {
      error: true,
      message: "'" + categoryExist.category + "' already found",
      id: categoryExist._id,
      category: categoryExist.category,
    });
  }
  await categoryModel.updateOne(
    { _id: req.body._id },
    { category: req.body.category }
  );
  res.redirect("/admin/category");
}

export async function listCategory(req, res) {
  const _id = req.params.id;
  await categoryModel.updateOne({ _id }, { $set: { unlist: false } });
  res.redirect("/admin/category");
}

export async function unListCategory(req, res) {
  const _id = req.params.id;
  await categoryModel.updateOne({ _id }, { $set: { unlist: true } });
  res.redirect("/admin/category");
}

export async function banUser(req, res) {
  const _id = req.params.id;
  await UserModel.findByIdAndUpdate(_id, { $set: { ban: true } });
  res.redirect("/admin/users");
}

export async function unBanUser(req, res) {
  const _id = req.params.id;
  await UserModel.findByIdAndUpdate(_id, { $set: { ban: false } });
  res.redirect("/admin/banned-users");
}

export async function deleteUser(req, res) {
  const _id = req.params.id;
  await UserModel.deleteOne({ _id });
  res.redirect("/admin/users");
}

export async function addProduct(req, res) {
  try {
    const { name, category, quantity, brand, MRP, price, description } =
      req.body;
    const categoryId = category.split(" ")[0];
    const categoryName = category.split(" ")[1];
    let mainImage=req.files.image[0], sideImages=req.files.images
      await sharp(mainImage.path)
      .png()
      .resize(540, 540, {
        kernel: sharp.kernel.nearest,
        fit: 'contain',
        position: 'center',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .toFile(mainImage.path+".png")
      .then(async () => {
        await unlinkAsync(mainImage.path)
        let imageFile=await cloudinary.uploader.upload(mainImage.path+".png",{folder:'cartGenie'})
        await unlinkAsync(mainImage.path+".png")
        mainImage=imageFile;
      });
    for (let i in sideImages) {
      await sharp(sideImages[i].path)
      .png()
      .resize(540, 540, {
        kernel: sharp.kernel.nearest,
        fit: 'contain',
        position: 'center',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .toFile(sideImages[i].path+".png")
      .then(async() => {
        await unlinkAsync(sideImages[i].path)
        let imageFile=await cloudinary.uploader.upload(sideImages[i].path+".png",{folder:'cartGenie'})
        await unlinkAsync(sideImages[i].path+".png")
        sideImages[i]=imageFile
      });
    }

    const product = new productModel({
      name,
      category: categoryName,
      categoryId,
      quantity,
      brand,
      MRP,
      price,
      description,
      mainImage,
      sideImages
    });

    product.save(async (err, data) => {
      if (err) {
        const categories = await categoryModel.find().lean();
        res.render("admin/addProduct", {
          error: true,
          message: "Fields validation failed",
          categories,
        });
      } else {
        res.redirect("/admin/product");
      }
    });
  } catch (err) {
    const categories = await categoryModel.find().lean();
    res.render("admin/addProduct", {
      error: true,
      message: "Please fill all the fields",
      categories,
    });
  }
}

export async function editProduct(req, res) {
  try {
  const {
    name,
    category,
    quantity,
    brand,
    MRP,
    price,
    description,
    _id,
    deletedImages,
  } = req.body;
  if (deletedImages) {
    if (Array.isArray(deletedImages)) {
      await productModel.updateOne(
        { _id },
        {
          $pull: {
            sideImages: { url: { $in: deletedImages } },
          },
        }
      );

    } else {
      await productModel.updateOne(
        { _id },
        {
          $pull: {
            sideImages: { url: deletedImages },
          },
        }
      );
    }
  }
  
    const categoryId = category.split(" ")[0];
    const categoryName = category.split(" ")[1];
    let mainImage=req.files?.image?.[0]
    let sideImages=req.files?.images
    if(req.files?.image){
      await sharp(req.files.image[0].path)
      .png()
      .resize(540, 540, {
        kernel: sharp.kernel.nearest,
        fit: 'contain',
        position: 'center',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .toFile(req.files.image[0].path+".png")
      .then(async () => {
        await unlinkAsync(req.files.image[0].path)
        let imageFile=await cloudinary.uploader.upload(req.files.image[0].path+".png",{folder:'cartGenie'})
        // await unlinkAsync(req.files.image[0].path+".png")
        mainImage=imageFile
      });
    }
    if(req.files?.images){
      for (let i in req.files.images) {
        await sharp(req.files.images[i].path)
        .png()
        .resize(540, 540, {
          kernel: sharp.kernel.nearest,
          fit: 'contain',
          position: 'center',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .toFile(req.files.images[i].path+".png")
        .then(async() => {
          await unlinkAsync(req.files.images[i].path)
          let imageFile=await cloudinary.uploader.upload(req.files.images[i].path+".png",{folder:'cartGenie'})
          // await unlinkAsync(req.files.images[i]+".png")
          sideImages[i]=imageFile
        });
      }
    }
    if (req.files?.image && req.files?.images) {
      await productModel.findByIdAndUpdate(_id, {
        $set: {
          name,
          category: categoryName,
          categoryId,
          quantity,
          brand,
          MRP,
          price,
          description,
          mainImage: mainImage,
        },
        $push: {
          sideImages: { $each: sideImages },
        },
      });
      return res.redirect("/admin/product");
    }
    if (!req.files.image && req.files.images) {
      await productModel.findByIdAndUpdate(_id, {
        $set: {
          name,
          category: categoryName,
          categoryId,
          quantity,
          brand,
          MRP,
          price,
          description,
        },
        $push: {
          sideImages: { $each: sideImages },
        },
      });
      return res.redirect("/admin/product");
    }
    if (req.files.image && !req.files.images) {
      await productModel.findByIdAndUpdate(_id, {
        $set: {
          name,
          category: categoryName,
          categoryId,
          quantity,
          brand,
          MRP,
          price,
          description,
          mainImage: mainImage,
        },
      });
      return res.redirect("/admin/product");
    }
    if (!req.files.image && !req.files.images) {
      await productModel.findByIdAndUpdate(_id, {
        $set: {
          name,
          category: categoryName,
          categoryId,
          quantity,
          brand,
          MRP,
          price,
          description,
        },
      });
      return res.redirect("/admin/product");
    }
    return res.redirect("/admin/product");
  } catch (err) {
    const categories = await categoryModel.find().lean();
    res.render("admin/editProduct", {
      error: true,
      message: "Please fill all the fields",
      categories,
      product: req.body,
    });
  }
}

export async function adminSearchProduct(req, res) {
  const products = await productModel
    .find({
      $or: [
        { name: new RegExp(req.body.name, "i") },
        { category: new RegExp(req.body.name, "i") },
      ],
    })
    .lean();
  res.render("admin/adminProduct", { products });
}

export async function adminSearchUser(req, res) {
  const users = await UserModel.find({
    $or: [
      { name: new RegExp(req.body.name, "i") },
      { email: new RegExp(req.body.name, "i") },
    ],
    ban: false,
  }).lean();
  res.render("admin/adminUsers", { users });
}

export async function adminSearchBanUser(req, res) {
  const users = await UserModel.find({
    $or: [
      { name: new RegExp(req.body.name, "i") },
      { email: new RegExp(req.body.name, "i") },
    ],
    ban: true,
  }).lean();
  res.render("admin/bannedUsers", { users });
}

export async function unListProduct(req, res) {
  const _id = req.params.id;
  await productModel.findByIdAndUpdate(_id, {
    $set: {
      unlist: true,
    },
  });
  res.redirect("/admin/product");
}

export async function listProduct(req, res) {
  const _id = req.params.id;
  await productModel.findByIdAndUpdate(_id, {
    $set: {
      unlist: false,
    },
  });
  res.redirect("/admin/product");
}

export async function getEditOffer(req, res) {
  const { name, url } = req.body;
  const offer = await offerModel.findOne({ _id: req.params.id });
  res.render("admin/editOffer", { offer, error: false });
}

export async function addOffer(req, res) {
  try {
    const { name, url } = req.body;
    const imageFile=await cloudinary.uploader.upload(req.file.path,{folder:'cartGenie'})
    const offer = new offerModel({ name, url, image: imageFile});
    offer.save((err, data) => {
      if (err) {
        return res.render("admin/addOffers", {
          error: true,
          message: "Offer adding failed",
        });
      }
      return res.redirect("/admin/offers");
    });
  } catch (err) {
    return res.render("admin/addOffers", {
      error: true,
      message: "Offer adding failed",
    });
  }
}

export async function editOffer(req, res) {
  try {
    const { name, _id, url } = req.body;
    if (req.file) {
      await offerModel.findByIdAndUpdate(_id, {
        $set: { name, url, image: req.file.filename },
      });
    } else {
      await offerModel.findByIdAndUpdate(_id, { $set: { name, url } });
    }
    return res.redirect("/admin/offers");
  } catch (err) {
    return res.redirect("/admin/offers");
  }
}

export async function deleteOffer(req, res) {
  try {
    const _id = req.params.id;
    await offerModel.deleteOne({ _id });
    return res.redirect("/admin/offers");
  } catch (err) {
    return res.redirect("/admin/offers");
  }
}

export async function getCouponsPage(req, res) {
  const coupons = await couponModel.find().lean();
  res.render("admin/adminCoupons", { coupons });
}

export async function getAddCoupon(req, res) {
  res.render("admin/addCoupon");
}

export async function addCoupon(req, res) {
  try {
    const { name, discount, maxDiscountAmount, minAmount, expiry, code } =
      req.body;
    const coupon = new couponModel({
      name,
      discount,
      maxDiscountAmount,
      minAmount,
      expiry,
      code,
    });
    coupon.save((err, data) => {
      res.redirect("/admin/coupons");
    });
  } catch (err) {
    res.redirect("/admin/coupons");
  }
}

export async function getEditCoupon(req, res) {
  const _id = req.params.id;
  let coupon = await couponModel.findOne({ _id });
  const expiry = moment(coupon.expiry).utc().format("YYYY-MM-DD");
  const { name, code, discount, maxDiscountAmount, minAmount } = coupon;
  res.render("admin/editCoupon", {
    coupon: { name, _id, code, discount, maxDiscountAmount, minAmount, expiry },
  });
}

export async function editCoupon(req, res) {
  try {
    const { name, discount, maxDiscountAmount, minAmount, expiry, code, _id } =
      req.body;

    await couponModel.findByIdAndUpdate(_id, {
      $set: {
        name,
        discount,
        maxDiscountAmount,
        minAmount,
        expiry,
        code,
      },
    });
    res.redirect("/admin/coupons");
  } catch (err) {
    res.redirect("/admin/coupons");
  }
}

export async function listCoupon(req, res) {
  try {
    const _id = req.params.id;
    await couponModel.updateOne({ _id }, { $set: { unlist: false } });
    res.redirect("/admin/coupons");
  } catch (err) {
    res.redirect("/admin/coupons");
  }
}
export async function unListCoupon(req, res) {
  try {
    const _id = req.params.id;
    await couponModel.updateOne({ _id }, { $set: { unlist: true } });
    res.redirect("/admin/coupons");
  } catch (err) {
    res.redirect("/admin/coupons");
  }
}

export async function editOrder(req, res) {
  const { status, _id } = req.body;
  if(!status){
    return res.redirect("/admin/orders")
  }
  if(status=='returned'){
    const order=await orderModel.findOne({_id});
    await orderModel.updateOne(
      { _id },
      {
        $set: {
          orderStatus: status,
        },
      }
    );
    await UserModel.updateOne({_id:order.userId}, {$inc:{wallet:order.total}})
  }
  if (status == "delivered") {
    await orderModel.updateOne(
      { _id },
      {
        $set: {
          paid: true,
          orderStatus: status,
          dispatch:new Date()
        },
      }
    );
    return res.redirect("/admin/orders");
  }
  await orderModel.updateOne(
    { _id },
    {
      $set: {
        orderStatus: status,
      },
    }
  );
  return res.redirect("/admin/orders");
}
