import { dateParts } from "@/lib/format";

export default function DateBlock({ iso }: { iso: string }) {
  const { day, month } = dateParts(iso);
  return (
    <div className="dateblock" aria-hidden="true">
      <span className="dateblock-day">{day}</span>
      <span className="dateblock-month">{month}</span>
    </div>
  );
}
