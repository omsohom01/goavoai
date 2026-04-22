"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function TopBar() {
  const router = useRouter();

  async function handleLogout() {
    const response = await fetch("/api/auth/logout", { method: "POST" });
    if (response.ok) {
      toast.success("Logged out successfully");
      router.push("/login");
      router.refresh();
    }
  }

  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Organizer Console</p>
        <h1 className="kpi text-2xl font-semibold text-slate-900">Event Management SaaS</h1>
      </div>
      <button
        onClick={handleLogout}
        className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
      >
        Logout
      </button>
    </div>
  );
}
