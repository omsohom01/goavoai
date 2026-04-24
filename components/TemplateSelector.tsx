"use client";

import { useEffect, useMemo, useState, type ComponentType } from "react";
import {
  BadgeCheck,
  Handshake,
  MicVocal,
  MonitorPlay,
  Presentation,
  Users,
  type LucideProps,
} from "lucide-react";
import { EVENT_TEMPLATES, type EventTemplate } from "@/lib/templates";

type TemplateSelectorProps = {
  onSelect: (template: EventTemplate) => void;
};

type IconComponent = ComponentType<LucideProps>;

const TEMPLATE_ICONS: Record<string, IconComponent> = {
  workshop: Presentation,
  webinar: MonitorPlay,
  conference: MicVocal,
  meetup: Users,
  training: BadgeCheck,
  networking: Handshake,
};

function AttendeeCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let frameId = 0;
    const duration = 2500;
    const start = performance.now();

    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(target * eased));

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [target]);

  return <>{count.toLocaleString()}</>;
}

export default function TemplateSelector({ onSelect }: TemplateSelectorProps) {
  const templatesCount = useMemo(() => EVENT_TEMPLATES.length, []);

  return (
    <section className="space-y-8">
      <div className="mx-auto max-w-3xl text-center">
        <h3 className="font-clash text-[1.65rem] font-semibold tracking-tight text-slate-900 md:text-3xl "
          style={{
            lineHeight: "1.2",
            letterSpacing: "1.2px",
          }}
        >
          Choose Your Event Blueprint
        </h3>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {EVENT_TEMPLATES.map((template) => {
          const TemplateIcon = TEMPLATE_ICONS[template.id] ?? Presentation;

          return (
            <button
              key={template.id}
              onClick={() => onSelect(template)}
              className="group relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] border border-slate-200/60 bg-white/70 p-7 text-left shadow-sm transition-all duration-300 hover:border-emerald-500/30 hover:bg-white hover:shadow-xl hover:shadow-emerald-900/5 hover:-translate-y-1"
            >
              <div className="relative z-10">
                <div className="mb-6 flex items-start justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-600 shadow-sm transition-colors group-hover:bg-emerald-500 group-hover:text-white">
                    <TemplateIcon className="h-7 w-7" strokeWidth={2} />
                  </div>
                  <span className="rounded-full border border-slate-100 bg-slate-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:border-emerald-100 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                    {template.locationType}
                  </span>
                </div>

                <h4 className="font-clash text-2xl font-bold text-slate-900 transition-colors group-hover:text-emerald-700">{template.name}</h4>
                <p className="font-clash mt-3 text-sm leading-relaxed text-slate-600 line-clamp-4">
                  {template.description}. {template.descriptionTemplate}
                </p>
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5 relative z-10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Capacity</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-clash text-2xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                    <AttendeeCounter target={template.capacityDefault} />
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-tight text-slate-500">Attendees</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
