import { useState, useRef, useEffect } from "react";
import { Check, Trash2, Pencil, Calendar } from "lucide-react";
import { Task } from "@/hooks/useTasks";
import { format, isPast, isToday } from "date-fns";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string, dueDate: string | null, category?: string) => void;
  categories: string[];
}

export function TaskItem({ task, onToggle, onDelete, onEdit, categories }: TaskItemProps) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDate, setEditDate] = useState(task.dueDate || "");
  const [editCat, setEditCat] = useState(task.category || "Personal");
  const [exiting, setExiting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const handleSave = () => {
    if (editTitle.trim()) onEdit(task.id, editTitle, editDate || null, editCat);
    setEditing(false);
  };

  const handleDelete = () => {
    setExiting(true);
    setTimeout(() => onDelete(task.id), 200);
  };

  const dueDateLabel = task.dueDate
    ? isToday(new Date(task.dueDate)) ? "Today" : format(new Date(task.dueDate), "MMM d")
    : null;

  const isOverdue = task.dueDate && !task.completed && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate));

  return (
    <div className={`group bg-card rounded-xl border border-border p-3 flex items-start gap-3 transition-all duration-200 hover:shadow-sm ${exiting ? "task-exit" : "task-enter"}`}>
      <button
        onClick={() => onToggle(task.id)}
        className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
          task.completed ? "bg-primary border-primary check-pop" : "border-border hover:border-primary"
        }`}
        aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
      >
        {task.completed && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
      </button>

      <div className="flex-1 min-w-0">
        {editing ? (
          <div className="flex flex-col gap-2">
            <input ref={inputRef} value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") setEditing(false); }}
              className="bg-muted rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring w-full" />
            <div className="flex gap-2">
              <input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)}
                className="bg-muted rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring flex-1" />
              <select value={editCat} onChange={(e) => setEditCat(e.target.value)}
                className="bg-muted rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring flex-1">
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={handleSave} className="text-xs font-medium text-primary hover:underline">Save</button>
              <button onClick={() => setEditing(false)} className="text-xs font-medium text-muted-foreground hover:underline">Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <p className={`text-sm font-medium leading-snug transition-all ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
              {task.title}
            </p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {task.category && (
                <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">{task.category}</span>
              )}
              {dueDateLabel && (
                <span className={`inline-flex items-center gap-1 text-xs font-medium ${isOverdue ? "text-destructive" : "text-muted-foreground"}`}>
                  <Calendar className="w-3 h-3" />
                  {dueDateLabel}{isOverdue && " · Overdue"}
                </span>
              )}
            </div>
          </>
        )}
      </div>

      {!editing && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => { setEditTitle(task.title); setEditDate(task.dueDate || ""); setEditCat(task.category || "Personal"); setEditing(true); }}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" aria-label="Edit task">
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button onClick={handleDelete}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" aria-label="Delete task">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
