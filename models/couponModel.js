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
        type:String,
        required:true
    },
    expiry:{
        type:Date,
        required:true
    }
})
const couponModel= mongoose.model("coupon", couponSchema);
export default couponModel;