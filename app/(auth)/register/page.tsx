"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useEffect } from "react";
import { toast } from "sonner";
import Image from "next/image";
import Magnet from "@/components/Magnet";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const carouselImages = [
    {
      src: "/auth_page_sidebar.png",
      title: "Enterprise Event Intelligence",
      subtitle: "actually scale.",
    },
    {
      src: "/auth_sidebar_2.png",
      title: "Professional Networking",
      subtitle: "connect better.",
    },
    {
      src: "/auth_sidebar_3.png",
      title: "Seamless Registration",
      subtitle: "experience magic.",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: String(formData.get("name") ?? "") + " " + String(formData.get("lastName") ?? ""),
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.error ?? "Registration failed");
      setLoading(false);
      return;
    }

    toast.success("Account created successfully");
    localStorage.removeItem("evexa_tour_done"); // clear so tour shows on dashboard
    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <main className="flex h-screen w-full overflow-hidden bg-[#fafafa] text-gray-900 font-sans">
      {/* ── LEFT SIDE — Image Carousel ── */}
      <div className="relative hidden w-[45%] overflow-hidden lg:block">
        {carouselImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <Image
              src={image.src}
              alt={image.title}
              fill
              className="object-cover scale-105"
              priority={index === 0}
            />
            
            {/* Carousel Content */}
            <div className="relative z-20 flex h-full flex-col justify-end p-12 pb-20">
              <div className="max-w-md space-y-2">
                <p className="text-emerald-400 text-sm font-bold tracking-[0.2em] uppercase">Insight Platform</p>
                <h2 className="text-[3rem] font-light leading-[1.05] text-white tracking-tight">
                  {image.title}, <br />
                  <span className="font-rustic text-emerald-400 italic">
                    {image.subtitle}
                  </span>
                </h2>
              </div>
            </div>
          </div>
        ))}

        {/* Unique Back Button */}
        <div className="absolute left-8 top-8 z-30">
          <Magnet padding={50} magnetStrength={8}>
            <Link 
              href="/" 
              className="group relative flex items-center justify-center overflow-hidden rounded-full bg-white/10 p-[1px] transition-all hover:bg-white/20"
            >
              <div className="relative flex items-center gap-3 rounded-full bg-black/40 backdrop-blur-xl px-6 py-3 text-sm font-medium text-white transition-all group-hover:bg-black group-hover:text-white">
                <div className="relative flex h-5 w-5 items-center justify-center overflow-hidden rounded-full bg-white/20 transition-all group-hover:bg-emerald-500">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="transition-transform group-hover:-translate-x-1">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                </div>
                Back to website
                <div className="absolute inset-0 -z-10 translate-y-full bg-gradient-to-t from-emerald-500/20 to-transparent transition-transform duration-500 group-hover:translate-y-0" />
              </div>
            </Link>
          </Magnet>
        </div>

        {/* Carousel Indicators (Sticks) */}
        <div className="absolute bottom-10 left-12 z-30 flex gap-2">
          {carouselImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-1 transition-all duration-500 rounded-full ${
                i === currentSlide ? "w-12 bg-emerald-500" : "w-6 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ── RIGHT SIDE — Form ── */}
      <div className="flex w-full flex-col items-center justify-center bg-white lg:w-[55%]">
        <div className="w-full max-w-md px-8 py-8 space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">Create account</h1>
            <p className="text-gray-500 text-base">
              Already have an account?{" "}
              <Link href="/login" className="font-rustic text-emerald-600 text-lg inline-block transition-transform hover:scale-105 active:scale-95">
                Log in
              </Link>
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="group relative">
                <input
                  name="name"
                  type="text"
                  placeholder="First name"
                  required
                  className="w-full rounded-full border border-gray-100 bg-gray-50 px-5 py-3.5 text-sm ring-offset-white transition-all focus:border-emerald-500/30 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/5 group-hover:bg-gray-100/50"
                />
              </div>
              <div className="group relative">
                <input
                  name="lastName"
                  type="text"
                  placeholder="Last name"
                  required
                  className="w-full rounded-full border border-gray-100 bg-gray-50 px-5 py-3.5 text-sm ring-offset-white transition-all focus:border-emerald-500/30 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/5 group-hover:bg-gray-100/50"
                />
              </div>
            </div>

            <div className="group relative">
              <input
                name="email"
                type="email"
                placeholder="Email address"
                required
                className="w-full rounded-full border border-gray-100 bg-gray-50 px-5 py-3.5 text-sm ring-offset-white transition-all focus:border-emerald-500/30 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/5 group-hover:bg-gray-100/50"
              />
            </div>

            <div className="group relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create password"
                required
                className="w-full rounded-full border border-gray-100 bg-gray-50 px-5 py-3.5 text-sm ring-offset-white transition-all focus:border-emerald-500/30 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/5 group-hover:bg-gray-100/50"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-emerald-500"
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>

            <button
              disabled={loading}
              className="group relative flex w-full items-center justify-center overflow-hidden rounded-full bg-black py-4 text-base font-bold text-white transition-all hover:bg-gray-900 active:scale-[0.98] disabled:opacity-50"
            >
              <span className="relative z-10">{loading ? "Creating account..." : "Get Started"}</span>
              <div className="absolute inset-0 -z-0 translate-x-full bg-gradient-to-r from-emerald-500/20 to-transparent transition-transform duration-500 group-hover:translate-x-0" />
            </button>
          </form>

        </div>
      </div>
    </main>
  );
}
