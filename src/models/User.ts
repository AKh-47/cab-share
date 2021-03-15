import mongoose, { Document } from "mongoose";
import bcrypt from "bcrypt";

interface ISavedLocation {
  name: string;
  location: string;
}

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  isLooking: boolean;
  isLookingForShare: boolean;
  rating: number;
  home: ISavedLocation;
  savedLocations: ISavedLocation[];
  city: string;
  // currentLocation: string;
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
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  },
  password: {
    type: String,
    required: true,
  },
  isLooking: {
    type: Boolean,
    default: false,
  },
  isLookingForshare: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  home: savedLocationSchema,
  savedLocations: [savedLocationSchema],
  city: {
    type: String,
    required: true,
    index: true,
  },
  // currentLocation: {
  //   type: String,
  // },
});

userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword: string) {
  // @ts-ignore
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model<IUser>("User", userSchema);
