import { useTasks } from "@/hooks/useTasks";
import { TaskInput } from "@/components/TaskInput";
import { TaskItem } from "@/components/TaskItem";
import { FilterBar } from "@/components/FilterBar";
import { SearchBar } from "@/components/SearchBar";
import { EmptyState } from "@/components/EmptyState";
import { CheckCircle2 } from "lucide-react";

const Index = () => {
  const { tasks, counts, filter, setFilter, search, setSearch, addTask, toggleTask, deleteTask, editTask } = useTasks();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <CheckCircle2 className="w-4.5 h-4.5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Day2Day</h1>
          </div>
          <p className="text-sm text-muted-foreground ml-10">Stay focused. Get it done.</p>
        </header>

        {/* Add Task */}
        <div className="mb-5">
          <TaskInput onAdd={addTask} />
        </div>

        {/* Search + Filter */}
        <div className="space-y-3 mb-5">
          <SearchBar value={search} onChange={setSearch} />
          <FilterBar filter={filter} onFilter={setFilter} counts={counts} />
        </div>

        {/* Task List */}
        {tasks.length === 0 ? (
          <EmptyState filter={filter} hasSearch={!!search.trim()} />
        ) : (
          <div className="space-y-2">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onDelete={deleteTask}
                onEdit={editTask}
              />
            ))}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center">
          <p className="text-xs text-muted-foreground tracking-widest uppercase">Day2Day Productivity</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
