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

  return (
    <div className="space-y-4">
      <div className="panel p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="kpi text-xl font-semibold">{event.title}</h2>
            <p className="mt-1 text-sm text-slate-500">{new Date(event.dateTime).toLocaleString()}</p>
            <p className="mt-1 text-xs text-slate-500">
              RSVP mode: {rsvpMode === "open" ? "Open (instant approval)" : "Shortlisted (manual approval)"}
            </p>
          </div>
          <button
            onClick={deleteEvent}
            className="rounded-xl border border-red-200 px-3 py-2 text-sm text-red-600"
          >
            Delete Event
          </button>
        </div>
      </div>

      <div className="panel p-5">
        <h3 className="mb-4 font-semibold">Attendee Dashboard</h3>
        {registrations.length === 0 ? (
          <p className="text-sm text-slate-500">No registrations yet.</p>
        ) : (
          <div className="space-y-3">
            {registrations.map((registration) => (
              <div key={registration._id} className="rounded-xl border border-slate-100 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold">{registration.name}</p>
                    <p className="text-xs text-slate-500">{registration.email}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs uppercase">
                    {registration.status}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  {registration.status === "pending" && (
                    <>
                      <button onClick={() => updateStatus(registration._id, "approved")} className="rounded-lg bg-teal-600 px-2.5 py-1 text-white hover:bg-teal-500">
                        Approve
                      </button>
                      <button onClick={() => updateStatus(registration._id, "rejected")} className="rounded-lg bg-rose-500 px-2.5 py-1 text-white hover:bg-rose-400">
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
