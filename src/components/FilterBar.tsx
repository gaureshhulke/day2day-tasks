import { FilterType } from "@/hooks/useTasks";

interface FilterBarProps {
  filter: FilterType;
  onFilter: (f: FilterType) => void;
  counts: { all: number; active: number; completed: number };
}

const filters: { key: FilterType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Done" },
];

export function FilterBar({ filter, onFilter, counts }: FilterBarProps) {
  return (
    <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
      {filters.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onFilter(key)}
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            filter === key
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {label}
          <span className={`ml-1.5 text-xs ${filter === key ? "text-primary" : "text-muted-foreground"}`}>
            {counts[key]}
          </span>
        </button>
      ))}
    </div>
  );
}
