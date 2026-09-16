"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { authenticate, dashboardForRole, saveSession, UserRole } from "@/lib/auth";

function Brand() {
  return (
    <Link href="/" className="inline-flex items-center gap-3" aria-label="KhmerTrade home">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-lg font-black text-white shadow-lg shadow-blue-600/20">K</span>
      <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Khmer<span className="text-blue-600">Trade</span></span>
    </Link>
  );
}

export default function SignupPage() {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password"));
    if (password !== String(form.get("confirmPassword"))) {
      setError("Passwords do not match.");
      return;
    }
    setPending(true);
    try {
      const auth = await authenticate("register", {
        fullName: `${String(form.get("firstName")).trim()} ${String(form.get("lastName")).trim()}`.trim(),
        email: String(form.get("email")).trim(),
        mobileNumber: String(form.get("mobile")).trim(),
        password,
        role: String(form.get("role")) as UserRole,
      });
      saveSession(auth);
      window.location.assign(dashboardForRole(auth.role));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to create your account.");
      setPending(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-neutral-950 md:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-8"><Brand /><h1 className="mt-8 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Create your account</h1><p className="mt-2 text-slate-600 dark:text-slate-400">Get started with KhmerTrade today.</p></div>
        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 md:p-8">
          {error && <p role="alert" className="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{error}</p>}
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="field-label">First Name<input name="firstName" placeholder="John" autoComplete="given-name" required className="form-input" /></label>
            <label className="field-label">Last Name<input name="lastName" placeholder="Doe" autoComplete="family-name" required className="form-input" /></label>
            <label className="field-label">Email<input type="email" name="email" placeholder="john@example.com" autoComplete="email" required className="form-input" /></label>
            <label className="field-label">Mobile Number<input type="tel" name="mobile" placeholder="123-456-7890" autoComplete="tel" required className="form-input" /></label>
            <label className="field-label">I want to join as<select name="role" defaultValue="BUYER" className="form-input"><option value="BUYER">Buyer</option><option value="SUPPLIER">Supplier</option></select></label>
            <span className="hidden sm:block" />
            <label className="field-label">Password<input type="password" name="password" minLength={8} autoComplete="new-password" placeholder="At least 8 characters" required className="form-input" /></label>
            <label className="field-label">Confirm Password<input type="password" name="confirmPassword" minLength={8} autoComplete="new-password" placeholder="Repeat your password" required className="form-input" /></label>
          </div>
          <label className="mt-6 flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400"><input type="checkbox" required className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600" />I accept the <a href="#" className="font-medium text-blue-700 hover:underline dark:text-blue-400">Terms and Conditions</a>.</label>
          <button disabled={pending} className="mt-7 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">{pending ? "Creating account..." : "Create an account"}</button>
          <p className="mt-5 text-sm text-slate-600 dark:text-slate-400">Already have an account? <Link href="/auth/signin" className="font-semibold text-blue-700 hover:underline dark:text-blue-400">Sign in</Link></p>
        </form>
      </div>
    </main>
  );
}
