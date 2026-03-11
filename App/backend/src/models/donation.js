import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    reciever: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ngo"
    },
    location: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    foodDesc: {
        type: String,
        required: true
    },
    pickupTime:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        required:true,
        default: false
    },
    images: {
        type: [String],
        default: []
    }
}, { timestamps: true });

export default mongoose.model("Donation",donationSchema);