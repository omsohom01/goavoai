import { Resend } from "resend";

type RegistrationConfirmationInput = {
  attendeeName: string;
  attendeeEmail: string;
  eventTitle: string;
  eventDate: Date;
  venue: string;
  rsvpMode: "open" | "shortlisted";
};

type RegistrationDecisionInput = {
  attendeeName: string;
  attendeeEmail: string;
  eventTitle: string;
  status: "approved" | "rejected";
};

type EventUpdateInput = {
  attendeeName: string;
  attendeeEmail: string;
  eventTitle: string;
  eventDate: Date;
  venue: string;
  updateType: "updated" | "cancelled";
  updateSummary?: string;
  isRepublish?: boolean;
};

function getEmailClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return null;
  }

  return new Resend(apiKey);
}

function getFromAddress() {
  return process.env.RESEND_FROM_EMAIL || "EventForge <onboarding@resend.dev>";
}

function formatDate(value: Date) {
  return new Date(value).toLocaleString();
}

async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
  text: string;
}) {
  const client = getEmailClient();
  if (!client) {
    return;
  }

  await client.emails.send({
    from: getFromAddress(),
    to: params.to,
    subject: params.subject,
    html: params.html,
    text: params.text,
  });
}

export async function sendRegistrationConfirmationEmail(input: RegistrationConfirmationInput) {
  const isOpen = input.rsvpMode === "open";
  const subject = isOpen
    ? `You are confirmed for ${input.eventTitle}`
    : `Application received for ${input.eventTitle}`;

  const statusLine = isOpen
    ? "Your RSVP is approved instantly. Your spot is confirmed."
    : "Your RSVP is now pending review. The organizer will notify you after reviewing your application.";

  await sendEmail({
    to: input.attendeeEmail,
    subject,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;">
        <h2 style="margin:0 0 12px;">Hi ${input.attendeeName},</h2>
        <p>Thanks for registering for <strong>${input.eventTitle}</strong>.</p>
        <p>${statusLine}</p>
        <p style="margin:16px 0 0;"><strong>Event details</strong></p>
        <ul style="padding-left:18px;">
          <li>Date: ${formatDate(input.eventDate)}</li>
          <li>Venue: ${input.venue}</li>
          <li>RSVP mode: ${isOpen ? "Open RSVP" : "Shortlisted RSVP"}</li>
        </ul>
        <p style="margin-top:18px;">See you there,<br/>EventForge Team</p>
      </div>
    `,
    text: `Hi ${input.attendeeName},\n\nThanks for registering for ${input.eventTitle}.\n${statusLine}\n\nEvent details:\n- Date: ${formatDate(input.eventDate)}\n- Venue: ${input.venue}\n- RSVP mode: ${isOpen ? "Open RSVP" : "Shortlisted RSVP"}\n\nSee you there,\nEventForge Team`,
  });
}

export async function sendRegistrationDecisionEmail(input: RegistrationDecisionInput) {
  const approved = input.status === "approved";
  const subject = approved
    ? `Congrats! You are approved for ${input.eventTitle}`
    : `Update on your ${input.eventTitle} application`;

  const body = approved
    ? "Great news. You have been approved and your spot is now confirmed."
    : "Thank you for applying. After reviewing all applications, we are unable to offer a spot this time.";

  await sendEmail({
    to: input.attendeeEmail,
    subject,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;">
        <h2 style="margin:0 0 12px;">Hi ${input.attendeeName},</h2>
        <p>${body}</p>
        <p>Event: <strong>${input.eventTitle}</strong></p>
        <p style="margin-top:18px;">Regards,<br/>EventForge Team</p>
      </div>
    `,
    text: `Hi ${input.attendeeName},\n\n${body}\n\nEvent: ${input.eventTitle}\n\nRegards,\nEventForge Team`,
  });
}

export async function sendEventUpdateEmail(input: EventUpdateInput) {
  const cancelled = input.updateType === "cancelled";
  const republished = input.isRepublish === true;

  let subject: string;
  let body: string;

  if (cancelled) {
    subject = `Event cancelled: ${input.eventTitle}`;
    body = `<strong>${input.eventTitle}</strong> has been cancelled by the organizer. We apologize for any inconvenience caused.`;
  } else if (republished) {
    subject = `Great news! ${input.eventTitle} is happening again`;
    body = `Great news! <strong>${input.eventTitle}</strong> is happening again! The event details have been updated below.`;
  } else {
    subject = `Event update: ${input.eventTitle}`;
    body = "The organizer has updated event details. Please review the latest information below.";
  }

  await sendEmail({
    to: input.attendeeEmail,
    subject,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;">
        <h2 style="margin:0 0 12px;">Hi ${input.attendeeName},</h2>
        <p>${body}</p>
        ${!cancelled ? `<p style="margin:16px 0 0;"><strong>Event details</strong></p>
        <ul style="padding-left:18px;">
          <li>Date: ${formatDate(input.eventDate)}</li>
          <li>Venue: ${input.venue}</li>
        </ul>
        ${!republished && input.updateSummary ? `<p><strong>What changed:</strong> ${input.updateSummary}</p>` : ""}` : ""}
        <p style="margin-top:18px;">Regards,<br/>EventForge Team</p>
      </div>
    `,
    text: `Hi ${input.attendeeName},\n\n${body.replace(/<[^>]*>/g, '')}${!cancelled ? `\n\nEvent details:\n- Date: ${formatDate(input.eventDate)}\n- Venue: ${input.venue}${!republished && input.updateSummary ? `\n- What changed: ${input.updateSummary}` : ""}` : ""}\n\nRegards,\nEventForge Team`,
  });
}
