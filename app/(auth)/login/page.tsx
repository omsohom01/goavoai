"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
    <main className="gradient-shell flex min-h-screen items-center justify-center p-6">
      <form onSubmit={handleLogin} className="panel w-full max-w-md space-y-4 p-8">
        <h1 className="kpi text-2xl font-semibold">Organizer Login</h1>
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          required
        />
        <button
          disabled={loading}
          className="w-full rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-500 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
        <p className="text-sm text-slate-500">
          New organizer? <Link href="/register" className="text-teal-600">Create account</Link>
        </p>
      </form>
    </main>
  );
}
