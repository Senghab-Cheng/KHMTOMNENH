"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AuthResponse, getSession, signOut } from "@/lib/auth";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState<AuthResponse | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSession(getSession());
    setHydrated(true);
  }, []);

  const visibleSession = hydrated ? session : null;
  const dashboardHref = visibleSession ? `/dashboard/${visibleSession.role.toLowerCase()}` : "/auth/signin";
  const supplierHref = visibleSession?.role === "SUPPLIER" ? "/company" : "/auth/signup";
  const supplierLabel = visibleSession?.role === "SUPPLIER" ? "Company profile" : "Become a Supplier";

  return <header className="site-header">
    <div className="utility-bar"><div className="section-shell utility-inner"><nav><Link href="/about">About</Link><Link href="/products">For Buyers</Link><Link href={supplierHref}>For Suppliers</Link><Link href="/about">Learning Center</Link><Link href="/about">Resources</Link></nav><nav className="utility-right"><Link href={supplierHref} className="green-link">{supplierLabel}</Link><Link href="/messages">Messages</Link><Link href="/orders">Orders</Link><span>🌐 EN / USD ▾</span></nav></div></div>
    <div className="main-header section-shell"><Link href="/" className="brand" aria-label="FoodFarm Hub home"><span className="brand-mark">◒</span><span><b>FOODFARM <i>HUB</i></b><small>Cambodia&apos;s B2B Food &amp; Agriculture Marketplace</small></span></Link><div className="header-search"><form action="/products" className="search-form"><select name="category" aria-label="Search category" defaultValue="Products"><option>Products</option><option>Suppliers</option><option>Categories</option></select><input name="q" placeholder="Search products, suppliers, or categories..." aria-label="Search products, suppliers, or categories" /><button type="submit">Search</button></form></div><div className="account-cluster">{visibleSession ? <><span>Welcome, {visibleSession.fullName}</span><Link href={dashboardHref}>{visibleSession.role === "ADMIN" ? "Administration" : "My dashboard"}</Link></> : <><span>Welcome, User</span><Link href="/auth/signin">Login &amp; Register</Link></>}<div className="header-icons"><Link href="/products" aria-label="Saved products">♡</Link><Link href="/rfqs/new" aria-label="Shopping cart">▱</Link>{visibleSession && <button type="button" onClick={signOut} aria-label="Sign out">↪</button>}</div></div><button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle menu">☰</button></div>
    <div className="mobile-search section-shell"><form action="/products" className="search-form"><input name="q" placeholder="Search products, suppliers, or categories..." aria-label="Search products" /><button type="submit">Search</button></form></div>
    {open && <nav className="mobile-nav section-shell"><Link href="/products">Browse Products</Link><Link href="/suppliers">Find Suppliers</Link><Link href="/orders">Orders</Link><Link href={supplierHref}>{supplierLabel}</Link></nav>}
  </header>;
}
