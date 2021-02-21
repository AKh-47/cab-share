import mongoose, { Document } from "mongoose";

interface ITrip extends Document {}

const customerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  fare: {
    type: Number,
  },
});

const tripSchema = new mongoose.Schema({
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Driver",
  },
  customers: [customerSchema],
  hasEnded: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model<ITrip>("Trip", tripSchema);
