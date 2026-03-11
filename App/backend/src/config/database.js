import mongoose from "mongoose";
import "dotenv/config";

const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.DB_ADD);
        console.log("Database Connected");
    }catch(err){
        console.log(err.message);
        process.exit(1);
    }
}

export default connectDB;
