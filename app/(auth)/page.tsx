"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-6 text-center">
      <h1 className="mb-6 text-3xl font-semibold text-zinc-900">Scheduler App</h1>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="rounded bg-black px-5 py-2 text-white transition hover:bg-zinc-800"
        >
          Login
        </button>

        <button
          type="button"
          onClick={() => router.push("/register")}
          className="rounded border border-zinc-300 bg-white px-5 py-2 text-zinc-900 transition hover:bg-zinc-100"
        >
          Register
        </button>
      </div>
    </main>
  );
}
