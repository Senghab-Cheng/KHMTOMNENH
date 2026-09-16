"use client";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/auth";
type Category = { id: number; name: string; description?: string };
export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => { apiRequest<Category[]>("/api/categories").then(setCategories).catch(() => setCategories([])); }, []);
  return <main className="min-h-screen bg-slate-50 px-6 py-12 dark:bg-neutral-950"><div className="mx-auto max-w-5xl"><p className="text-sm font-semibold uppercase tracking-widest text-blue-600">Browse by category</p><h1 className="mt-2 text-4xl font-bold text-slate-900 dark:text-slate-50">Categories</h1><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{categories.map((category) => <article className="rounded-2xl bg-white p-6 shadow-sm dark:bg-neutral-900" key={category.id}><h2 className="text-xl font-semibold">{category.name}</h2><p className="mt-2 text-sm text-slate-500">{category.description || "Explore products in this category."}</p></article>)}</div>{categories.length === 0 && <p className="mt-10 text-slate-500">No categories available yet.</p>}</div></main>;
}
