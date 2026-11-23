import Link from "next/link";

export function ErrorMessage({
  title = "Something went wrong",
  message,
}: {
  title?: string;
  message: string;
}) {
  return (
    <div className="notice notice-error" role="alert">
      <strong>{title}</strong>
      <p>{message}</p>
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="empty">
      <p>{message}</p>
    </div>
  );
}

export function NotFoundMessage({
  title,
  message,
  backHref,
  backLabel,
}: {
  title: string;
  message: string;
  backHref: string;
  backLabel: string;
}) {
  return (
    <div className="container page">
      <div className="empty empty-lg">
        <h1>{title}</h1>
        <p>{message}</p>
        <Link className="btn" href={backHref}>
          {backLabel}
        </Link>
      </div>
    </div>
  );
}
