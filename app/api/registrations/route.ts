import mongoose from "mongoose";
import { NextRequest } from "next/server";
import { recomputeEventCapacity } from "@/lib/capacity";
import { connectDb } from "@/lib/db";
import { sendRegistrationConfirmationEmail } from "@/lib/email";
import { fail, ok } from "@/lib/response";
import { registrationSchema } from "@/lib/validation";
import { sendRegistrationConfirmationWhatsapp } from "@/lib/whatsapp";
import Event from "@/models/Event";
import MessageLog from "@/models/MessageLog";
import Registration from "@/models/Registration";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registrationSchema.safeParse(body);

    if (!parsed.success) {
      return fail(parsed.error.issues[0]?.message ?? "Invalid payload", 422);
    }

    if (!mongoose.Types.ObjectId.isValid(parsed.data.eventId)) {
      return fail("Invalid event ID", 400);
    }

    await connectDb();

    const event = await Event.findById(parsed.data.eventId);
    if (!event) {
      return fail("Event not found", 404);
    }

    if (event.status === "cancelled") {
      return fail("Event is cancelled", 409);
    }

    if (event.isFull) {
      return fail("Event is full", 409);
    }

    if (event.whatsappEnabled && !parsed.data.phone) {
      return fail("Phone is required when WhatsApp is enabled", 422);
    }

    const rsvpMode = event.rsvpMode ?? "open";
    const initialStatus = rsvpMode === "open" ? "approved" : "pending";

    const registration = await Registration.create({
      ...parsed.data,
      eventId: event._id,
      phone: parsed.data.phone || undefined,
      status: initialStatus,
    });

    let messageLogId: string | null = null;

    if (event.whatsappEnabled) {
      const log = await MessageLog.create({
        eventId: event._id,
        attendeeId: registration._id,
        type: `registration_${initialStatus}`,
        status: "Pending",
      });
      messageLogId = log._id.toString();
    }

    await recomputeEventCapacity(event._id.toString());

    try {
      await sendRegistrationConfirmationEmail({
        attendeeName: registration.name,
        attendeeEmail: registration.email,
        eventTitle: event.title,
        eventDate: event.dateTime,
        venue: event.venue,
        rsvpMode,
      });
    } catch (emailError) {
      console.error("Registration email error:", emailError);
    }

    if (event.whatsappEnabled && messageLogId) {
      try {
        const result = await sendRegistrationConfirmationWhatsapp({
          attendeeName: registration.name,
          phone: registration.phone,
          eventTitle: event.title,
          eventDate: event.dateTime,
          venue: event.venue,
          rsvpMode,
        });

        await MessageLog.findByIdAndUpdate(messageLogId, {
          status: result.sent ? "Sent" : "Failed",
        });

        if (!result.sent) {
          console.error("Registration WhatsApp error:", result.error);
        }
      } catch (whatsappError) {
        console.error("Registration WhatsApp error:", whatsappError);
        await MessageLog.findByIdAndUpdate(messageLogId, { status: "Failed" });
      }
    }

    return ok({ registration }, 201);
  } catch (error) {
    if ((error as { code?: number })?.code === 11000) {
      return fail("You are already registered for this event", 409);
    }
    return fail("Unable to create registration", 500);
  }
}
