"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";

import {
  getCalendarEntries,
  updateCalendarEntry,
  deleteCalendarEntry,
  type CalendarEntry,
} from "@/lib/calendar";
import EventForm from "@/components/EventForm";

const typeColors: Record<string, string> = {
  Work: "bg-blue-100 text-blue-800",
  Personal: "bg-purple-100 text-purple-800",
  Meeting: "bg-amber-100 text-amber-800",
  Appointment: "bg-emerald-100 text-emerald-800",
  Other: "bg-gray-100 text-gray-700",
};

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function localDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();

  date.setHours(hours, minutes, 0, 0);

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  const parsed = new Date(year, month - 1, day);

  return parsed.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function sortEntries(entries: CalendarEntry[]) {
  return [...entries].sort((a, b) =>
    `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`),
  );
}

function isPastDate(dateString: string): boolean {
  if (!dateString) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const date = new Date(`${dateString}T00:00:00`);
  date.setHours(0, 0, 0, 0);

  return date < today;
}

type DraggableEventProps = {
  entry: CalendarEntry;
  onClick?: () => void;
  disabled?: boolean;
};

function DraggableEvent({
  entry,
  onClick,
  disabled = false,
}: DraggableEventProps) {
  const past = isPastDate(entry.date);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: entry.id,
      disabled: disabled || past,
      data: { entry },
    });

  return (
    <button
      ref={setNodeRef}
      type="button"
      title={
        past
          ? `${entry.time} — ${entry.name} (past event)`
          : `${entry.time} — ${entry.name}. Drag to reschedule.`
      }
      onClick={past ? undefined : onClick}
      disabled={past}
      style={{
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
        opacity: isDragging ? 0.3 : past ? 0.45 : 1,
        touchAction: "none",
      }}
      className={`block w-full truncate rounded px-1.5 py-1 text-left text-[10px] font-medium transition-shadow sm:text-xs ${
        typeColors[entry.type] ?? typeColors.Other
      } ${
        past
          ? "cursor-not-allowed grayscale"
          : isDragging
            ? "z-10 cursor-grabbing shadow-lg"
            : "cursor-grab hover:brightness-95 active:cursor-grabbing"
      } ${disabled ? "cursor-wait opacity-60" : ""}`}
      {...attributes}
      {...listeners}
    >
      <span className="hidden sm:inline">{entry.time} </span>
      {entry.name}
    </button>
  );
}

type CalendarDayCellProps = {
  dropId: string;
  date: string | null;
  className: string;
  children: React.ReactNode;
};

function CalendarDayCell({
  dropId,
  date,
  className,
  children,
}: CalendarDayCellProps) {
  const past = date ? isPastDate(date) : false;

  const { setNodeRef, isOver } = useDroppable({
    id: dropId,
    disabled: !date || past,
    data: { date },
  });

  return (
    <div
      ref={setNodeRef}
      className={`${className} ${past ? "bg-gray-100 text-gray-400" : ""} ${
        isOver && date && !past
          ? "bg-blue-50 ring-2 ring-inset ring-blue-400"
          : ""
      }`}
    >
      {children}
    </div>
  );
}

