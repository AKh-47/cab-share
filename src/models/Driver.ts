import mongoose, { Document } from "mongoose";
import bcrypt from "bcrypt";

interface ICab {
  name: string;
  numberPlate: string;
  capacity: number;
}

interface IDriver extends Document {
  name: string;
  email: string;
  password: string;
  cab: ICab;
  rating: number;
  isAvailable: boolean;
  inTrip: boolean;
  currentLocation: boolean;
}

const cabSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  numberPlate: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
});

const driverSchema = new mongoose.Schema({
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
  cab: {
    type: cabSchema,
    required: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  // IsAvailable if driver is willing to work
  // inTrip if she is in a trip
  isAvailable: {
    type: Boolean,
    default: false,
  },
  inTrip: {
    type: Boolean,
    default: false,
  },
  currentLocation: {
    type: String,
    default: JSON.stringify({
      lat: 23.8068768,
      lng: -118.3527671,
    }),
  },
  city: {
    type: String,
    required: true,
    index: true,
  },
});

// driverSchema.statics.toggleAvailability = function (id: string, callback: any) {
//
// };

driverSchema.pre<IDriver>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

driverSchema.methods.matchPassword = async function (enteredPassword: string) {
  // @ts-ignore
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model<IDriver>("Driver", driverSchema);
