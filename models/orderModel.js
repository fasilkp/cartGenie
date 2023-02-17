import mongoose from 'mongoose'
import createId from '../actions/createId.js';
const orderSchema= new mongoose.Schema({
    orderStatus:{
        type:String,
        default:"pending"
    },
    paid:{
        type:Boolean,
        required:true,
        default:false
    },
    address:{
        type:Object,
        required:true
    },
    product:{
        type:Object,
        required:true
    },
    createdAt:{
        type:Date,
        default: new Date()
    },
    userId:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    dispatch:{
        type:Date,
        default: new Date(new Date().setDate(new Date().getDate() + 7))
    },
    payment:{
        type:Object,
        default:{}
    },
    paymentType:{
        type:String,
        default:'cod'
    },
    total:{
        type:Number,
        required:true
    },
    amountPayable:{
        type:Number,
        default:0
    },
    coupon:{
        type:Object,
        default:{applied:false, price:0, coupon:{}}
    },
    orderId:{
        type:Number,
        default:0,
    }
},{timestamps:true})
const orderModel= mongoose.model("order", orderSchema);
export default orderModel;