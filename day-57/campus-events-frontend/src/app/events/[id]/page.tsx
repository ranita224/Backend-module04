import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ApiError, getEventById, getEventSessions } from "@/services/eventService";
import type { Event, Session } from "@/types/event";
import DateBlock from "@/components/DateBlock";
import StatusBadge from "@/components/StatusBadge";
import { EmptyState, ErrorMessage } from "@/components/Message";
import { capitalize, formatDate, formatDateTime, formatTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    return { title: (await getEventById(id)).title };
  } catch {
    return { title: "Event" };
  }
}

export default async function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let event: Event;
  let sessions: Session[] = [];

  try {
    // Both requests use the ID from the URL.
    [event, sessions] = await Promise.all([getEventById(id), getEventSessions(id)]);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    return (
      <div className="container page">
        <ErrorMessage
          title="We couldn't load this event"
          message={e instanceof Error ? e.message : "Unexpected error."}
        />
        <Link className="btn btn-outline" href="/events" style={{ marginTop: "1rem" }}>Back to events</Link>
      </div>
    );
  }

  return (
    <div className="container page">
      <Link href="/events" className="back">&larr; All events</Link>

      <article className="detail" data-category={event.category}>
        <header className="detail-head">
          <DateBlock iso={event.eventDate} />
          <div>
            <div className="card-tags">
              <span className="tag">{capitalize(event.category)}</span>
              <StatusBadge isPublished={event.isPublished} />
            </div>
            <h1>{event.title}</h1>
          </div>
        </header>

        <p className="detail-desc">{event.description}</p>

        <dl className="meta meta-lg">
          <div><dt>Date and time</dt><dd>{formatDateTime(event.eventDate)}</dd></div>
          <div><dt>Location</dt><dd>{event.location}</dd></div>
          <div><dt>Category</dt><dd>{capitalize(event.category)}</dd></div>
          <div><dt>Status</dt><dd>{event.isPublished ? "Published" : "Draft"}</dd></div>
        </dl>
      </article>

      <section className="sessions">
        <h2>Sessions</h2>
        {sessions.length === 0 ? (
          <EmptyState message="No sessions have been added to this event yet." />
        ) : (
          <ul className="session-list">
            {sessions.map((s) => (
              <li key={s.id}>
                <Link href={`/events/${event.id}/sessions/${s.id}`} className="session">
                  <div className="session-time">
                    <strong>{formatTime(s.startsAt)}</strong>
                    <span>{formatTime(s.endsAt)}</span>
                  </div>
                  <div className="session-info">
                    <h3>{s.title}</h3>
                    <p>{formatDate(s.startsAt)} &middot; {s.room}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
