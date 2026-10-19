
"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { createCalendarEntry } from "@/lib/calendar";
import EventForm from "@/components/EventForm";

export default function CreateCalendarEntryPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/home"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600"
        >
          <span aria-hidden="true">←</span>
          Back to calendar
        </Link>

        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Calendar
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
              Create an event
            </h1>
            <p className="mt-2 text-gray-500">
              Add an event to your personal calendar.
            </p>
          </div>

          <EventForm
            onSubmit={async (data) => {
              await createCalendarEntry(data);
              router.push("/CalendarPage");
            }}
          />
        </div>
      </div>
    </main>
  );
}
