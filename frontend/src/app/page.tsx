import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-4">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
          Welcome to the Application
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Use the auth pages below to sign in or create an account.
        </p>
        <div className="flex gap-3">
          <Link
            href="/auth/signin"
            className="py-2 px-3.5 text-sm rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700"
          >
            Sign in
          </Link>
          <Link
            href="/auth/signup"
            className="py-2 px-3.5 text-sm rounded-md font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-neutral-800 dark:text-blue-400"
          >
            Sign up
          </Link>
        </div>
      </div>
    </main>
  );
}
