/** One fixed time zone, so server and browser always print the same text. */
export const TIME_ZONE = process.env.NEXT_PUBLIC_TIMEZONE ?? "Africa/Addis_Ababa";

export const CATEGORIES = [
  "technology",
  "sports",
  "cultural",
  "career",
  "academic",
] as const;

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: TIME_ZONE,
  }).format(new Date(iso));
}

export function formatTime(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TIME_ZONE,
  }).format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return `${formatDate(iso)}, ${formatTime(iso)}`;
}

/** Pieces for the calendar-style date block on cards. */
export function dateParts(iso: string): { day: string; month: string } {
  const d = new Date(iso);
  return {
    day: new Intl.DateTimeFormat("en-GB", { day: "numeric", timeZone: TIME_ZONE }).format(d),
    month: new Intl.DateTimeFormat("en-GB", { month: "short", timeZone: TIME_ZONE }).format(d),
  };
}

/**
 * Converts the value of <input type="datetime-local"> ("2026-12-04T09:00"),
 * read as a time in TIME_ZONE, into an ISO string for the API.
 */
export function localInputToIso(value: string): string {
  const asUtc = new Date(`${value}:00Z`);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(asUtc);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  const zonedAsUtc = Date.UTC(
    get("year"),
    get("month") - 1,
    get("day"),
    get("hour"),
    get("minute"),
    get("second"),
  );
  const offset = zonedAsUtc - asUtc.getTime();
  return new Date(asUtc.getTime() - offset).toISOString();
}
