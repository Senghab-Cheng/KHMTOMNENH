"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { AuthShell } from "@/components/AuthShell";
import { authenticate, dashboardForRole, saveSession } from "@/lib/auth";

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

  return <AuthShell><div className="auth-form-wrap">
    <div className="auth-heading"><p className="eyebrow">WELCOME BACK</p><h2>Sign in to your account</h2><p>Continue sourcing, connecting and growing with FoodFarm Hub.</p></div>
    <form onSubmit={handleSubmit} className="auth-form">
      {error && <p role="alert" className="auth-error"><strong>We couldn&apos;t sign you in.</strong><span>{error}</span></p>}
      <label className="auth-label" htmlFor="email">Email address<input type="email" id="email" name="email" autoComplete="email" placeholder="you@company.com" required className="auth-input" /></label>
      <div className="auth-label"><div className="password-label"><label htmlFor="password">Password</label><Link href="/about">Forgot password?</Link></div><input type="password" id="password" name="password" autoComplete="current-password" placeholder="Enter your password" required className="auth-input" /></div>
      <label className="remember-row"><input type="checkbox" name="remember" /> <span>Keep me signed in on this device</span></label>
      <button disabled={pending} className="auth-submit">{pending ? "Signing in..." : "Sign in"} <span>→</span></button>
    </form>
    <p className="auth-switch">New to FoodFarm Hub? <Link href="/auth/signup">Create an account</Link></p>
    <div className="auth-trust"><span>✓ Verified suppliers</span><span>✓ Secure transactions</span><span>✓ Global reach</span></div>
  </div></AuthShell>;
}
