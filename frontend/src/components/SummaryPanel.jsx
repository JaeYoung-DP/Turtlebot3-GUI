const LABEL_META = {
  red:     { name: "Red",     chip: "bg-red-100 text-red-700" },
  green:   { name: "Green",   chip: "bg-emerald-100 text-emerald-700" },
  stop:    { name: "Stop",    chip: "bg-amber-100 text-amber-700" },
  left:    { name: "Left",    chip: "bg-sky-100 text-sky-700" },
  right:   { name: "Right",   chip: "bg-indigo-100 text-indigo-700" },
  parking: { name: "Parking", chip: "bg-violet-100 text-violet-700" },
  kids:    { name: "Kids",    chip: "bg-pink-100 text-pink-700" },
};

function formatNumber(value, digits = 2) {
  return typeof value === "number" ? value.toFixed(digits) : "—";
}

function SummaryCard({ label, value, helper }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-4">
      <div className="text-xs text-slate-400 mb-1">{label}</div>
      <div className="text-2xl font-bold text-[#1D3461]">{value}</div>
      {helper ? <div className="text-xs text-slate-500 mt-2">{helper}</div> : null}
    </div>
  );
}

export default function SummaryPanel({ summary, revealed }) {
  if (!summary) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-5 py-10 text-center text-slate-500">
        분석 결과를 불러오는 중입니다.
      </div>
    );
  }

  if (!revealed) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-5 py-10 text-center">
        <div className="text-lg font-semibold text-[#1D3461]">분석 결과 대기 중</div>
        <div className="text-sm text-slate-500 mt-2">
          자동 재생이 마지막 프레임까지 완료되면 평균 FPS, 평균 inference time,
          클래스별 평균 confidence가 이 탭에 표시됩니다.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard
          label="평균 FPS"
          value={`${formatNumber(summary.avg_fps)} FPS`}
          helper={`총 ${summary.total_frames} 프레임 기준`}
        />
        <SummaryCard
          label="평균 Inference Time"
          value={`${formatNumber(summary.avg_infer_ms)} ms`}
          helper="전체 프레임 평균"
        />
        <SummaryCard
          label="감지 발생 프레임"
          value={`${summary.detected_frames} / ${summary.total_frames}`}
          helper={`탐지 비율 ${formatNumber((summary.detection_rate ?? 0) * 100)}%`}
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200">
          <div className="font-semibold text-[#1D3461]">7개 클래스 평균 Confidence</div>
          <div className="text-sm text-slate-500 mt-1">
            각 클래스가 실제로 탐지된 샘플만 기준으로 평균을 계산함.
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="text-left px-5 py-3 font-medium">Class</th>
                <th className="text-left px-5 py-3 font-medium">평균 Confidence</th>
                <th className="text-left px-5 py-3 font-medium">탐지 횟수</th>
              </tr>
            </thead>
            <tbody>
              {summary.class_summary.map((item) => {
                const meta = LABEL_META[item.label] ?? { name: item.label, chip: "bg-slate-100 text-slate-700" };
                return (
                  <tr key={item.label} className="border-t border-slate-100">
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${meta.chip}`}>
                        {meta.name}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-700 font-medium">
                      {item.avg_score === null ? "—" : item.avg_score.toFixed(4)}
                    </td>
                    <td className="px-5 py-3 text-slate-500">{item.count}</td>
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
