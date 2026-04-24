"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import EventForm from "@/components/EventForm";
import LoadingState from "@/components/LoadingState";
import type { EventItem } from "@/lib/types";

export default function EditEventPage() {
  const params = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params?.id) {
      return;
    }

    fetch(`/api/events/${params.id}`)
      .then((response) => response.json())
      .then((data) => setEvent(data.event ?? null))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return <LoadingState label="Loading event data..." />;
  }

  if (!event) {
    return <p className="text-sm text-slate-500">Event not found.</p>;
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
        <p className="font-clash text-xs uppercase tracking-[0.2em] text-slate-500">Dashboard</p>
        <h2 className="mt-2 text-3xl text-slate-900 sm:text-4xl">
          <span className="font-clash font-semibold">Edit </span>
          <span className="font-rustic align-middle text-emerald-600">Event</span>
        </h2>
        <p className="mt-2 text-sm text-slate-600">Update details, schedule, and registration settings.</p>
      </div>
      <EventForm initial={event} />
    </div>
  );
}
