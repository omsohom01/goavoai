type NotifyPayload = {
  to: string;
  text: string;
};

type NotifyResult = {
  sent: boolean;
  error?: string;
};

type RegistrationWhatsappInput = {
  attendeeName: string;
  phone?: string;
  eventTitle: string;
  eventDate: Date;
  venue: string;
  rsvpMode: "open" | "shortlisted";
};

type DecisionWhatsappInput = {
  attendeeName: string;
  phone?: string;
  eventTitle: string;
  status: "approved" | "rejected";
};

type EventUpdateWhatsappInput = {
  attendeeName: string;
  phone?: string;
  eventTitle: string;
  eventDate: Date;
  venue: string;
  updateType: "updated" | "cancelled";
  updateSummary?: string;
};

function formatDate(value: Date) {
  return new Date(value).toLocaleString();
}

function normalizeBaseUrl(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

async function notifyWhatsapp(payload: NotifyPayload): Promise<NotifyResult> {
  const baseUrl = process.env.WHATSAPP_SERVICE_URL;

  if (!baseUrl) {
    return { sent: false, error: "WHATSAPP_SERVICE_URL is not configured" };
  }

  const serviceKey = process.env.WHATSAPP_SERVICE_KEY;

  try {
    const response = await fetch(`${normalizeBaseUrl(baseUrl)}/api/v1/whatsapp/notify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(serviceKey ? { "x-service-key": serviceKey } : {}),
      },
      body: JSON.stringify(payload),
    });

    const data = (await response.json().catch(() => ({}))) as { sent?: boolean; error?: string };

    if (!response.ok || !data.sent) {
      return {
        sent: false,
        error: data.error ?? `WhatsApp service failed with status ${response.status}`,
      };
    }

    return { sent: true };
  } catch (error) {
    return {
      sent: false,
      error: error instanceof Error ? error.message : "Unexpected WhatsApp service error",
    };
  }
}

export async function sendRegistrationConfirmationWhatsapp(
  input: RegistrationWhatsappInput,
): Promise<NotifyResult> {
  if (!input.phone) {
    return { sent: false, error: "Attendee phone is missing" };
  }

  const isOpen = input.rsvpMode === "open";
  const statusLine = isOpen
    ? "Your RSVP is approved instantly. Your spot is confirmed."
    : "Your RSVP is pending review. The organizer will update you after review.";

  const text = [
    `Hi ${input.attendeeName},`,
    `Thanks for registering for ${input.eventTitle}.`,
    statusLine,
    "",
    "Event details:",
    `Date: ${formatDate(input.eventDate)}`,
    `Venue: ${input.venue}`,
    `RSVP mode: ${isOpen ? "Open RSVP" : "Shortlisted RSVP"}`,
  ].join("\n");

  return notifyWhatsapp({ to: input.phone, text });
}

export async function sendRegistrationDecisionWhatsapp(
  input: DecisionWhatsappInput,
): Promise<NotifyResult> {
  if (!input.phone) {
    return { sent: false, error: "Attendee phone is missing" };
  }

  const approved = input.status === "approved";
  const body = approved
    ? "Great news. You have been approved and your spot is now confirmed."
    : "Thank you for applying. After review, we are unable to offer a spot this time.";

  const text = [
    `Hi ${input.attendeeName},`,
    body,
    "",
    `Event: ${input.eventTitle}`,
  ].join("\n");

  return notifyWhatsapp({ to: input.phone, text });
}

export async function sendEventUpdateWhatsapp(input: EventUpdateWhatsappInput): Promise<NotifyResult> {
  if (!input.phone) {
    return { sent: false, error: "Attendee phone is missing" };
  }

  const cancelled = input.updateType === "cancelled";
  const body = cancelled
    ? "This event has been cancelled by the organizer."
    : "The organizer has updated event details. Please review the latest information.";

  const text = [
    `Hi ${input.attendeeName},`,
    body,
    "",
    "Event details:",
    `Title: ${input.eventTitle}`,
    `Date: ${formatDate(input.eventDate)}`,
    `Venue: ${input.venue}`,
    ...(input.updateSummary ? [`What changed: ${input.updateSummary}`] : []),
  ].join("\n");

  return notifyWhatsapp({ to: input.phone, text });
}