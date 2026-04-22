export type EventStatus = "draft" | "published" | "cancelled";
export type RegistrationStatus = "pending" | "approved" | "rejected";
export type RsvpMode = "open" | "shortlisted";

export type EventItem = {
  _id: string;
  title: string;
  description: string;
  dateTime: string;
  locationType: "online" | "offline";
  rsvpMode: RsvpMode;
  venue: string;
  capacity: number;
  status: EventStatus;
  organizerId: string;
  templateType: string;
  whatsappEnabled: boolean;
  isFull: boolean;
};

export type RegistrationItem = {
  _id: string;
  eventId: string;
  name: string;
  email: string;
  phone?: string;
  status: RegistrationStatus;
  createdAt: string;
};

export type MessageLogItem = {
  _id: string;
  type: string;
  status: "Pending" | "Sent" | "Failed";
  timestamp: string;
  eventId: { _id: string; title: string };
  attendeeId: { _id: string; name: string; email: string };
};
