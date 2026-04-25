"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import EmptyState from "@/components/EmptyState";
import LoadingState from "@/components/LoadingState";
import Magnet from "@/components/Magnet";
import { Plus } from "lucide-react";
import type { EventItem } from "@/lib/types";
import { useTour } from "@/components/TourProvider";

export default function DashboardPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { startTour } = useTour();

  useEffect(() => {
    let mounted = true;

    fetch("/api/events", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        if (mounted) {
          setEvents(data.events ?? []);
          setLoading(false);

          // Auto-start tour for first-time users
          const tourDone = localStorage.getItem("evexa_tour_done");
          if (!tourDone) {
            setTimeout(() => startTour(), 600);
          }
        }
      })
      .catch(() => setLoading(false));

    return () => {
      mounted = false;
    };
  }, [startTour]);

  if (loading) {
    return <LoadingState label="Fetching your events..." />;
  }

  return (
    <div className="relative min-h-screen pb-20">
      <style>{`
        @keyframes spacingIn {
          0% { letter-spacing: 0.3em; opacity: 0; transform: scale(0.95); }
          100% { letter-spacing: normal; opacity: 1; transform: scale(1); }
        }
        .animate-spacing-in {
          animation: spacingIn 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
      `}</style>

      {/* SaaS Background Elements */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-transparent bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-emerald-500 opacity-20 blur-[100px]"></div>
        <div className="absolute top-[20%] left-[-10%] -z-10 h-[400px] w-[400px] rounded-full bg-teal-500 opacity-10 blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[-10%] -z-10 h-[400px] w-[400px] rounded-full bg-emerald-400 opacity-10 blur-[120px]"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center pt-2 md:pt-4">
        <div className="w-full max-w-[1200px] px-6">
          
          {/* Header Section */}
          <div className="mb-10 flex flex-col items-center text-center gap-4">
            <div className="flex flex-col items-center">
              <h2 data-tour="dashboard-heading" className="font-rustic text-5xl md:text-[5rem] leading-[1.3] py-2 px-12 -mt-2 font-normal animate-spacing-in hover:tracking-widest transition-all duration-500 ease-out bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 drop-shadow-sm">
                Events
              </h2>
            </div>
            
            {events.length > 0 && (
              <Magnet padding={20} magnetStrength={2}>
                <Link
                  data-tour="new-event-btn"
                  href="/dashboard/events/new"
                  className="font-clash group relative flex h-12 w-40 items-center justify-center overflow-hidden rounded-full border border-emerald-500 bg-emerald-500 text-sm font-bold text-white shadow-sm transition-all hover:border-slate-900 hover:bg-slate-900 hover:shadow-md hover:-translate-y-0.5"
                >
                  <span className="relative z-10 transition-transform duration-300 flex items-center gap-1.5">
                    <Plus className="w-4 h-4" /> New Event
                  </span>
                </Link>
              </Magnet>
            )}
          </div>

          {events.length === 0 ? (
            <div className="flex flex-col items-center justify-center space-y-6 py-5 bg-white/40 backdrop-blur-md rounded-[2rem] border border-slate-200/50 shadow-sm">
              <EmptyState
                title="No events yet"
                body="Create your first event, publish it, and share your event page URL."
              />
              <Magnet padding={20} magnetStrength={2}>
                <Link
                  data-tour="new-event-btn"
                  href="/dashboard/events/new"
                  className="font-clash group relative flex h-12 w-40 items-center justify-center overflow-hidden rounded-full border border-emerald-500 bg-emerald-500 text-sm font-bold text-white shadow-sm transition-all hover:border-slate-900 hover:bg-slate-900 hover:shadow-md hover:-translate-y-0.5"
                >
                  <span className="relative z-10 transition-transform duration-300 flex items-center gap-1.5">
                    <Plus className="w-4 h-4" /> New Event
                  </span>
                </Link>
              </Magnet>
            </div>
          ) : (
            <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <article key={event._id} className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-slate-200/60 bg-white/90 backdrop-blur-xl shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-emerald-900/5 hover:-translate-y-1 p-6">
                  
                  <div>
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <h3 className="font-clash text-xl md:text-2xl font-bold text-slate-900 transition-colors group-hover:text-emerald-700">
                        {event.title}
                      </h3>
                      
                      <span className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${event.isFull ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {event.isFull ? "full" : event.status}
                      </span>
                    </div>
                    
                    <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">
                      {event.description}
                    </p>
                    
                    <div className="mt-5 flex flex-wrap items-center gap-2.5 text-xs font-medium text-slate-500">
                      <div className="flex items-center gap-1.5 rounded-full border border-slate-100 bg-slate-50 px-2.5 py-1.5 transition-colors group-hover:border-emerald-100 group-hover:bg-emerald-50/50 group-hover:text-emerald-700">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        {new Date(event.dateTime).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1.5 rounded-full border border-slate-100 bg-slate-50 px-2.5 py-1.5 transition-colors group-hover:border-emerald-100 group-hover:bg-emerald-50/50 group-hover:text-emerald-700">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {event.locationType}
                      </div>
                      <div className="flex items-center gap-1.5 rounded-full border border-slate-100 bg-slate-50 px-2.5 py-1.5 transition-colors group-hover:border-emerald-100 group-hover:bg-emerald-50/50 group-hover:text-emerald-700">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        {event.capacity}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex flex-wrap items-center gap-2">
                    <Link href={`/dashboard/events/${event._id}`} className="group/btn relative overflow-hidden flex-1 rounded-full border border-slate-200 bg-white py-2 text-center text-[13px] font-semibold text-slate-700 shadow-sm transition-all">
                      <span className="absolute inset-0 h-full w-full bg-black translate-y-[101%] transition-transform duration-300 ease-out group-hover/btn:translate-y-0" />
                      <span className="relative z-10 transition-colors duration-300 group-hover/btn:text-white">Manage</span>
                    </Link>
                    <Link href={`/dashboard/events/${event._id}/edit`} className="group/btn relative overflow-hidden flex-1 rounded-full border border-slate-200 bg-white py-2 text-center text-[13px] font-semibold text-slate-700 shadow-sm transition-all">
                      <span className="absolute inset-0 h-full w-full bg-black translate-y-[101%] transition-transform duration-300 ease-out group-hover/btn:translate-y-0" />
                      <span className="relative z-10 transition-colors duration-300 group-hover/btn:text-white">Edit</span>
                    </Link>
                    <Link href={`/event/${event._id}`} className="group/btn relative overflow-hidden flex-[1.2] rounded-full border border-emerald-500 bg-emerald-500 py-2 text-center text-[13px] font-semibold text-white shadow-sm transition-all">
                      <span className="absolute inset-0 h-full w-full bg-slate-900 translate-y-[101%] transition-transform duration-300 ease-out group-hover/btn:translate-y-0" />
                      <span className="relative z-10 transition-colors duration-300 group-hover/btn:text-white">Public Page</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
