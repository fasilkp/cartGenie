import offerModel from "../models/offerModel.js";
import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import userModel from "../models/userModel.js";
import UserModel from "../models/userModel.js";
import createId from "../actions/createId.js";
import orderModel from "../models/orderModel.js";
import couponModel from "../models/couponModel.js";
import bcrypt from "bcryptjs";
import axios from "axios";
var salt = bcrypt.genSaltSync(10);

export async function getHome(req, res) {
  const offers = await offerModel.find().lean();
  const products = await productModel.find({ unlist: false }).limit(8).lean();
  res.render("user/home", { offers, products, key: "" });
}
export async function getProductList(req, res) {
  const category = req.query.category ?? "";
  const key = req.query.key ?? "";
  const filter = req.query.filter ?? "";
  const page = req.query.page ?? 0;
  let count = 0;
  let products = [];
  if (filter == 0) {
    products = await productModel
      .find({
        name: new RegExp(key, "i"),
        categoryId: new RegExp(category, "i"),
        unlist: false,
      })
      .sort({ uploadedAt: -1 })
      .skip(page * 9)
      .limit(9)
      .lean();
    count = products.length;
  } else {
    products = await productModel
      .find({
        name: new RegExp(key, "i"),
        categoryId: new RegExp(category, "i"),
        unlist: false,
      })
      .sort({ price: filter })
      .skip(page * 9)
      .limit(9)
      .lean();
    count = products.length;
  }
  const categories = await categoryModel.find().lean();
  let pageCount = Math.floor(count / 9);
  return res.render("user/productList", {
    products,
    categories,
    key,
    category,
    filter,
    pageCount,
    page,
  });
}

