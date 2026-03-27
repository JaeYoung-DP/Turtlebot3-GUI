const CHART_H = 240;

export function chartLayout(dark) {
  return {
    paper_bgcolor: "transparent",
    plot_bgcolor: dark ? "rgba(17,24,39,0.6)" : "#F8FAFC",
    font: {
      color: dark ? "#94A3B8" : "#475569",
      family: "Inter, Noto Sans KR",
      size: 11,
    },
    margin: { l: 42, r: 14, t: 8, b: 28 },
    height: CHART_H,
    autosize: true,
    xaxis: {
      gridcolor: dark ? "#1E293B" : "#E2E8F0",
      linecolor: dark ? "#1E293B" : "#E2E8F0",
      zerolinecolor: dark ? "#1E293B" : "#E2E8F0",
    },
    yaxis: {
      gridcolor: dark ? "#1E293B" : "#E2E8F0",
      linecolor: dark ? "#1E293B" : "#E2E8F0",
      zerolinecolor: dark ? "#1E293B" : "#E2E8F0",
    },
  };
}

export { CHART_H };
