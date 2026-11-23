import type { Metadata } from "next";
import CreateEventForm from "@/components/CreateEventForm";

export const metadata: Metadata = { title: "Create Event" };

export default function CreateEventPage() {
  return (
    <div className="container page page-narrow">
      <div className="section-head"><h1>Create an event</h1></div>
      <p className="lead">Fill in the details below. Events saved as drafts stay hidden from the published filter until you publish them.</p>
      <CreateEventForm />
    </div>
  );
}
