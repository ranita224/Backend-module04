# Campus Events API (CodeOps Day 56)

A NestJS + TypeScript REST API where students can discover campus events, view event details and browse the sessions of each event. Data is stored in memory (arrays), so no database is needed.

## Installation and run

```bash
npm install
npm install class-validator class-transformer   # used for validation
npm run start:dev
```

The API runs at `http://localhost:3000/api`. Requests can be tried with `requests.http` (VS Code "REST Client" extension), Postman or curl.

## Project structure

```
src/
  main.ts                      global prefix "api" + ValidationPipe
  app.module.ts                imports EventsModule
  events/
    events.module.ts           connects controller + service
    events.controller.ts       routes; reads @Param / @Query / @Body
    events.service.ts          find, filter, sort, paginate, create
    events.data.ts             seed data (8 events, 6 sessions)
    event.interface.ts         CampusEvent, EventSession, PaginatedResult
    dto/
      create-event.dto.ts      validation rules for POST body
      find-events-query.dto.ts validation + conversion for the query string
```

## Routes

| Method | Endpoint | Behaviour |
|---|---|---|
| GET | `/api/events` | List events with filter, sort and pagination |
| GET | `/api/events/upcoming` | Events dated today or later (soonest first) |
| GET | `/api/events/published` | Only published events (stretch) |
| GET | `/api/events/:id` | One event, or 404 |
| GET | `/api/events/:id/sessions` | Sessions of an event, or 404 if the event is missing |
| GET | `/api/events/:id/sessions/:sessionId` | One session of that event, or 404 |
| POST | `/api/events` | Create an event (201), or 400 if invalid |

`/upcoming` and `/published` are declared **before** `/:id` in the controller, otherwise Nest would read the word "upcoming" as an ID.

### Query options for `GET /api/events`

| Query | Meaning | Example |
|---|---|---|
| `category` | exact match, case-insensitive | `?category=technology` |
| `location` | contains text, case-insensitive | `?location=main` |
| `isPublished` | `true` or `false` | `?isPublished=true` |
| `sortBy` | `eventDate` or `title` (anything else = 400) | `?sortBy=eventDate` |
| `order` | `asc` (default) or `desc` | `?order=desc` |
| `page` | page number, starts at 1 | `?page=2` |
| `limit` | items per page, default 5, max 100 | `?limit=3` |
| `search` (stretch) | words in the title | `?search=hack` |
| `dateFrom`, `dateTo` (stretch) | date range | `?dateFrom=2026-12-01&dateTo=2026-12-31` |

The response always has this shape, and the header `X-Total-Count` carries the total (stretch):

```json
{ "items": [], "total": 8, "page": 2, "limit": 3, "totalPages": 3 }
```

## How filtering, sorting and pagination work

All three happen in `EventsService.findAll()`, always in this order:

1. **Filter.** `events.filter(...)` keeps only events that pass every filter that was sent (category, location, isPublished, search, date range). It returns a *new* array, so the stored events are not changed.
2. **Sort.** The filtered list is copied (`[...filtered]`) and the copy is sorted by `eventDate` or `title`, ascending or descending. A copy is used because `Array.sort()` changes the array it is called on, and the original data must not be mutated.
3. **Paginate.** With `offset = (page - 1) * limit`, the page is `sorted.slice(offset, offset + limit)`. `total` is the length of the filtered list *before* slicing and `totalPages = Math.ceil(total / limit)`.

Filtering must come first so `total` and `totalPages` describe only the matching events. Sorting must come before slicing so the pages come from one consistent order.

Query values arrive as strings, so `page` and `limit` are converted to numbers and `isPublished` to a boolean by the DTO (`@Type`, `@Transform`). Unsupported `sortBy` or `order` values, `page=abc` and unknown query names are rejected with 400.

## Status codes

| Situation | Code |
|---|---|
| Successful GET | 200 |
| Successful POST | 201 |
| Event ID not found | 404 |
| Session ID not in that event | 404 |
| Missing/invalid body field, invalid query value | 400 |

## Test results

Run each request from `requests.http` and attach screenshots. The values below are what the seed data returns (the "upcoming" list depends on today's date; shown for 13 Nov 2026).

| # | Request | Status | Result |
|---|---|---|---|
| 1 | `GET /api/events` | 200 | 5 items (evt-101 to evt-105), total 8, page 1, limit 5, totalPages 2 |
| 2 | `GET /api/events?category=technology` | 200 | evt-101, evt-102, total 2 |
| 3 | `GET /api/events?isPublished=true` | 200 | 5 items, total 7, totalPages 2 (evt-108 is a draft) |
| 4 | `GET /api/events?sortBy=eventDate&order=asc&page=2&limit=2` | 200 | evt-103, evt-101, total 8, totalPages 4 |
| 5 | `GET /api/events/upcoming` | 200 | evt-103, evt-101, evt-102, evt-104, evt-105, evt-108 |
| 6 | `GET /api/events/evt-101` | 200 | "AI and Machine Learning Workshop" |
| 7 | `GET /api/events/not-real` | 404 | `Event with id "not-real" was not found` |
| 8 | `GET /api/events/evt-101/sessions` | 200 | ses-201, ses-202, ses-203 |
| 9 | `GET /api/events/evt-101/sessions/ses-201` | 200 | "Introduction to Machine Learning" |
| 9b | `GET /api/events/evt-101/sessions/ses-204` | 404 | ses-204 belongs to evt-102 |
| 10 | `POST /api/events` (valid body) | 201 | new event with id `evt-109` |
| 11 | `POST /api/events` (no title) | 400 | validation message about `title` |

## Stretch challenges completed

`search` by title words, `dateFrom`/`dateTo` filters, unsupported sort fields rejected, `GET /api/events/published`, and the `X-Total-Count` response header.

## Reflection answers

1. **Path vs query parameter.** A path parameter identifies one specific resource and is part of the URL path, e.g. `/api/events/evt-101`. A query parameter is optional and adjusts a collection (filter, sort, page), e.g. `/api/events?category=technology`.
2. **Why `/upcoming` before `/:id`?** Nest checks routes in the order they are declared. `/:id` matches any text, so if it came first, `/upcoming` would match it with `id = "upcoming"` and return 404.
3. **Why filter before paginate?** The page must be cut from the matching events only. If we paginated first, the filter would only see that page's few items, matches on other pages would be missed, and `total` and `totalPages` would be wrong.
4. **page = 3, limit = 5.** offset = (3 - 1) x 5 = 10, so the page starts at array index 10 (the 11th item) and holds indexes 10 to 14.
5. **Why the controller calls the service.** Each class has one job: the controller handles HTTP (routes, request data) and the service handles the logic. That keeps code readable, reusable (another controller can use the service) and testable without HTTP.
6. **Status for a missing event.** 404 Not Found, because the request is valid but the resource does not exist. 400 would mean the request itself is malformed, and 200 with empty data would hide the problem.
