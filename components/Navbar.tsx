"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MoveRight, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const navItems = [
  { href: "/dashboard", label: "Events" },
  { href: "/dashboard/attendees", label: "Attendees" },
  { href: "/dashboard/messages", label: "Messaging" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  // Pages where navbar should NOT be visible
  const isExcluded = pathname === "/" || pathname.startsWith("/login") || pathname.startsWith("/register");
  
  if (isExcluded) return null;

  async function handleLogout() {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (response.ok) {
        toast.success("Logged out successfully");
        router.push("/login");
        router.refresh();
      }
    } catch (error) {
      toast.error("Logout failed");
    }
  }

  return (
    <nav className="fixed top-2 left-1/2 z-50 w-full max-w-5xl -translate-x-1/2 px-4 border ">
      <div className="flex h-14 items-center justify-between rounded-full border border-slate-600/60 bg-white/80 px-4 backdrop-blur-xl md:px-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
          <div className="relative h-7 w-7 overflow-hidden rounded-lg invert">
            <Image
              src="/logo.png"
              alt="Evexa Logo"
              fill
              sizes="28px"
              className="object-contain"
            />
          </div>
          <span className="font-rustic text-sm font-bold uppercase tracking-[0.2em] text-slate-900">
            Evexa
          </span>
        </Link>

        {/* Center Links - Desktop */}
        <div className="hidden items-center gap-1 rounded-full border border-slate-200/50 bg-slate-200/50 p-1 md:flex">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "font-clash relative rounded-full px-5 py-1.5 text-[13px] font-medium transition-all duration-300",
                  active
                    ? "bg-slate-900 text-white shadow-sm border border-slate-200"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Right Action Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-full bg-slate-900 px-4 py-1.5 text-[13px] font-semibold text-white transition-all duration-300 hover:bg-slate-300/40 hover:text-black"
          >
            <span className="font-clash hidden sm:inline">Logout</span>
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Center Links - Mobile pill underneath or just centered */}
      <div className="mt-3 flex justify-center md:hidden">
        <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white/90 p-1 backdrop-blur-md shadow-lg">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-1.5 text-xs font-medium transition-all",
                  active
                    ? "bg-slate-900 text-white"
                    : "text-slate-500 hover:text-slate-900"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
