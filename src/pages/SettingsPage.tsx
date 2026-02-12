import { useState } from "react";
import { User, Bell, Palette, Info, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const [name, setName] = useState(() => localStorage.getItem("day2day-name") || "");
  const [reminder, setReminder] = useState(() => localStorage.getItem("day2day-reminder") === "true");
  const [reminderTime, setReminderTime] = useState(() => localStorage.getItem("day2day-reminder-time") || "08:30");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem("day2day-name", name);
    localStorage.setItem("day2day-reminder", String(reminder));
    localStorage.setItem("day2day-reminder-time", reminderTime);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClearData = () => {
    if (window.confirm("This will delete all your tasks and settings. Are you sure?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Customize your experience</p>
      </header>

      {/* Profile */}
      <section className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <User className="w-4 h-4 text-primary" />
          <h2 className="text-xs font-semibold text-primary uppercase tracking-wider">Profile</h2>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 space-y-3">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Bell className="w-4 h-4 text-primary" />
          <h2 className="text-xs font-semibold text-primary uppercase tracking-wider">Notifications</h2>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Daily Reminder</p>
              <p className="text-xs text-muted-foreground">Get notified for daily tasks</p>
            </div>
            <button
              onClick={() => setReminder(!reminder)}
              className={`w-12 h-7 rounded-full transition-colors relative ${reminder ? "bg-primary" : "bg-muted"}`}
              aria-label="Toggle reminder"
            >
              <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-card shadow transition-transform ${reminder ? "left-[22px]" : "left-0.5"}`} />
            </button>
          </div>
          {reminder && (
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">Reminder Time</p>
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="bg-muted rounded-lg px-3 py-1.5 text-sm text-primary font-medium outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          )}
        </div>
      </section>

      {/* App Info */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-4 h-4 text-primary" />
          <h2 className="text-xs font-semibold text-primary uppercase tracking-wider">About</h2>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-foreground">Version</p>
            <span className="text-xs text-muted-foreground">2.4.0</span>
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={handleSave}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          {saved ? <><CheckCircle2 className="w-4 h-4" /> Saved!</> : "Save Changes"}
        </button>
        <button
          onClick={handleClearData}
          className="w-full py-3 rounded-xl border border-border text-muted-foreground font-medium text-sm hover:text-destructive hover:border-destructive/30 transition-colors"
        >
          Clear All Data
        </button>
      </div>

      <footer className="mt-8 text-center">
        <p className="text-xs text-muted-foreground tracking-widest uppercase">Day2Day Productivity v2.4.0</p>
      </footer>
    </div>
  );
}
