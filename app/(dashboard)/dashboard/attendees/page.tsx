"use client";

import { useEffect, useMemo, useState } from "react";
import LoadingState from "@/components/LoadingState";
import type { EventItem, RegistrationItem } from "@/lib/types";

export default function AttendeesPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [eventId, setEventId] = useState("");
  const [registrations, setRegistrations] = useState<RegistrationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    fetch("/api/events")
      .then((response) => response.json())
      .then((data) => {
        const list = data.events ?? [];
        setEvents(list);
        if (list[0]) {
          setEventId(list[0]._id);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!eventId) return;

    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (status !== "all") params.set("status", status);

    fetch(`/api/registrations/${eventId}?${params.toString()}`)
      .then((response) => response.json())
      .then((data) => setRegistrations(data.registrations ?? []));
  }, [eventId, query, status]);

  const selectedEvent = useMemo(() => events.find((event) => event._id === eventId), [events, eventId]);

  if (loading) {
    return <LoadingState label="Loading attendee explorer..." />;
  }

  return (
    <div className="space-y-4">
      <h2 className="kpi text-xl font-semibold">Attendee Dashboard</h2>
      <div className="panel grid gap-3 p-4 md:grid-cols-4">
        <select value={eventId} onChange={(event) => setEventId(event.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          {events.map((event) => (
            <option key={event._id} value={event._id}>
              {event.title}
            </option>
          ))}
        </select>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search name/email/phone"
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
        <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="all">All status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <div className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-600">
          Capacity: {selectedEvent?.capacity ?? 0}
        </div>
      </div>

      <div className="panel overflow-x-auto p-4">
        <table className="w-full text-left text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="pb-2">Name</th>
              <th className="pb-2">Email</th>
              <th className="pb-2">Phone</th>
              <th className="pb-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((registration) => (
              <tr key={registration._id} className="border-t border-slate-100">
                <td className="py-2">{registration.name}</td>
                <td className="py-2">{registration.email}</td>
                <td className="py-2">{registration.phone || "-"}</td>
                <td className="py-2 uppercase">{registration.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {registrations.length === 0 && <p className="pt-4 text-sm text-slate-500">No attendees matched your filters.</p>}
      </div>
    </div>
  );
}
