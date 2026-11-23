import type {
  Event,
  EventQuery,
  NewEvent,
  PaginatedEvents,
  Session,
} from "@/types/event";

/**
 * On the server (Server Components) we call the NestJS API directly.
 * In the browser we call "/backend/...", which next.config.ts forwards to the
 * API. This avoids CORS errors because the NestJS API does not enable CORS.
 */
const SERVER_API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000/api";

function baseUrl(): string {
  return typeof window === "undefined" ? SERVER_API_URL : "/backend";
}

/** An error that remembers the HTTP status (0 = server unreachable). */
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/** Shared fetch helper: sends the request, checks response.ok, parses JSON. */
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${baseUrl()}${path}`, {
      cache: "no-store",
      ...init,
    });
  } catch {
    throw new ApiError(
      "Could not reach the Campus Events API. Is the NestJS server running?",
      0,
    );
  }

  if (!response.ok) {
    // NestJS sends { message: string | string[] } for errors.
    let message = `Request failed (${response.status})`;
    try {
      const body = await response.json();
      if (Array.isArray(body.message)) message = body.message.join(". ");
      else if (typeof body.message === "string") message = body.message;
    } catch {
      /* body was not JSON, keep the default message */
    }
    throw new ApiError(message, response.status);
  }

  return response.json() as Promise<T>;
}

/** Accepts either a plain array or a { items: [] } wrapper. */
function toArray<T>(data: T[] | { items: T[] }): T[] {
  return Array.isArray(data) ? data : data.items;
}

export function getEvents(query: EventQuery = {}): Promise<PaginatedEvents> {
  const params = new URLSearchParams();
  // The API rejects unknown or invalid values, so only send what is set.
  for (const [key, value] of Object.entries(query)) {
    if (value) params.set(key, value);
  }
  const qs = params.toString();
  return request<PaginatedEvents>(`/events${qs ? `?${qs}` : ""}`);
}

export async function getUpcomingEvents(): Promise<Event[]> {
  return toArray(await request<Event[] | { items: Event[] }>("/events/upcoming"));
}

export function getEventById(id: string): Promise<Event> {
  return request<Event>(`/events/${encodeURIComponent(id)}`);
}

export async function getEventSessions(id: string): Promise<Session[]> {
  return toArray(
    await request<Session[] | { items: Session[] }>(
      `/events/${encodeURIComponent(id)}/sessions`,
    ),
  );
}

export function getSessionById(
  eventId: string,
  sessionId: string,
): Promise<Session> {
  return request<Session>(
    `/events/${encodeURIComponent(eventId)}/sessions/${encodeURIComponent(sessionId)}`,
  );
}

export function createEvent(event: NewEvent): Promise<Event> {
  return request<Event>("/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  });
}
