"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import type { EventItem } from "@/lib/types";
import type { EventTemplate } from "@/lib/templates";

type EventFormProps = {
  initial?: EventItem;
  template?: EventTemplate;
};

// Helper function to get minimum datetime (current time rounded up to next minute)
function getMinDateTime(): string {
  const now = new Date();
  // Round up to next minute
  now.setSeconds(0, 0);
  now.setMinutes(now.getMinutes() + 1);
  
  // Format as YYYY-MM-DDTHH:mm for datetime-local input
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const date = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  
  return `${year}-${month}-${date}T${hours}:${minutes}`;
}

export default function EventForm({ initial, template }: EventFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Use template values as defaults if provided and not editing
  const titleDefault = initial?.title ?? template?.titlePattern ?? "";
  const descriptionDefault = initial?.description ?? template?.descriptionTemplate ?? "";
  const locationTypeDefault = initial?.locationType ?? template?.locationType ?? "offline";
  const rsvpModeDefault = initial?.rsvpMode ?? template?.rsvpModeDefault ?? "open";
  const capacityDefault = initial?.capacity ?? template?.capacityDefault ?? 100;
  const templateTypeDefault = initial?.templateType ?? template?.id ?? "standard";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    const payload = {
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      dateTime: new Date(String(formData.get("dateTime") ?? "")).toISOString(),
      locationType: String(formData.get("locationType") ?? "offline"),
      rsvpMode: String(formData.get("rsvpMode") ?? "open"),
      venue: String(formData.get("venue") ?? ""),
      capacity: Number(formData.get("capacity") ?? 0),
      status: String(formData.get("status") ?? "draft"),
      templateType: String(formData.get("templateType") ?? "standard"),
      whatsappEnabled: Boolean(formData.get("whatsappEnabled")),
    };

    const method = initial ? "PUT" : "POST";
    const url = initial ? `/api/events/${initial._id}` : "/api/events";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.error ?? "Unable to save event");
      setLoading(false);
      return;
    }

    toast.success(initial ? "Event updated" : "Event created");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="panel grid gap-4 p-6">
      <input
        name="title"
        placeholder="Event title"
        defaultValue={titleDefault}
        className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
        required
      />
      <textarea
        name="description"
        placeholder="Describe your event"
        defaultValue={descriptionDefault}
        className="min-h-32 rounded-xl border border-slate-200 px-3 py-2 text-sm"
        required
      />
      <input
        name="dateTime"
        type="datetime-local"
        min={getMinDateTime()}
        defaultValue={initial ? new Date(initial.dateTime).toISOString().slice(0, 16) : ""}
        className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
        required
      />
      <div className="grid gap-4 md:grid-cols-3">
        <select
          name="locationType"
          defaultValue={locationTypeDefault}
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
        >
          <option value="offline">Offline</option>
          <option value="online">Online</option>
        </select>
        <select
          name="rsvpMode"
          defaultValue={rsvpModeDefault}
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
        >
          <option value="open">Open RSVP (instant approval)</option>
          <option value="shortlisted">Shortlisted RSVP (pending + organizer approval)</option>
        </select>
        <input
          name="venue"
          placeholder="Venue / meeting link"
          defaultValue={initial?.venue}
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
          required
        />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <input
          name="capacity"
          type="number"
          min={1}
          defaultValue={capacityDefault}
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
          required
        />
        <select
          name="status"
          defaultValue={initial?.status ?? "draft"}
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <input
          name="templateType"
          placeholder="Template type"
          defaultValue={templateTypeDefault}
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
          required
        />
      </div>
      <label className="inline-flex items-center gap-2 text-sm text-slate-600">
        <input
          type="checkbox"
          name="whatsappEnabled"
          defaultChecked={initial?.whatsappEnabled}
          className="h-4 w-4"
        />
        Enable WhatsApp registration flow prep
      </label>
      <button
        disabled={loading}
        className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-500 disabled:opacity-60"
      >
        {loading ? "Saving..." : initial ? "Update Event" : "Create Event"}
      </button>
    </form>
  );
}
