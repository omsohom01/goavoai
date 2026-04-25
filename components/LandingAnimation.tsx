'use client'

import React, { useEffect, useRef, useState } from "react";

interface LandingAnimationProps {
  onComplete?: () => void;
}

const LETTERS = ["E", "v", "e", "x", "a"];
const LETTER_DELAY = 160;
const START   = 180;
const GREEN   = START + LETTERS.length * LETTER_DELAY + 80;
const UBAR    = GREEN + 60;
const TAGLINE = GREEN + 280;
const EXIT    = TAGLINE + 1500;
const UNMOUNT = EXIT + 700;

export default function LandingAnimation({ onComplete }: LandingAnimationProps) {
  const [visible, setVisible]   = useState<boolean[]>(Array(LETTERS.length).fill(false));
  const [green, setGreen]       = useState(false);
  const [ubar, setUbar]         = useState(false);
  const [tagline, setTagline]   = useState(false);
  const [exit, setExit]         = useState(false);
  const [mounted, setMounted]   = useState(true);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    const startTs = performance.now();
    const animBar = (ts: number) => {
      const pct = Math.min(((ts - startTs) / (EXIT - 100)) * 100, 100);
      setProgress(pct);
      if (pct < 100) rafRef.current = requestAnimationFrame(animBar);
    };
    rafRef.current = requestAnimationFrame(animBar);

    LETTERS.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          setVisible((prev) => {
            const next = [...prev];
            next[i] = true;
            return next;
          });
        }, START + i * LETTER_DELAY)
      );
    });

    timers.push(setTimeout(() => setGreen(true),   GREEN));
    timers.push(setTimeout(() => setUbar(true),    UBAR));
    timers.push(setTimeout(() => setTagline(true), TAGLINE));
    timers.push(setTimeout(() => setExit(true),    EXIT));
    timers.push(
      setTimeout(() => {
        setMounted(false);
        onComplete?.();
      }, UNMOUNT)
    );

    return () => {
      timers.forEach(clearTimeout);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [onComplete]);

  if (!mounted) return null;

  const letterStyle: React.CSSProperties = {
    fontSize: "clamp(5rem, 14vw, 9rem)",
    fontWeight: 400,
    fontStyle: "italic",
    lineHeight: 1,
    letterSpacing: "-0.02em",
    display: "inline-block",
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white transition-opacity duration-700 ${exit ? "opacity-0 pointer-events-none" : "opacity-100"}`}
    >
      {/* Top progress line */}
      <div
        className="absolute top-0 left-0 h-[1.5px] bg-gradient-to-r from-emerald-700 via-emerald-400 to-emerald-300 transition-[width] duration-75 ease-linear"
        style={{ width: `${progress}%` }}
      />

      <div className="flex flex-col items-center">

        {/* Word container */}
        <div className="relative inline-flex items-baseline">

          {/* Layer 1: black letters, animate in */}
          {LETTERS.map((char, i) => (
            <span
              key={i}
              className="font-rustic transition-[opacity,transform] duration-[320ms] ease-out"
              style={{
                ...letterStyle,
                color: "#111111",
                opacity: visible[i] ? 1 : 0,
                transform: visible[i] ? "translateY(0)" : "translateY(16px)",
              }}
            >
              {char}
            </span>
          ))}

          {/*
            Layer 2: gradient overlay.
            Expands 16px top/bottom and 12px left/right BEYOND the letters
            so background-clip never reaches a glyph edge.
            Padding mirrors the expansion to keep glyphs aligned.
          */}
          <div
            className={`absolute pointer-events-none flex items-baseline transition-opacity duration-500 ease-out ${green ? "opacity-100" : "opacity-0"}`}
            style={{
              top: "-16px",
              bottom: "-16px",
              left: "-12px",
              right: "-12px",
              padding: "16px 12px",
              background: "linear-gradient(135deg, #059669 0%, #10b981 55%, #34d399 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
            }}
          >
            {LETTERS.map((char, i) => (
              <span
                key={i}
                className="font-rustic"
                style={{
                  ...letterStyle,
                  WebkitTextFillColor: "transparent",
                  color: "transparent",
                }}
              >
                {char}
              </span>
            ))}
          </div>
        </div>

        {/* Underline bar */}
        <div
          className={`h-px bg-gradient-to-r from-transparent via-emerald-100 to-transparent mt-1 transition-all duration-[600ms] ease-out ${ubar ? "w-full" : "w-0"}`}
        />
        {/* Tagline */}
        <p
          className={`font-clash italic text-[0.88rem] tracking-[0.05em] text-gray-400 mt-4 transition-all duration-[550ms] ease-out ${tagline ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
        >
          Where ideas turn into experiences.
        </p>
      </div>
    </div>
  );
}