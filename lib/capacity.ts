import Event from "@/models/Event";
import Registration from "@/models/Registration";

export async function recomputeEventCapacity(eventId: string) {
  const approvedCount = await Registration.countDocuments({
    eventId,
    status: "approved",
  });

  const event = await Event.findById(eventId);
  if (!event) return null;

  const isFull = approvedCount >= event.capacity;
  if (event.isFull !== isFull) {
    event.isFull = isFull;
    await event.save();
  }

  return { event, approvedCount, isFull };
}
