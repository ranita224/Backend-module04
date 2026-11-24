import { Injectable, NotFoundException } from '@nestjs/common';
import type { CreateEventDto } from './dto/create-event.dto.js';
import type { FindEventsQueryDto } from './dto/find-events-query.dto.js';
import type {
  CampusEvent,
  EventSession,
  PaginatedResult,
} from './event.interface.js';
import { SEED_EVENTS, SEED_SESSIONS } from './events.data.js';

@Injectable()
export class EventsService {
  private readonly events: CampusEvent[] = [...SEED_EVENTS];
  private readonly sessions: EventSession[] = [...SEED_SESSIONS];
  private nextEventNumber = 109; 

  findAll(query: FindEventsQueryDto): PaginatedResult<CampusEvent> {
    const {
      category,
      location,
      isPublished,
      search,
      dateFrom,
      dateTo,
      sortBy,
      order = 'asc',
      page = 1,
      limit = 5,
    } = query;

  
    const filtered = this.events.filter((event) => {
      if (category && event.category.toLowerCase() !== category.toLowerCase()) {
        return false;
      }
      if (
        location &&
        !event.location.toLowerCase().includes(location.toLowerCase())
      ) {
        return false;
      }
      if (isPublished !== undefined && event.isPublished !== isPublished) {
        return false;
      }
      if (
        search &&
        !event.title.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }
      if (dateFrom && Date.parse(event.eventDate) < Date.parse(dateFrom)) {
        return false;
      }
      if (dateTo && Date.parse(event.eventDate) > Date.parse(dateTo)) {
        return false;
      }
      return true;
    });

    const sorted = sortBy
      ? [...filtered].sort((a, b) => {
          const direction = order === 'desc' ? -1 : 1;
          const result =
            sortBy === 'title'
              ? a.title.localeCompare(b.title)
              : Date.parse(a.eventDate) - Date.parse(b.eventDate);
          return result * direction;
        })
      : filtered;

    const total = sorted.length; 
    const offset = (page - 1) * limit;
    const items = sorted.slice(offset, offset + limit);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  findUpcoming(): CampusEvent[] {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0); 

    return this.events
      .filter((event) => Date.parse(event.eventDate) >= startOfToday.getTime())
      .sort((a, b) => Date.parse(a.eventDate) - Date.parse(b.eventDate));
  }


  findPublished(): CampusEvent[] {
    return this.events.filter((event) => event.isPublished);
  }


  findOne(id: string): CampusEvent {
    const event = this.events.find((e) => e.id === id);
    if (!event) {
      throw new NotFoundException(`Event with id "${id}" was not found`);
    }
    return event;
  }

  findSessions(eventId: string): EventSession[] {
    this.findOne(eventId); // throws 404 if the event does not exist
    return this.sessions.filter((s) => s.eventId === eventId);
  }

  findSession(eventId: string, sessionId: string): EventSession {
    this.findOne(eventId); // 404 if the event is missing
    const session = this.sessions.find(
      (s) => s.id === sessionId && s.eventId === eventId,
    );
    if (!session) {
      throw new NotFoundException(
        `Session "${sessionId}" was not found in event "${eventId}"`,
      );
    }
    return session;
  }

  create(dto: CreateEventDto): CampusEvent {
    const event: CampusEvent = {
      id: `evt-${this.nextEventNumber++}`,
      title: dto.title.trim(),
      description: dto.description.trim(),
      location: dto.location.trim(),
      eventDate: new Date(dto.eventDate).toISOString(),
      category: dto.category.trim().toLowerCase(),
      isPublished: dto.isPublished ?? false,
    };
    this.events.push(event);
    return event;
  }
}
