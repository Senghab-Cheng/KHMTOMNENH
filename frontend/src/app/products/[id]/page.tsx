"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/auth";

type Product = { id: number; name: string; description?: string; price: number; stockQuantity?: number; company?: { name: string } };

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { params.then(({ id }) => apiRequest<Product>(`/api/products/${id}`).then(setProduct).catch((reason) => setError(reason instanceof Error ? reason.message : "Unable to load product."))); }, [params]);
  if (error) return <main className="p-8"><p role="alert" className="text-red-700">{error}</p></main>;
  if (!product) return <main className="p-8 text-slate-500">Loading product...</main>;
  return <main className="min-h-screen bg-slate-50 px-6 py-12 dark:bg-neutral-950"><div className="mx-auto grid max-w-5xl gap-10 rounded-3xl bg-white p-8 shadow-sm dark:bg-neutral-900 md:grid-cols-2"><div className="flex min-h-80 items-center justify-center rounded-2xl bg-blue-50 text-8xl dark:bg-blue-950/30">📦</div><div><Link href="/products" className="text-sm font-semibold text-blue-700">← Back to products</Link><h1 className="mt-8 text-4xl font-bold text-slate-900 dark:text-slate-50">{product.name}</h1><p className="mt-4 text-slate-600 dark:text-slate-400">{product.description}</p><p className="mt-8 text-3xl font-bold text-blue-700">${Number(product.price).toFixed(2)}</p><p className="mt-2 text-sm text-slate-500">Available quantity: {product.stockQuantity ?? 0}</p><Link href={`/rfqs/new?productId=${product.id}`} className="mt-8 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">Request a quote</Link></div></div></main>;
}
