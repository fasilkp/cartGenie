import mongoose from 'mongoose'

const productSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true
    },
    categoryId:{
        type:String,
        default:""
    },
    brand:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    MRP:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    mainImage:{
        type:Object,
        required:true
    },
    sideImages:{
        type: Array,
        required:true,
    },
    unlist:{
        type:Boolean,
        default:false
    },
    uploadedAt:{
        type:Date,
        default:new Date()
    },
    ratings:{
        type:Array,
        default:[]
    },
    reviews:{
        type:Array,
        default:[]
    }
},{timestamps:true})
const productModel= mongoose.model("product", productSchema);
export default productModel;