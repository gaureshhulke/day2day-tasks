import { useMemo } from "react";
import { Task } from "@/hooks/useTasks";
import { CheckCircle2, Circle, TrendingUp, Calendar, Target } from "lucide-react";
import { startOfWeek, endOfWeek, eachDayOfInterval, format, isSameDay, subDays } from "date-fns";

interface StatsPageProps {
  tasks: Task[];
}

export default function StatsPage({ tasks }: StatsPageProps) {
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const active = total - completed;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Weekly breakdown (last 7 days)
    const today = new Date();
    const last7 = Array.from({ length: 7 }, (_, i) => {
      const day = subDays(today, 6 - i);
      const dayTasks = tasks.filter((t) => isSameDay(new Date(t.createdAt), day));
      const dayCompleted = tasks.filter((t) => t.completed && isSameDay(new Date(t.createdAt), day));
      return { day, label: format(day, "EEE"), total: dayTasks.length, completed: dayCompleted.length };
    });

    // Category breakdown
    const byCategory = new Map<string, { total: number; completed: number }>();
    tasks.forEach((t) => {
      const cat = t.category || "Personal";
      if (!byCategory.has(cat)) byCategory.set(cat, { total: 0, completed: 0 });
      const entry = byCategory.get(cat)!;
      entry.total++;
      if (t.completed) entry.completed++;
    });

    // Streak
    let streak = 0;
    for (let i = 0; i < 30; i++) {
      const day = subDays(today, i);
      const dayCompleted = tasks.filter((t) => t.completed && isSameDay(new Date(t.createdAt), day));
      if (dayCompleted.length > 0) streak++;
      else break;
    }

    return { total, completed, active, rate, last7, byCategory, streak };
  }, [tasks]);

  const maxDaily = Math.max(...stats.last7.map((d) => d.total), 1);

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Statistics</h1>
        <p className="text-sm text-muted-foreground">Your productivity overview</p>
      </header>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { icon: Target, label: "Total Tasks", value: stats.total, color: "text-primary" },
          { icon: CheckCircle2, label: "Completed", value: stats.completed, color: "text-primary" },
          { icon: Circle, label: "Active", value: stats.active, color: "text-muted-foreground" },
          { icon: TrendingUp, label: "Streak", value: `${stats.streak}d`, color: "text-primary" },
        ].map((s) => (
          <div key={s.label} className="bg-card rounded-xl border border-border p-4">
            <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Completion rate */}
      <div className="bg-card rounded-xl border border-border p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-foreground">Completion Rate</span>
          <span className="text-sm font-bold text-primary">{stats.rate}%</span>
        </div>
        <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${stats.rate}%` }}
          />
        </div>
      </div>

      {/* Weekly chart */}
      <div className="bg-card rounded-xl border border-border p-4 mb-6">
        <h3 className="text-sm font-medium text-foreground mb-4">Last 7 Days</h3>
        <div className="flex items-end gap-2 h-24">
          {stats.last7.map((d) => (
            <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex flex-col items-center justify-end" style={{ height: 80 }}>
                <div
                  className="w-full max-w-[28px] bg-primary/20 rounded-t-md relative overflow-hidden transition-all"
                  style={{ height: `${(d.total / maxDaily) * 100}%`, minHeight: d.total > 0 ? 8 : 2 }}
                >
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-md transition-all"
                    style={{ height: d.total > 0 ? `${(d.completed / d.total) * 100}%` : "0%" }}
                  />
                </div>
              </div>
              <span className="text-[10px] text-muted-foreground font-medium">{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* By category */}
      {stats.byCategory.size > 0 && (
        <div className="bg-card rounded-xl border border-border p-4">
          <h3 className="text-sm font-medium text-foreground mb-3">By Category</h3>
          <div className="space-y-3">
            {Array.from(stats.byCategory.entries()).map(([cat, data]) => (
              <div key={cat}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-foreground">{cat}</span>
                  <span className="text-xs text-muted-foreground">{data.completed}/{data.total}</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${data.total > 0 ? (data.completed / data.total) * 100 : 0}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
