"use client";

import { useParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import LoadingState from "@/components/LoadingState";
import type { EventItem } from "@/lib/types";

export default function PublicEventPage() {
  const params = useParams<{ id: string }>();
  const eventId = params.id;

  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/events/${eventId}`)
      .then((response) => response.json())
      .then((data) => setEvent(data.event ?? null))
      .finally(() => setLoading(false));
  }, [eventId]);

  async function handleRegister(registrationEvent: FormEvent<HTMLFormElement>) {
    registrationEvent.preventDefault();
    setSubmitting(true);

    const formData = new FormData(registrationEvent.currentTarget);

    const response = await fetch("/api/registrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventId,
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        phone: String(formData.get("phone") ?? ""),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.error ?? "Unable to register");
      setSubmitting(false);
      return;
    }

    toast.success(
      data.registration?.status === "approved"
        ? "Registration approved instantly"
        : "Application submitted for organizer review",
    );
    if (registrationEvent.currentTarget) {
      registrationEvent.currentTarget.reset();
    }
    setSubmitting(false);
  }

  if (loading) {
    return <LoadingState label="Loading event page..." />;
  }

  if (!event) {
    return <p className="mx-auto mt-16 max-w-xl text-center text-slate-500">Event not found.</p>;
  }

  const rsvpMode = event.rsvpMode ?? "open";
  const blocked = event.status === "cancelled" || event.isFull;
  const cancelledMessage = event.status === "cancelled" 
    ? "This event has been cancelled. Registrations are closed."
    : event.isFull 
    ? "This event is full. No more registrations available."
    : null;

  return (
    <main className="gradient-shell min-h-screen p-6">
      <div className="mx-auto grid w-full max-w-5xl gap-6 md:grid-cols-2">
        <section className="panel p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Public Event Page</p>
          <h1 className="kpi mt-2 text-3xl font-semibold">{event.title}</h1>
          <p className="mt-4 text-sm leading-6 text-slate-600">{event.description}</p>
          <div className="mt-6 space-y-2 text-sm text-slate-600">
            <p>Date: {new Date(event.dateTime).toLocaleString()}</p>
            <p>Location: {event.locationType} | {event.venue}</p>
            <p>RSVP Mode: {rsvpMode === "open" ? "Open (instant approval)" : "Shortlisted (organizer approval)"}</p>
            <p>Capacity: {event.capacity}</p>
            <p>
              Status: 
              <span className={`ml-2 font-semibold ${
                event.status === "cancelled" 
                  ? "text-rose-600" 
                  : event.isFull 
                  ? "text-amber-600" 
                  : "text-teal-600"
              }`}>
                {event.status === "cancelled" ? "🚫 CANCELLED" : event.isFull ? "⚠️ FULL" : "✓ OPEN"}
              </span>
            </p>
          </div>
        </section>
        <section className="panel p-6">
          <h2 className="text-xl font-semibold">Register</h2>
          {!blocked && (
            <p className="mt-2 text-sm text-slate-600">
              {rsvpMode === "open"
                ? "Open RSVP is enabled. You will be approved instantly after submitting."
                : "Shortlisted RSVP is enabled. Your application will stay pending until organizer approval."}
            </p>
          )}
          {blocked ? (
            <div className={`mt-4 rounded-lg border-l-4 p-4 ${event.status === "cancelled" ? "border-rose-500 bg-rose-50" : "border-amber-500 bg-amber-50"}`}>
              <p className={`text-sm font-semibold ${event.status === "cancelled" ? "text-rose-900" : "text-amber-900"}`}>
                {event.status === "cancelled" ? "🚫 Event Cancelled" : "⚠️ Event Full"}
              </p>
              <p className={`mt-1 text-sm ${event.status === "cancelled" ? "text-rose-700" : "text-amber-700"}`}>
                {cancelledMessage}
              </p>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="mt-4 grid gap-3">
              <input name="name" placeholder="Full name" className="rounded-xl border border-slate-200 px-3 py-2 text-sm" required />
              <input name="email" type="email" placeholder="Email" className="rounded-xl border border-slate-200 px-3 py-2 text-sm" required />
              {event.whatsappEnabled && (
                <input name="phone" placeholder="Phone (required for WhatsApp)" className="rounded-xl border border-slate-200 px-3 py-2 text-sm" required />
              )}
              {!event.whatsappEnabled && (
                <input name="phone" placeholder="Phone (optional)" className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
              )}
              <button
                disabled={submitting}
                className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-500 disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Submit Registration"}
              </button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
