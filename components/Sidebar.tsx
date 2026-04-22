"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Events" },
  { href: "/dashboard/attendees", label: "Attendees" },
  { href: "/dashboard/messages", label: "Messaging" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full border-b border-[var(--border)] bg-white px-4 py-4 md:min-h-screen md:w-64 md:border-b-0 md:border-r md:px-6 md:py-8">
      <div className="mb-8 flex items-center gap-2">
        <div className="h-3 w-3 rounded-full bg-cyan-500" />
        <p className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">
          EventForge
        </p>
      </div>
      <nav className="flex gap-2 md:flex-col">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                active
                  ? "bg-cyan-50 text-cyan-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
