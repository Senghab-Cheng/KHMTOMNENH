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
    <main className="min-h-screen bg-[#f8faf6] px-5 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-[#dfe7e0] pb-7"><div><p className="eyebrow">FoodFarm Hub marketplace</p><h1 className="mt-3 text-4xl font-extrabold text-[#173d2c]">Products for your next order.</h1><p className="mt-3 max-w-xl text-[#668073]">Explore quality products from Cambodian suppliers ready to do business.</p></div>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products..." className="form-input w-full sm:w-72" aria-label="Search products" />
        </div>
        {error && <p role="alert" className="mt-8 rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <Link href={`/products/${product.id}`} key={product.id} className="group overflow-hidden border border-[#dfe7e0] bg-white transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-48 items-end bg-[url('https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=900&q=80')] bg-cover bg-center p-4"><span className="bg-white px-2 py-1 text-xs font-bold uppercase tracking-wider text-[#087a45]">Cambodian origin</span></div>
              <div className="p-5"><h2 className="text-lg font-bold text-[#173d2c] group-hover:text-[#087a45]">{product.name}</h2><p className="mt-2 line-clamp-2 text-sm leading-6 text-[#668073]">{product.description || "Quality products from verified suppliers."}</p><p className="mt-4 text-xs text-[#789080]">MOQ 100 kg · Available {product.stockQuantity ?? 0}</p><div className="mt-5 flex items-end justify-between gap-3 border-t border-[#edf0ed] pt-4"><div><p className="text-lg font-bold text-[#173d2c]">${Number(product.price).toFixed(2)}</p>{product.company?.name && <p className="mt-1 text-xs text-[#789080]">{product.company.name}</p>}</div><span className="text-sm font-bold text-[#087a45]">View →</span></div></div>
            </Link>
          ))}
        </div>
        {!error && filtered.length === 0 && <p className="mt-12 text-center text-[#668073]">No products found.</p>}
      </div>
    </main>
  );
}
