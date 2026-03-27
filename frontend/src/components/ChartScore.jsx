import Plot from "react-plotly.js";
import { useMemo } from "react";
import { useTheme } from "../ThemeContext";
import { chartLayout } from "../chartLayout";

const COLOR_MAP = {
  red: "#EF4444",
  green: "#22C55E",
  stop: "#F59E0B",
  left: "#0EA5E9",
  right: "#6366F1",
  parking: "#8B5CF6",
  kids: "#EC4899",
  none: "#475569",
};

export default function ChartScore({ data }) {
  const { dark } = useTheme();
  const layout = chartLayout(dark);

  const traces = useMemo(() => {
    const pts = data.filter(d => d.score !== null);
    return [{
      x: pts.map(d => d.frame),
      y: pts.map(d => d.score),
      type: "scatter",
      mode: "markers",
      marker: {
        color: pts.map(d => COLOR_MAP[d.label] ?? "#475569"),
        size: 5,
        line: { width: 0.5, color: dark ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.5)" },
      },
      text: pts.map(d => `Frame ${d.frame}<br>${d.label}: ${d.score?.toFixed(3)}`),
      hoverinfo: "text",
      name: "Score",
    }];
  }, [data, dark]);

  return (
    <div className="dash-card p-3 flex flex-col h-full">
      <div className="flex items-center justify-between mb-1 px-1 flex-wrap gap-1">
        <span className="text-xs font-semibold tracking-wide" style={{ color: "var(--text-secondary)" }}>DETECTION SCORES</span>
        <div className="flex items-center gap-2 flex-wrap">
          {Object.entries(COLOR_MAP).filter(([k]) => k !== "none").map(([label, color]) => (
            <div key={label} className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
              <span className="text-[0.55rem] capitalize" style={{ color: "var(--text-muted)" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <Plot
          data={traces}
          layout={{
            ...layout,
            yaxis: { ...layout.yaxis, range: [0.35, 1.0] },
            shapes: [{
              type: "line", x0: 0, x1: 1, xref: "paper", y0: 0.5, y1: 0.5,
              line: { dash: "dot", color: dark ? "#334155" : "#CBD5E1", width: 1 },
            }],
          }}
          style={{ width: "100%", height: "100%" }}
          useResizeHandler
          config={{ displayModeBar: false, responsive: true }}
        />
      </div>
    </div>
  );
}
