import mongoose from 'mongoose'


export default function dbConnect(){
    mongoose.set('strictQuery', true);
    // "mongodb://localhost:27017/eCart"
    // process.env.DB_CONFIG
    mongoose.connect(process.env.DB_CONFIG).then(()=>{
        console.log("Database connected")
    }).catch(err=>{
        console.log("database connection failed : ", err)
    })
}