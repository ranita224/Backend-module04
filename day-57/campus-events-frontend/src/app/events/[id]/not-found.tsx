import { NotFoundMessage } from "@/components/Message";

export default function EventNotFound() {
  return (
    <NotFoundMessage
      title="Event not found"
      message="We couldn't find an event with that ID. It may have been removed, or the link may be wrong."
      backHref="/events"
      backLabel="Browse all events"
    />
  );
}
