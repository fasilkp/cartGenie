import mongoose from 'mongoose'
const offerSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    url:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    }
},{timestamps:true})
const offerModel= mongoose.model("offer", offerSchema);
export default offerModel;