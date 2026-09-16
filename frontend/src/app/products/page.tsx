"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "@/lib/auth";

type Product = {
  id: number;
  name: string;
  description?: string;
  price: number;
  stockQuantity?: number;
  company?: { id: number; name: string };
  active?: boolean;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest<Product[]>("/api/products")
      .then(setProducts)
      .catch((reason) => setError(reason instanceof Error ? reason.message : "Unable to load products."));
  }, []);

  const filtered = useMemo(
    () => products.filter((product) => `${product.name} ${product.description ?? ""}`.toLowerCase().includes(query.toLowerCase())),
    [products, query],
  );

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 dark:bg-neutral-950">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-sm font-semibold uppercase tracking-widest text-blue-600">Marketplace</p><h1 className="mt-2 text-4xl font-bold text-slate-900 dark:text-slate-50">Find products</h1></div>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products..." className="form-input w-72" aria-label="Search products" />
        </div>
        {error && <p role="alert" className="mt-8 rounded-lg bg-red-50 p-4 text-red-700">{error}</p>}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <Link href={`/products/${product.id}`} key={product.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
              <div className="flex h-36 items-center justify-center rounded-xl bg-blue-50 text-5xl dark:bg-blue-950/30">📦</div>
              <h2 className="mt-5 text-xl font-semibold text-slate-900 dark:text-slate-50">{product.name}</h2>
              <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">{product.description || "Quality products from verified suppliers."}</p>
              <p className="mt-5 text-lg font-bold text-blue-700 dark:text-blue-400">${Number(product.price).toFixed(2)}</p>
              {product.company?.name && <p className="mt-1 text-sm text-slate-500">{product.company.name}</p>}
            </Link>
          ))}
        </div>
        {!error && filtered.length === 0 && <p className="mt-12 text-center text-slate-500">No products found.</p>}
      </div>
    </main>
  );
}
