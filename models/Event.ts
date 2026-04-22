import mongoose, { Model, Schema, Types } from "mongoose";

export type EventDocument = {
  _id: Types.ObjectId;
  title: string;
  description: string;
  dateTime: Date;
  locationType: "online" | "offline";
  rsvpMode: "open" | "shortlisted";
  venue: string;
  capacity: number;
  status: "draft" | "published" | "cancelled";
  organizerId: Types.ObjectId;
  templateType: string;
  whatsappEnabled: boolean;
  isFull: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const EventSchema = new Schema<EventDocument>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    dateTime: { type: Date, required: true },
    locationType: {
      type: String,
      enum: ["online", "offline"],
      required: true,
    },
    rsvpMode: {
      type: String,
      enum: ["open", "shortlisted"],
      default: "open",
      required: true,
    },
    venue: { type: String, required: true },
    capacity: { type: Number, required: true },
    status: {
      type: String,
      enum: ["draft", "published", "cancelled"],
      default: "draft",
      required: true,
    },
    organizerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    templateType: { type: String, required: true },
    whatsappEnabled: { type: Boolean, default: false },
    isFull: { type: Boolean, default: false },
  },
  { timestamps: true },
);

EventSchema.index({ organizerId: 1, createdAt: -1 });

const existingEventModel = mongoose.models.Event as Model<EventDocument> | undefined;

if (existingEventModel && !existingEventModel.schema.path("rsvpMode")) {
  delete (mongoose.models as Record<string, Model<unknown>>).Event;
}

const Event: Model<EventDocument> =
  (mongoose.models.Event as Model<EventDocument> | undefined) ||
  mongoose.model<EventDocument>("Event", EventSchema);

export default Event;
