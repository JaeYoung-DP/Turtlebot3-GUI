import Plot from "react-plotly.js";
import { useMemo } from "react";
const COLOR_MAP = {
  red:"#EF4444",
  green:"#22C55E",
  stop:"#F59E0B",
  left:"#0EA5E9",
  right:"#6366F1",
  parking:"#8B5CF6",
  kids:"#EC4899",
  none:"#6B7280",
};
export default function ChartScore({ data }) {
  const traces = useMemo(() => {
    const pts = data.filter(d => d.score !== null);
    return [{
      x: pts.map(d => d.frame), y: pts.map(d => d.score),
      type:"scatter", mode:"markers",
      marker:{ color:pts.map(d => COLOR_MAP[d.label] ?? "#6B7280"), size:6, line:{ width:0.5, color:"#fff" } },
      text: pts.map(d => `Frame ${d.frame}<br>Label: ${d.label}<br>Score: ${d.score?.toFixed(3)}`),
      hoverinfo:"text", name:"Detection",
    }];
  }, [data]);
  return (
    <Plot data={traces}
      layout={{
        title:{ text:"Detection Score Timeline", font:{ color:"#8094AE", size:13, family:"Noto Sans KR" }, x:0.5, xanchor:"center" },
        paper_bgcolor:"#F8FAFC", plot_bgcolor:"#F1F5F9",
        font:{ color:"#334155", family:"Noto Sans KR" },
        margin:{ l:40,r:30,t:40,b:30 }, height:370, autosize:true,
        yaxis:{ range:[0.4,1.0], gridcolor:"#CBD5E1" },
        xaxis:{ gridcolor:"#CBD5E1" },
        shapes:[{ type:"line", x0:0, x1:1, xref:"paper", y0:0.5, y1:0.5, line:{ dash:"dash", color:"#94A3B8" } }],
        annotations:[{ x:1, xref:"paper", y:0.5, text:"threshold", showarrow:false,
                       xanchor:"right", font:{ color:"#94A3B8", size:10 } }],
      }}
      style={{ width:"100%" }} useResizeHandler config={{ displayModeBar:false }} />
  );
}
