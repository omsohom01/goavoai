"use client";

import { useEffect, useState } from "react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function LoadingState({ label = "Loading...", isComplete = false }: { label?: string; isComplete?: boolean }) {
  const [fadeOut, setFadeOut] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Avoid flashing the loader on fast page transitions.
    const showTimer = setTimeout(() => setVisible(true), 350);
    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (isComplete) {
      const fadeTimer = setTimeout(() => setFadeOut(true), 500);
      return () => clearTimeout(fadeTimer);
    }
  }, [isComplete]);

  if (!visible) {
    return null;
  }

  return (
    <div className={`flex min-h-[60vh] w-full items-center justify-center px-6 transition-opacity duration-500 ${fadeOut ? "opacity-0" : "opacity-100"}`}>
      <div className="w-full max-w-xl flex flex-col items-center">
        <div className="h-[600px] w-[600px]">
          <DotLottieReact
            src="/Animations/Green%20Loader.lottie"
            loop
            autoplay
          />
        </div>
        <p className="font-clash text-center text-sm tracking-wide text-emerald-800/90">{label}</p>
      </div>
    </div>
  );
}
