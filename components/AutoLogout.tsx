"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

/**
 * AutoLogout Component
 * 
 * Automatically logs out the user after a period of inactivity.
 * Inactivity is defined as no mouse movement, key presses, clicks, or scrolls.
 */
export default function AutoLogout() {
  const router = useRouter();
  const pathname = usePathname();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // ============================================================
  // TIME SETUP CODE (Change the value below as needed)
  // The value is in milliseconds. 
  // 1 minute = 60 * 1000 = 60000 ms
  // ============================================================
  const INACTIVITY_LIMIT = 120 * 1000; 
  // ============================================================

  const handleLogout = async () => {
    try {
      console.log("Inactivity detected. Logging out...");
      const response = await fetch("/api/auth/logout", { method: "POST" });
      
      if (response.ok) {
        toast.info("Session expired due to inactivity. Please sign in again.");
        router.push("/login");
        router.refresh();
      }
    } catch (error) {
      console.error("Auto-logout request failed:", error);
    }
  };

  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(handleLogout, INACTIVITY_LIMIT);
  };

  useEffect(() => {
    // Only track inactivity on dashboard/protected routes
    const isProtectedRoute = pathname.startsWith("/dashboard");

    if (!isProtectedRoute) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // Start timer on initial load or route change to protected route
    resetTimer();

    // List of events to listen for to detect user activity
    const activityEvents = [
      "mousedown",
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
      "click"
    ];

    const eventHandler = () => resetTimer();

    // Attach listeners
    activityEvents.forEach((event) => {
      window.addEventListener(event, eventHandler);
    });

    // Cleanup on unmount or route change
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      activityEvents.forEach((event) => {
        window.removeEventListener(event, eventHandler);
      });
    };
  }, [pathname]);

  // This component doesn't render any UI
  return null;
}