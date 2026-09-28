"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { apiRequest, getSession } from "@/lib/auth";

type Product = { id: number; name: string; description?: string; price: number; stockQuantity: number; company?: { name: string } };
type Company = { id: number; name: string };
type Category = { id: number; name: string };

const initialForm = { companyId: "", categoryId: "", name: "", description: "", price: "", stockQuantity: "" };

export default function SupplierProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");

  useEffect(() => {
    if (!getSession()) { window.location.assign("/auth/signin"); return; }
    Promise.all([
      apiRequest<Product[]>("/api/products"),
      apiRequest<Company[]>("/api/companies"),
      apiRequest<Category[]>("/api/categories"),
    ]).then(([items, ownCompanies, availableCategories]) => {
      setProducts(items);
      setCompanies(ownCompanies);
      setCategories(availableCategories);
      if (ownCompanies[0]) setForm((current) => ({ ...current, companyId: String(ownCompanies[0].id) }));
      if (availableCategories[0]) setForm((current) => ({ ...current, categoryId: String(availableCategories[0].id) }));
    }).catch((reason) => setError(reason instanceof Error ? reason.message : "Unable to load your catalog."));
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(""); setSaved("");
    try {
      const created = await apiRequest<Product>("/api/products", { method: "POST", body: JSON.stringify({ ...form, companyId: Number(form.companyId), categoryId: Number(form.categoryId), price: Number(form.price), stockQuantity: Number(form.stockQuantity) }) });
      setProducts((current) => [created, ...current]);
      setForm((current) => ({ ...initialForm, companyId: current.companyId, categoryId: current.categoryId }));
      setSaved("Product added to your catalog.");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to create product."); }
  }

  return <main className="workspace-page"><div className="section-shell"><div className="workspace-heading"><div><p className="eyebrow">Supplier workspace / Catalog</p><h1 className="workspace-title">Products buyers can find.</h1><p className="workspace-lede">Keep your catalog clear, current, and ready for quotation.</p></div><Link href="/products" className="workspace-secondary">View storefront <span>→</span></Link></div><div className="catalog-layout"><form onSubmit={submit} className="supplier-form product-form">{saved && <p role="status" className="form-notice form-success">{saved}</p>}{error && <p role="alert" className="form-notice form-error">{error}</p>}<div className="form-section"><div><p className="form-section-number">01</p><h2>Add a product</h2><p>Share enough detail for buyers to make a confident enquiry.</p></div><div className="form-fields"><label className="field-label">Company<select value={form.companyId} onChange={(event) => setForm({ ...form, companyId: event.target.value })} required className="form-input">{companies.map((company) => <option value={company.id} key={company.id}>{company.name}</option>)}</select></label><label className="field-label">Category<select value={form.categoryId} onChange={(event) => setForm({ ...form, categoryId: event.target.value })} required className="form-input">{categories.map((category) => <option value={category.id} key={category.id}>{category.name}</option>)}</select></label><label className="field-label field-wide">Product name<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required className="form-input" placeholder="e.g. Kampot Black Pepper" /></label><label className="field-label field-wide">Description<textarea rows={4} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="form-input" placeholder="Describe origin, quality, packaging, and certifications." /></label><label className="field-label">Price (USD)<input type="number" min="0" step="0.01" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} required className="form-input" /></label><label className="field-label">Available stock<input type="number" min="0" value={form.stockQuantity} onChange={(event) => setForm({ ...form, stockQuantity: event.target.value })} required className="form-input" /></label><button className="workspace-primary field-wide">Add to catalog <span>→</span></button></div></div></form><aside className="catalog-summary"><p className="eyebrow">Catalog overview</p><strong>{products.length}</strong><span>published products</span><div className="catalog-summary-line"><span>Keep stock levels updated</span><span>↗</span></div><Link href="/company">Update company profile →</Link></aside></div><section className="catalog-list"><div className="section-heading"><div><p className="eyebrow">Your inventory</p><h2>Published products</h2></div><span className="count-badge">{products.length} total</span></div>{products.length === 0 ? <div className="empty-state"><h2>Your catalog is empty</h2><p>Add your first product using the form above.</p></div> : <div className="inventory-table">{products.map((product) => <article className="inventory-row" key={product.id}><div><h3>{product.name}</h3><p>{product.company?.name || "Your company"} · {product.stockQuantity} available</p></div><strong>${Number(product.price).toFixed(2)}</strong><span className="status-pill status-complete">Published</span></article>)}</div>}</section></div></main>;
}
