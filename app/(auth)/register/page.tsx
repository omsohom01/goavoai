"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: String(formData.get("name") ?? ""),
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

    toast.success("Account created");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="gradient-shell flex min-h-screen items-center justify-center p-6">
      <form onSubmit={handleRegister} className="panel w-full max-w-md space-y-4 p-8">
        <h1 className="kpi text-2xl font-semibold">Organizer Signup</h1>
        <input
          name="name"
          placeholder="Full name"
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          required
        />
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
          {loading ? "Creating account..." : "Create Account"}
        </button>
        <p className="text-sm text-slate-500">
          Already registered? <Link href="/login" className="text-teal-600">Sign in</Link>
        </p>
      </form>
    </main>
  );
}
