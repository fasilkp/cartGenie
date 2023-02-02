import mongoose from 'mongoose'
const categorySchema= new mongoose.Schema({
    category:{
        type:String,
        required:true
    },
    unlist:{
        type:Boolean,
        default:false
    }
})
const categoryModel= mongoose.model("category", categorySchema);
export default categoryModel;