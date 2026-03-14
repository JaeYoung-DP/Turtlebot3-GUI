import { useMemo } from "react";

const TH_STRONG = 0.05;
const TH_WEAK   = 0.03;

function getArrow(error) {
  if (error < -TH_STRONG) return { arrow:"⬅", label:"왼쪽으로 조향",   color:"#3B82F6", bg:"#EFF6FF" };
  if (error < -TH_WEAK)   return { arrow:"↖", label:"약간 왼쪽",       color:"#60A5FA", bg:"#F0F9FF" };
  if (error >  TH_STRONG) return { arrow:"➡", label:"오른쪽으로 조향", color:"#F59E0B", bg:"#FFFBEB" };
  if (error >  TH_WEAK)   return { arrow:"↗", label:"약간 오른쪽",     color:"#FBBF24", bg:"#FEFCE8" };
  return                          { arrow:"⬆", label:"직진 (중앙)",     color:"#10B981", bg:"#ECFDF5" };
}

export default function ChartDirection({ data }) {
  const last  = data[data.length - 1];
  const error = last ? last.lane_error : 0;
  const { arrow, label, color, bg } = useMemo(() => getArrow(error), [error]);
  const history = data.slice(-15);
  const pct = Math.min(100, Math.max(0, ((error + 0.3) / 0.6) * 100));

  return (
    <div style={{
      background:"#F8FAFC", borderRadius:12, border:"1px solid #E2E8F0",
      boxShadow:"0 1px 3px rgba(0,0,0,0.07)", padding:"16px",
      height:370, display:"flex", flexDirection:"column", overflow:"hidden", boxSizing:"border-box"
    }}>
      <div style={{ color:"#8094AE", fontSize:13, fontWeight:400,
                    fontFamily:"Noto Sans KR, sans-serif", textAlign:"center", marginBottom:10 }}>
        Steering Direction Guide
      </div>

      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-around",
                    flex:1, gap:12, minHeight:0, overflow:"hidden" }}>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                      borderRadius:16, padding:"20px 24px", transition:"all 0.3s",
                      background:bg, border:`2px solid ${color}`, minWidth:120, maxWidth:160, flexShrink:0 }}>
          <div style={{ fontSize:"3.2rem", lineHeight:1, color }}>{arrow}</div>
          <div style={{ color, fontWeight:700, fontSize:"0.88rem", marginTop:8, textAlign:"center" }}>{label}</div>
          <div style={{ color:"#94A3B8", fontSize:"0.68rem", marginTop:4 }}>error: {error.toFixed(4)}</div>
        </div>

        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4, flexShrink:0 }}>
          <span style={{ fontSize:"0.7rem", fontWeight:600, color:"#F59E0B" }}>R</span>
          <div style={{ position:"relative", borderRadius:999, overflow:"hidden", width:20, height:160,
                        background:"linear-gradient(to bottom,#F59E0B,#10B981,#3B82F6)" }}>
            <div style={{ position:"absolute", left:0, right:0, transition:"top 0.3s",
                          top:`${pct}%`, height:3, background:"white",
                          boxShadow:"0 0 5px rgba(0,0,0,0.6)", transform:"translateY(-50%)" }} />
          </div>
          <span style={{ fontSize:"0.7rem", fontWeight:600, color:"#3B82F6" }}>L</span>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:2, flexShrink:0, overflow:"hidden" }}>
          <div style={{ fontSize:"0.68rem", color:"#94A3B8", marginBottom:4, textAlign:"center" }}>최근 이력</div>
          <div style={{ display:"flex", flexDirection:"column-reverse", gap:2, overflow:"hidden" }}>
            {history.map((d, i) => {
              const { color:c, arrow:a } = getArrow(d.lane_error);
              return (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:c, flexShrink:0 }} />
                  <span style={{ fontSize:"0.62rem", color:c, fontWeight:600 }}>{a}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ display:"flex", justifyContent:"center", gap:16, marginTop:10, flexWrap:"wrap" }}>
        {[{ c:"#3B82F6",t:"왼쪽" },{ c:"#10B981",t:"중앙" },{ c:"#F59E0B",t:"오른쪽" }].map(({c,t}) => (
          <div key={t} style={{ display:"flex", alignItems:"center", gap:4, fontSize:"0.72rem", color:"#64748B" }}>
            <div style={{ width:9, height:9, borderRadius:"50%", background:c }} />{t}
          </div>
        ))}
      </div>
    </div>
  );
}