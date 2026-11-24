"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CATEGORIES, capitalize } from "@/lib/format";

/**
 * Filters and sorting live in the URL (?category=...&sortBy=...).
 * Changing one pushes a new URL, and the server page re-fetches from the API
 * with those query parameters.
 */
export default function EventFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [location, setLocation] = useState(searchParams.get("location") ?? "");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function update(changes: Record<string, string>) {
    const next = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    next.delete("page"); // a new filter always starts at page 1
    startTransition(() => {
      const qs = next.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    });
  }

  // Wait until the user stops typing before asking the API.
  function onLocationChange(value: string) {
    setLocation(value);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => update({ location: value.trim() }), 450);
  }
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  function reset() {
    setLocation("");
    startTransition(() => router.push(pathname));
  }

  const hasFilters = searchParams.toString() !== "";

  return (
    <form className="filters" onSubmit={(e) => e.preventDefault()} aria-busy={isPending}>
      <div className="field">
        <label htmlFor="category">Category</label>
        <select id="category" value={searchParams.get("category") ?? ""}
          onChange={(e) => update({ category: e.target.value })}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{capitalize(c)}</option>)}
        </select>
      </div>

      <div className="field">
        <label htmlFor="location">Location</label>
        <input id="location" type="text" placeholder="e.g. Main Hall" value={location}
          onChange={(e) => onLocationChange(e.target.value)} />
      </div>

      <div className="field">
        <label htmlFor="isPublished">Status</label>
        <select id="isPublished" value={searchParams.get("isPublished") ?? ""}
          onChange={(e) => update({ isPublished: e.target.value })}>
          <option value="">All</option>
          <option value="true">Published</option>
          <option value="false">Draft</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="sortBy">Sort by</label>
        <select id="sortBy" value={searchParams.get("sortBy") ?? ""}
          onChange={(e) => update({ sortBy: e.target.value })}>
          <option value="">Default</option>
          <option value="eventDate">Event date</option>
          <option value="title">Title</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="order">Order</label>
        <select id="order" value={searchParams.get("order") ?? ""}
          onChange={(e) => update({ order: e.target.value })}>
          <option value="">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <div className="field field-action">
        <button type="button" className="btn btn-ghost" onClick={reset} disabled={!hasFilters}>
          Clear filters
        </button>
      </div>
    </form>
  );
}
