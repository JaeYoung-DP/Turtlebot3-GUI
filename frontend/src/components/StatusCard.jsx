const ICON_MAP = {
  fps: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  detection: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  lane: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" /><line x1="12" y1="3" x2="12" y2="21" strokeDasharray="3 3" />
    </svg>
  ),
  steering: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="2" /><path d="M12 2a10 10 0 0 1 0 20" opacity="0.3"/>
    </svg>
  ),
};

const ACCENT = {
  blue:   "var(--accent-blue)",
  green:  "var(--accent-green)",
  amber:  "var(--accent-amber)",
  purple: "var(--accent-purple)",
};

export default function StatusCard({ label, value, icon = "fps", color = "blue" }) {
  const ic = ICON_MAP[icon] || ICON_MAP.fps;
  const accent = ACCENT[color] || ACCENT.blue;

  return (
    <div className="dash-card px-4 py-3 flex items-center gap-3" style={{ borderLeft: `3px solid ${accent}` }}>
      <div className="opacity-70 shrink-0" style={{ color: accent }}>{ic}</div>
      <div className="min-w-0 flex-1">
        <div className="text-[0.65rem] font-medium uppercase tracking-wider mb-0.5" style={{ color: "var(--text-muted)" }}>{label}</div>
        <div className="font-mono text-sm font-bold truncate" style={{ color: "var(--text-heading)" }}>{value}</div>
      </div>
    </div>
  );
}
