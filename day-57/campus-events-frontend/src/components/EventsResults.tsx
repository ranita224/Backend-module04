"use client";

import { useState } from "react";
import type { Event } from "@/types/event";
import EventCard from "./EventCard";
import SearchBar from "./SearchBar";
import { EmptyState } from "./Message";

/**
 * Title search happens HERE, in the browser, on the events already fetched
 * for the current page. The API has no search route we are allowed to use.
 */
export default function EventsResults({ events }: { events: Event[] }) {
  const [search, setSearch] = useState("");
  const term = search.trim().toLowerCase();
  const visible = term
    ? events.filter((e) => e.title.toLowerCase().includes(term))
    : events;

  return (
    <>
      <SearchBar value={search} onChange={setSearch} />
      {term && (
        <p className="search-note" aria-live="polite">
          {visible.length} of {events.length} events on this page match &ldquo;{search.trim()}&rdquo;
        </p>
      )}
      {visible.length === 0 ? (
        <EmptyState
          message={
            term
              ? `No events on this page match "${search.trim()}".`
              : "No events found. Check back later!"
          }
        />
      ) : (
        <div className="grid">
          {visible.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </>
  );
}
