import mongoose from 'mongoose'


export default function dbConnect(){
    mongoose.set('strictQuery', true);
    mongoose.connect("mongodb://localhost:27017/eCart").then(()=>{
        console.log("Database connected")
    }).catch(err=>{
        console.log("database connection failed : ", err)
    })
}