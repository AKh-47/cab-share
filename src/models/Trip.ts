import mongoose, { Document } from "mongoose";

interface ICustomer {
  user: mongoose.Schema.Types.ObjectId;
  from: string;
  to: string;
  fare: number;
}

interface ITrip extends Document {
  driver: mongoose.Schema.Types.ObjectId;
  customers: ICustomer[];
  hasEnded: boolean;
  solo: boolean;
}

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
  solo: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model<ITrip>("Trip", tripSchema);
