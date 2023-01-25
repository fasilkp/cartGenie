import mongoose from "mongoose";

const adminModel = mongoose.model('admins', {name:String, email:String, password:String});


export default adminModel