import mongoose from "mongoose";

const adminModel = mongoose.model('admins', {name:String, email:String, password:String});

adminModel.find().then((data)=>{
    console.log(data)
})

export default adminModel