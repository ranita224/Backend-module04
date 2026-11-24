import Link from "next/link";

interface Props {
  page: number;
  totalPages: number;
  total: number;
  /** Current query string values, so filters survive page changes. */
  params: Record<string, string | undefined>;
}

function hrefFor(params: Props["params"], page: number) {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v && k !== "page") qs.set(k, v);
  if (page > 1) qs.set("page", String(page));
  const s = qs.toString();
  return `/events${s ? `?${s}` : ""}`;
}

export default function Pagination({ page, totalPages, total, params }: Props) {
  if (totalPages <= 1) {
    return <p className="pagination-info">{total} event{total === 1 ? "" : "s"}</p>;
  }
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <nav className="pagination" aria-label="Pagination">
      <p className="pagination-info">
        Page {page} of {totalPages} &middot; {total} events
      </p>
      <ul>
        <li>
          {page > 1 ? (
            <Link href={hrefFor(params, page - 1)} rel="prev">Previous</Link>
          ) : (
            <span className="disabled">Previous</span>
          )}
        </li>
        {pages.map((p) => (
          <li key={p}>
            <Link
              href={hrefFor(params, p)}
              className={p === page ? "current" : undefined}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </Link>
          </li>
        ))}
        <li>
          {page < totalPages ? (
            <Link href={hrefFor(params, page + 1)} rel="next">Next</Link>
          ) : (
            <span className="disabled">Next</span>
          )}
        </li>
      </ul>
    </nav>
  );
}
