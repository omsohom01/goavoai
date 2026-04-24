"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import LoadingState from "@/components/LoadingState";
import type { EventItem, RegistrationItem, RegistrationStatus } from "@/lib/types";

export default function EventManagePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const eventId = params.id;

  const [event, setEvent] = useState<EventItem | null>(null);
  const [registrations, setRegistrations] = useState<RegistrationItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function refreshData() {
    setLoading(true);
    const [eventRes, regsRes] = await Promise.all([
      fetch(`/api/events/${eventId}`),
      fetch(`/api/registrations/${eventId}`),
    ]);

    const eventData = await eventRes.json();
    const regsData = await regsRes.json();

    if (eventRes.ok) {
      setEvent(eventData.event);
    }
    if (regsRes.ok) {
      setRegistrations(regsData.registrations ?? []);
    }

    setLoading(false);
  }

  useEffect(() => {
    if (!eventId) {
      return;
    }

    Promise.all([fetch(`/api/events/${eventId}`), fetch(`/api/registrations/${eventId}`)])
      .then(async ([eventRes, regsRes]) => {
        const eventData = await eventRes.json();
        const regsData = await regsRes.json();

        if (eventRes.ok) {
          setEvent(eventData.event);
        }
        if (regsRes.ok) {
          setRegistrations(regsData.registrations ?? []);
        }
      })
      .finally(() => setLoading(false));
  }, [eventId]);

  async function updateStatus(id: string, status: RegistrationStatus) {
    // Optimistically update local state immediately
    setRegistrations(
      registrations.map((reg) =>
        reg._id === id ? { ...reg, status } : reg,
      ),
    );

    const response = await fetch(`/api/registrations/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.error ?? "Failed to update attendee status");
      // Revert on error by refreshing
      await refreshData();
      return;
    }

    toast.success(`Attendee marked as ${status}`);
  }

  async function deleteEvent() {
    const response = await fetch(`/api/events/${eventId}`, { method: "DELETE" });
    if (!response.ok) {
      toast.error("Unable to delete event");
      return;
    }
    toast.success("Event deleted");
    router.push("/dashboard");
    router.refresh();
  }

  if (loading) {
    return <LoadingState label="Loading event dashboard..." />;
  }

  if (!event) {
    return <p className="text-sm text-slate-500">Event not found.</p>;
  }

  const rsvpMode = event.rsvpMode ?? "open";
  const formattedEventDate = new Date(event.dateTime).toLocaleString();

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="font-clash text-[11px] uppercase tracking-[0.22em] text-slate-500">Event Overview</p>
            <h1 className="font-clash text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              {event.title}
            </h1>
            <p className="text-sm text-slate-600">{formattedEventDate}</p>
            <p className="text-sm text-slate-500">
              RSVP mode: {rsvpMode === "open" ? "Open (instant approval)" : "Shortlisted (manual approval)"}
            </p>
          </div>
          <button
            onClick={deleteEvent}
            className="font-clash rounded-full border border-rose-200 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-rose-700 transition-colors hover:bg-rose-50"
          >
            Delete Event
          </button>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="font-clash text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
            Attendee Dashboard
          </h2>
          <span className="font-rustic text-lg text-emerald-600">Manage</span>
        </div>
        {registrations.length === 0 ? (
          <p className="text-sm text-slate-500">No registrations yet.</p>
        ) : (
          <div className="space-y-3.5">
            {registrations.map((registration) => (
              <article
                key={registration._id}
                className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-clash text-sm font-semibold text-slate-900">{registration.name}</p>
                    <p className="text-xs text-slate-500">{registration.email}</p>
                  </div>
                  <span className="font-clash rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] uppercase tracking-wider text-slate-600">
                    {registration.status}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  {registration.status === "pending" && (
                    <>
                      <button
                        onClick={() => updateStatus(registration._id, "approved")}
                        className="font-clash rounded-full bg-emerald-600 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-white transition-colors hover:bg-emerald-500"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(registration._id, "rejected")}
                        className="font-clash rounded-full border border-rose-200 bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-rose-700 transition-colors hover:bg-rose-50"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
