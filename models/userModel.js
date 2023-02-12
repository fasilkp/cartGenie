import mongoose from 'mongoose'
const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    ban:{
        type:Boolean,
        default:false
    },
    address:{
        type:Array,
        default:[]
    },
    cart:{ 
        type:Array,
        default:[]
    },
    wishlist:{
        type:Array,
        default:[]
    },
    wallet:{
        type:Number, 
        default:0
    }
},{timestamps:true})
const UserModel= mongoose.model("users", userSchema);
export default UserModel;