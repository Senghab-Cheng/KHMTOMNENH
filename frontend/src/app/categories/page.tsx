"use client";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/auth";
type Category = { id: number; name: string; description?: string };
export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => { apiRequest<Category[]>("/api/categories").then(setCategories).catch(() => setCategories([])); }, []);
  return <main className="section-shell min-h-screen py-10"><p className="eyebrow">Browse the marketplace</p><h1 className="mt-3 text-4xl font-extrabold text-[#173d2c]">Product categories</h1><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{categories.map((category) => <article className="border border-[#dfe7e0] bg-white p-6" key={category.id}><h2 className="text-xl font-bold text-[#173d2c]">{category.name}</h2><p className="mt-2 text-sm leading-6 text-[#668073]">{category.description || "Explore products in this category."}</p><a href="/products" className="mt-5 inline-block text-sm font-bold text-[#087a45]">Browse products →</a></article>)}</div>{categories.length === 0 && <p className="mt-10 text-[#789080]">No categories available yet.</p>}</main>;
}
