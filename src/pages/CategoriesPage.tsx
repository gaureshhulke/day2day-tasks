import { useState } from "react";
import { Task } from "@/hooks/useTasks";
import { Plus, Trash2, FolderOpen, CheckCircle2, Circle } from "lucide-react";

interface CategoriesPageProps {
  tasks: Task[];
  categories: string[];
  onAddCategory: (name: string) => void;
  onDeleteCategory: (name: string) => void;
}

export default function CategoriesPage({ tasks, categories, onAddCategory, onDeleteCategory }: CategoriesPageProps) {
  const [newCat, setNewCat] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCat.trim() && !categories.includes(newCat.trim())) {
      onAddCategory(newCat.trim());
      setNewCat("");
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Categories</h1>
        <p className="text-sm text-muted-foreground">Organize your tasks</p>
      </header>

      {/* Add category */}
      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
          placeholder="New category..."
          className="flex-1 bg-card border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
          aria-label="Add category"
        >
          <Plus className="w-5 h-5" />
        </button>
      </form>

      {/* Category list */}
      <div className="space-y-3">
        {categories.map((cat) => {
          const catTasks = tasks.filter((t) => (t.category || "Personal") === cat);
          const completed = catTasks.filter((t) => t.completed).length;
          const total = catTasks.length;

          return (
            <div key={cat} className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground">{cat}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground">{total} task{total !== 1 ? "s" : ""}</span>
                    {total > 0 && (
                      <>
                        <span className="text-xs text-muted-foreground">·</span>
                        <span className="text-xs text-primary font-medium">{completed} done</span>
                      </>
                    )}
                  </div>
                </div>
                {!["Personal", "Work", "Study", "Health"].includes(cat) && (
                  <button
                    onClick={() => onDeleteCategory(cat)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    aria-label={`Delete ${cat}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              {total > 0 && (
                <div className="mt-3 w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(completed / total) * 100}%` }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
