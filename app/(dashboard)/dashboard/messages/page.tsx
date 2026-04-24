"use client";

import { useEffect, useState } from "react";
import LoadingState from "@/components/LoadingState";
import type { MessageLogItem } from "@/lib/types";

export default function MessagesPage() {
  const [logs, setLogs] = useState<MessageLogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/messages")
      .then((response) => response.json())
      .then((data) => setLogs(data.logs ?? []))
      .finally(() => setLoading(false));
  }, []);

  function getTypeLabel(type?: string) {
    if (!type) return "Unknown";
    return type
      .split(/[_-\s]+/)
      .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1).toLowerCase())
      .join(" ");
  }

  function getStatusClass(status?: string) {
    const normalized = String(status ?? "").toLowerCase();
    if (normalized === "sent" || normalized === "delivered" || normalized === "success") {
      return "bg-emerald-100 text-emerald-700";
    }
    if (normalized === "failed" || normalized === "error") {
      return "bg-rose-100 text-rose-700";
    }
    if (normalized === "pending" || normalized === "queued") {
      return "bg-amber-100 text-amber-700";
    }
    return "bg-slate-100 text-slate-700";
  }

  if (loading) {
    return <LoadingState label="Loading message logs..." />;
  }

  return (
    <div className="mt-1 mx-auto w-full max-w-6xl space-y-6">
      <style>{`
        @keyframes spacingIn {
          0% { letter-spacing: 0.3em; opacity: 0; transform: scale(0.95); }
          100% { letter-spacing: normal; opacity: 1; transform: scale(1); }
        }
        .animate-spacing-in {
          animation: spacingIn 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
      `}</style>
      <div className="flex justify-center">
        <h2 className="font-rustic text-center text-5xl text-emerald-500 animate-spacing-in sm:text-7xl">
          Messaging Dashboard
        </h2>
      </div>

      <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-clash text-[11px] uppercase tracking-[0.2em] text-slate-500">Communication Logs</p>
            <p className="mt-1 text-sm text-slate-600">Track delivery status and attendee communication timeline.</p>
          </div>
          <div className="rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2">
            <p className="font-clash text-[10px] uppercase tracking-[0.2em] text-emerald-700">Total Logs</p>
            <p className="font-clash text-base font-semibold text-emerald-800">{logs.length}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="font-clash text-[11px] uppercase tracking-[0.16em] text-slate-500">
            <tr>
              <th className="pb-3">Event</th>
              <th className="pb-3">Attendee</th>
              <th className="pb-3">Type</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id} className="border-t border-slate-100 text-slate-700 transition-colors hover:bg-slate-50/70">
                <td className="py-3 font-medium text-slate-900">{log.eventId?.title ?? "Untitled Event"}</td>
                <td className="py-3">{log.attendeeId?.name ?? "Unknown Attendee"}</td>
                <td className="py-3">
                  <span className="font-clash rounded-full bg-cyan-100 px-3 py-1 text-[11px] uppercase tracking-wider text-cyan-700">
                    {getTypeLabel(log.type)}
                  </span>
                </td>
                <td className="py-3">
                  <span className={`font-clash rounded-full px-3 py-1 text-[11px] uppercase tracking-wider ${getStatusClass(log.status)}`}>
                    {getTypeLabel(log.status)}
                  </span>
                </td>
                <td className="py-3 text-slate-600">{new Date(log.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        {logs.length === 0 && <p className="pt-4 text-sm text-slate-500">No message logs available yet.</p>}
      </div>
    </div>
  );
}
