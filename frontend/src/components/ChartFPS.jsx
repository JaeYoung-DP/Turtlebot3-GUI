import Plot from "react-plotly.js";
import { useMemo } from "react";
import { useTheme } from "../ThemeContext";
import { chartLayout } from "../chartLayout";

const WINDOW = 100;

export default function ChartFPS({ data }) {
  const { dark } = useTheme();
  const slice = data.slice(-WINDOW);
  const layout = chartLayout(dark);

  const traces = useMemo(() => [{
    x: slice.map(d => d.frame),
    y: slice.map(d => d.fps),
    type: "scatter",
    mode: "lines",
    name: "FPS",
    line: { color: "#3B82F6", width: 2, shape: "spline" },
    fill: "tozeroy",
    fillcolor: dark ? "rgba(59,130,246,0.08)" : "rgba(59,130,246,0.12)",
  }], [slice, dark]);

  return (
    <div className="dash-card p-3 flex flex-col h-full">
      <div className="flex items-center justify-between mb-1 px-1">
        <span className="text-xs font-semibold tracking-wide" style={{ color: "var(--text-secondary)" }}>FPS</span>
        {slice.length > 0 && (
          <span className="font-mono text-xs font-bold" style={{ color: "var(--accent-blue)" }}>
            {slice[slice.length - 1].fps}
          </span>
        )}
      </div>
      <div className="flex-1 min-h-0">
        <Plot
          data={traces}
          layout={{ ...layout, yaxis: { ...layout.yaxis, title: { text: "FPS", font: { size: 10 } } } }}
          style={{ width: "100%", height: "100%" }}
          useResizeHandler
          config={{ displayModeBar: false, responsive: true }}
        />
      </div>
    </div>
  );
}
