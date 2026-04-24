import type { ReactNode } from "react";
import GridBackground from "@/components/GridBackground";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <main className="gradient-shell min-h-screen pt-24 relative isolate">
      <GridBackground />
      <section className="mx-auto w-full max-w-7xl px-4 md:px-8 relative z-10">
        {children}
      </section>
    </main>
  );
}
