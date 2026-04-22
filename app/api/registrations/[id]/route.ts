import mongoose from "mongoose";
import { NextRequest } from "next/server";
import { getAuthUserFromRequest } from "@/lib/auth";
import { recomputeEventCapacity } from "@/lib/capacity";
import { connectDb } from "@/lib/db";
import { sendRegistrationDecisionEmail } from "@/lib/email";
import { fail, ok } from "@/lib/response";
import { registrationStatusSchema } from "@/lib/validation";
import { sendRegistrationDecisionWhatsapp } from "@/lib/whatsapp";
import Event from "@/models/Event";
import MessageLog from "@/models/MessageLog";
import Registration from "@/models/Registration";

function isObjectId(value: string) {
  return mongoose.Types.ObjectId.isValid(value);
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthUserFromRequest(req);
  if (!auth) {
    return fail("Unauthorized", 401);
  }

  const { id } = await params;
  if (!isObjectId(id)) {
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

  const query = req.nextUrl.searchParams.get("q")?.trim();
  const status = req.nextUrl.searchParams.get("status")?.trim();

  const filters: Record<string, unknown> = { eventId: id };

  if (status && ["pending", "approved", "rejected"].includes(status)) {
    filters.status = status;
  }

  if (query) {
    filters.$or = [
      { name: { $regex: query, $options: "i" } },
      { email: { $regex: query, $options: "i" } },
      { phone: { $regex: query, $options: "i" } },
    ];
  }

  const registrations = await Registration.find(filters).sort({ createdAt: -1 });
  const approvedCount = await Registration.countDocuments({ eventId: id, status: "approved" });

  return ok({ registrations, approvedCount, capacity: event.capacity, isFull: event.isFull });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthUserFromRequest(req);
  if (!auth) {
    return fail("Unauthorized", 401);
  }

  const { id } = await params;
  if (!isObjectId(id)) {
    return fail("Invalid registration ID", 400);
  }

  const body = await req.json();
  const parsed = registrationStatusSchema.safeParse(body);

  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Invalid payload", 422);
  }

  await connectDb();

  const registration = await Registration.findById(id);
  if (!registration) {
    return fail("Registration not found", 404);
  }

  const event = await Event.findById(registration.eventId);
  if (!event) {
    return fail("Event not found", 404);
  }

  if (event.organizerId.toString() !== auth.userId) {
    return fail("Forbidden", 403);
  }

  const nextStatus = parsed.data.status;

  if (
    registration.status !== "approved" &&
    nextStatus === "approved" &&
    (event.status === "cancelled" || event.isFull)
  ) {
    return fail("Cannot approve because event is full or cancelled", 409);
  }

  const previousStatus = registration.status;
  registration.status = nextStatus;
  await registration.save();

  const recalculated = await recomputeEventCapacity(event._id.toString());

  if (previousStatus !== nextStatus && (nextStatus === "approved" || nextStatus === "rejected")) {
    let messageLogId: string | null = null;

    if (event.whatsappEnabled) {
      const log = await MessageLog.create({
        eventId: event._id,
        attendeeId: registration._id,
        type: `registration_${nextStatus}`,
        status: "Pending",
      });
      messageLogId = log._id.toString();
    }

    try {
      await sendRegistrationDecisionEmail({
        attendeeName: registration.name,
        attendeeEmail: registration.email,
        eventTitle: event.title,
        status: nextStatus,
      });
    } catch (emailError) {
      console.error("Decision email error:", emailError);
    }

    if (event.whatsappEnabled && messageLogId) {
      try {
        const result = await sendRegistrationDecisionWhatsapp({
          attendeeName: registration.name,
          phone: registration.phone,
          eventTitle: event.title,
          status: nextStatus,
        });

        await MessageLog.findByIdAndUpdate(messageLogId, {
          status: result.sent ? "Sent" : "Failed",
        });

        if (!result.sent) {
          console.error("Decision WhatsApp error:", result.error);
        }
      } catch (whatsappError) {
        console.error("Decision WhatsApp error:", whatsappError);
        await MessageLog.findByIdAndUpdate(messageLogId, { status: "Failed" });
      }
    }
  }

  return ok({
    registration,
    approvedCount: recalculated?.approvedCount ?? 0,
    isFull: recalculated?.isFull ?? false,
  });
}
