const LABEL_META = {
  red:     { name: "Red Light",   color: "#EF4444", bg: "rgba(239,68,68,0.1)" },
  green:   { name: "Green Light", color: "#22C55E", bg: "rgba(34,197,94,0.1)" },
  stop:    { name: "Stop Sign",   color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
  left:    { name: "Left Arrow",  color: "#0EA5E9", bg: "rgba(14,165,233,0.1)" },
  right:   { name: "Right Arrow", color: "#6366F1", bg: "rgba(99,102,241,0.1)" },
  parking: { name: "Parking",     color: "#8B5CF6", bg: "rgba(139,92,246,0.1)" },
  kids:    { name: "Kids Zone",   color: "#EC4899", bg: "rgba(236,72,153,0.1)" },
};

function fmt(v, d = 2) {
  return typeof v === "number" ? v.toFixed(d) : "\u2014";
}

function MetricCard({ label, value, unit, sub, color = "#3B82F6" }) {
  return (
    <div className="dash-card px-5 py-4">
      <div className="text-[0.65rem] font-medium uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>{label}</div>
      <div className="flex items-baseline gap-1.5">
        <span className="font-mono text-2xl font-bold" style={{ color }}>{value}</span>
        {unit && <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>{unit}</span>}
      </div>
      {sub && <div className="text-[0.65rem] mt-2" style={{ color: "var(--text-muted)" }}>{sub}</div>}
    </div>
  );
}

function ProgressBar({ value, max, color }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

export default function SummaryPanel({ summary, revealed }) {
  if (!summary) {
    return (
      <div className="dash-card px-5 py-16 text-center">
        <div className="text-sm" style={{ color: "var(--text-muted)" }}>Loading analysis data...</div>
      </div>
    );
  }

  if (!revealed) {
    return (
      <div className="dash-card px-5 py-16 text-center">
        <svg className="mx-auto mb-3" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
        </svg>
        <div className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>Waiting for Analysis</div>
        <div className="text-sm mt-2 max-w-md mx-auto" style={{ color: "var(--text-muted)" }}>
          Play through all frames to generate comprehensive analysis results including average FPS, inference time, and per-class confidence metrics.
        </div>
      </div>
    );
  }

  const maxCount = Math.max(...summary.class_summary.map(c => c.count), 1);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <MetricCard label="Average FPS" value={fmt(summary.avg_fps)} unit="FPS" sub={`${summary.total_frames} frames analyzed`} color="#3B82F6" />
        <MetricCard label="Avg Inference" value={fmt(summary.avg_infer_ms)} unit="ms" sub="Per-frame average" color="#F59E0B" />
        <MetricCard label="Detection Rate" value={fmt((summary.detection_rate ?? 0) * 100)} unit="%" sub={`${summary.detected_frames} / ${summary.total_frames} frames`} color="#10B981" />
        <MetricCard label="Total Detections" value={summary.total_detections} sub="All classes combined" color="#8B5CF6" />
      </div>

      <div className="dash-card overflow-hidden">
        <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border)" }}>
          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Per-Class Performance</span>
          <span className="text-[0.65rem]" style={{ color: "var(--text-muted)" }}>{summary.class_summary.length} classes</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-muted)" }}>
                <th className="text-left px-5 py-3 font-medium text-xs uppercase tracking-wider">Class</th>
                <th className="text-left px-5 py-3 font-medium text-xs uppercase tracking-wider">Confidence</th>
                <th className="text-left px-5 py-3 font-medium text-xs uppercase tracking-wider">Count</th>
                <th className="text-left px-5 py-3 font-medium text-xs uppercase tracking-wider w-32">Distribution</th>
              </tr>
            </thead>
            <tbody>
              {summary.class_summary.map((item) => {
                const meta = LABEL_META[item.label] ?? { name: item.label, color: "#64748B", bg: "rgba(100,116,139,0.1)" };
                return (
                  <tr key={item.label} className="transition-colors" style={{ borderTop: "1px solid var(--border)" }}>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold" style={{ background: meta.bg, color: meta.color }}>
                        <div className="w-1.5 h-1.5 rounded-full mr-1.5" style={{ background: meta.color }} />
                        {meta.name}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-mono font-medium" style={{ color: "var(--text-primary)" }}>
                      {item.avg_score === null ? "\u2014" : item.avg_score.toFixed(4)}
                    </td>
                    <td className="px-5 py-3 font-mono" style={{ color: "var(--text-secondary)" }}>{item.count}</td>
                    <td className="px-5 py-3">
                      <ProgressBar value={item.count} max={maxCount} color={meta.color} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
