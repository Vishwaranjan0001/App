import mongoose from "mongoose";

const ngoSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required : true
        },
        email:{
            type:String,
            required:true,
            unique: true
        },
        password:{
            type:String,
            required:true
        },
        location:{
            type:String,
            required:true
        },
        capacity:{
            type:String,
            required:true
        },
        // optional wishlist links that the NGO can provide
        wishlists: [
            {
                title: { type: String },
                url: { type: String }
            }
        ]
    },
    {timestamps:true}
);

export default mongoose.model("NGOs",ngoSchema);