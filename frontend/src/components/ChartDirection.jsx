import { useMemo } from "react";
import { useTheme } from "../ThemeContext";

const TH_STRONG = 0.05;
const TH_WEAK = 0.03;

function getArrow(error) {
  if (error < -TH_STRONG) return { arrow: "\u2B05", label: "LEFT",    color: "#3B82F6", bg: "rgba(59,130,246,0.1)" };
  if (error < -TH_WEAK)   return { arrow: "\u2196", label: "SLIGHT L",color: "#60A5FA", bg: "rgba(96,165,250,0.08)" };
  if (error >  TH_STRONG) return { arrow: "\u27A1", label: "RIGHT",   color: "#F59E0B", bg: "rgba(245,158,11,0.1)" };
  if (error >  TH_WEAK)   return { arrow: "\u2197", label: "SLIGHT R",color: "#FBBF24", bg: "rgba(251,191,36,0.08)" };
  return                          { arrow: "\u2B06", label: "CENTER",  color: "#10B981", bg: "rgba(16,185,129,0.1)" };
}

export default function ChartDirection({ data }) {
  const { dark } = useTheme();
  const last = data[data.length - 1];
  const error = last ? last.lane_error : 0;
  const { arrow, label, color, bg } = useMemo(() => getArrow(error), [error]);
  const history = data.slice(-15);
  const pct = Math.min(100, Math.max(0, ((error + 0.3) / 0.6) * 100));

  return (
    <div className="dash-card p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-xs font-semibold tracking-wide" style={{ color: "var(--text-secondary)" }}>STEERING</span>
        <span className="font-mono text-[0.65rem]" style={{ color: "var(--text-muted)" }}>
          ERR: {error.toFixed(4)}
        </span>
      </div>

      <div className="flex items-center justify-around flex-1 gap-3 min-h-0 overflow-hidden">
        {/* Main indicator */}
        <div
          className="flex flex-col items-center justify-center rounded-2xl px-5 py-4 transition-all duration-300 shrink-0"
          style={{ background: bg, border: `2px solid ${color}`, minWidth: 100 }}
        >
          <div className="text-3xl leading-none" style={{ color }}>{arrow}</div>
          <div className="mt-1.5 text-[0.65rem] font-bold tracking-widest" style={{ color }}>{label}</div>
        </div>

        {/* Vertical gauge */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <span className="text-[0.55rem] font-bold" style={{ color: "var(--accent-amber)" }}>R</span>
          <div
            className="relative rounded-full overflow-hidden"
            style={{
              width: 12,
              height: 120,
              background: "linear-gradient(to bottom, #F59E0B, #10B981 50%, #3B82F6)",
              boxShadow: "inset 0 0 6px rgba(0,0,0,0.4)",
            }}
          >
            <div
              className="absolute left-0 right-0 transition-all duration-300"
              style={{
                top: `${pct}%`,
                height: 3,
                background: "white",
                boxShadow: "0 0 6px rgba(255,255,255,0.8)",
                transform: "translateY(-50%)",
              }}
            />
          </div>
          <span className="text-[0.55rem] font-bold" style={{ color: "var(--accent-blue)" }}>L</span>
        </div>

        {/* History */}
        <div className="flex flex-col gap-0.5 shrink-0 overflow-hidden max-h-full">
          <div className="text-[0.55rem] mb-1 text-center font-medium" style={{ color: "var(--text-muted)" }}>HISTORY</div>
          <div className="flex flex-col-reverse gap-0.5 overflow-hidden">
            {history.map((d, i) => {
              const { color: c, arrow: a } = getArrow(d.lane_error);
              return (
                <div key={i} className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: c }} />
                  <span className="text-[0.5rem] font-semibold" style={{ color: c }}>{a}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 mt-2 pt-2" style={{ borderTop: "1px solid var(--border)" }}>
        {[
          { c: "#3B82F6", t: "LEFT" },
          { c: "#10B981", t: "CENTER" },
          { c: "#F59E0B", t: "RIGHT" },
        ].map(({ c, t }) => (
          <div key={t} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: c }} />
            <span className="text-[0.55rem] font-medium" style={{ color: "var(--text-muted)" }}>{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
