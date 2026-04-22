import mongoose, { Model, Schema, Types } from "mongoose";

export type MessageLogDocument = {
  _id: Types.ObjectId;
  eventId: Types.ObjectId;
  attendeeId: Types.ObjectId;
  type: string;
  status: "Pending" | "Sent" | "Failed";
  timestamp: Date;
};

const MessageLogSchema = new Schema<MessageLogDocument>({
  eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
  attendeeId: {
    type: Schema.Types.ObjectId,
    ref: "Registration",
    required: true,
  },
  type: { type: String, required: true },
  status: {
    type: String,
    enum: ["Pending", "Sent", "Failed"],
    default: "Pending",
    required: true,
  },
  timestamp: { type: Date, default: Date.now, required: true },
});

MessageLogSchema.index({ eventId: 1, timestamp: -1 });

const MessageLog: Model<MessageLogDocument> =
  mongoose.models.MessageLog ||
  mongoose.model<MessageLogDocument>("MessageLog", MessageLogSchema);

export default MessageLog;
