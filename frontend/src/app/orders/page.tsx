"use client";

import { useEffect, useState } from "react";
import { apiRequest, getSession } from "@/lib/auth";

type Order = { id: number; status: string; totalAmount: number; createdAt: string; shippingAddress?: string };

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");
  useEffect(() => { if (!getSession()) { window.location.assign("/auth/signin"); return; } apiRequest<Order[]>("/api/orders").then(setOrders).catch((reason) => setError(reason instanceof Error ? reason.message : "Unable to load orders.")); }, []);
  return <main className="min-h-screen bg-slate-50 px-6 py-12 dark:bg-neutral-950"><div className="mx-auto max-w-5xl"><h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50">Orders</h1>{error && <p role="alert" className="mt-6 text-red-700">{error}</p>}<div className="mt-8 space-y-4">{orders.map((order) => <article key={order.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-6 shadow-sm dark:bg-neutral-900"><div><h2 className="font-semibold">Order #{order.id}</h2><p className="mt-1 text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p></div><span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">{order.status}</span><strong>${Number(order.totalAmount).toFixed(2)}</strong></article>)}</div>{!error && orders.length === 0 && <p className="mt-10 text-slate-500">No orders yet.</p>}</div></main>;
}
