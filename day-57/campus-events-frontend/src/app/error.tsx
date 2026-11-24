"use client";

import { ErrorMessage } from "@/components/Message";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container page">
      <ErrorMessage title="Something went wrong" message={error.message || "Unexpected error."} />
      <button className="btn" onClick={reset} style={{ marginTop: "1rem" }}>Try again</button>
    </div>
  );
}
