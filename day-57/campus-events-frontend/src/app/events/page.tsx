import type { Metadata } from "next";
import { getEvents } from "@/services/eventService";
import type { PaginatedEvents } from "@/types/event";
import EventFilters from "@/components/EventFilters";
import EventsResults from "@/components/EventsResults";
import Pagination from "@/components/Pagination";
import { EmptyState, ErrorMessage } from "@/components/Message";

export const metadata: Metadata = { title: "All Events" };
export const dynamic = "force-dynamic";

type SearchParams = Record<string, string | string[] | undefined>;

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function EventsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const params = {
    category: first(sp.category),
    location: first(sp.location),
    isPublished: first(sp.isPublished),
    sortBy: first(sp.sortBy),
    order: first(sp.order),
    page: first(sp.page),
    limit: first(sp.limit),
  };

  let data: PaginatedEvents | null = null;
  let error: string | null = null;
  try {
    data = await getEvents(params);
  } catch (e) {
    error = e instanceof Error ? e.message : "Could not load events.";
  }

  return (
    <div className="container page">
      <div className="section-head">
        <h1>All events</h1>
      </div>

      <EventFilters />

      {error ? (
        <ErrorMessage title="We couldn't load events" message={error} />
      ) : !data || data.items.length === 0 ? (
        <EmptyState message="No events found. Check back later!" />
      ) : (
        <>
          {/* key resets the search box when the page or filters change */}
          <EventsResults key={JSON.stringify(params)} events={data.items} />
          <Pagination page={data.page} totalPages={data.totalPages} total={data.total} params={params} />
        </>
      )}
    </div>
  );
}
