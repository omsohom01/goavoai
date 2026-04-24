'use client'

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DarkVeil from "../DarkVeil";
import GridBackground from "../GridBackground";


const Hero = () => {
  const lottieContainer = useRef<HTMLDivElement>(null);

  const router = useRouter();

  useEffect(() => {
    let anim: any;
    let isMounted = true;

    const loadLottie = async () => {
      try {
        const lottie = (await import("lottie-web")).default;
        
        if (!isMounted || !lottieContainer.current) return;

        // Clear container to prevent duplicates
        lottieContainer.current.innerHTML = "";

        anim = lottie.loadAnimation({
          container: lottieContainer.current,
          renderer: "svg",
          loop: false,
          autoplay: true,
          path: "/Animations/Dashboard_lottie.json",
          rendererSettings: {
            preserveAspectRatio: "xMidYMid meet",
          },
        });
      } catch (error) {
        console.error("Error loading Lottie:", error);
      }
    };

    loadLottie();

    return () => {
      isMounted = false;
      if (anim) {
        anim.destroy();
      }
    };
  }, []);

  return (
    <section
      className="relative isolate overflow-hidden "
      style={{ background: "linear-gradient(160deg, #ffffff 70%, #f0fdf4 100%)" }}
    >
      <GridBackground className="absolute inset-0 z-0" />
      {/* Noise texture overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "180px",
        }}
      />

      {/* Bottom-left green glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-72 -left-56 z-0 h-[36rem] w-[36rem] rounded-full"
        style={{
          background: "radial-gradient(circle, #16a34a 0%, transparent 70%)",
          opacity: 0.1,
          filter: "blur(90px)",
        }}
      />

      {/* Top-right subtle green glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-48 -right-48 z-0 h-[40rem] w-[40rem] rounded-full"
        style={{
          background: "radial-gradient(circle, #10b981 0%, transparent 75%)",
          opacity: 0.08,
          filter: "blur(110px)",
        }}
      />

      {/* Center-left soft accent glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 -left-24 z-0 h-[30rem] w-[30rem] -translate-y-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, #34d399 0%, transparent 70%)",
          opacity: 0.06,
          filter: "blur(100px)",
        }}
      />

      {/* Large Bottom Peeking Sphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[22rem] left-1/2 z-0 h-[45rem] w-[100vw] -translate-x-1/2 rounded-[100%]"
        style={{
          background: "radial-gradient(50% 50% at 50% 50%, rgba(16, 185, 129, 0.4) 0%, rgba(5, 150, 105, 0.15) 50%, transparent 85%)",
          filter: "blur(60px)",
        }}
      />

      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-[1400px] grid-cols-1 items-center gap-12 px-6 py-32 sm:px-10 lg:grid-cols-2 lg:gap-16 lg:px-12">

        {/* ── LEFT ── */}
        <div className="flex flex-col gap-6 max-w-xl">

          {/* Eyebrow */}
          <div className="flex items-center gap-4">
            <span
              className="h-px w-10 inline-block bg-green-500"
            />
            <p
              className="text-sm font-medium tracking-[0.2em] uppercase text-gray-500"
            >
              Enterprise Event Intelligence
            </p>
          </div>

          {/* Heading */}
          <h1 className="flex flex-col gap-2" style={{ lineHeight: 1.1 }}>
            {/* First line — plain dark gray, system font */}
            <span
              className="text-5xl font-light sm:text-6xl lg:text-[4.2rem] text-gray-900 tracking-tight"
            >
              Run events that{" "}
            </span>

            {/* Second line — Clash Display + green pill background */}
            <span
              className="font-rustic inline-block whitespace-nowrap text-5xl sm:text-6xl lg:text-[6rem]"
              style={{
                background: "linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 8px 16px rgba(16, 185, 129, 0.25))",
                paddingTop: "0.15em",
                paddingBottom: "0.15em"
              }}
            >
              actually scale
            </span>
          </h1>

          {/* Description */}
          <p
            className="text-[1.3rem] leading-snug max-w-[580px] text-gray-500 font-light"
          >
            Unify registrations, attendee messaging, and operational visibility
            in one platform built for teams that refuse to compromise.
          </p>

          {/* CTA row */}
          <div className="flex items-center gap-8 pt-4">
            <Link
              href="/register"
              className="group relative inline-flex items-center gap-4 overflow-hidden rounded-full px-10 py-5 text-base font-medium text-white transition-all duration-500 bg-gray-900"
              style={{
                boxShadow: "0 4px 14px 0 rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.1) inset, 0 8px 24px -8px rgba(16,185,129,0.4)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 6px 20px 0 rgba(0,0,0,0.15), 0 0 0 1px rgba(16,185,129,0.5) inset, 0 12px 32px -8px rgba(16,185,129,0.6)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 4px 14px 0 rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.1) inset, 0 8px 24px -8px rgba(16,185,129,0.4)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              {/* Shimmer */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 translate-x-[-100%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-[200%]"
              />
              <span className="relative z-10 tracking-wide">Get Started</span>
              <svg viewBox="0 0 16 16" fill="none" className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 text-green-400" stroke="currentColor" strokeWidth="2">
                <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <p className="text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
              View demo
            </p>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-4 pt-6">
            <div className="flex -space-x-3">
              {["#d1fae5", "#a7f3d0", "#6ee7b7", "#34d399"].map((bg, i) => (
                <div
                  key={i}
                  className="h-10 w-10 rounded-full border-[2.5px] border-white shadow-sm"
                  style={{ background: bg }}
                />
              ))}
            </div>
            <p className="text-base font-light text-gray-500">
              <span className="font-medium text-gray-800">2,400+</span> teams onboarded
            </p>
          </div>
        </div>

        {/* ── RIGHT — Lottie Animation ── */}
        <div className="relative flex items-center justify-center">
          <div
            ref={lottieContainer}
            className="w-full max-w-[650px] lg:max-w-[800px]"
            style={{
              minHeight: "480px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: "scale(1.15)",
              transformOrigin: "center",
            }}
          />
        </div>

      </div>
    </section>
  );
};

export default Hero;