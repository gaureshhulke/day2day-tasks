import { useState, forwardRef } from "react";
import { Plus, Calendar, Tag } from "lucide-react";

interface TaskInputProps {
  onAdd: (title: string, dueDate: string | null, category: string) => void;
  categories: string[];
}

export const TaskInput = forwardRef<HTMLInputElement, TaskInputProps>(({ onAdd, categories }, ref) => {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState(categories[0] || "Personal");
  const [showOptions, setShowOptions] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title, dueDate || null, category);
    setTitle("");
    setDueDate("");
    setShowOptions(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-xl shadow-sm border border-border p-3 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <button
          type="submit"
          className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Add task"
        >
          <Plus className="w-5 h-5" />
        </button>
        <input
          ref={ref}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-base font-medium"
          aria-label="Task title"
        />
        <button
          type="button"
          onClick={() => setShowOptions(!showOptions)}
          className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${showOptions ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
          aria-label="Task options"
        >
          <Tag className="w-4 h-4" />
        </button>
      </div>
      {showOptions && (
        <div className="flex items-center gap-2 ml-12 flex-wrap">
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="bg-muted rounded-lg px-3 py-1.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            aria-label="Due date"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-muted rounded-lg px-3 py-1.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            aria-label="Category"
          >
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      )}
    </form>
  );
});

TaskInput.displayName = "TaskInput";
