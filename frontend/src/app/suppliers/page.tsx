"use client";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/auth";
type Company = { id: number; name: string; description?: string; city: string; country: string };
export default function SuppliersPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  useEffect(() => { apiRequest<Company[]>("/api/companies").then(setCompanies).catch(() => setCompanies([])); }, []);
  return <main className="min-h-screen bg-slate-50 px-6 py-12 dark:bg-neutral-950"><div className="mx-auto max-w-5xl"><p className="text-sm font-semibold uppercase tracking-widest text-blue-600">Verified partners</p><h1 className="mt-2 text-4xl font-bold text-slate-900 dark:text-slate-50">Suppliers</h1><div className="mt-10 grid gap-5 sm:grid-cols-2">{companies.map((company) => <article className="rounded-2xl bg-white p-6 shadow-sm dark:bg-neutral-900" key={company.id}><div className="flex h-20 w-20 items-center justify-center rounded-xl bg-blue-50 text-4xl dark:bg-blue-950/30">🏢</div><h2 className="mt-5 text-xl font-semibold">{company.name}</h2><p className="mt-2 text-sm text-slate-500">{company.description || "Supplier on KhmerTrade."}</p><p className="mt-4 text-sm text-slate-600">{company.city}, {company.country}</p></article>)}</div>{companies.length === 0 && <p className="mt-10 text-slate-500">No suppliers available yet.</p>}</div></main>;
}