export async function getProduct(req, res) {
  try {
    const proId = req.params.id;
    const product = await productModel.findOne({ _id: proId, unlist: false });

    let reviewUserIds = product.reviews.map((item) => item.userId);

    const reviewUsers = await userModel
      .find({ _id: { $in: reviewUserIds } })
      .lean();

    product.reviews.forEach((item, index) => {
      product.reviews[index].userName = reviewUsers[index].name;
    });
    let rating = 0;
    let ratings = {};
    product.ratings.forEach((item) => {
      ratings = { ...ratings, [item.userId]: item.rating };
      rating = rating + parseInt(item.rating);
    });
    rating = rating / product.ratings.length;
    if (req?.user?.wishlist?.includes(proId)) {
      return res.render("user/product", {
        product,
        key: "",
        wish: true,
        rating: Math.floor(rating),
        ratings,
      });
    } else {
      return res.render("user/product", {
        product,
        key: "",
        wish: false,
        rating: Math.floor(rating),
        ratings,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(404).render("partials/error404");
  }
}
export async function getWishlist(req, res) {
  const wishlist = req?.user?.wishlist ?? [];
  const products = await productModel
    .find({ _id: { $in: wishlist }, unlist: false })
    .lean();
  res.render("user/wishlist", { key: "", products });
}
export async function getCart(req, res) {
  const cart = req?.user?.cart ?? [];
  const cartQuantities = {};
  const cartList = cart.map((item) => {
    cartQuantities[item.id] = item.quantity;
    return item.id;
  });
  const products = await productModel
    .find({ _id: { $in: cartList }, unlist: false })
    .lean();
  let totalPrice = 0;
  products.forEach((item, index) => {
    products[index].cartQuantity = cartQuantities[item._id];
    totalPrice = totalPrice + item.price * cartQuantities[item._id];
  });
  let totalMRP = 0;
  products.forEach((item, index) => {
    totalMRP = totalMRP + item.MRP * cartQuantities[item._id];
  });
  res.render("user/cart", { key: "", products, totalPrice, cart, totalMRP });
}
export async function getOrderHistory(req, res) {
  const orders = await orderModel
    .find({ userId: req.session.user.id })
    .sort({ createdAt: -1 })
    .lean();
  res.render("user/orderHistory", { key: "", orders });
}
export function getCheckout(req, res) {
  let address = req.user.address;
  res.render("user/checkout", { key: "", address, error: false });
}

export async function checkQuantity(req, res){
  let address = req.user.address;
  const cart = req?.user?.cart ?? [];
  let cartQuantities={}
  const cartList = cart.map((item) =>{
    cartQuantities[item.id]=item.quantity
    return  item.id
  });
  let products = await productModel
    .find({ _id: { $in: cartList }, unlist: false })
    .lean();
    let quantityError=false;
    let outOfQuantity=[]
    console.log(cartQuantities)
  for(let item of products){
    console.log(item.quantity, cartQuantities[item._id])
    if(item.quantity<cartQuantities[item._id]){
      quantityError=true
      outOfQuantity.push({id:item._id, balanceQuantity:item.quantity})
    }else{
    }
  }
  if(quantityError){
    return res.json({error:true, outOfQuantity})
  }
  return res.json({error:false})
}

export async function getPayment(req, res) {
  const addressId = req.params.id;
  console.log(addressId);
  const cart = req?.user?.cart ?? [];
  const cartList = cart.map((item) => {
    return item.id;
  });
  const products = await productModel
    .find({ _id: { $in: cartList }, unlist: false }, { price: 1 })
    .lean();
  let totalPrice = 0;
  products.forEach((item, index) => {
    totalPrice = (totalPrice + item.price) * cart[index].quantity;
  });
  res.render("user/payment", {
    key: "",
    totalPrice,
    couponPrice: 0,
    error: false,
    addressId,
  });
}
export function getAddAddress(req, res) {
  res.render("user/addAddress", { key: "", redirect: req.query.redirect });
}
export async function getEditAddress(req, res) {
  let { address } = await userModel.findOne(
    { "address.id": req.params.id },
    { _id: 0, address: { $elemMatch: { id: req.params.id } } }
  );

  res.render("user/editAddress", { key: "", address: address[0] });
}
export async function getOrderProduct(req, res) {
  try {
    const order = await orderModel.findOne({
      _id: req.params.id,
      userId: req.session.user.id,
    });
    let ratingData = await productModel.findOne(
      { "ratings.userId": req.session.user.id, _id: order.product._id },
      { _id: 0, ratings: { $elemMatch: { userId: req.session.user.id } } }
    );
    let reviewData = await productModel.findOne(
      { "reviews.userId": req.session.user.id, _id: order.product._id },
      { _id: 0, reviews: { $elemMatch: { userId: req.session.user.id } } }
    );
    let rating = ratingData?.ratings[0].rating ?? "";
    let review = reviewData?.reviews[0].review ?? "";

    return res.render("user/orderedProduct", {
      key: "",
      order,
      rating,
      review,
    });
  } catch (err) {
    return res.status(404).render("partials/error404");
  }
}
export function getUserProfile(req, res) {
  res.render("user/userProfile", { key: "", user: req.user });
}
export function getEditProfile(req, res) {
  res.render("user/editProfile", { key: "", user: req.user, error: false });
}
export async function getCoupons(req, res) {
  const coupons = await couponModel
    .find({ unlist: false, expiry: { $gt: new Date() } })
    .lean();
  res.render("user/coupons", { key: "", coupons });
}
export async function getOrderPlaced(req, res) {
  res.render("user/orderPlaced", { key: "", failed:false });
}

export async function addToWishlist(req, res) {
  const _id = req.session.user.id;
  const proId = req.params.id;
  await UserModel.updateOne(
    { _id },
    {
      $addToSet: {
        wishlist: proId,
      },
    }
  );
  res.redirect("back");
}

export async function removeFromWishlist(req, res) {
  const _id = req.session.user.id;
  const proId = req.params.id;
  await UserModel.updateOne(
    { _id },
    {
      $pull: {
        wishlist: proId,
      },
    }
  );
  res.redirect("back");
}

export async function addToCart(req, res) {
  const _id = req.session.user.id;
  const proId = req.params.id;
  await UserModel.updateOne(
    { _id },
    {
      $pull: {
        wishlist: proId,
      },
      $addToSet: {
        cart: {
          id: proId,
          quantity: 1,
        },
      },
    }
  );
  res.redirect("/cart");
}

export async function removeFromCart(req, res) {
  const _id = req.session.user.id;
  const proId = req.params.id;
  await UserModel.updateOne(
    { _id },
    {
      $pull: {
        cart: { id: proId },
      },
    }
  );
  res.redirect("/cart");
}

export async function addAddress(req, res) {
  const { name, mobile, pincode, locality, address, city, state, redirect } =
    req.body;
  await userModel.updateOne(
    { _id: req.session.user.id },
    {
      $addToSet: {
        address: {
          name,
          mobile,
          pincode,
          locality,
          address,
          city,
          state,
          id: createId(),
        },
      },
    }
  );
  res.redirect("/" + redirect);
}
export async function deleteAddress(req, res) {
  await userModel.updateOne(
    {
      _id: req.session.user.id,
      address: { $elemMatch: { id: req.params.id } },
    },
    {
      $pull: {
        address: {
          id: req.params.id,
        },
      },
    }
  );
  res.redirect("/profile");
}

export async function editAddress(req, res) {
  await userModel.updateOne(
    { _id: req.session.user.id, address: { $elemMatch: { id: req.body.id } } },
    {
      $set: {
        "address.$": req.body,
      },
    }
  );
  res.redirect("/profile");
}

export async function addQuantity(req, res) {
  const user=await userModel.updateOne(
    { _id: req.session.user.id, cart: { $elemMatch: { id: req.params.id } } },
    {
      $inc: {
        "cart.$.quantity": 1,
      },
    }
  );
  res.json({user})
}

export async function minusQuantity(req, res) {
  let { cart } = await userModel.findOne(
    { "cart.id": req.params.id },
    { _id: 0, cart: { $elemMatch: { id: req.params.id } } }
  );
  console.log(req.params.id);
  if (cart[0].quantity <= 1) {
    await UserModel.updateOne(
      { _id: req.session.user.id },
      {
        $pull: {
          cart: { id: req.params.id },
        },
      }
    );
    return res.redirect("/cart");
  }
  await userModel.updateOne(
    { _id: req.session.user.id, cart: { $elemMatch: { id: req.params.id } } },
    {
      $inc: {
        "cart.$.quantity": -1,
      },
    }
  );
  return res.redirect("/cart");
}

export async function checkout(req, res) {
  const { payment, address: addressId } = req.body;
  if (!req.body?.address) {
    let address = req.user.address;
    return res.render("user/checkout", {
      key: "",
      address,
      error: true,
      message: "please choose address",
    });
  }

  if (payment != "cod") {
    req.session.tempOrder={...req.session.tempOrder,addressId}
    return res.redirect("/payment/" + addressId);
  }

  const cart = req?.user?.cart ?? [];
  const cartList = cart.map((item) => item.id);
  let { address } = await userModel.findOne(
    { "address.id": addressId },
    { _id: 0, address: { $elemMatch: { id: addressId } } }
  );
  let products = await productModel
    .find({ _id: { $in: cartList }, unlist: false })
    .lean();
  let orders = [];
  let i = 0;
  for (let item of products) {
    await productModel.updateOne(
      { _id: item._id },
      {
        $inc: {
          quantity: -1 * cart[i].quantity,
        },
      }
    );
    orders.push({
      address: address[0],
      product: item,
      userId: req.session.user.id,
      quantity: cart[i].quantity,
      total: cart[i].quantity * item.price,
    });
    i++;
  }

  const order = await orderModel.create(orders);
  await userModel.findByIdAndUpdate(req.session.user.id, {
    $set: { cart: [] },
  });
  return res.redirect("order-placed");
}

export async function applyCoupon(req, res) {
  const { coupon: couponCode } = req.body;
  const cart = req?.user?.cart ?? [];
  const cartList = cart.map((item) => {
    return item.id;
  });
  const products = await productModel
    .find({ _id: { $in: cartList }, unlist: false }, { price: 1 })
    .lean();
  let totalPrice = 0;
  products.forEach((item, index) => {
    totalPrice = (totalPrice + item.price) * cart[index].quantity;
  });
  const coupon = await couponModel.findOne({ code: couponCode });
  if (!coupon) {
    return res.json({
      key: "",
      totalPrice,
      error: true,
      message: "No Coupon Available",
      couponPrice: 0,
    });
  }
  if (totalPrice < coupon.minAmount) {
    return res.json({
      key: "",
      totalPrice,
      error: true,
      message:
        "Coupon not applicaple (minimum amount must be above" +
        coupon.minAmount +
        ")",
      couponPrice: 0,
    });
  }
  if (coupon.expiry < new Date()) {
    return res.json({
      key: "",
      totalPrice,
      error: true,
      message: "Coupon Expired",
      couponPrice: 0,
    });
  }

  let discountAmount = (totalPrice * coupon.discount) / 100;

  if (discountAmount > coupon.maxDiscountAmount) {
    discountAmount = coupon.maxDiscountAmount;
  }
  return res.json({
    key: "",
    totalPrice,
    error: false,
    couponPrice: discountAmount,
  });
}

export async function payNow(req, res) {
  const { addressId, coupon: couponCode } = req.body;
  let { address } = await userModel.findOne(
    { "address.id": addressId },
    { _id: 0, address: { $elemMatch: { id: addressId } } }
  );
  console.log(address);
  const cart = req?.user?.cart ?? [];
  const cartQuantities={}
  const cartList = cart.map((item) => {
    cartQuantities[item.id]=item.quantity
    return item.id
  });
  let products = await productModel
    .find({ _id: { $in: cartList }, unlist: false })
    .lean();
  let totalPrice = 0;
  products.map((item, index) => {
    totalPrice = totalPrice + (item.price* cartQuantities[item._id]);
  });
  const coupon = await couponModel.findOne({ code: couponCode });
  if (coupon) {
    if (totalPrice > coupon.minAmount && coupon.expiry > new Date()) {
      let discountAmount = (totalPrice * coupon.discount) / 100;
      if (discountAmount > coupon.maxDiscountAmount) {
        discountAmount = coupon.maxDiscountAmount;
      }
      totalPrice = totalPrice - discountAmount;
      
    }
  }

  req.session.tempOrder = {
    ...req.session.tempOrder,
    coupon,
    totalPrice
  };

  let orderId = "order_" + createId();
  const options = {
    method: "POST",
    url: "https://sandbox.cashfree.com/pg/orders",
    headers: {
      accept: "application/json",
      "x-api-version": "2022-09-01",
      "x-client-id": process.env.CASHFREE_API_KEY,
      "x-client-secret": process.env.CASHFREE_SECRET_KEY,
      "content-type": "application/json",
    },
    data: {
      order_id: orderId,
      order_amount: totalPrice,
      order_currency: "INR",
      customer_details: {
        customer_id: req.user._id,
        customer_email: req.user.email,
        customer_phone: address[0].mobile,
      },
      order_meta: {
        return_url: "http://localhost:4001/return?order_id={order_id}",
      },
    },
  };

  axios
    .request(options)
    .then(function (response) {
      console.log(response.data);
      res.render("user/paymentScreen", {
        orderId,
        sessionId: response.data.payment_session_id,
      });
    })
    .catch(function (error) {
      console.error(error);
    });
}

export async function returnURL(req, res) {
    try{

   
  
  const order_id = req.query.order_id;
  const options = {
    method: "GET",
    url: "https://sandbox.cashfree.com/pg/orders/" + order_id,
    headers: {
      accept: "application/json",
      "x-api-version": "2022-09-01",
      "x-client-id": process.env.CASHFREE_API_KEY,
      "x-client-secret": process.env.CASHFREE_SECRET_KEY,
      "content-type": "application/json",
    },
  };

  const response = await axios.request(options);

  console.log(response.data);
  if (response.data.order_status == "PAID") {
    const cart = req?.user?.cart ?? [];
    const cartQuantities={}
    const cartList = cart.map((item) => {
    cartQuantities[item.id]=item.quantity;
    return item.id;
  });
    let addressId = req.session.tempOrder.addressId;
    let { address } = await userModel.findOne(
      { "address.id": addressId },
      { _id: 0, address: { $elemMatch: { id: addressId } } }
    );
    let products = await productModel
    .find({ _id: { $in: cartList }, unlist: false })
    .lean();
    console.log(products)
    let orders = [];
    for (let item of products) {
      await productModel.updateOne(
        { _id: item._id },
        {
          $inc: {
              quantity: -1 * cartQuantities[item._id],
            },
        }
        );
        orders.push({
            address: address[0],
            product: item,
            userId: req.session.user.id,
            quantity: cartQuantities[item._id],
            paid:true,
            paymentType:"online", 
            payment:response.data,
            total: cartQuantities[item._id] * item.price,
        });
    }
    
    const order = await orderModel.create(orders);
    await userModel.findByIdAndUpdate(req.session.user.id, {
        $set: { cart: [] },
    });
    return res.render("user/orderPlaced", {key: "",failed:false});
}
res.render("user/orderPlaced", {key: "",failed:true});
}catch(err){
    console.log(err)
    res.render("user/orderPlaced", {key: "",failed:true});
}
}

export async function editProfile(req, res) {
  const { name, email, password } = req.body;
  if (name == "" || email == "") {
    return res.render("user/editProfile", {
      error: true,
      key: "",
      message: "fill every fields",
      user: req.user,
    });
  }
  const user = await userModel.findOne({ email });
  if (bcrypt.compareSync(password, user.password)) {
    await userModel.updateOne(
      { email },
      {
        $set: { email, name },
      }
    );
    return res.redirect("/profile");
  }
  return res.render("user/editProfile", {
    error: true,
    key: "",
    message: "Invalid Password",
    user: req.user,
  });
}

export async function addRating(req, res) {
  const { proId, rating } = req.body;
  console.log(req.body);
  const ratingExist = await productModel.findOne({
    _id: proId,
    ratings: { $elemMatch: { userId: req.session.user.id } },
  });
  console.log(ratingExist);
  if (ratingExist) {
    await productModel.updateOne(
      { _id: proId, ratings: { $elemMatch: { userId: req.session.user.id } } },
      {
        $set: {
          "ratings.$.userId": req.session.user.id,
          "ratings.$.rating": rating,
        },
      }
    );
  } else {
    await productModel.updateOne(
      { _id: proId },
      {
        $addToSet: {
          ratings: {
            userId: req.session.user.id,
            rating,
          },
        },
      }
    );
  }
  res.redirect("back");
}
export async function addReview(req, res) {
  const { proId, review } = req.body;
  console.log(req.body);
  const reviewExist = await productModel.findOne({
    _id: proId,
    reviews: { $elemMatch: { userId: req.session.user.id } },
  });
  if (reviewExist) {
    await productModel.updateOne(
      { _id: proId, reviews: { $elemMatch: { userId: req.session.user.id } } },
      {
        $set: {
          "reviews.$.userId": req.session.user.id,
          "reviews.$.review": review,
        },
      }
    );
  } else {
    await productModel.updateOne(
      { _id: proId },
      {
        $addToSet: {
          reviews: {
            userId: req.session.user.id, 
            review,
          },
        },
      }
    );
  }
  res.redirect("back");
}


export async function cancelOrder(req, res){
  const _id = req.params.id;
  const order= await orderModel.findOne({_id})
  console.log(order)
  if(order.paid){
    await userModel.updateOne({_id:req.session.user.id}, {$inc:{wallet:order.total}})
  }
  await orderModel.updateOne({_id}, {
    $set:{
      orderStatus:"cancelled"
    }
  })
  res.redirect("back")
}

export async function returnOrder(req, res){
  const _id = req.params.id;
  const order= await orderModel.findOne({_id})
  console.log(order)
  await orderModel.updateOne({_id}, {
    $set:{
      orderStatus:"returnProcessing"
    }
  })
  res.redirect("back")
}