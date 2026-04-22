import mongoose, { Model, Schema, Types } from "mongoose";

export type RegistrationDocument = {
  _id: Types.ObjectId;
  eventId: Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
};

const RegistrationSchema = new Schema<RegistrationDocument>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      required: true,
    },
  },
  { timestamps: true },
);

RegistrationSchema.index({ eventId: 1, createdAt: -1 });
RegistrationSchema.index({ eventId: 1, email: 1 }, { unique: true });

const Registration: Model<RegistrationDocument> =
  mongoose.models.Registration ||
  mongoose.model<RegistrationDocument>("Registration", RegistrationSchema);

export default Registration;
