import { NextRequest } from "next/server";
import { getAuthUserFromRequest } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { fail, ok } from "@/lib/response";
import Event from "@/models/Event";
import MessageLog from "@/models/MessageLog";

export async function GET(req: NextRequest) {
  const auth = getAuthUserFromRequest(req);
  if (!auth) {
    return fail("Unauthorized", 401);
  }

  await connectDb();

  const eventId = req.nextUrl.searchParams.get("eventId");
  const organizerEvents = await Event.find({ organizerId: auth.userId }).select("_id title");

  const eventIds = organizerEvents.map((event) => event._id.toString());

  const filters: Record<string, unknown> = {
    eventId: { $in: eventIds },
  };

  if (eventId) {
    if (!eventIds.includes(eventId)) {
      return fail("Forbidden", 403);
    }
    filters.eventId = eventId;
  }

  const logs = await MessageLog.find(filters)
    .populate("eventId", "title")
    .populate("attendeeId", "name email")
    .sort({ timestamp: -1 });

  return ok({ logs });
}
