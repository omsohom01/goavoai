"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Calendar as CalendarIcon, Clock, MapPin, Users as UsersIcon, Layout, Info, CheckCircle2, Sparkles } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import type { EventItem } from "@/lib/types";
import type { EventTemplate } from "@/lib/templates";
import Calendar from "./Calendar";
import TimePickerUI from "./TimePickerUI";
import CustomSelect from "./CustomSelect";
import { motion, AnimatePresence } from "framer-motion";

type EventFormProps = {
  initial?: EventItem;
  template?: EventTemplate;
};

export default function EventForm({ initial, template }: EventFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [whatsappEnabled, setWhatsappEnabled] = useState(initial?.whatsappEnabled ?? false);
  
  // Form Field States for animations
  const [titleValue, setTitleValue] = useState(initial?.title ?? template?.titlePattern ?? "");
  const [descValue, setDescValue] = useState(initial?.description ?? template?.descriptionTemplate ?? "");
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const [isDescFocused, setIsDescFocused] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  
  // Dynamic Placeholders
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const titles = ["HacksTrix", "WebDev Summit", "AI Horizon 2024", "SaaS Growth Expo", "Creative Jam"];
  const descriptions = [
    "Join 500+ developers for 48 hours of pure innovation...",
    "Master the latest web technologies from industry leaders...",
    "Exploring the future of artificial intelligence together...",
    "The ultimate gathering for SaaS founders and enthusiasts...",
    "Bring your designs to life in this collaborative workshop..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % titles.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Date and Time states
  const [selectedDate, setSelectedDate] = useState<Date>(
    initial ? new Date(initial.dateTime) : new Date()
  );
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  const calendarRef = useRef<HTMLDivElement>(null);
  const timePickerRef = useRef<HTMLDivElement>(null);

  // Close pickers on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
      if (timePickerRef.current && !timePickerRef.current.contains(event.target as Node)) {
        setShowTimePicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const locationTypeDefault = initial?.locationType ?? template?.locationType ?? "offline";
  const rsvpModeDefault = initial?.rsvpMode ?? template?.rsvpModeDefault ?? "open";
  const capacityDefault = initial?.capacity ?? template?.capacityDefault ?? 100;
  const templateTypeDefault = initial?.templateType ?? template?.id ?? "standard";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const now = new Date();
    
    if (selectedDate.toDateString() === now.toDateString()) {
      if (selectedDate.getTime() < now.getTime()) {
        toast.error("Event time cannot be in the past for today's date");
        setLoading(false);
        return;
      }
    } else if (selectedDate.getTime() < now.getTime()) {
      toast.error("Event date cannot be in the past");
      setLoading(false);
      return;
    }

    const formData = new FormData(event.currentTarget);
    
    const payload = {
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      dateTime: selectedDate.toISOString(),
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

    if (!response.ok) {
      const data = await response.json();
      toast.error(data.error ?? "Unable to save event");
      setLoading(false);
      return;
    }

    toast.success(initial ? "Event updated" : "Event created");
    router.push("/dashboard");
    router.refresh();
  }

  async function handleEnhance() {
    if (!descValue.trim()) {
      toast.error("Please write a line to enhance first");
      return;
    }

    setIsEnhancing(true);
    try {
      const response = await fetch("/api/ai/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: descValue }),
      });

      if (!response.ok) {
        throw new Error("Failed to enhance");
      }

      const data = await response.json();
      setDescValue(data.enhancedText);
      toast.success("Description enhanced!");
    } catch (error) {
      console.error(error);
      toast.error("AI enhancement failed. Please check your API key.");
    } finally {
      setIsEnhancing(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-3xl space-y-8 pb-12">
      <style>{`
        .description-textarea::-webkit-scrollbar {
          width: 4px;
        }
        .description-textarea::-webkit-scrollbar-track {
          background: transparent;
        }
        .description-textarea::-webkit-scrollbar-thumb {
          background: #10b981;
          border-radius: 10px;
        }
        .description-textarea {
          scrollbar-width: thin;
          scrollbar-color: #10b981 transparent;
        }
      `}</style>
      {/* Essential Info */}
      <div className="space-y-4">
        <div className="group relative">
          <input
            name="title"
            value={titleValue}
            onChange={(e) => setTitleValue(e.target.value)}
            onFocus={() => setIsTitleFocused(true)}
            onBlur={() => setIsTitleFocused(false)}
            className="w-full rounded-full border border-slate-200 bg-white/50 px-10 py-4 text-lg font-semibold text-slate-900 outline-none transition-[border-color,background-color] duration-200 hover:border-slate-400 focus:border-emerald-500/50 focus:bg-white"
            required
          />
          {!titleValue && !isTitleFocused && (
            <div className="pointer-events-none absolute left-10 top-1/2 -translate-y-1/2 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={placeholderIndex}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  style={{ willChange: "transform, opacity" }}
                  className="block text-lg font-semibold text-slate-400"
                >
                  {titles[placeholderIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          )}
        </div>

        <div className="relative">
          <textarea
            name="description"
            value={descValue}
            onChange={(e) => setDescValue(e.target.value)}
            onFocus={() => setIsDescFocused(true)}
            onBlur={() => setIsDescFocused(false)}
            className="min-h-40 w-full rounded-[2rem] border border-slate-200 bg-white/50 px-8 pb-16 pt-6 text-base text-slate-700 outline-none transition-[border-color,background-color] duration-200 hover:border-slate-400 focus:border-emerald-500/50 focus:bg-white description-textarea"
            required
          />
          {!descValue && !isDescFocused && (
            <div className="pointer-events-none absolute left-8 top-6 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={placeholderIndex}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  style={{ willChange: "transform, opacity" }}
                  className="block text-base text-slate-400"
                >
                  {descriptions[placeholderIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          )}
          
          <button
            type="button"
            onClick={handleEnhance}
            disabled={isEnhancing}
            className="absolute bottom-4 right-4 group flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-lg transition-all hover:bg-emerald-600 active:scale-95 disabled:opacity-50"
          >
            <Sparkles className={`h-3.5 w-3.5 ${isEnhancing ? "animate-pulse" : "group-hover:scale-110"}`} />
            {isEnhancing ? "Enhancing..." : "Enhance with AI"}
          </button>
        </div>
      </div>

      {/* Date & Time Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Date Picker */}
        <div className="relative" ref={calendarRef}>
          <button
            type="button"
            onClick={() => setShowCalendar(!showCalendar)}
            className="flex w-full items-center gap-4 rounded-full border border-slate-200 bg-white/50 px-6 py-4 text-left transition-[border-color,background-color] duration-200 hover:bg-white hover:border-slate-300"
          >
            <CalendarIcon className="h-6 w-6 text-emerald-600" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Date</span>
              <span className="text-sm font-semibold text-slate-700">
                {selectedDate.toLocaleDateString("default", { day: "numeric", month: "long", year: "numeric" })}
              </span>
            </div>
          </button>
          
          {showCalendar && (
            <div className="absolute left-0 top-full z-50 mt-2">
              <Calendar 
                selectedDate={selectedDate} 
                onDateChange={(date) => {
                  const newDate = new Date(selectedDate);
                  newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
                  setSelectedDate(newDate);
                  setShowCalendar(false);
                }} 
              />
            </div>
          )}
        </div>

        {/* Time Picker */}
        <div className="relative" ref={timePickerRef}>
          <button
            type="button"
            onClick={() => setShowTimePicker(!showTimePicker)}
            className="flex w-full items-center gap-4 rounded-full border border-slate-200 bg-white/50 px-6 py-4 text-left transition-[border-color,background-color] duration-200 hover:bg-white hover:border-slate-300"
          >
            <Clock className="h-6 w-6 text-emerald-600" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Time</span>
              <span className="text-sm font-semibold text-slate-700">
                {selectedDate.toLocaleTimeString("default", { hour: "2-digit", minute: "2-digit", hour12: true })}
              </span>
            </div>
          </button>

          {showTimePicker && (
            <div className="absolute right-0 top-full z-50 mt-2">
              <TimePickerUI
                value={selectedDate}
                onChange={(newDate) => {
                  setSelectedDate(newDate);
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Logistics Grid */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="group relative">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-600">
            <MapPin className="h-5 w-5" />
          </div>
          <input
            name="venue"
            placeholder="Venue or Meeting Link"
            defaultValue={initial?.venue}
            className="w-full rounded-full border border-slate-200 bg-white/50 px-14 py-4 text-sm font-semibold text-slate-700 outline-none transition-[border-color,background-color] duration-200 hover:border-slate-400 focus:border-emerald-500/50 focus:bg-white"
            required
          />
        </div>

        <div className="group relative">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-600">
            <UsersIcon className="h-5 w-5" />
          </div>
          <input
            name="capacity"
            type="number"
            min={1}
            placeholder="Capacity"
            defaultValue={capacityDefault}
            className="w-full rounded-full border border-slate-200 bg-white/50 px-14 py-4 text-sm font-semibold text-slate-700 outline-none transition-[border-color,background-color] duration-200 hover:border-slate-400 focus:border-emerald-500/50 focus:bg-white"
            required
          />
        </div>
      </div>

      {/* Settings Row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <CustomSelect
          name="locationType"
          label="Location"
          defaultValue={locationTypeDefault}
          icon={<Layout className="h-5 w-5" />}
          options={[
            { value: "offline", label: "Offline" },
            { value: "online", label: "Online" },
          ]}
        />

        <CustomSelect
          name="rsvpMode"
          label="RSVP Mode"
          defaultValue={rsvpModeDefault}
          icon={<CheckCircle2 className="h-5 w-5" />}
          options={[
            { value: "open", label: "Open RSVP" },
            { value: "shortlisted", label: "Shortlisted" },
          ]}
        />

        <CustomSelect
          name="status"
          label="Status"
          defaultValue={initial?.status ?? "draft"}
          icon={<Info className="h-5 w-5" />}
          options={[
            { value: "draft", label: "Draft" },
            { value: "published", label: "Published" },
            { value: "cancelled", label: "Cancelled" },
          ]}
        />
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col items-center gap-6 pt-4">
        <div className="w-full max-w-sm">
          <label 
            className={`group relative flex cursor-pointer items-center justify-between gap-4 rounded-2xl border p-4 transition-all duration-300 ${
              whatsappEnabled 
                ? "border-emerald-500/20 bg-emerald-50/30 shadow-sm" 
                : "border-slate-100 bg-slate-50/50 hover:border-slate-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 ${
                whatsappEnabled ? "bg-white text-[#25D366] shadow-sm" : "bg-slate-100 text-slate-400"
              }`}>
                <FaWhatsapp className="h-6 w-6" />
              </div>
              <div className="flex flex-col text-left">
                <span className={`text-sm font-bold tracking-tight transition-colors ${
                  whatsappEnabled ? "text-slate-900" : "text-slate-500"
                }`}>
                  WhatsApp Registration
                </span>
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                  {whatsappEnabled ? "Enabled" : "Disabled"}
                </span>
              </div>
            </div>

            {/* Toggle Switch Visual */}
            <div className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 ${
              whatsappEnabled ? "bg-[#25D366]" : "bg-slate-200"
            }`}>
              <div className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all duration-300 shadow-sm ${
                whatsappEnabled ? "translate-x-6" : "translate-x-1"
              }`} />
            </div>

            <input
              type="checkbox"
              name="whatsappEnabled"
              checked={whatsappEnabled}
              onChange={(e) => setWhatsappEnabled(e.target.checked)}
              className="sr-only"
            />
          </label>
        </div>

        <button
          disabled={loading}
          className="group relative h-14 w-full max-w-sm overflow-hidden rounded-full bg-slate-900 text-base font-bold text-white transition-all hover:bg-emerald-600 active:scale-95 disabled:opacity-50"
        >
          <span className="relative z-10">{loading ? "Saving..." : initial ? "Update Event" : "Create Event"}</span>
          <div className="absolute inset-0 z-0 translate-y-full bg-gradient-to-t from-emerald-500 to-emerald-400 transition-transform duration-300 group-hover:translate-y-0" />
        </button>
      </div>

      {/* Hidden Fields */}
      <input type="hidden" name="templateType" value={templateTypeDefault} />
    </form>
  );
}

