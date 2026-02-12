import { useState, useEffect, useCallback, useMemo } from "react";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string | null;
  createdAt: string;
}

export type FilterType = "all" | "active" | "completed";

const STORAGE_KEY = "day2day-tasks";

function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTasks(tasks: Task[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const addTask = useCallback((title: string, dueDate: string | null) => {
    const task: Task = {
      id: crypto.randomUUID(),
      title: title.trim(),
      completed: false,
      dueDate,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [task, ...prev]);
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const editTask = useCallback((id: string, title: string, dueDate: string | null) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, title: title.trim(), dueDate } : t))
    );
  }, []);

  const filteredTasks = useMemo(() => {
    let result = tasks;

    if (filter === "active") result = result.filter((t) => !t.completed);
    if (filter === "completed") result = result.filter((t) => t.completed);

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((t) => t.title.toLowerCase().includes(q));
    }

    // Sort: incomplete with due dates first (by date), then incomplete without dates, then completed
    return result.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      if (a.dueDate && b.dueDate) return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [tasks, filter, search]);

  const counts = useMemo(() => ({
    all: tasks.length,
    active: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
  }), [tasks]);

  return { tasks: filteredTasks, counts, filter, setFilter, search, setSearch, addTask, toggleTask, deleteTask, editTask };
}
