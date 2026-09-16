import Link from "next/link";
export default function AdminDashboardPage() {
  return <main className="min-h-screen bg-slate-50 px-6 py-12 dark:bg-neutral-950"><div className="mx-auto max-w-5xl"><p className="text-sm font-semibold uppercase tracking-widest text-blue-600">Administration</p><h1 className="mt-2 text-4xl font-bold text-slate-900 dark:text-slate-50">Manage marketplace</h1><Link href="/categories" className="mt-10 inline-block rounded-2xl bg-white p-6 shadow-sm dark:bg-neutral-900"><span className="text-3xl">🗂️</span><h2 className="mt-4 font-semibold">Categories</h2><p className="mt-2 text-sm text-slate-500">Review marketplace categories through the API.</p></Link></div></main>;
}
