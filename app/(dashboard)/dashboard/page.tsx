"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import EmptyState from "@/components/EmptyState";
import LoadingState from "@/components/LoadingState";
import type { EventItem } from "@/lib/types";

export default function DashboardPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    fetch("/api/events", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        if (mounted) {
          setEvents(data.events ?? []);
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return <LoadingState label="Fetching your events..." />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="kpi text-xl font-semibold">Events</h2>
        <Link
          href="/dashboard/events/new"
          className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-500"
        >
          New Event
        </Link>
      </div>

      {events.length === 0 ? (
        <EmptyState
          title="No events yet"
          body="Create your first event, publish it, and share your event page URL."
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {events.map((event) => (
            <article key={event._id} className="panel p-5">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">{event.title}</h3>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase text-slate-600">
                  {event.isFull ? "full" : event.status}
                </span>
              </div>
              <p className="line-clamp-2 text-sm text-slate-600">{event.description}</p>
              <p className="mt-3 text-xs text-slate-500">
                {new Date(event.dateTime).toLocaleString()} | {event.locationType} | cap {event.capacity}
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-sm">
                <Link href={`/dashboard/events/${event._id}`} className="rounded-lg bg-slate-100 px-3 py-1.5">
                  Manage
                </Link>
                <Link href={`/dashboard/events/${event._id}/edit`} className="rounded-lg bg-slate-100 px-3 py-1.5">
                  Edit
                </Link>
                <Link href={`/event/${event._id}`} className="rounded-lg bg-cyan-50 px-3 py-1.5 text-cyan-700">
                  Public Page
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
