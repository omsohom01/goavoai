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
    <div className="space-y-4">
      <h2 className="kpi text-xl font-semibold">Edit Event</h2>
      <EventForm initial={event} />
    </div>
  );
}
