"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { authenticate, dashboardForRole, saveSession } from "@/lib/auth";

function Brand() {
  return (
    <Link href="/" className="inline-flex items-center gap-3" aria-label="KhmerTrade home">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-lg font-black text-white shadow-lg shadow-blue-600/20">
        K
      </span>
      <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
        Khmer<span className="text-blue-600">Trade</span>
      </span>
    </Link>
  );
}

export default function SigninPage() {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    const form = new FormData(event.currentTarget);

    try {
      const auth = await authenticate("login", {
        email: String(form.get("email")).trim(),
        password: String(form.get("password")),
      });
      saveSession(auth);
      window.location.assign(dashboardForRole(auth.role));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to sign in.");
      setPending(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-neutral-950 md:px-8">
      <div className="mx-auto flex min-h-[80vh] w-full max-w-md flex-col justify-center">
        <div className="mb-10">
          <Brand />
          <h1 className="mt-10 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Welcome back</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Sign in to continue to your account.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{error}</p>}
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-900 dark:text-slate-50">Email</label>
            <input type="email" id="email" name="email" autoComplete="email" placeholder="you@example.com" required className="form-input" />
          </div>
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-900 dark:text-slate-50">Password</label>
            <input type="password" id="password" name="password" autoComplete="current-password" placeholder="Your password" required className="form-input" />
          </div>
          <button disabled={pending} className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
            {pending ? "Signing in..." : "Sign in"}
          </button>
          <p className="text-center text-sm text-slate-600 dark:text-slate-400">
            New here? <Link href="/auth/signup" className="font-semibold text-blue-700 hover:underline dark:text-blue-400">Create an account</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
