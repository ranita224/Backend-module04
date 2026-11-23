"use client";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: Props) {
  return (
    <div className="searchbar">
      <label htmlFor="search" className="sr-only">
        Search events by title
      </label>
      <input
        id="search"
        type="search"
        placeholder="Search events by title..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
