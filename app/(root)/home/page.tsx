"use client";

import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-5 py-16 text-slate-900">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="absolute -bottom-48 -right-32 h-[32rem] w-[32rem] rounded-full bg-sky-200/40 blur-3xl" />
      </div>

      <section className="w-full max-w-5xl">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-indigo-500" />
            Calendar workspace
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Pick a directory
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            Create something new or jump back into your schedule.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
        <button
          type="button"
          onClick={() => router.push("/CreateCalendarEntryPage")}
          className="group flex min-h-60 flex-col items-start rounded-2xl border border-slate-200/80 bg-white/90 p-7 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-950/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-300"
        >
          <span className="mb-8 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 transition group-hover:bg-indigo-600 group-hover:text-white">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-6 w-6">
              <rect x="3.5" y="5" width="17" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
              <path d="M7.5 3.5v3M16.5 3.5v3M3.5 9.5h17M12 13v5M9.5 15.5h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </span>
          <span className="text-lg font-semibold text-slate-900">Create a calendar</span>
          <span className="mt-2 text-sm leading-6 text-slate-500">
            Start fresh and add your upcoming events.
          </span>
          <span className="mt-auto pt-5 text-sm font-semibold text-indigo-700">
            Get started <span aria-hidden="true" className="transition group-hover:translate-x-1 inline-block">-&gt;</span>
          </span>
        </button>

        <button
          type="button"
          onClick={() => router.push("/CalendarPage")}
          className="group flex min-h-60 flex-col items-start rounded-2xl border border-slate-200/80 bg-white/90 p-7 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-sky-200 hover:shadow-xl hover:shadow-sky-950/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300"
        >
          <span className="mb-8 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sky-700 transition group-hover:bg-sky-600 group-hover:text-white">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-6 w-6">
              <rect x="3.5" y="5" width="17" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
              <path d="M7.5 3.5v3M16.5 3.5v3M3.5 9.5h17M7.5 13h2M12 13h2M16.5 13h.01M7.5 17h2M12 17h2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </span>
          <span className="text-lg font-semibold text-slate-900">View calendar</span>
          <span className="mt-2 text-sm leading-6 text-slate-500">
            See your schedule and what is coming up.
          </span>
          <span className="mt-auto pt-5 text-sm font-semibold text-sky-700">
            Open calendar <span aria-hidden="true" className="transition group-hover:translate-x-1 inline-block">-&gt;</span>
          </span>
        </button>

        <button
          type="button"
          onClick={() => router.push("/CreateCalendarEntryPage")}
          className="group flex min-h-60 flex-col items-start rounded-2xl border border-slate-200/80 bg-white/90 p-7 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-950/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300"
        >
          <span className="mb-8 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 transition group-hover:bg-emerald-600 group-hover:text-white">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-6 w-6">
              <path d="M7 4.5h10a2 2 0 0 1 2 2v13H5v-13a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
              <path d="M8.5 9h7M8.5 12.5h7M8.5 16h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </span>
          <span className="text-lg font-semibold text-slate-900">View entries</span>
          <span className="mt-2 text-sm leading-6 text-slate-500">
            Add and manage the events in your calendar.
          </span>
          <span className="mt-auto pt-5 text-sm font-semibold text-emerald-700">
            Manage entries <span aria-hidden="true" className="transition group-hover:translate-x-1 inline-block">-&gt;</span>
          </span>
        </button>
      </div>
      </section>
    </main>
  );
}
