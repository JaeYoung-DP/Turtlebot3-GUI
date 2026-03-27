import { useState, useEffect } from "react";
import { useTheme } from "../ThemeContext";

export default function Header({ connected }) {
  const { dark, toggle } = useTheme();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const fmt = (n) => String(n).padStart(2, "0");
  const timeStr = `${fmt(time.getHours())}:${fmt(time.getMinutes())}:${fmt(time.getSeconds())}`;
  const dateStr = `${time.getFullYear()}.${fmt(time.getMonth() + 1)}.${fmt(time.getDate())}`;

  return (
    <header
      className="flex items-center justify-between px-6 py-3"
      style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border)" }}
    >
      {/* Left: Logo + Title */}
      <div className="flex items-center gap-4">
        <div className="bg-white rounded-md px-2 py-1 flex items-center justify-center">
          <img src="/sl_logo.png" alt="SL" className="h-8 block" />
        </div>
        <div>
          <h1 className="text-[1.1rem] font-bold tracking-tight leading-tight" style={{ color: "var(--text-heading)" }}>
            TurtleBot3 Autonomous Driving
          </h1>
          <p className="text-[0.7rem] mt-0.5" style={{ color: "var(--text-muted)" }}>
            Monitoring Dashboard &middot; SL Corporation &times; HIGHLOW
          </p>
        </div>
      </div>

      {/* Right: Theme + Status + Clock */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={toggle}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
          style={{
            background: dark ? "rgba(59,130,246,0.15)" : "rgba(245,158,11,0.15)",
            color: dark ? "#60A5FA" : "#D97706",
            border: `1px solid ${dark ? "rgba(59,130,246,0.3)" : "rgba(245,158,11,0.3)"}`,
          }}
        >
          {dark ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          )}
          {dark ? "DARK" : "LIGHT"}
        </button>

        {/* Divider */}
        <div className="w-px h-6" style={{ background: "var(--border)" }} />

        {/* Connection Status */}
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${connected ? "bg-emerald-400 animate-pulse-live" : "bg-red-500"}`} />
          <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            {connected ? "CONNECTED" : "DISCONNECTED"}
          </span>
        </div>

        {/* Divider */}
        <div className="w-px h-6" style={{ background: "var(--border)" }} />

        {/* Clock */}
        <div className="text-right">
          <div className="font-mono text-sm font-semibold tracking-wider" style={{ color: "var(--text-heading)" }}>{timeStr}</div>
          <div className="text-[0.65rem]" style={{ color: "var(--text-muted)" }}>{dateStr}</div>
        </div>
      </div>
    </header>
  );
}
