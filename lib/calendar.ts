import { API_ROUTE } from "@/routes/routes";

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

function getToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("token") ?? "";
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const url = `${API_ROUTE}api/calendar/${path.replace(/^\/+/, "")}`;
  const method = options.method ?? "GET";

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  const responseBody = await response.text();
  let data: unknown = {};

  if (responseBody) {
    try {
      data = JSON.parse(responseBody);
    } catch {
      data = {};
    }
  }

  if (!response.ok) {
    console.error("[calendar API] request failed", {
      method,
      url,
      status: response.status,
      statusText: response.statusText,
      responseBody: responseBody.slice(0, 1000),
    });

    const backendMessage =
      typeof data === "object" &&
      data !== null &&
      "error" in data &&
      typeof data.error === "string"
        ? data.error
        : "";

    throw new Error(
      backendMessage || `Request failed (${response.status})`,
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