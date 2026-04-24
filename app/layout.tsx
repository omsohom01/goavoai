import type { Metadata } from "next";
import { Inter, Montserrat, Space_Grotesk } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import AutoLogout from "@/components/AutoLogout";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const rusticRoadway = localFont({
  src: "../public/Fonts/rustic-roadway-personal-use/RusticRoadway.otf",
  variable: "--font-rustic-roadway",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Evexa",
  description: "Production-style event management platform built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${montserrat.variable} ${rusticRoadway.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <AutoLogout />
        <Navbar />
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
