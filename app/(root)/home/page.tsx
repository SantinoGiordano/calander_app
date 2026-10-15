"use client";

import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <button
        type="button"
        onClick={() => router.push("/createCalendar")}
        className="rounded bg-black px-5 py-2 text-white transition hover:bg-zinc-800"
      >
        Create a Calendar
      </button>
    </div>
  );
}
