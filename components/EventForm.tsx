
"use client";

import { useState } from "react";
import type {
  CalendarEntry,
  CalendarEntryInput,
} from "@/lib/calendar";

const eventTypes = [
  "Work",
  "Personal",
  "Meeting",
  "Appointment",
  "Other",
];

type EventFormProps = {
  initialEntry?: CalendarEntry | null;
  onSubmit: (data: CalendarEntryInput) => Promise<void>;
  onCancel?: () => void;
};

export default function EventForm({
  initialEntry,
  onSubmit,
  onCancel,
}: EventFormProps) {
  const [name, setName] = useState(initialEntry?.name ?? "");
  const [description, setDescription] = useState(
    initialEntry?.description ?? "",
  );
  const [date, setDate] = useState(initialEntry?.date ?? "");
  const [time, setTime] = useState(initialEntry?.time ?? "");
  const [type, setType] = useState(
    initialEntry?.type ?? "Work",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        date,
        time,
        type,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  }

  const fieldClass =
    "mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="event-name"
          className="block text-sm font-medium text-gray-700"
        >
          Event name *
        </label>
        <input
          id="event-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Team meeting"
          className={fieldClass}
          maxLength={150}
          required
        />
      </div>

      <div>
        <label
          htmlFor="event-description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="event-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add details about this event..."
          className={fieldClass}
          rows={4}
          maxLength={2000}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="event-date"
            className="block text-sm font-medium text-gray-700"
          >
            Date *
          </label>
          <input
            id="event-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={fieldClass}
            required
          />
        </div>

        <div>
          <label
            htmlFor="event-time"
            className="block text-sm font-medium text-gray-700"
          >
            Start time *
          </label>
          <input
            id="event-time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className={fieldClass}
            required
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="event-type"
          className="block text-sm font-medium text-gray-700"
        >
          Event type *
        </label>
        <select
          id="event-type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className={fieldClass}
          required
        >
          {eventTypes.map((eventType) => (
            <option key={eventType} value={eventType}>
              {eventType}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-xl border border-gray-300 px-5 py-3 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Saving..."
            : initialEntry
              ? "Save changes"
              : "Create event"}
        </button>
      </div>
    </form>
  );
}
