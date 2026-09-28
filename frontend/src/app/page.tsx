"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/auth";

type Product = {
  id: number;
  name: string;
  description?: string;
  stockQuantity?: number;
  company?: { name: string };
};

const productImages = [
  "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1599909533730-f9d4f1b9a8b6?auto=format&fit=crop&w=900&q=85",
];

const productFallbacks = [
  { name: "Kampot Black Pepper", location: "Kampot, Cambodia", supplier: "Angkor Green Co., Ltd.", category: "SPICES" },
  { name: "Aromatic Jasmine Rice", location: "Battambang, Cambodia", supplier: "Mekong Harvest Co.", category: "RICE & GRAINS" },
  { name: "Cashew Nuts W320", location: "Kampong Thom, Cambodia", supplier: "Khmer NutriFoods", category: "NUTS & SEEDS" },
  { name: "Robusta Coffee", location: "Mondulkiri, Cambodia", supplier: "Highland Origin", category: "COFFEE" },
  { name: "Dried Mango", location: "Phnom Penh, Cambodia", supplier: "Golden Orchard", category: "PROCESSED FOOD" },
];

const categories = [
  ["🌾", "Rice"], ["🌶", "Pepper"], ["🥜", "Cashew"], ["☕", "Coffee"],
  ["🥭", "Fresh Produce"], ["🥫", "Processed Food"], ["📦", "Raw Materials"], ["🏭", "Manufacturing"],
];

const suppliers = [
  ["AG", "Angkor Green Co., Ltd.", "Agriculture · Processing · Export", "12 Products"],
  ["KH", "Khmer Harvest Foods", "Agriculture · Processing · Export", "24 Products"],
  ["MO", "Mondulkiri Origin", "Agriculture · Processing · Export", "8 Products"],
];

