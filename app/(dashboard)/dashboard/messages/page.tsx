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

  if (loading) {
    return <LoadingState label="Loading message logs..." />;
  }

  return (
    <div className="space-y-4">
      <h2 className="kpi text-xl font-semibold">Messaging Dashboard</h2>
      <div className="panel overflow-x-auto p-4">
        <table className="w-full text-left text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="pb-2">Event</th>
              <th className="pb-2">Attendee</th>
              <th className="pb-2">Type</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id} className="border-t border-slate-100">
                <td className="py-2">{log.eventId?.title}</td>
                <td className="py-2">{log.attendeeId?.name}</td>
                <td className="py-2">{log.type}</td>
                <td className="py-2">{log.status}</td>
                <td className="py-2">{new Date(log.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {logs.length === 0 && <p className="pt-4 text-sm text-slate-500">No message logs available yet.</p>}
      </div>
    </div>
  );
}
