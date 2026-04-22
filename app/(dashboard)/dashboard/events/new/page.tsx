"use client";

import { useState } from "react";
import EventForm from "@/components/EventForm";
import TemplateSelector from "@/components/TemplateSelector";
import type { EventTemplate } from "@/lib/templates";

export default function NewEventPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<EventTemplate | null>(null);

  if (!selectedTemplate) {
    return (
      <div className="space-y-4">
        <h2 className="kpi text-xl font-semibold">Create Event</h2>
        <TemplateSelector onSelect={setSelectedTemplate} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="kpi text-xl font-semibold">Create Event</h2>
        <button
          onClick={() => setSelectedTemplate(null)}
          className="text-sm text-slate-600 underline hover:text-slate-900"
        >
          Change template
        </button>
      </div>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
        <span className="font-semibold text-slate-900">{selectedTemplate.icon} {selectedTemplate.name}</span>
        <p className="mt-1 text-slate-600">{selectedTemplate.description}</p>
      </div>
      <EventForm template={selectedTemplate} />
    </div>
  );
}
