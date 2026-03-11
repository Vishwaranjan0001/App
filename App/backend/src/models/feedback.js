import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    donation: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Donation"
    },
    ngo: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "NGOs"
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    comment: {
      type: String,
      required: true
    },
    images: [
      {
        type: String, // URL or path to image
        default: null
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Feedback", feedbackSchema);
