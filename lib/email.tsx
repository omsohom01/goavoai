import { Resend } from "resend";
import { render } from "@react-email/render";
import { EvexaEmailTemplate } from "@/components/emails/EvexaEmailTemplate";
import * as React from "react";

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
  return process.env.RESEND_FROM_EMAIL || "Evexa <onboarding@resend.dev>";
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

  const html = await render(
    <EvexaEmailTemplate
      attendeeName={input.attendeeName}
      heading={subject}
      eventHeading={input.eventTitle}
      bodyParagraphs={[
        `Thanks for registering for ${input.eventTitle}.`,
        statusLine
      ]}
      eventDetails={[
        { label: "Title", value: input.eventTitle },
        { label: "Date", value: formatDate(input.eventDate) },
        { label: "Venue", value: input.venue },
        { label: "RSVP Mode", value: isOpen ? "Open RSVP" : "Shortlisted RSVP" }
      ]}
      type="happy"
    />
  );

  await sendEmail({
    to: input.attendeeEmail,
    subject,
    html,
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

  const html = await render(
    <EvexaEmailTemplate
      attendeeName={input.attendeeName}
      heading={approved ? "You're Approved!" : "Application Update"}
      eventHeading={input.eventTitle}
      bodyParagraphs={[body]}
      eventDetails={[{ label: "Title", value: input.eventTitle }]}
      type={approved ? "happy" : "sad"}
    />
  );

  await sendEmail({
    to: input.attendeeEmail,
    subject,
    html,
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
    body = `${input.eventTitle} has been cancelled by the organizer. We apologize for any inconvenience caused.`;
  } else if (republished) {
    subject = `Great news! ${input.eventTitle} is happening again`;
    body = `Great news! ${input.eventTitle} is happening again! The event details have been updated below.`;
  } else {
    subject = `Event update: ${input.eventTitle}`;
    body = "The organizer has updated event details. Please review the latest information below.";
  }

  const html = await render(
    <EvexaEmailTemplate
      attendeeName={input.attendeeName}
      heading={cancelled ? "Event Cancelled Update" : "Event Update"}
      eventHeading={input.eventTitle}
      bodyParagraphs={[
        body,
        ...(!republished && input.updateSummary ? [`What changed: ${input.updateSummary}`] : [])
      ]}
      eventDetails={
        !cancelled
          ? [
              { label: "Title", value: input.eventTitle },
              { label: "Date", value: formatDate(input.eventDate) },
              { label: "Venue", value: input.venue },
            ]
          : undefined
      }
      type={cancelled ? "sad" : "happy"}
    />
  );

  await sendEmail({
    to: input.attendeeEmail,
    subject,
    html,
    text: `Hi ${input.attendeeName},\n\n${body.replace(/<[^>]*>/g, '')}${!cancelled ? `\n\nEvent details:\n- Title: ${input.eventTitle}\n- Date: ${formatDate(input.eventDate)}\n- Venue: ${input.venue}${!republished && input.updateSummary ? `\n\nWhat changed:\n- ${input.updateSummary}` : ""}` : ""}\n\nRegards,\nEventForge Team`,
  });
}
