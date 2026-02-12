import { useState } from "react";
import { Plus, Calendar } from "lucide-react";

interface TaskInputProps {
  onAdd: (title: string, dueDate: string | null) => void;
}

export function TaskInput({ onAdd }: TaskInputProps) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [showDate, setShowDate] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title, dueDate || null);
    setTitle("");
    setDueDate("");
    setShowDate(false);
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
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-base font-medium"
          aria-label="Task title"
        />
        <button
          type="button"
          onClick={() => setShowDate(!showDate)}
          className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${showDate ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
          aria-label="Set due date"
        >
          <Calendar className="w-4 h-4" />
        </button>
      </div>
      {showDate && (
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="ml-12 bg-muted rounded-lg px-3 py-1.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          aria-label="Due date"
        />
      )}
    </form>
  );
}
