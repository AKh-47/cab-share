import mongoose, { Document } from "mongoose";

interface IUser extends Document {
  name: string;
}

const savedLocationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  isLooking: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    required: true,
  },
  home: savedLocationSchema,
  savedLocations: [savedLocationSchema],
});

export default mongoose.model<IUser>("User", userSchema);
