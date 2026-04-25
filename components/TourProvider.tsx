"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type TourContextType = {
  runTour: boolean;
  startTour: () => void;
  endTour: () => void;
};

const TourContext = createContext<TourContextType>({
  runTour: false,
  startTour: () => {},
  endTour: () => {},
});

export function TourProvider({ children }: { children: ReactNode }) {
  const [runTour, setRunTour] = useState(false);

  function startTour() {
    setRunTour(true);
  }

  function endTour() {
    setRunTour(false);
    localStorage.setItem("evexa_tour_done", "true");
  }

  return (
    <TourContext.Provider value={{ runTour, startTour, endTour }}>
      {children}
    </TourContext.Provider>
  );
}

export function useTour() {
  return useContext(TourContext);
}
