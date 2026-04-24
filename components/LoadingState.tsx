"use client";

import { useEffect, useState } from "react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function LoadingState({ label = "Loading...", isComplete = false }: { label?: string; isComplete?: boolean }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (isComplete) {
      const fadeTimer = setTimeout(() => setFadeOut(true), 500);
      return () => clearTimeout(fadeTimer);
    }
  }, [isComplete]);

  return (
    <div className={`flex min-h-[60vh] w-full items-center justify-center px-6 transition-opacity duration-500 ${fadeOut ? "opacity-0" : "opacity-100"}`}>
      <div className="w-full max-w-xl flex flex-col items-center">
        <div className="h-48 w-48">
          <DotLottieReact
            src="/Animations/Green%20Loader.lottie"
            loop
            autoplay
          />
        </div>
        <p className="font-clash mt-6 text-center text-sm tracking-wide text-emerald-800/90">{label}</p>
      </div>
    </div>
  );
}
