import mongoose, { Document } from "mongoose";

interface IReview extends Document {
  by: string;
  for: string;
  rating: number;
  message: string;
}

const reviewSchema = new mongoose.Schema({
  by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  for: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Driver",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
  },
});

export default mongoose.model<IReview>("Review", reviewSchema);
