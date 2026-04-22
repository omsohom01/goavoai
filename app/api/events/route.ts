import { NextRequest } from "next/server";
import { getAuthUserFromRequest } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { fail, ok } from "@/lib/response";
import { eventSchema } from "@/lib/validation";
import Event from "@/models/Event";

export async function POST(req: NextRequest) {
  const auth = getAuthUserFromRequest(req);
  if (!auth) {
    return fail("Unauthorized", 401);
  }

  try {
    const body = await req.json();
    const parsed = eventSchema.safeParse(body);

    if (!parsed.success) {
      return fail(parsed.error.issues[0]?.message ?? "Invalid payload", 422);
    }

    await connectDb();

    const event = await Event.create({
      title: parsed.data.title,
      description: parsed.data.description,
      dateTime: new Date(parsed.data.dateTime),
      locationType: parsed.data.locationType,
      rsvpMode: parsed.data.rsvpMode,
      venue: parsed.data.venue,
      capacity: parsed.data.capacity,
      status: parsed.data.status,
      templateType: parsed.data.templateType,
      whatsappEnabled: parsed.data.whatsappEnabled,
      organizerId: auth.userId,
    });

    return ok({ event }, 201);
  } catch {
    return fail("Unable to create event", 500);
  }
}

export async function GET(req: NextRequest) {
  await connectDb();

  const auth = getAuthUserFromRequest(req);
  const onlyPublished = req.nextUrl.searchParams.get("public") === "1";

  const query = onlyPublished
    ? { status: "published", isFull: { $ne: true } }
    : auth
      ? { organizerId: auth.userId }
      : { status: "published" };

  const events = await Event.find(query).sort({ createdAt: -1 });
  return ok({ events });
}
