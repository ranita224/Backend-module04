import { NotFoundMessage } from "@/components/Message";

export default function SessionNotFound() {
  return (
    <NotFoundMessage
      title="Session not found"
      message="This session doesn't exist, or it doesn't belong to that event."
      backHref="/events"
      backLabel="Browse all events"
    />
  );
}
