export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  eventDate: string;
  category: string;
  isPublished: boolean;
}

export interface Session {
  id: string;
  eventId: string;
  title: string;
  startsAt: string;
  endsAt: string;
  room: string;
}

export interface PaginatedEvents {
  items: Event[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** Query parameters supported by GET /api/events */
export interface EventQuery {
  category?: string;
  location?: string;
  isPublished?: string; // "true" | "false"
  sortBy?: string; // "eventDate" | "title"
  order?: string; // "asc" | "desc"
  page?: string;
  limit?: string;
}

/** Body sent to POST /api/events */
export type NewEvent = Omit<Event, "id">;
