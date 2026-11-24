import { NotFoundMessage } from "@/components/Message";

export default function NotFound() {
  return (
    <NotFoundMessage
      title="Page not found"
      message="We couldn't find the page you were looking for."
      backHref="/"
      backLabel="Back to home"
    />
  );
}
