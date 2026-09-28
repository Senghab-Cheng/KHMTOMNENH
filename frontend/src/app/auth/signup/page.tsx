"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { AuthShell } from "@/components/AuthShell";
import { authenticate, dashboardForRole, getSession, saveSession, UserRole } from "@/lib/auth";

export default function SignupPage() {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (session) window.location.replace(dashboardForRole(session.role));
  }, []);

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

  return <AuthShell><div className="auth-form-wrap signup-wrap">
    <div className="auth-heading"><p className="eyebrow">JOIN THE NETWORK</p><h2>Create your account</h2><p>Start building better trade connections across Cambodia and beyond.</p></div>
    <form onSubmit={handleSubmit} className="auth-form">
      {error && <p role="alert" className="auth-error"><strong>Check your details.</strong><span>{error}</span></p>}
      <div className="auth-grid">
        <label className="auth-label">First name<input name="firstName" placeholder="Sokha" autoComplete="given-name" required className="auth-input" /></label>
        <label className="auth-label">Last name<input name="lastName" placeholder="Chan" autoComplete="family-name" required className="auth-input" /></label>
        <label className="auth-label">Work email<input type="email" name="email" placeholder="you@company.com" autoComplete="email" required className="auth-input" /></label>
        <label className="auth-label">Mobile number<input type="tel" name="mobile" placeholder="+855 12 345 678" autoComplete="tel" required className="auth-input" /></label>
      </div>
      <fieldset className="role-fieldset"><legend>I want to join as</legend><div className="role-options"><label><input type="radio" name="role" value="BUYER" defaultChecked /><span><b>Buyer</b><small>Source products for your business</small></span></label><label><input type="radio" name="role" value="SUPPLIER" /><span><b>Supplier</b><small>Reach buyers around the world</small></span></label></div></fieldset>
      <div className="auth-grid"><label className="auth-label">Create password<input type="password" name="password" minLength={8} autoComplete="new-password" placeholder="At least 8 characters" required className="auth-input" /></label><label className="auth-label">Confirm password<input type="password" name="confirmPassword" minLength={8} autoComplete="new-password" placeholder="Repeat your password" required className="auth-input" /></label></div>
      <label className="remember-row terms-row"><input type="checkbox" required /> <span>I agree to the <a href="#terms">Terms and Conditions</a>.</span></label>
      <button disabled={pending} className="auth-submit">{pending ? "Creating account..." : "Create account"} <span>→</span></button>
    </form>
    <p className="auth-switch">Already have an account? <Link href="/auth/signin">Sign in</Link></p>
  </div></AuthShell>;
}
