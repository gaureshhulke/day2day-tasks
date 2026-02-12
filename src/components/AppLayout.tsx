import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutGrid, CalendarDays, Plus, BarChart3, Settings } from "lucide-react";

const navItems = [
  { icon: LayoutGrid, label: "Tasks", path: "/" },
  { icon: CalendarDays, label: "Calendar", path: "/calendar" },
  { icon: null, label: "Add", path: "/" },
  { icon: BarChart3, label: "Stats", path: "/stats" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      <Outlet />

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-t border-border">
        <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-2">
          {navItems.map((item, i) => {
            if (i === 2) {
              // Center FAB
              return (
                <button
                  key="fab"
                  onClick={() => { navigate("/"); window.dispatchEvent(new CustomEvent("day2day:focus-input")); }}
                  className="w-12 h-12 -mt-5 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:opacity-90 transition-all active:scale-95"
                  aria-label="Add task"
                >
                  <Plus className="w-6 h-6" />
                </button>
              );
            }

            const Icon = item.icon!;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.path + item.label}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label={item.label}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
