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
    <nav className="fixed top-6 left-1/2 z-50 w-full max-w-5xl -translate-x-1/2 px-4">
      <div className="flex h-14 items-center justify-between rounded-full border border-white/10 bg-black/70 px-4 backdrop-blur-xl md:px-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
          <div className="relative h-7 w-7 overflow-hidden rounded-lg">
            <Image
              src="/logo.png"
              alt="Evexa Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-white">
            Evexa
          </span>
        </Link>

        {/* Center Links - Desktop */}
        <div className="hidden items-center gap-1 rounded-full border border-white/5 bg-white/5 p-1 md:flex">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-full px-5 py-1.5 text-[13px] font-medium transition-all duration-300",
                  active
                    ? "bg-white text-black shadow-lg"
                    : "text-white/60 hover:text-white"
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
            className="flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-[13px] font-semibold text-black transition-all hover:bg-green-500 hover:text-white"
          >
            <span className="hidden sm:inline">Logout</span>
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Center Links - Mobile pill underneath or just centered */}
      <div className="mt-3 flex justify-center md:hidden">
        <div className="flex items-center gap-1 rounded-full border border-white/10 bg-black/80 p-1 backdrop-blur-md shadow-xl">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-1.5 text-xs font-medium transition-all",
                  active
                    ? "bg-white text-black"
                    : "text-white/50 hover:text-white"
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