export default function CalendarPage() {
  const router = useRouter();

  const [entries, setEntries] = useState<CalendarEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [month, setMonth] = useState(() => new Date());

  const [selectedEntry, setSelectedEntry] = useState<CalendarEntry | null>(
    null,
  );

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [movingId, setMovingId] = useState<string | null>(null);
  const [activeDragEntry, setActiveDragEntry] = useState<CalendarEntry | null>(
    null,
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  const loadEntries = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getCalendarEntries();
      setEntries(sortEntries(data));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to load events.";

      setError(message);

      if (
        message.toLowerCase().includes("token") ||
        message.toLowerCase().includes("unauthorized") ||
        message.toLowerCase().includes("missing")
      ) {
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void loadEntries();
  }, [loadEntries]);

  const today = localDateString(new Date());

  const upcomingEntries = useMemo(
    () =>
      entries.filter(
        (entry) =>
          `${entry.date}T${entry.time}` >=
          `${today}T${new Date().toTimeString().slice(0, 5)}`,
      ),
    [entries, today],
  );

  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);

  const daysInMonth = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0,
  ).getDate();

  // Monday-first calendar grid.
  const leadingDays = (firstDay.getDay() + 6) % 7;

  const calendarCells: (number | null)[] = [
    ...Array.from({ length: leadingDays }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  while (calendarCells.length % 7 !== 0) {
    calendarCells.push(null);
  }

  function entriesForDay(day: number) {
    const date = localDateString(
      new Date(month.getFullYear(), month.getMonth(), day),
    );

    return entries.filter((entry) => entry.date === date);
  }

  async function handleDelete(entry: CalendarEntry) {
    const confirmed = window.confirm(
      `Delete "${entry.name}"? This cannot be undone.`,
    );

    if (!confirmed) return;

    setDeletingId(entry.id);
    setError("");

    try {
      await deleteCalendarEntry(entry.id);

      setEntries((current) => current.filter((item) => item.id !== entry.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete event.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleUpdate(data: Parameters<typeof updateCalendarEntry>[1]) {
    if (!selectedEntry) return;

    const updated = await updateCalendarEntry(selectedEntry.id, data);

    setEntries((current) =>
      sortEntries(
        current.map((entry) => (entry.id === updated.id ? updated : entry)),
      ),
    );

    setSelectedEntry(null);
  }

  function handleDragStart(event: { active: { id: string | number } }) {
    const entry = entries.find((item) => item.id === String(event.active.id));

    setActiveDragEntry(entry ?? null);
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveDragEntry(null);

    const { active, over } = event;

    // Dropped outside a calendar date.
    if (!over) return;

    const entryId = String(active.id);
    const destinationDate = String(over.id);

    const entry = entries.find((item) => item.id === entryId);

    if (!entry) return;

    // Only accept IDs that look like YYYY-MM-DD.
    if (!/^\d{4}-\d{2}-\d{2}$/.test(destinationDate)) {
      return;
    }
    if (isPastDate(entry.date) || isPastDate(destinationDate)) {
      return;
    }

    // Nothing to change if the event stayed on its original day.
    if (destinationDate === entry.date) return;

    setMovingId(entry.id);
    setError("");

    try {
      // Reuse your existing PUT endpoint.
      // Keep the event's original time and other details.
      const updated = await updateCalendarEntry(entry.id, {
        name: entry.name,
        description: entry.description,
        date: destinationDate,
        time: entry.time,
        type: entry.type,
      });

      // Update the interface only after the server confirms success.
      setEntries((current) =>
        sortEntries(
          current.map((item) => (item.id === entry.id ? updated : item)),
        ),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? `Couldn't move "${entry.name}". ${err.message}`
          : "Unable to reschedule this event.",
      );
    } finally {
      setMovingId(null);
    }
  }

  function changeMonth(amount: number) {
    setMonth(
      (current) =>
        new Date(current.getFullYear(), current.getMonth() + amount, 1),
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-7xl">
        {/* Dashboard heading */}
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/home"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600"
            >
              <span aria-hidden="true">←</span>
              Back to calendar
            </Link>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              My Calendar
            </h1>

            <p className="mt-2 text-gray-500">
              Keep track of your events, all in one place.
            </p>
          </div>

          <Link
            href="/CreateCalendarEntryPage"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <span className="text-xl" aria-hidden="true">
              +
            </span>
            Create event
          </Link>
        </header>

        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <span>{error}</span>

            <button
              onClick={() => void loadEntries()}
              className="font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Drag-and-drop status */}
        {movingId && (
          <div
            role="status"
            className="mb-4 flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-800"
          >
            <span className="animate-pulse">●</span>
            Saving your new event date...
          </div>
        )}

        {/* Summary cards */}
        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total events</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {entries.length}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Upcoming events</p>
            <p className="mt-2 text-3xl font-bold text-blue-600">
              {upcomingEntries.length}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Events today</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {entries.filter((entry) => entry.date === today).length}
            </p>
          </div>
        </section>

        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,1fr)]">
          {/* Monthly calendar */}
          <section className="min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b border-gray-100 p-4 sm:p-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {month.toLocaleDateString([], {
                    month: "long",
                    year: "numeric",
                  })}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Drag an event to another date to reschedule it.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMonth(new Date())}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Today
                </button>

                <button
                  onClick={() => changeMonth(-1)}
                  aria-label="Previous month"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  ←
                </button>

                <button
                  onClick={() => changeMonth(1)}
                  aria-label="Next month"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  →
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 border-b border-gray-100">
              {weekdays.map((day) => (
                <div
                  key={day}
                  className="py-3 text-center text-xs font-semibold text-gray-500 sm:text-sm"
                >
                  {day}
                </div>
              ))}
            </div>

            {loading ? (
              <div className="p-10 text-center text-gray-500">
                Loading calendar...
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragEnd={(event) => void handleDragEnd(event)}
                onDragCancel={() => setActiveDragEntry(null)}
              >
                <div className="grid grid-cols-7">
                  {calendarCells.map((day, index) => {
                    const dayEntries = day ? entriesForDay(day) : [];

                    const date = day
                      ? localDateString(
                          new Date(month.getFullYear(), month.getMonth(), day),
                        )
                      : null;

                    const past = date ? isPastDate(date) : false;

                    const baseClassName = `min-h-24 border-b border-r border-gray-100 p-1 transition-colors sm:min-h-32 sm:p-2 ${
                      !day ? "bg-gray-50/70" : past ? "bg-gray-100" : "bg-white"
                    }`;

                    return (
                      <CalendarDayCell
                        key={`${month.getFullYear()}-${month.getMonth()}-${index}`}
                        dropId={
                          date ??
                          `empty-${month.getFullYear()}-${month.getMonth()}-${index}`
                        }
                        date={date}
                        className={baseClassName}
                      >
                        {day && date && (
                          <>
                            <div className="mb-1 flex justify-center sm:justify-start">
                              <span
                                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium sm:h-8 sm:w-8 sm:text-sm ${
                                  date === today
                                    ? "bg-blue-600 font-bold text-white"
                                    : past
                                      ? "text-gray-400"
                                      : "text-gray-700"
                                }`}
                              >
                                {day}
                              </span>
                            </div>

                            <div className="space-y-1">
                              {dayEntries.slice(0, 2).map((entry) => (
                                <DraggableEvent
                                  key={entry.id}
                                  entry={entry}
                                  disabled={movingId !== null}
                                  onClick={() => setSelectedEntry(entry)}
                                />
                              ))}

                              {dayEntries.length > 2 && (
                                <p
                                  className="px-1 text-[10px] text-gray-500 sm:text-xs"
                                  title={dayEntries
                                    .slice(2)
                                    .map((entry) => entry.name)
                                    .join(", ")}
                                >
                                  +{dayEntries.length - 2} more
                                </p>
                              )}
                            </div>
                          </>
                        )}
                      </CalendarDayCell>
                    );
                  })}
                </div>

                {/* Visual preview while dragging */}
                <DragOverlay>
                  {activeDragEntry && (
                    <div
                      className={`max-w-48 truncate rounded-lg px-3 py-2 text-xs font-semibold shadow-xl ring-2 ring-blue-400 ${
                        typeColors[activeDragEntry.type] ?? typeColors.Other
                      }`}
                    >
                      <span className="mr-1">{activeDragEntry.time}</span>
                      {activeDragEntry.name}
                    </div>
                  )}
                </DragOverlay>
              </DndContext>
            )}
          </section>

          {/* Upcoming event list */}
          <section className="min-w-0 rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 p-5 sm:p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Upcoming events
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your next events, in chronological order.
              </p>
            </div>

            <div className="p-4 sm:p-5">
              {loading ? (
                <p className="py-8 text-center text-gray-500">
                  Loading events...
                </p>
              ) : upcomingEntries.length === 0 ? (
                <div className="py-10 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-2xl text-blue-600">
                    +
                  </div>

                  <h3 className="mt-4 font-semibold text-gray-900">
                    Nothing scheduled
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    Create an event to get started.
                  </p>

                  <Link
                    href="/create-calendar-entry"
                    className="mt-4 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Create your first event →
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingEntries.map((entry) => (
                    <article
                      key={entry.id}
                      className="rounded-xl border border-gray-100 p-4 transition hover:border-gray-200 hover:bg-gray-50/70"
                    >
                      <div className="flex items-start gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="break-words font-semibold text-gray-900">
                              {entry.name}
                            </h3>

                            <span
                              className={`rounded-full px-2 py-1 text-xs font-medium ${
                                typeColors[entry.type] ?? typeColors.Other
                              }`}
                            >
                              {entry.type}
                            </span>
                          </div>

                          <p className="mt-2 text-sm text-gray-600">
                            {formatDate(entry.date)} · {formatTime(entry.time)}
                          </p>

                          {entry.description && (
                            <p className="mt-2 whitespace-pre-wrap break-words text-sm text-gray-500">
                              {entry.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-3">
                        <button
                          onClick={() => setSelectedEntry(entry)}
                          className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-white"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => void handleDelete(entry)}
                          disabled={deletingId === entry.id}
                          className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          {deletingId === entry.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {entries.some(
                (entry) =>
                  `${entry.date}T${entry.time}` <
                  `${today}T${new Date().toTimeString().slice(0, 5)}`,
              ) && (
                <p className="mt-5 border-t border-gray-100 pt-4 text-xs text-gray-500">
                  Past events are hidden from this list but remain on the
                  calendar.
                </p>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Edit event dialog */}
      {selectedEntry && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-gray-950/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedEntry(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-event-title"
            className="my-auto w-full max-w-xl rounded-2xl bg-white p-5 shadow-xl sm:p-8"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2
                  id="edit-event-title"
                  className="text-2xl font-bold text-gray-900"
                >
                  Edit event
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Update your calendar entry.
                </p>
              </div>

              <button
                onClick={() => setSelectedEntry(null)}
                aria-label="Close edit form"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xl text-gray-500 hover:bg-gray-100"
              >
                ×
              </button>
            </div>

            <EventForm
              key={selectedEntry.id}
              initialEntry={selectedEntry}
              onSubmit={handleUpdate}
              onCancel={() => setSelectedEntry(null)}
            />
          </div>
        </div>
      )}
    </main>
  );
}
