import mongoose, { Document } from "mongoose";

interface IDriver extends Document {
  name: string;
  cab: string;
  rating: number;
  isAvailable: boolean;
  currentLocation: boolean;
  inTrip: boolean;
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
  cab: cabSchema,
  rating: {
    type: Number,
    required: true,
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

export default mongoose.model<IDriver>("Driver", driverSchema);
