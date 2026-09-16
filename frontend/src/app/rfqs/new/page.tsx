"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { apiRequest, getSession } from "@/lib/auth";

type Product = { id: number; name: string; price: number };

export default function NewRfqPage({ searchParams }: { searchParams: Promise<{ productId?: string }> }) {
  const [productId, setProductId] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    searchParams.then((params) => setProductId(params.productId ?? ""));
    apiRequest<Product[]>("/api/products").then(setProducts).catch(() => setProducts([]));
  }, [searchParams]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!getSession()) { window.location.assign("/auth/signin"); return; }
    setPending(true); setError("");
    const form = new FormData(event.currentTarget);
    try {
      await apiRequest("/api/rfqs", { method: "POST", body: JSON.stringify({
        title: String(form.get("title")).trim(),
        description: `${String(form.get("destination")).trim()}\nRequired date: ${String(form.get("requiredDate"))}\n${String(form.get("message")).trim()}`,
        items: [{ productId: Number(form.get("productId")), quantity: Number(form.get("quantity")) }],
      }) });
      setMessage("Your request for quotation was sent successfully.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to send your request.");
    } finally { setPending(false); }
  }

  return <main className="min-h-screen bg-slate-50 px-6 py-12 dark:bg-neutral-950"><div className="mx-auto max-w-2xl"><Link href="/products" className="text-sm font-semibold text-blue-700">← Back to marketplace</Link><h1 className="mt-8 text-4xl font-bold text-slate-900 dark:text-slate-50">Request a quotation</h1><p className="mt-2 text-slate-600 dark:text-slate-400">Tell suppliers what you need and where it should be delivered.</p><form onSubmit={submit} className="mt-8 space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">{message && <p role="status" className="rounded-lg bg-green-50 p-3 text-green-700">{message}</p>}{error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}<label className="field-label">Title<input name="title" required placeholder="Bulk Kampot pepper order" className="form-input" /></label><label className="field-label">Product<select name="productId" value={productId} onChange={(event) => setProductId(event.target.value)} required className="form-input">{products.map((product) => <option value={product.id} key={product.id}>{product.name}</option>)}</select></label><label className="field-label">Quantity<input name="quantity" type="number" min="1" required className="form-input" /></label><label className="field-label">Destination<input name="destination" required placeholder="City, country" className="form-input" /></label><label className="field-label">Required date<input name="requiredDate" type="date" required className="form-input" /></label><label className="field-label">Message<textarea name="message" rows={5} placeholder="Add specifications or shipping details" className="form-input" /></label><button disabled={pending} className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white disabled:opacity-60">{pending ? "Sending..." : "Send RFQ"}</button></form></div></main>;
}
