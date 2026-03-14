import Plot from "react-plotly.js";
import { useMemo } from "react";

const WINDOW = 100;

export default function ChartInfer({ data }) {
  const slice = data.slice(-WINDOW);
  const traces = useMemo(() => [{
    x: slice.map(d => d.frame),
    y: slice.map(d => d.infer),
    type:"scatter", name:"Inference Time",
    line:{ color:"#F97316", width:2 }, fill:"tozeroy", fillcolor:"rgba(249,115,22,0.12)",
  }], [slice]);

  return (
    <Plot data={traces}
      layout={{
        title:{ text:"Inference Time (ms)", font:{ color:"#8094AE", size:13, family:"Noto Sans KR" }, x:0.5, xanchor:"center" },
        paper_bgcolor:"#F8FAFC", plot_bgcolor:"#F1F5F9",
        font:{ color:"#334155", family:"Noto Sans KR" },
        margin:{ l:40,r:30,t:40,b:30 }, height:370, autosize:true,
        yaxis:{ title:"ms", gridcolor:"#CBD5E1", autorange:true },
        xaxis:{ title:"Frame", gridcolor:"#CBD5E1", autorange:true },
      }}
      style={{ width:"100%" }} useResizeHandler config={{ displayModeBar:false }} />
  );
}
