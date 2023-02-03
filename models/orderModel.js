import mongoose from 'mongoose'
const orderSchema= new mongoose.Schema({
    orederStatus:{
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
    }
})
const orderModel= mongoose.model("order", orderSchema);
export default orderModel;