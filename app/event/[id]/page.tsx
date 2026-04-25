"use client";

import { useParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  CircleCheckBig,
  CircleX,
  MapPin,
  ShieldCheck,
  TriangleAlert,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import LoadingState from "@/components/LoadingState";
import type { EventItem } from "@/lib/types";

export default function PublicEventPage() {
  const params = useParams<{ id: string }>();
  const eventId = params.id;

  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [nameHintIndex, setNameHintIndex] = useState(0);
  const [emailHintIndex, setEmailHintIndex] = useState(0);
  const [phoneHintIndex, setPhoneHintIndex] = useState(0);
  const [displayCapacity, setDisplayCapacity] = useState(0);
  const [nameValue, setNameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [phoneValue, setPhoneValue] = useState("");

  const nameHints = useMemo(
    () => ["John Doe", "Joe Parker", "William Smith"],
    [],
  );
  const emailHints = useMemo(
    () => ["you@example.com", "xyz@gmail.com", "abc.proton.me"],
    [],
  );
  const phoneHints = useMemo(
    () => ["+91 98XXXXXXXX", "+91 89XXXXXXXX", "+91 77XXXXXXXX"],
    [],
  );

  useEffect(() => {
    fetch(`/api/events/${eventId}`)
      .then((response) => response.json())
      .then((data) => setEvent(data.event ?? null))
      .finally(() => setLoading(false));
  }, [eventId]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNameHintIndex((current) => (current + 1) % nameHints.length);
    }, 2400);

    return () => clearInterval(intervalId);
  }, [nameHints]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setEmailHintIndex((current) => (current + 1) % emailHints.length);
      setPhoneHintIndex((current) => (current + 1) % phoneHints.length);
    }, 2400);

    return () => clearInterval(intervalId);
  }, [emailHints, phoneHints]);

  useEffect(() => {
    if (!event) {
      return;
    }

    const target = Number(event.capacity) || 0;
    let current = 0;
    const steps = Math.min(target, 40);
    const increment = steps === 0 ? 0 : Math.max(1, Math.ceil(target / steps));
    const timer = setInterval(() => {
      current = Math.min(current + increment, target);
      setDisplayCapacity(current);
      if (current >= target) {
        clearInterval(timer);
      }
    }, 24);

    return () => clearInterval(timer);
  }, [event]);

  async function handleRegister(registrationEvent: FormEvent<HTMLFormElement>) {
    registrationEvent.preventDefault();
    setSubmitting(true);

    const formData = new FormData(registrationEvent.currentTarget);

    const response = await fetch("/api/registrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventId,
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        phone: String(formData.get("phone") ?? ""),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.error ?? "Unable to register");
      setSubmitting(false);
      return;
    }

    toast.success(
      data.registration?.status === "approved"
        ? "Registration approved instantly"
        : "Application submitted for organizer review",
    );
    if (registrationEvent.currentTarget) {
      registrationEvent.currentTarget.reset();
    }
    setNameValue("");
    setEmailValue("");
    setPhoneValue("");
    setSubmitting(false);
  }

  if (loading) {
    return <LoadingState label="Loading event page..." />;
  }

  if (!event) {
    return <p className="mx-auto mt-16 max-w-xl text-center text-slate-500">Event not found.</p>;
  }

  const rsvpMode = event.rsvpMode ?? "open";
  const blocked = event.status === "cancelled" || event.isFull;
  const cancelledMessage =
    event.status === "cancelled"
      ? "This event has been cancelled. Registrations are closed."
      : event.isFull
        ? "This event is full. No more registrations available."
        : null;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7faf8] px-4 pb-16 pt-24 sm:px-6 sm:pt-28 lg:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.42]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(15,23,42,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.08) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="pointer-events-none absolute -top-36 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-emerald-200/35 blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-[1240px] items-start gap-5 lg:gap-7 xl:gap-8 lg:grid-cols-[1.22fr_0.92fr]">
        <section className="rounded-[2rem] border border-slate-200/70 bg-white/95 p-6 shadow-sm backdrop-blur-md sm:p-8">
          <p className="font-clash text-[11px] uppercase tracking-[0.24em] text-slate-500">Public Event Page</p>
          <h1 className="font-clash mt-1.5 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{event.title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{event.description}</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <article className="rounded-3xl border border-emerald-100 bg-emerald-50/70 p-4">
              <div className="mb-2 flex items-center gap-2 text-emerald-700">
                <CalendarDays className="h-4 w-4" />
                <p className="font-clash text-[11px] uppercase tracking-[0.18em]">Date & Time</p>
              </div>
              <p className="font-clash text-sm font-semibold text-slate-800">{new Date(event.dateTime).toLocaleString()}</p>
            </article>

            <article className="rounded-3xl border border-teal-100 bg-teal-50/70 p-4">
              <div className="mb-2 flex items-center gap-2 text-teal-700">
                <MapPin className="h-4 w-4" />
                <p className="font-clash text-[11px] uppercase tracking-[0.18em]">Location</p>
              </div>
              <p className="font-clash text-sm font-semibold text-slate-800">{event.locationType} | {event.venue}</p>
            </article>

            <article className="rounded-3xl border border-cyan-100 bg-cyan-50/70 p-4">
              <div className="mb-2 flex items-center gap-2 text-cyan-700">
                <ShieldCheck className="h-4 w-4" />
                <p className="font-clash text-[11px] uppercase tracking-[0.18em]">RSVP Mode</p>
              </div>
              <p className="font-clash text-sm font-semibold text-slate-800">
                {rsvpMode === "open" ? "Open (instant approval)" : "Shortlisted (organizer approval)"}
              </p>
            </article>

            <article className="rounded-3xl border border-violet-100 bg-violet-50/70 p-4">
              <div className="mb-2 flex items-center gap-2 text-violet-700">
                <Users className="h-4 w-4" />
                <p className="font-clash text-[11px] uppercase tracking-[0.18em]">Capacity</p>
              </div>
              <p className="font-clash text-sm font-semibold text-slate-800">{displayCapacity} attendees</p>
            </article>
          </div>

          <div className="mt-3.5 rounded-3xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2">
              {event.status === "cancelled" ? (
                <CircleX className="h-4 w-4 text-rose-600" />
              ) : event.isFull ? (
                <TriangleAlert className="h-4 w-4 text-amber-600" />
              ) : (
                <CircleCheckBig className="h-4 w-4 text-emerald-600" />
              )}
              <p className="font-clash text-[11px] uppercase tracking-[0.2em] text-slate-500">Current Status</p>
            </div>
            <p
              className={`font-rustic mt-2 text-2xl ${
                event.status === "cancelled" ? "text-rose-600" : event.isFull ? "text-amber-600" : "text-emerald-600"
              }`}
            >
              {event.status === "cancelled" ? "Cancelled" : event.isFull ? "Full" : "Open"}
            </p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200/70 bg-white/95 p-6 shadow-sm backdrop-blur-md sm:p-8 lg:sticky lg:top-24">
          <h2 className="font-clash text-2xl font-semibold tracking-tight text-slate-900">Register</h2>
          {!blocked && (
            <p className="mt-2 text-sm text-slate-600">
              {rsvpMode === "open"
                ? "Open RSVP is enabled. You will be approved instantly after submitting."
                : "Shortlisted RSVP is enabled. Your application will stay pending until organizer approval."}
            </p>
          )}
          {blocked ? (
            <div
              className={`mt-5 rounded-3xl border p-4 ${
                event.status === "cancelled" ? "border-rose-200 bg-rose-50" : "border-amber-200 bg-amber-50"
              }`}
            >
              <p className={`text-sm font-semibold ${event.status === "cancelled" ? "text-rose-900" : "text-amber-900"}`}>
                {event.status === "cancelled" ? "Event Cancelled" : "Event Full"}
              </p>
              <p className={`mt-1 text-sm ${event.status === "cancelled" ? "text-rose-700" : "text-amber-700"}`}>
                {cancelledMessage}
              </p>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="mt-4 grid gap-3.5">
              <label className="relative">
                <input
                  name="name"
                  placeholder=" "
                  value={nameValue}
                  onChange={(eventInput) => setNameValue(eventInput.target.value)}
                  className="w-full rounded-full border border-slate-200 bg-white px-5 py-3 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-500"
                  required
                />
                {nameValue.length === 0 && (
                  <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[11px]">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={nameHints[nameHintIndex]}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.22 }}
                        className="font-clash uppercase tracking-[0.15em] text-slate-400"
                      >
                        {nameHints[nameHintIndex]}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                )}
              </label>

              <label className="relative">
                <input
                  name="email"
                  type="email"
                  placeholder=" "
                  value={emailValue}
                  onChange={(eventInput) => setEmailValue(eventInput.target.value)}
                  className="w-full rounded-full border border-slate-200 bg-white px-5 py-3 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-500"
                  required
                />
                {emailValue.length === 0 && (
                  <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[11px]">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={emailHints[emailHintIndex]}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.22 }}
                        className="font-clash uppercase tracking-[0.15em] text-slate-400"
                      >
                        {emailHints[emailHintIndex]}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                )}
              </label>

              {event.whatsappEnabled && (
                <label className="relative">
                  <input
                    name="phone"
                    placeholder=" "
                    value={phoneValue}
                    onChange={(eventInput) => setPhoneValue(eventInput.target.value)}
                    className="w-full rounded-full border border-slate-200 bg-white px-5 py-3 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-500"
                    required
                  />
                  {phoneValue.length === 0 && (
                    <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[11px]">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={phoneHints[phoneHintIndex]}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.22 }}
                          className="font-clash uppercase tracking-[0.15em] text-slate-400"
                        >
                          {phoneHints[phoneHintIndex]}
                        </motion.span>
                      </AnimatePresence>
                    </span>
                  )}
                </label>
              )}

              {!event.whatsappEnabled && (
                <label className="relative">
                  <input
                    name="phone"
                    placeholder=" "
                    value={phoneValue}
                    onChange={(eventInput) => setPhoneValue(eventInput.target.value)}
                    className="w-full rounded-full border border-slate-200 bg-white px-5 py-3 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-500"
                  />
                  {phoneValue.length === 0 && (
                    <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[11px]">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={phoneHints[phoneHintIndex]}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.22 }}
                          className="font-clash uppercase tracking-[0.15em] text-slate-400"
                        >
                          {phoneHints[phoneHintIndex]}
                        </motion.span>
                      </AnimatePresence>
                    </span>
                  )}
                </label>
              )}

              <button
                disabled={submitting}
                className="font-clash group relative mt-1 overflow-hidden rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white disabled:opacity-60"
              >
                <span className="absolute inset-x-0 bottom-0 h-full translate-y-full bg-emerald-600 transition-transform duration-300 group-hover:translate-y-0" />
                <span className="relative z-10">{submitting ? "Submitting..." : "Submit Registration"}</span>
              </button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