function SearchForm({ hero = false }: { hero?: boolean }) {
  return (
    <form action="/products" className={`search-form ${hero ? "hero-search" : ""}`}>
      <select name="category" aria-label="Search category" defaultValue="Products">
        <option>Products</option><option>Suppliers</option><option>Categories</option>
      </select>
      <input name="q" placeholder="Search products, suppliers, or categories..." aria-label="Search products, suppliers, or categories" />
      <button type="submit">Search</button>
    </form>
  );
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [saved, setSaved] = useState<number[]>([]);

  useEffect(() => {
    apiRequest<Product[]>("/api/products").then(setProducts).catch(() => setProducts([]));
  }, []);

  const items = productFallbacks.map((fallback, index) => ({
    ...fallback,
    ...(products[index] || {}),
    id: products[index]?.id || index + 1,
    image: productImages[index],
  }));

  return (
    <main>
      <section className="category-strip" aria-label="Product categories">
        <div className="section-shell category-inner">
          {categories.map(([icon, label]) => <Link href="/categories" className="category-tile" key={label}><span>{icon}</span><strong>{label}</strong></Link>)}
          <Link href="/categories" className="category-all">View All Categories <span>→</span></Link>
        </div>
      </section>

      <section className="hero">
        <div className="hero-photo" />
        <div className="section-shell hero-inner">
          <div className="hero-copy">
            <p className="eyebrow eyebrow-light"><span /> PREMIUM CAMBODIAN PRODUCTS</p>
            <h1>Source Cambodia.<br /><em>Trade Globally.</em></h1>
            <p className="hero-lede">Connect with trusted Cambodian suppliers and high-quality agricultural products for your business.</p>
            <SearchForm hero />
            <div className="hero-actions"><Link href="/products" className="button button-green">Explore Products <span>→</span></Link><Link href="/suppliers" className="button button-outline">Find Suppliers</Link></div>
          </div>
          <aside className="hero-stats">
            <div><b>100+</b><span>Trusted Suppliers</span></div>
            <div><b>5,000+</b><span>Products</span></div>
            <div><b>50+</b><span>Countries</span></div>
          </aside>
          <div className="hero-badge">From Cambodia to the World <span>🌐</span></div>
        </div>
      </section>

      <section className="popular-section">
        <div className="section-shell popular-panel">
          <div className="section-heading compact-heading"><div><p className="eyebrow">QUICK SOURCING</p><h2>Popular Products</h2></div><Link href="/products">View All Products <span>→</span></Link></div>
          <div className="popular-list">
            {items.slice(0, 4).map((item, index) => <Link href={`/products/${item.id}`} className="popular-item" key={`${item.id}-${index}`}><img src={item.image} alt="" /><div><small>{item.category}</small><strong>{item.name}</strong><span>{item.location}</span></div><b>Request Quote <span>→</span></b></Link>)}
          </div>
        </div>
      </section>

      <section className="section-shell featured-section">
        <div className="section-heading"><div><p className="eyebrow">FEATURED PRODUCTS</p><h2>Popular &amp; High-Quality Products</h2></div><Link href="/products">View All Products <span>→</span></Link></div>
        <div className="product-grid">
          {items.map((item, index) => {
            const isSaved = saved.includes(item.id);
            return <article className="product-card" key={`${item.id}-${index}`}>
              <Link href={`/products/${item.id}`} className="product-image"><img src={item.image} alt={item.name} loading="lazy" /><span className="verified-badge">✓ Verified Supplier</span></Link>
              <button className={`favorite ${isSaved ? "active" : ""}`} onClick={() => setSaved((current) => isSaved ? current.filter((id) => id !== item.id) : [...current, item.id])} aria-label={`${isSaved ? "Remove" : "Save"} ${item.name}`}>♥</button>
              <div className="product-body"><Link href={`/products/${item.id}`}><h3>{item.name}</h3></Link><p className="location">🇰🇭 {item.location}</p><dl><div><dt>MOQ</dt><dd>500 kg</dd></div><div><dt>Available</dt><dd>10,000 kg</dd></div><div><dt>Supplier</dt><dd>{item.supplier}</dd></div></dl><Link href="/rfqs/new" className="quote-link">Request Quote <span>→</span></Link></div>
            </article>;
          })}
        </div>
      </section>

      <section className="supplier-band">
        <div className="section-shell supplier-layout"><div className="supplier-intro"><p className="eyebrow eyebrow-gold">TRUSTED SUPPLIERS</p><h2>Verified Cambodian Suppliers</h2><p>Build reliable trade relationships with producers who meet our quality and business standards.</p><Link href="/suppliers" className="button button-white">Browse All Suppliers <span>→</span></Link></div><div className="supplier-cards">{suppliers.map(([initials, name, tags, count]) => <Link href="/suppliers" className="supplier-card" key={name}><div className="supplier-top"><div className="supplier-logo">{initials}</div><span className="supplier-verified">✓ Verified</span></div><h3>{name}</h3><p>{tags}</p><span className="supplier-location">🇰🇭 Cambodia</span><div className="supplier-bottom"><span>{count}</span><b>→</b></div></Link>)}</div></div>
      </section>

      <section className="why-section"><div className="section-shell why-layout"><div className="why-copy"><p className="eyebrow">WHY CHOOSE US</p><h2>More Than a Marketplace</h2><p>FoodFarm Hub makes sourcing from Cambodia simple, transparent and ready for the world.</p><Link href="/about" className="button button-outline-green">Learn More <span>→</span></Link></div><div className="feature-list">{[["✓", "Verified Suppliers", "Businesses checked for trade readiness"], ["↔", "Transparent Trade", "Clear details at every step"], ["◎", "Global Reach", "Connect beyond borders"], ["▣", "Secure Transactions", "Support from quote to order"]].map(([icon, title, text]) => <div className="feature" key={title}><span className="feature-icon">{icon}</span><h3>{title}</h3><p>{text}</p></div>)}</div></div></section>

      <section className="global-banner"><div className="global-map" /><div className="section-shell global-inner"><div><p className="global-route">Cambodia <span>→</span> Southeast Asia <span>→</span> Global</p><h2>Building a Stronger<br />Food Future</h2><p>Together we grow, trade and create opportunities.</p></div><Link href="/auth/signup" className="button button-green">Join Our Platform <span>→</span></Link></div></section>
    </main>
  );
}
