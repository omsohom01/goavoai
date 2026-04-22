"use client";

import { EVENT_TEMPLATES, type EventTemplate } from "@/lib/templates";

type TemplateSelectorProps = {
  onSelect: (template: EventTemplate) => void;
};

export default function TemplateSelector({ onSelect }: TemplateSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">Choose Event Template</h3>
        <p className="mt-1 text-sm text-slate-600">
          Select a template to get started. You&apos;ll be able to customize everything.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {EVENT_TEMPLATES.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelect(template)}
            className="rounded-xl border-2 border-slate-200 bg-white p-4 text-left transition hover:border-teal-500 hover:bg-teal-50"
          >
            <div className="mb-3 text-3xl">{template.icon}</div>
            <h4 className="font-semibold text-slate-900">{template.name}</h4>
            <p className="mt-1 text-sm text-slate-600">{template.description}</p>
            <div className="mt-3 flex gap-2 text-xs text-slate-500">
              <span>{template.locationType === "online" ? "🌐 Online" : "📍 Offline"}</span>
              <span>•</span>
              <span>Up to {template.capacityDefault} attendees</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
