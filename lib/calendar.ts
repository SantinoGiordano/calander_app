export type CalendarEntry = {
  id: string;
  userId: string;
  name: string;
  description: string;
  date: string;
  time: string;
  type: string;
  startAt: string;
  createdAt: string;
};

export type CalendarEntryInput = {
  name: string;
  description: string;
  date: string;
  time: string;
  type: string;
};

const API_URL = "http://localhost:8080/api/calendar";

function getToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("token") ?? "";
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.error || `Request failed (${response.status})`,
    );
  }

  return data as T;
}

export function getCalendarEntries() {
  return request<CalendarEntry[]>("");
}

export function createCalendarEntry(input: CalendarEntryInput) {
  return request<CalendarEntry>("", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateCalendarEntry(
  id: string,
  input: CalendarEntryInput,
) {
  return request<CalendarEntry>(`/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export function deleteCalendarEntry(id: string) {
  return request<{ message: string; id: string }>(
    `/${encodeURIComponent(id)}`,
    { method: "DELETE" },
  );
}