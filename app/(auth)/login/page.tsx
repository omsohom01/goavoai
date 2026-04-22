"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useEffect } from "react";
import { toast } from "sonner";
import Image from "next/image";
import Magnet from "@/components/Magnet";

export default function LoginPage() {
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

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.error ?? "Login failed");
      setLoading(false);
      return;
    }

    toast.success("Welcome back");
    router.push("/dashboard");
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
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">Welcome back</h1>
            <p className="text-gray-500 text-base">
              New here?{" "}
              <Link href="/register" className="font-rustic text-emerald-600 text-lg inline-block transition-transform hover:scale-105 active:scale-95">
                Sign up
              </Link>
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
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
                placeholder="Password"
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
              <span className="relative z-10">{loading ? "Signing in..." : "Sign In"}</span>
              <div className="absolute inset-0 -z-0 translate-x-full bg-gradient-to-r from-emerald-500/20 to-transparent transition-transform duration-500 group-hover:translate-x-0" />
            </button>
          </form>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="font-clash bg-white px-4 text-gray-400 font-medium uppercase tracking-widest">Or social login</span>
            </div>
          </div>

          <button className="group flex w-full items-center justify-center gap-3 rounded-full border border-gray-100 bg-white py-3.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 hover:border-emerald-500/20 active:scale-[0.98]">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>
        </div>
      </div>
    </main>
  );
}
