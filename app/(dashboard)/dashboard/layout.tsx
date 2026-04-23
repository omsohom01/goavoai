import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <main className="gradient-shell min-h-screen pt-24">
      <section className="mx-auto w-full max-w-7xl px-4 md:px-8">
        {children}
      </section>
    </main>
  );
}
