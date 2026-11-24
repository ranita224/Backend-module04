# Campus Events: Frontend

A responsive web app where students discover campus events, browse their sessions, filter and sort the list, and create new events. It is the frontend for the existing **NestJS Campus Events API** (CodeOps Day 56), built for CodeOps Module 4.

## Technologies used

- **Next.js** (App Router) and **React**
- **TypeScript**
- **Native Fetch API** (no Axios, no React Router)
- **Plain CSS** (`src/app/globals.css`)

## Installation

```bash
npm install
cp .env.example .env.local     # Windows (cmd): copy .env.example .env.local
```

## Backend URL configuration

1. Start the NestJS API first (`npm run start:dev` in the API project). It runs at `http://localhost:3000/api`.
2. Check `.env.local` in this project:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NEXT_PUBLIC_TIMEZONE=Africa/Addis_Ababa
```

Change `NEXT_PUBLIC_API_BASE_URL` if your API uses another port or address, and **restart the dev server** after any change to `.env.local`. `.env.example` is a copy you can commit.

## Start the development server

```bash
npm run dev
```

Open **http://localhost:3001**.

> The NestJS API and Next.js both default to port 3000, so the `dev` script in `package.json` runs the frontend on **3001** (`next dev -p 3001`).

## Main features

| Page | Route | What it does |
|---|---|---|
| Home | `/` | Welcome section, "Next on campus" highlight, 3 upcoming events, link to all events |
| All events | `/events` | Event cards, category / location / status filters, sort by date or title (asc/desc), pagination, title search |
| Event details | `/events/[id]` | Full event info plus its sessions |
| Session details | `/events/[id]/sessions/[sessionId]` | Title, start/end time, room and the related event |
| Create event | `/create-event` | Validated form, success message, redirect to the new event |

Application states handled: loading, error (API down), empty ("No events found. Check back later!"), not found (bad event or session ID), success, and form validation.

## How it talks to the API

All requests live in `src/services/eventService.ts` and use `fetch()`:

| Function | Request |
|---|---|
| `getEvents(query)` | `GET /api/events?category=&location=&isPublished=&sortBy=&order=&page=&limit=` |
| `getUpcomingEvents()` | `GET /api/events/upcoming` |
| `getEventById(id)` | `GET /api/events/:id` |
| `getEventSessions(id)` | `GET /api/events/:id/sessions` |
| `getSessionById(id, sessionId)` | `GET /api/events/:id/sessions/:sessionId` |
| `createEvent(event)` | `POST /api/events` |

- **Server Components** (the pages) call these functions on the server.
- **Client Components** (`"use client"`: filters, search, create form, navbar) run in the browser. Browser requests go to `/backend/...`, which `next.config.ts` forwards to the API. This avoids a **CORS** error, because the NestJS API does not enable CORS. No backend change is needed.
- Filters, sorting and the page number live in the URL (`/events?category=technology&sortBy=title&page=2`). Changing a filter changes the URL and the server page asks the API again.
- **Title search is done on the frontend**, as the guide requires: it filters the events already fetched for the current page. The API has no search route that this project uses.
- Only valid, non-empty query parameters are sent, because the API rejects unknown or invalid ones with 400.

## Project structure

```
src/
  app/
    layout.tsx  page.tsx  globals.css  loading.tsx  error.tsx  not-found.tsx
    events/
      page.tsx  loading.tsx
      [id]/
        page.tsx  not-found.tsx
        sessions/[sessionId]/page.tsx  not-found.tsx
    create-event/page.tsx
  components/   Navbar, Footer, EventCard, EventsResults, EventFilters,
                SearchBar, Pagination, CreateEventForm, Loading, Message, ...
  services/     eventService.ts   (all fetch calls)
  types/        event.ts          (Event, Session, PaginatedEvents ...)
  lib/          format.ts         (dates, categories)
```

## Time zone

Event times are shown, and entered in the form, in the time zone set by `NEXT_PUBLIC_TIMEZONE` (default `Africa/Addis_Ababa`). Using one fixed zone keeps server and browser output identical. The API stores times in UTC.

## Testing checklist

| # | Test | Result |
|---|---|---|
| 1 | Open the home page | Dashboard loads |
| 2 | Open all events | 5 events per page shown |
| 3 | Filter by category | Only matching events |
| 4 | Filter by location | Only matching events |
| 5 | Search by title | Cards filter as you type |
| 6 | Change sorting | Order changes |
| 7 | Navigate pagination | Correct page appears |
| 8 | Open event details | Correct event appears |
| 9 | View event sessions | Only that event's sessions |
| 10 | Open invalid event ID (`/events/not-real`) | "Event not found" message |
| 11 | Submit a valid event | Success message, then redirect to the new event |
| 12 | Submit an incomplete form | Validation messages |
| 13 | Stop the backend | Friendly error messages, no crash |

Add your own screenshots of each page to `docs/screenshots/` before submitting (examples are already there).
