"use client";

import { CalendarEntry } from "@/types/types";
import { API_ROUTE } from "@/routes/routes";
import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function Managetasks() {
  const [tasks, settasks] = useState<CalendarEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchtasks = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Please log in to view your tasks.");
        }

        const response = await fetch(`${API_ROUTE}api/calendar/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const data = await response.json().catch(() => null);

          throw new Error(data?.error || "Failed to fetch calendar entries.");
        }

        const data: CalendarEntry[] = await response.json();

        settasks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchtasks();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <p>Loading Tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Link
        href="/home"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600"
      >
        <span aria-hidden="true">←</span>
        Back to calendar
      </Link>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Manage Tasks</h1>

        <p className="mt-1 text-sm text-gray-500">
          You have {tasks.length} calendar{" "}
          {tasks.length === 1 ? "event" : "tasks"}.
        </p>
      </div>

      {tasks.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center">
          <h2 className="text-lg font-semibold">No tasks found</h2>

          <p className="mt-2 text-sm text-gray-500">
            Create a calendar event to see it here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tasks.map((event) => (
            <div
              key={event.id}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <h2 className="text-lg font-semibold text-gray-900">
                  {event.name}
                </h2>

                <span className="shrink-0 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                  {event.type}
                </span>
              </div>

              <p className="mb-5 min-h-10 text-sm leading-5 text-gray-600">
                {event.description || "No description provided."}
              </p>

              <div className="space-y-3 border-t border-gray-100 pt-4 text-sm">
                <div className="flex items-center gap-2">
                  <span>📅</span>
                  <span className="font-medium text-gray-700">Date:</span>
                  <span className="text-gray-600">{event.date}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span>🕒</span>
                  <span className="font-medium text-gray-700">Time:</span>
                  <span className="text-gray-600">{event.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
