import Link from "next/link";
import type { Event } from "@/types/event";
import { capitalize, formatDateTime } from "@/lib/format";
import DateBlock from "./DateBlock";
import StatusBadge from "./StatusBadge";

export default function EventCard({ event }: { event: Event }) {
  return (
    <article className="card" data-category={event.category}>
      <DateBlock iso={event.eventDate} />
      <div className="card-body">
        <div className="card-tags">
          <span className="tag">{capitalize(event.category)}</span>
          <StatusBadge isPublished={event.isPublished} />
        </div>
        <h3 className="card-title">{event.title}</h3>
        <p className="card-desc">{event.description}</p>
        <dl className="meta">
          <div>
            <dt>When</dt>
            <dd>{formatDateTime(event.eventDate)}</dd>
          </div>
          <div>
            <dt>Where</dt>
            <dd>{event.location}</dd>
          </div>
        </dl>
        <Link className="btn btn-outline" href={`/events/${event.id}`}>
          View Details
        </Link>
      </div>
    </article>
  );
}
