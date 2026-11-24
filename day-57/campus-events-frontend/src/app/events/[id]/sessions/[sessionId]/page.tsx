import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ApiError, getEventById, getSessionById } from "@/services/eventService";
import type { Event, Session } from "@/types/event";
import StatusBadge from "@/components/StatusBadge";
import { ErrorMessage } from "@/components/Message";
import { capitalize, formatDate, formatDateTime, formatTime } from "@/lib/format";

export const metadata: Metadata = { title: "Session" };
export const dynamic = "force-dynamic";

export default async function SessionPage({ params }: { params: Promise<{ id: string; sessionId: string }> }) {
  const { id, sessionId } = await params;

  let event: Event;
  let session: Session;
  try {
    [event, session] = await Promise.all([getEventById(id), getSessionById(id, sessionId)]);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    return (
      <div className="container page">
        <ErrorMessage title="We couldn't load this session" message={e instanceof Error ? e.message : "Unexpected error."} />
        <Link className="btn btn-outline" href={`/events/${id}`} style={{ marginTop: "1rem" }}>Back to the event</Link>
      </div>
    );
  }

  return (
    <div className="container page">
      <Link href={`/events/${event.id}`} className="back">&larr; {event.title}</Link>

      <article className="detail">
        <h1>{session.title}</h1>
        <dl className="meta meta-lg">
          <div><dt>Date</dt><dd>{formatDate(session.startsAt)}</dd></div>
          <div><dt>Starts</dt><dd>{formatTime(session.startsAt)}</dd></div>
          <div><dt>Ends</dt><dd>{formatTime(session.endsAt)}</dd></div>
          <div><dt>Room</dt><dd>{session.room}</dd></div>
        </dl>
      </article>

      <aside className="related" data-category={event.category}>
        <h2>Part of this event</h2>
        <div className="card-tags">
          <span className="tag">{capitalize(event.category)}</span>
          <StatusBadge isPublished={event.isPublished} />
        </div>
        <h3>{event.title}</h3>
        <p>{event.description}</p>
        <p className="muted">{formatDateTime(event.eventDate)} &middot; {event.location}</p>
        <Link className="btn btn-outline" href={`/events/${event.id}`}>View event</Link>
      </aside>
    </div>
  );
}
