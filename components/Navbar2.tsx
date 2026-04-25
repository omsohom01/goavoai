"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar2() {
  const pathname = usePathname();

  const isLanding = pathname === "/";
  const isEventPage = pathname.startsWith("/event/");

  if (!isLanding && !isEventPage) return null;

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

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          {isLanding && (
            <>
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-full px-4 py-1.5 text-[13px] font-semibold text-slate-900 transition-all duration-300 hover:bg-slate-200/50"
              >
                <span className="font-clash hidden sm:inline">Login</span>
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-2 rounded-full bg-slate-900 px-4 py-1.5 text-[13px] font-semibold text-white transition-all duration-300 hover:bg-slate-300/40 hover:text-black"
              >
                <span className="font-clash hidden sm:inline">Get Started</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

