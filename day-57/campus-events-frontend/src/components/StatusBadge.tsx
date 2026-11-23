export default function StatusBadge({ isPublished }: { isPublished: boolean }) {
  return (
    <span className={`badge ${isPublished ? "badge-live" : "badge-draft"}`}>
      {isPublished ? "Published" : "Draft"}
    </span>
  );
}
