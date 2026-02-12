import { useMemo } from "react";
import { Task } from "@/hooks/useTasks";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isToday, isSameDay } from "date-fns";
import { useState } from "react";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";

interface CalendarPageProps {
  tasks: Task[];
}

export default function CalendarPage({ tasks }: CalendarPageProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const days = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const startDayOfWeek = getDay(days[0]);

  const tasksByDate = useMemo(() => {
    const map = new Map<string, Task[]>();
    tasks.forEach((t) => {
      if (t.dueDate) {
        const key = t.dueDate;
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(t);
      }
    });
    return map;
  }, [tasks]);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const selectedTasks = useMemo(() => {
    if (!selectedDate) return [];
    const key = format(selectedDate, "yyyy-MM-dd");
    return tasksByDate.get(key) || [];
  }, [selectedDate, tasksByDate]);

  const prevMonth = () => setCurrentMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Calendar</h1>
        <p className="text-sm text-muted-foreground">View tasks by date</p>
      </header>

      {/* Month navigator */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold text-foreground">{format(currentMonth, "MMMM yyyy")}</h2>
        <button onClick={nextMonth} className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const dayTasks = tasksByDate.get(key) || [];
          const hasTask = dayTasks.length > 0;
          const allDone = hasTask && dayTasks.every((t) => t.completed);
          const isSelected = selectedDate && isSameDay(day, selectedDate);

          return (
            <button
              key={key}
              onClick={() => setSelectedDate(day)}
              className={`relative aspect-square rounded-xl flex flex-col items-center justify-center text-sm font-medium transition-all
                ${isToday(day) ? "ring-2 ring-primary" : ""}
                ${isSelected ? "bg-primary text-primary-foreground" : "hover:bg-muted"}
              `}
            >
              {day.getDate()}
              {hasTask && (
                <span className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${
                  isSelected ? "bg-primary-foreground" : allDone ? "bg-primary" : "bg-primary/50"
                }`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected date tasks */}
      {selectedDate && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-foreground mb-3">{format(selectedDate, "EEEE, MMM d")}</h3>
          {selectedTasks.length === 0 ? (
            <p className="text-sm text-muted-foreground">No tasks for this date</p>
          ) : (
            <div className="space-y-2">
              {selectedTasks.map((t) => (
                <div key={t.id} className="flex items-center gap-3 bg-card rounded-xl border border-border p-3">
                  <CheckCircle2 className={`w-4 h-4 shrink-0 ${t.completed ? "text-primary" : "text-muted-foreground"}`} />
                  <span className={`text-sm ${t.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>{t.title}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{t.category}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
