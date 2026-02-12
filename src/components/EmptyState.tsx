import { ClipboardList, Search, CheckCircle2 } from "lucide-react";
import { FilterType } from "@/hooks/useTasks";

interface EmptyStateProps {
  filter: FilterType;
  hasSearch: boolean;
}

export function EmptyState({ filter, hasSearch }: EmptyStateProps) {
  if (hasSearch) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
          <Search className="w-6 h-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground">No results found</p>
        <p className="text-xs text-muted-foreground mt-1">Try a different search term</p>
      </div>
    );
  }

  if (filter === "completed") {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-6 h-6 text-primary" />
        </div>
        <p className="text-sm font-medium text-foreground">No completed tasks yet</p>
        <p className="text-xs text-muted-foreground mt-1">Finish a task to see it here</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
        <ClipboardList className="w-6 h-6 text-primary" />
      </div>
      <p className="text-sm font-medium text-foreground">
        {filter === "active" ? "All caught up!" : "Start your day"}
      </p>
      <p className="text-xs text-muted-foreground mt-1">
        {filter === "active" ? "No active tasks remaining" : "Add your first task above"}
      </p>
    </div>
  );
}
