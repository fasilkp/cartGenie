import mongoose from 'mongoose'
const couponSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    code:{
        type:String,
        required:true
    },
    minAmount:{
        type:Number,
        required:true
    },
    discount:{
        type:Number,
        required:true
    },
    maxDiscountAmount:{
        type:Number,
        required:true
    },
    expiry:{
        type:Date,
        required:true
    },
    unlist:{
        type:Boolean,
        default:false
    }
},{timestamps:true})
const couponModel= mongoose.model("coupon", couponSchema);
export default couponModel;