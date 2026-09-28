"use client";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/auth";
type Company = { id: number; name: string; description?: string; city: string; country: string };
export default function SuppliersPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  useEffect(() => { apiRequest<Company[]>("/api/companies").then(setCompanies).catch(() => setCompanies([])); }, []);
  return <main className="section-shell min-h-screen py-10"><p className="eyebrow">Verified partners</p><h1 className="mt-3 text-4xl font-extrabold text-[#173d2c]">Trusted suppliers</h1><p className="mt-3 text-[#668073]">Meet businesses ready to grow with buyers around the world.</p><div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{companies.map((company) => <article className="border border-[#dfe7e0] bg-white p-6" key={company.id}><div className="flex h-14 w-14 items-center justify-center bg-[#eaf1e8] text-2xl text-[#087a45]">▦</div><h2 className="mt-5 text-xl font-bold text-[#173d2c]">{company.name}</h2><p className="mt-2 text-sm leading-6 text-[#668073]">{company.description || "Supplier on FoodFarm Hub."}</p><p className="mt-4 text-sm text-[#789080]">{company.city}, {company.country}</p><span className="mt-5 inline-block text-xs font-bold uppercase tracking-wider text-[#087a45]">Verified supplier</span></article>)}</div>{companies.length === 0 && <p className="mt-10 text-[#789080]">No suppliers available yet.</p>}</main>;
}
