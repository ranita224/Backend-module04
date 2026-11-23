export interface CampusEvent {
  id: string; 
  title: string;
  description: string;
  location: string;
  eventDate: string; 
  category: string; 
  isPublished: boolean;
}

export interface EventSession {
  id: string; 
  eventId: string;
  title: string;
  startsAt: string; 
  endsAt: string; 
  room: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
