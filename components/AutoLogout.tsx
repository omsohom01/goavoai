"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

/**
 * AutoLogout Component
 *
 * Automatically logs out the user after a period of inactivity.
 * Inactivity is defined as no mouse movement, key presses, clicks, or scrolls.
 *
 * The last-activity timestamp is stored in localStorage so that closing the
 * tab and reopening it after the limit has elapsed still triggers a logout.
 */
export default function AutoLogout() {
  const router = useRouter();
  const pathname = usePathname();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isLoggingOut = useRef(false);

  // ============================================================
  // TIME SETUP CODE (Change the value below as needed)
  // The value is in milliseconds.
  // 1 minute = 60 * 1000 = 60000 ms
  // ============================================================
  const INACTIVITY_LIMIT = 120 * 1000;
  // ============================================================

  const STORAGE_KEY = "goavoai_last_activity";

  /** Write the current timestamp to localStorage */
  const stampActivity = () => {
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
  };

  /** How many ms have passed since the last recorded activity */
  const msSinceLastActivity = (): number => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return 0;
    return Date.now() - parseInt(raw, 10);
  };

  const handleLogout = async () => {
    if (isLoggingOut.current) return;
    isLoggingOut.current = true;
    try {
      console.log("Inactivity detected. Logging out...");
      localStorage.removeItem(STORAGE_KEY);
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (response.ok) {
        toast.info("Session expired due to inactivity. Please sign in again.");
        router.push("/login");
        router.refresh();
      }
    } catch (error) {
      console.error("Auto-logout request failed:", error);
      isLoggingOut.current = false;
    }
  };

  const resetTimer = () => {
    stampActivity();
    if (timerRef.current) clearTimeout(timerRef.current);
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

    // ---------------------------------------------------------------
    // KEY FIX: On (re)mount check if the tab was closed/hidden long
    // enough to have exceeded the inactivity limit. If so, log out now.
    // ---------------------------------------------------------------
    const elapsed = msSinceLastActivity();
    if (elapsed > INACTIVITY_LIMIT) {
      handleLogout();
      return;
    }

    // If there is remaining time, schedule just the remainder so we don't
    // reset to a full INACTIVITY_LIMIT simply because the tab reopened.
    const remaining = elapsed > 0 ? INACTIVITY_LIMIT - elapsed : INACTIVITY_LIMIT;
    stampActivity(); // anchor the timestamp to now
    timerRef.current = setTimeout(handleLogout, remaining);

    // Activity events that reset the inactivity timer
    const activityEvents = [
      "mousedown",
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
      "click",
    ];

    const eventHandler = () => resetTimer();

    // ---------------------------------------------------------------
    // visibilitychange: when the tab is hidden (switched or closed),
    // stamp the time.  When it becomes visible again, check elapsed.
    // ---------------------------------------------------------------
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        // Persist the moment user left so the gap can be measured later
        stampActivity();
      } else {
        // Tab visible again — was the user gone too long?
        const elapsedSinceHidden = msSinceLastActivity();
        if (elapsedSinceHidden > INACTIVITY_LIMIT) {
          handleLogout();
        } else {
          resetTimer(); // restart with fresh full window of activity
        }
      }
    };

    // Attach listeners
    activityEvents.forEach((event) =>
      window.addEventListener(event, eventHandler)
    );
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup on unmount or route change
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      activityEvents.forEach((event) =>
        window.removeEventListener(event, eventHandler)
      );
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // This component doesn't render any UI
  return null;
}