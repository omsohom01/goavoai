import type { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <main className="gradient-shell min-h-screen md:flex">
      <Sidebar />
      <section className="w-full p-4 md:p-8">
        <TopBar />
        {children}
      </section>
    </main>
  );
}
