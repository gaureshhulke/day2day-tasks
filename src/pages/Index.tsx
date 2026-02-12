import { useEffect, useRef, useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import { TaskInput } from "@/components/TaskInput";
import { TaskItem } from "@/components/TaskItem";
import { FilterBar } from "@/components/FilterBar";
import { SearchBar } from "@/components/SearchBar";
import { EmptyState } from "@/components/EmptyState";
import { CheckCircle2 } from "lucide-react";
import CalendarPage from "@/pages/CalendarPage";
import StatsPage from "@/pages/StatsPage";
import CategoriesPage from "@/pages/CategoriesPage";
import SettingsPage from "@/pages/SettingsPage";

interface IndexProps {
  page?: "calendar" | "stats" | "categories" | "settings";
}

const Index = ({ page }: IndexProps) => {
  const { tasks, allTasks, counts, filter, setFilter, search, setSearch, addTask, toggleTask, deleteTask, editTask, categories, addCategory, deleteCategory } = useTasks();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = () => inputRef.current?.focus();
    window.addEventListener("day2day:focus-input", handler);
    return () => window.removeEventListener("day2day:focus-input", handler);
  }, []);

  if (page === "calendar") return <CalendarPage tasks={allTasks} />;
  if (page === "stats") return <StatsPage tasks={allTasks} />;
  if (page === "categories") return <CategoriesPage tasks={allTasks} categories={categories} onAddCategory={addCategory} onDeleteCategory={deleteCategory} />;
  if (page === "settings") return <SettingsPage />;

  const displayName = localStorage.getItem("day2day-name");

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Day2Day</h1>
        </div>
        <p className="text-sm text-muted-foreground ml-10">
          {displayName ? `Hey ${displayName}! Stay focused.` : "Stay focused. Get it done."}
        </p>
      </header>

      <div className="mb-5">
        <TaskInput onAdd={addTask} categories={categories} ref={inputRef} />
      </div>

      <div className="space-y-3 mb-5">
        <SearchBar value={search} onChange={setSearch} />
        <FilterBar filter={filter} onFilter={setFilter} counts={counts} />
      </div>

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
              categories={categories}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Index;
