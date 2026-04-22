import mongoose from "mongoose";
import { NextRequest } from "next/server";
import { getAuthUserFromRequest } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { sendEventUpdateEmail } from "@/lib/email";
import { fail, ok } from "@/lib/response";
import { eventSchema } from "@/lib/validation";
import { sendEventUpdateWhatsapp } from "@/lib/whatsapp";
import Event from "@/models/Event";
import MessageLog from "@/models/MessageLog";
import Registration from "@/models/Registration";

function validObjectId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthUserFromRequest(_);
  const { id } = await params;
  if (!validObjectId(id)) {
    return fail("Invalid event ID", 400);
  }

  await connectDb();
  const event = await Event.findById(id);

  if (!event) {
    return fail("Event not found", 404);
  }

  // Show published or cancelled events to public
  // Hide draft events unless organizer
  if (event.status === "draft") {
    if (!auth || event.organizerId.toString() !== auth.userId) {
      return fail("Event not found", 404);
    }
  }

  return ok({ event });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthUserFromRequest(req);
  if (!auth) {
    return fail("Unauthorized", 401);
  }

  const { id } = await params;
  if (!validObjectId(id)) {
    return fail("Invalid event ID", 400);
  }

  const body = await req.json();
  const parsed = eventSchema.safeParse(body);

  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Invalid payload", 422);
  }

  await connectDb();
  const event = await Event.findById(id);

  if (!event) {
    return fail("Event not found", 404);
  }

  if (event.organizerId.toString() !== auth.userId) {
    return fail("Forbidden", 403);
  }

  const previous = {
    title: event.title,
    description: event.description,
    dateTime: new Date(event.dateTime),
    locationType: event.locationType,
    rsvpMode: event.rsvpMode,
    venue: event.venue,
    capacity: event.capacity,
    status: event.status,
    templateType: event.templateType,
    whatsappEnabled: event.whatsappEnabled,
  };

  event.title = parsed.data.title;
  event.description = parsed.data.description;
  event.dateTime = new Date(parsed.data.dateTime);
  event.locationType = parsed.data.locationType;
  event.rsvpMode = parsed.data.rsvpMode;
  event.venue = parsed.data.venue;
  event.capacity = parsed.data.capacity;
  event.status = parsed.data.status;
  event.templateType = parsed.data.templateType;
  event.whatsappEnabled = parsed.data.whatsappEnabled;

  await event.save();

  const updated = {
    title: event.title,
    description: event.description,
    dateTime: new Date(event.dateTime),
    locationType: event.locationType,
    rsvpMode: event.rsvpMode,
    venue: event.venue,
    capacity: event.capacity,
    status: event.status,
    templateType: event.templateType,
    whatsappEnabled: event.whatsappEnabled,
  };

  const changedFields: string[] = [];
  if (previous.title !== updated.title) changedFields.push("title");
  if (previous.description !== updated.description) changedFields.push("description");
  if (previous.dateTime.getTime() !== updated.dateTime.getTime()) changedFields.push("date and time");
  if (previous.locationType !== updated.locationType) changedFields.push("location mode");
  if (previous.rsvpMode !== updated.rsvpMode) changedFields.push("RSVP mode");
  if (previous.venue !== updated.venue) changedFields.push("venue");
  if (previous.capacity !== updated.capacity) changedFields.push("capacity");
  if (previous.status !== updated.status) changedFields.push("status");

  if (changedFields.length > 0) {
    const attendees = await Registration.find({ eventId: event._id }).select("name email phone");
    const updateType = event.status === "cancelled" ? "cancelled" : "updated";
    const updateSummary = changedFields.join(", ");
    const isRepublish = previous.status === "cancelled" && event.status !== "cancelled";

    await Promise.all(
      attendees.map(async (attendee) => {
        try {
          await sendEventUpdateEmail({
            attendeeName: attendee.name,
            attendeeEmail: attendee.email,
            eventTitle: event.title,
            eventDate: event.dateTime,
            venue: event.venue,
            updateType,
            updateSummary,
            isRepublish,
          });
        } catch (emailError) {
          console.error("Event update email error:", emailError);
        }

        if (event.whatsappEnabled) {
          const log = await MessageLog.create({
            eventId: event._id,
            attendeeId: attendee._id,
            type: `event_${updateType}`,
            status: "Pending",
          });

          try {
            const result = await sendEventUpdateWhatsapp({
              attendeeName: attendee.name,
              phone: attendee.phone,
              eventTitle: event.title,
              eventDate: event.dateTime,
              venue: event.venue,
              updateType,
              updateSummary,
            });

            await MessageLog.findByIdAndUpdate(log._id, {
              status: result.sent ? "Sent" : "Failed",
            });

            if (!result.sent) {
              console.error("Event update WhatsApp error:", result.error);
            }
          } catch (whatsappError) {
            console.error("Event update WhatsApp error:", whatsappError);
            await MessageLog.findByIdAndUpdate(log._id, { status: "Failed" });
          }
        }
      }),
    );
  }

  return ok({ event });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthUserFromRequest(req);
  if (!auth) {
    return fail("Unauthorized", 401);
  }

  const { id } = await params;
  if (!validObjectId(id)) {
    return fail("Invalid event ID", 400);
  }

  await connectDb();
  const event = await Event.findById(id);

  if (!event) {
    return fail("Event not found", 404);
  }

  if (event.organizerId.toString() !== auth.userId) {
    return fail("Forbidden", 403);
  }

  await Event.findByIdAndDelete(id);
  return ok({ success: true });
}
