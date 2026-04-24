"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Filter } from "lucide-react";
import LoadingState from "@/components/LoadingState";
import type { EventItem, RegistrationItem } from "@/lib/types";

interface RegistrationWithEvent extends RegistrationItem {
  eventTitle?: string;
}

type SelectOption = {
  value: string;
  label: string;
};

function ThemedSelect({
  value,
  onChange,
  options,
  ariaLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  ariaLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label={ariaLabel}
        onClick={() => setOpen((current) => !current)}
        className="font-clash flex h-12 w-full items-center rounded-full border border-slate-200 bg-slate-50 px-4 pr-11 text-left text-sm text-slate-700 outline-none transition-colors hover:border-slate-300 focus:border-emerald-400"
      >
        <span className="truncate">{selected.label}</span>
      </button>
      <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
        <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`} />
      </span>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={`font-clash flex w-full items-center rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                option.value === value
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span className="truncate">{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AttendeesPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [eventId, setEventId] = useState("all");
  const [registrations, setRegistrations] = useState<RegistrationWithEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [displayTotal, setDisplayTotal] = useState(0);
  const [phoneRevealStep, setPhoneRevealStep] = useState(0);

  useEffect(() => {
    fetch("/api/events")
      .then((response) => response.json())
      .then((data) => {
        const list = data.events ?? [];
        setEvents(list);
        setEventId("all");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!eventId) return;

    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (status !== "all") params.set("status", status);

    if (eventId === "all") {
      // Fetch registrations from all events
      Promise.all(
        events.map((event) =>
          fetch(`/api/registrations/${event._id}?${params.toString()}`)
            .then((response) => response.json())
            .then((data) => {
              return (data.registrations ?? []).map((reg: RegistrationItem) => ({
                ...reg,
                eventTitle: event.title,
              }));
            })
            .catch(() => [])
        )
      )
        .then((allRegistrations) => {
          const flattened = allRegistrations.flat();
          setRegistrations(flattened);
        });
    } else {
      fetch(`/api/registrations/${eventId}?${params.toString()}`)
        .then((response) => response.json())
        .then((data) => setRegistrations(data.registrations ?? []));
    }
  }, [eventId, query, status, events]);

  const selectedEvent = useMemo(() => events.find((event) => event._id === eventId), [events, eventId]);
  const isAllEvents = eventId === "all";
  const summaryTarget = isAllEvents ? registrations.length : selectedEvent?.capacity ?? 0;
  const eventOptions = useMemo<SelectOption[]>(
    () => [{ value: "all", label: "All Events" }, ...events.map((event) => ({ value: event._id, label: event.title }))],
    [events],
  );
  const statusOptions: SelectOption[] = [
    { value: "all", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ];

  useEffect(() => {
    let current = 0;
    setDisplayTotal(0);
    const target = Math.max(0, summaryTarget);
    const increment = target <= 50 ? 1 : Math.ceil(target / 45);
    const timer = setInterval(() => {
      current = Math.min(target, current + increment);
      setDisplayTotal(current);
      if (current >= target) {
        clearInterval(timer);
      }
    }, 28);

    return () => clearInterval(timer);
  }, [summaryTarget]);

  useEffect(() => {
    const maxPhoneLength = registrations.reduce((max, registration) => {
      const digits = (registration.phone ?? "").replace(/\D/g, "");
      return Math.max(max, digits.length);
    }, 0);

    setPhoneRevealStep(0);
    if (maxPhoneLength === 0) {
      return;
    }

    const timer = setInterval(() => {
      setPhoneRevealStep((current) => {
        if (current >= maxPhoneLength) {
          clearInterval(timer);
          return current;
        }
        return current + 1;
      });
    }, 85);

    return () => clearInterval(timer);
  }, [registrations]);



  function renderAnimatedPhone(phone?: string) {
    if (!phone) {
      return "-";
    }

    const digits = phone.replace(/\D/g, "");
    if (!digits) {
      return phone;
    }

    const visibleCount = Math.min(phoneRevealStep, digits.length);
    const maskedCount = Math.max(0, digits.length - visibleCount);
    return `${digits.slice(0, visibleCount)}${"X".repeat(maskedCount)}`;
  }

  if (loading) {
    return <LoadingState label="Loading attendee explorer..." />;
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <style>{`
        @keyframes spacingIn {
          0% { letter-spacing: 0.3em; opacity: 0; transform: scale(0.95); }
          100% { letter-spacing: normal; opacity: 1; transform: scale(1); }
        }
        .animate-spacing-in {
          animation: spacingIn 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
      `}</style>
      <div className="mt-8 flex justify-center">
        <h2 className="font-rustic text-center text-5xl text-emerald-500 animate-spacing-in sm:text-7xl">
          Attendee Explorer
        </h2>
      </div>

      <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
        <div className="grid gap-3 md:grid-cols-4">
          <ThemedSelect
            value={eventId}
            onChange={setEventId}
            options={eventOptions}
            ariaLabel="Filter by event"
          />

          <label className="relative">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name, email, phone"
              className="h-12 w-full rounded-full border border-slate-200 bg-slate-50 px-4 pr-12 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-400"
            />
            <span className="pointer-events-none absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full">
              <Filter className="h-4 w-4 text-slate-500" />
            </span>
          </label>

          <ThemedSelect
            value={status}
            onChange={setStatus}
            options={statusOptions}
            ariaLabel="Filter by status"
          />

          <div className="flex h-12 items-center justify-between rounded-full border border-emerald-100 bg-emerald-50 px-4 text-sm">
            <p className="font-clash text-base font-semibold text-emerald-800">{displayTotal}</p>
            <p className="font-clash text-[10px] uppercase tracking-[0.2em] text-emerald-700">
              {isAllEvents ? "Total Attendees" : "Capacity"}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="font-clash text-[11px] uppercase tracking-[0.16em] text-slate-500">
              <tr>
                <th className="pb-3">Name</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Phone</th>
                {isAllEvents && <th className="pb-3">Event</th>}
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((registration) => (
                <tr key={registration._id} className="border-t border-slate-100 text-slate-700">
                  <td className="py-3 font-medium text-slate-900">{registration.name}</td>
                  <td className="py-3">{registration.email}</td>
                  <td className="font-clash py-3 tracking-wider text-slate-700">{renderAnimatedPhone(registration.phone)}</td>
                  {isAllEvents && <td className="py-3">{registration.eventTitle}</td>}
                  <td className="py-3">
                    <span
                      className={`font-clash rounded-full px-3 py-1 text-[11px] uppercase tracking-wider ${
                        registration.status === "approved"
                          ? "bg-emerald-100 text-emerald-700"
                          : registration.status === "rejected"
                            ? "bg-rose-100 text-rose-700"
                            : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {registration.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {registrations.length === 0 && <p className="pt-4 text-sm text-slate-500">No attendees matched your filters.</p>}
      </div>
    </div>
  );
}
