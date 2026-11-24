import Link from "next/link";
import { getUpcomingEvents } from "@/services/eventService";
import type { Event } from "@/types/event";
import EventCard from "@/components/EventCard";
import DateBlock from "@/components/DateBlock";
import { EmptyState, ErrorMessage } from "@/components/Message";
import { capitalize, formatDateTime } from "@/lib/format";

export const dynamic = "force-dynamic"; // always ask the API, never cache

export default async function HomePage() {
  let upcoming: Event[] = [];
  let error: string | null = null;
  try {
    upcoming = await getUpcomingEvents();
  } catch (e) {
    error = e instanceof Error ? e.message : "Could not load upcoming events.";
  }

  const next = upcoming[0];
  const rest = upcoming.slice(0, 3);

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <h1>Discover what&rsquo;s happening on campus</h1>
            <p>
              Workshops, tournaments, career fairs and cultural nights, all in one place.
              Find something to join this week or put your own event on the board.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-accent" href="/events">Explore Events</Link>
              <Link className="btn btn-light" href="/create-event">Create an event</Link>
            </div>
          </div>

          {next && (
            <Link href={`/events/${next.id}`} className="nextup">
              <span className="nextup-label">Next on campus</span>
              <div className="nextup-main">
                <DateBlock iso={next.eventDate} />
                <div>
                  <h2>{next.title}</h2>
                  <p>{formatDateTime(next.eventDate)}</p>
                  <p>{next.location} &middot; {capitalize(next.category)}</p>
                </div>
              </div>
            </Link>
          )}
        </div>
      </section>

      <section className="container page">
        <div className="section-head">
          <h2>Upcoming events</h2>
          <Link href="/events" className="link-arrow">View all events</Link>
        </div>

        {error ? (
          <ErrorMessage title="We couldn't load upcoming events" message={error} />
        ) : rest.length === 0 ? (
          <EmptyState message="No events found. Check back later!" />
        ) : (
          <div className="grid">
            {rest.map((event) => <EventCard key={event.id} event={event} />)}
          </div>
        )}
      </section>
    </>
  );
}
