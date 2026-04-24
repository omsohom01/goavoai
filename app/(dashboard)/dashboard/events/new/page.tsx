"use client";

import { useState } from "react";
import {
  BadgeCheck,
  Handshake,
  MicVocal,
  MonitorPlay,
  Presentation,
  Users,
  type LucideIcon,
} from "lucide-react";
import EventForm from "@/components/EventForm";
import TemplateSelector from "@/components/TemplateSelector";
import type { EventTemplate } from "@/lib/templates";

const TEMPLATE_ICONS: Record<string, LucideIcon> = {
  workshop: Presentation,
  webinar: MonitorPlay,
  conference: MicVocal,
  meetup: Users,
  training: BadgeCheck,
  networking: Handshake,
};

export default function NewEventPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<EventTemplate | null>(null);

  const SelectedIcon = selectedTemplate ? TEMPLATE_ICONS[selectedTemplate.id] ?? Presentation : Presentation;

  const heading = (
    <div className="pt-2 md:pt-6 w-full max-w-4xl mx-auto px-4">
      <h1 className="font-rustic text-center text-5xl leading-[1.4] py-3 px-6 font-normal text-transparent animate-spacing-in bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 bg-clip-text md:text-[5rem]">
        Create Event
      </h1>
      <p className="font-clash mt-4 text-center text-sm text-slate-600 md:text-base leading-relaxed">
        Build an event page that looks premium from day one. Pick a template and customize in seconds.
      </p>
    </div>
  );

  if (!selectedTemplate) {
    return (
      <div className="relative min-h-screen pb-14">
        <style>{`
          @keyframes spacingIn {
            0% { letter-spacing: 0.2em; opacity: 0; transform: scale(0.98) translateY(10px); }
            100% { letter-spacing: normal; opacity: 1; transform: scale(1) translateY(0); }
          }
          .animate-spacing-in {
            animation: spacingIn 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
            will-change: transform, opacity;
            backface-visibility: hidden;
          }
        `}</style>

        <div className="absolute inset-0 -z-10 h-full w-full bg-transparent bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[24px_24px]">
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-75 w-75 rounded-full bg-emerald-500/20 blur-[100px]" />
          <div className="absolute bottom-[10%] right-[-8%] -z-10 h-70 w-70 rounded-full bg-teal-400/15 blur-[110px]" />
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex justify-center">{heading}</div>
          <TemplateSelector onSelect={setSelectedTemplate} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen space-y-6 pb-20">
      <style>{`
        @keyframes spacingIn {
          0% { letter-spacing: 0.3em; opacity: 0; transform: scale(0.95); }
          100% { letter-spacing: normal; opacity: 1; transform: scale(1); }
        }
        .animate-spacing-in {
          animation: spacingIn 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
      `}</style>

      <div className="absolute inset-0 -z-10 h-full w-full bg-transparent bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[24px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-75 w-75 rounded-full bg-emerald-500/20 blur-[100px]" />
        <div className="absolute bottom-[10%] right-[-8%] -z-10 h-70 w-70 rounded-full bg-teal-400/15 blur-[110px]" />
      </div>

      <div className="relative z-10 flex justify-center">{heading}</div>

      <div className="mx-auto max-w-3xl rounded-[2.5rem] border border-slate-200/70 bg-white/80 p-6 backdrop-blur-sm sm:p-8 hover:border-slate-300 transition-colors duration-300">
        <div className="flex items-start gap-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-600 transition-colors">
            <SelectedIcon className="h-7 w-7" strokeWidth={2} />
          </div>
          <div>
            <span className="font-clash text-2xl font-bold text-slate-900">{selectedTemplate.name}</span>
            <p className="font-clash mt-1.5 text-sm leading-relaxed text-slate-600">
              {selectedTemplate.description}. {selectedTemplate.descriptionTemplate}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-0">
        <EventForm template={selectedTemplate} />
      </div>
    </div>
  );
}
