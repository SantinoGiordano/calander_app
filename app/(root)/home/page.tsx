"use client";

import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <div className="m-5 flex min-h-screen items-center justify-center">
      <button
        type="button"
        onClick={() => router.push("/CreateCalendarEntryPage")}
        className="rounded bg-black px-5 py-2 text-white transition hover:bg-zinc-800"
      >
        Create a Calendar
      </button>
            <button
        type="button"
        onClick={() => router.push("/CalendarPage")}
        className="m-5 rounded bg-black px-5 py-2 text-white transition hover:bg-zinc-800"
      >
        View Calendar
      </button>
    </div>
  );
}
