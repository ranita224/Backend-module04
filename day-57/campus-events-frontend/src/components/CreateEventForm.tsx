"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createEvent } from "@/services/eventService";
import { CATEGORIES, TIME_ZONE, capitalize, localInputToIso } from "@/lib/format";
import type { Event } from "@/types/event";

interface FormState {
  title: string;
  description: string;
  location: string;
  eventDate: string;
  category: string;
  isPublished: boolean;
}

const EMPTY: FormState = {
  title: "", description: "", location: "", eventDate: "", category: "", isPublished: false,
};

type Errors = Partial<Record<keyof FormState, string>>;

function validate(f: FormState): Errors {
  const errors: Errors = {};
  if (!f.title.trim()) errors.title = "Enter a title for the event.";
  if (!f.description.trim()) errors.description = "Add a short description.";
  if (!f.location.trim()) errors.location = "Say where the event takes place.";
  if (!f.eventDate) errors.eventDate = "Choose the date and time.";
  if (!f.category) errors.category = "Pick a category.";
  return errors;
}

export default function CreateEventForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [created, setCreated] = useState<Event | null>(null);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // stop the browser's own form submission
    setApiError(null);

    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      // Send exactly the six fields the API expects, nothing more.
      const event = await createEvent({
        title: form.title.trim(),
        description: form.description.trim(),
        location: form.location.trim(),
        eventDate: localInputToIso(form.eventDate),
        category: form.category,
        isPublished: form.isPublished,
      });
      setCreated(event);
      setForm(EMPTY);
      router.refresh(); // make sure lists fetch the new event
      setTimeout(() => router.push(`/events/${event.id}`), 1800);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Could not create the event.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      {created && (
        <div className="notice notice-success" role="status">
          <strong>Event created!</strong>
          <p>
            &ldquo;{created.title}&rdquo; was saved as {created.id}. Taking you to its page...{" "}
            <Link href={`/events/${created.id}`}>Go now</Link>
          </p>
        </div>
      )}
      {apiError && (
        <div className="notice notice-error" role="alert">
          <strong>The event was not created</strong>
          <p>{apiError}</p>
        </div>
      )}
      {Object.keys(errors).length > 0 && (
        <div className="notice notice-error" role="alert">
          <strong>Please fix the highlighted fields.</strong>
        </div>
      )}

      <div className={`field ${errors.title ? "has-error" : ""}`}>
        <label htmlFor="title">Title</label>
        <input id="title" type="text" value={form.title}
          aria-invalid={!!errors.title} aria-describedby={errors.title ? "title-err" : undefined}
          onChange={(e) => set("title", e.target.value)} />
        {errors.title && <p className="error-text" id="title-err">{errors.title}</p>}
      </div>

      <div className={`field ${errors.description ? "has-error" : ""}`}>
        <label htmlFor="description">Description</label>
        <textarea id="description" rows={5} value={form.description}
          aria-invalid={!!errors.description} aria-describedby={errors.description ? "description-err" : undefined}
          onChange={(e) => set("description", e.target.value)} />
        {errors.description && <p className="error-text" id="description-err">{errors.description}</p>}
      </div>

      <div className="form-row">
        <div className={`field ${errors.location ? "has-error" : ""}`}>
          <label htmlFor="form-location">Location</label>
          <input id="form-location" type="text" value={form.location}
            aria-invalid={!!errors.location} aria-describedby={errors.location ? "location-err" : undefined}
            onChange={(e) => set("location", e.target.value)} />
          {errors.location && <p className="error-text" id="location-err">{errors.location}</p>}
        </div>

        <div className={`field ${errors.category ? "has-error" : ""}`}>
          <label htmlFor="form-category">Category</label>
          <select id="form-category" value={form.category}
            aria-invalid={!!errors.category} aria-describedby={errors.category ? "category-err" : undefined}
            onChange={(e) => set("category", e.target.value)}>
            <option value="">Select a category</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{capitalize(c)}</option>)}
          </select>
          {errors.category && <p className="error-text" id="category-err">{errors.category}</p>}
        </div>
      </div>

      <div className={`field ${errors.eventDate ? "has-error" : ""}`}>
        <label htmlFor="eventDate">Event date and time</label>
        <input id="eventDate" type="datetime-local" value={form.eventDate}
          aria-invalid={!!errors.eventDate} aria-describedby="date-hint"
          onChange={(e) => set("eventDate", e.target.value)} />
        <p className="hint" id="date-hint">Time zone: {TIME_ZONE}</p>
        {errors.eventDate && <p className="error-text">{errors.eventDate}</p>}
      </div>

      <label className="check" htmlFor="isPublished">
        <input id="isPublished" type="checkbox" checked={form.isPublished}
          onChange={(e) => set("isPublished", e.target.checked)} />
        <span>Publish this event now (unticked events are saved as drafts)</span>
      </label>

      <button type="submit" className="btn" disabled={submitting || !!created}>
        {submitting ? "Creating..." : "Create event"}
      </button>
    </form>
  );
}
