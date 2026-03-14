import React, { useState, useEffect, useRef, useCallback } from "react";
import Header         from "./components/Header";
import StatusCard     from "./components/StatusCard";
import VideoPlayer    from "./components/VideoPlayer";
import ChartFPS       from "./components/ChartFPS";
import ChartInfer     from "./components/ChartInfer";
import ChartScore     from "./components/ChartScore";
import ChartDirection from "./components/ChartDirection";
import SummaryPanel   from "./components/SummaryPanel";

const API = "http://localhost:8000";

export default function App() {
  const [totalFrames, setTotalFrames] = useState(100);
  const [frameIdx,    setFrameIdx]    = useState(50);
  const [frameData,   setFrameData]   = useState([]);
  const [playing,     setPlaying]     = useState(false);
  const [speed,       setSpeed]       = useState(1);
  const [summaryData, setSummaryData] = useState(null);
  const [activeTab,   setActiveTab]   = useState("live");
  const [summaryOpen, setSummaryOpen] = useState(false);

  const playRef   = useRef(false);
  const timerRef  = useRef(null);
  const video1Ref = useRef(null);
  const video2Ref = useRef(null);

  useEffect(() => {
    fetch(`${API}/api/total_frames`).then(r => r.json())
      .then(d => { setTotalFrames(d.total); setFrameIdx(Math.min(50, d.total)); })
      .catch(() => console.warn("백엔드 연결 실패"));
  }, []);

  useEffect(() => {
    fetch(`${API}/api/summary`).then(r => r.json()).then(setSummaryData).catch(() => {});
  }, []);

  const fetchFrames = useCallback((idx) => {
    fetch(`${API}/api/frames/${idx}`).then(r => r.json()).then(d => setFrameData(d)).catch(() => {});
  }, []);

  useEffect(() => { fetchFrames(frameIdx); }, [frameIdx, fetchFrames]);

  const playVideos  = () => { video1Ref.current?.play().catch(()=>{}); video2Ref.current?.play().catch(()=>{}); };
  const pauseVideos = () => { video1Ref.current?.pause(); video2Ref.current?.pause(); };
  const revealSummary = useCallback(() => { setSummaryOpen(true); setActiveTab("summary"); }, []);

  const syncVideoTime = useCallback((idx) => {
    const v1 = video1Ref.current, v2 = video2Ref.current;
    if (v1?.duration) v1.currentTime = (idx / totalFrames) * v1.duration;
    if (v2?.duration) v2.currentTime = (idx / totalFrames) * v2.duration;
  }, [totalFrames]);

  const handlePlay = () => {
    if (playRef.current) return;
    playRef.current = true; setPlaying(true); setActiveTab("live"); playVideos();
    const step = Math.max(10, Math.round(speed * 15));
    const tick = (current) => {
      if (!playRef.current) {
        playRef.current = false; setPlaying(false); pauseVideos(); return;
      }
      const safeFrame = Math.min(current, totalFrames);
      fetch(`${API}/api/frames/${safeFrame}`).then(r => r.json()).then(d => {
        setFrameData(d); setFrameIdx(safeFrame); syncVideoTime(safeFrame);
        if (safeFrame >= totalFrames) {
          playRef.current = false;
          setPlaying(false);
          pauseVideos();
          revealSummary();
          return;
        }
        timerRef.current = setTimeout(() => tick(safeFrame + step), 300);
      }).catch(() => {
        playRef.current = false;
        setPlaying(false);
        pauseVideos();
      });
    };
    tick(frameIdx);
  };

  const handleStop = () => {
    playRef.current = false; setPlaying(false);
    clearTimeout(timerRef.current); pauseVideos();
  };

  const handleSlider = (val) => {
    handleStop();
    setFrameIdx(val);
    syncVideoTime(val);
    if (val >= totalFrames) revealSummary();
  };

  const last    = frameData[frameData.length - 1];
  const fpsStr  = last ? `${last.fps} FPS` : "—";
  const detStr  = last ? (last.score ? `${last.label.toUpperCase()} (${last.score.toFixed(2)})` : "None") : "—";
  const laneMap = { 1:"Left Lane", 2:"Center", 3:"Right Lane" };
  const laneStr = last ? (laneMap[last.lane] ?? String(last.lane)) : "—";
  const dirMap  = { left:"⬅ 왼쪽", center:"⬆ 중앙", right:"➡ 오른쪽" };
  const dirStr  = last ? (dirMap[last.direction] ?? "—") : "—";

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-4">
      <Header />
      <div className="flex gap-4 mt-4">
        <div className="w-48 flex flex-col gap-3 shrink-0">
          <StatusCard label="현재 FPS"  value={fpsStr}  />
          <StatusCard label="감지 신호" value={detStr}  />
          <StatusCard label="차선 상태" value={laneStr} />
          <StatusCard label="조향 방향" value={dirStr}  />
        </div>
        <div className="flex-1 grid grid-cols-2 gap-3">
          <VideoPlayer label="📹 OBJECT — 객체 감지 영상" src="/OBJECT.mov" videoRef={video1Ref} />
          <VideoPlayer label="📹 LANE — 차선 인식 영상"   src="/LANE.mov"  videoRef={video2Ref} />
        </div>
      </div>

      <hr className="border-slate-300 my-4" />
      <div className="flex flex-col gap-3 mb-4 md:flex-row md:items-center md:justify-between">
        <div className="font-bold text-[#1D3461] text-base">
          {activeTab === "live" ? "📊 실시간 로그 분석" : "📑 분석 결과"}
        </div>
        <div className="inline-flex w-fit rounded-xl bg-slate-100 p-1">
          <button
            onClick={() => setActiveTab("live")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              activeTab === "live" ? "bg-white text-[#1D3461] shadow-sm" : "text-slate-500"
            }`}
          >
            실시간 로그 분석
          </button>
          <button
            onClick={() => setActiveTab("summary")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              activeTab === "summary" ? "bg-white text-[#1D3461] shadow-sm" : "text-slate-500"
            }`}
          >
            분석 결과
          </button>
        </div>
      </div>

      {activeTab === "live" ? (
        <>
          <div className="flex items-end gap-4 flex-wrap mb-4 bg-white rounded-xl p-4 shadow-sm border border-slate-200">
            <div className="flex-1 min-w-[240px]">
              <label className="text-xs text-slate-500 block mb-1">재생 프레임 — {frameIdx} / {totalFrames}</label>
              <input type="range" min={1} max={totalFrames} value={frameIdx} step={1}
                onChange={e => handleSlider(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer" />
            </div>
            <button onClick={handlePlay} disabled={playing}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold disabled:opacity-50 hover:bg-blue-700 transition">
              ▶ 자동 재생
            </button>
            <button onClick={handleStop}
              className="px-5 py-2 bg-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-300 transition">
              ⏹ 정지
            </button>
            <div>
              <label className="text-xs text-slate-500 block mb-1">배속</label>
              <select value={speed} onChange={e => setSpeed(Number(e.target.value))}
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white cursor-pointer">
                {[0.5,1,2,4].map(s => <option key={s} value={s}>{s}x</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <ChartFPS       data={frameData} />
            <ChartInfer     data={frameData} />
            <ChartScore     data={frameData} />
            <ChartDirection data={frameData} />
          </div>
        </>
      ) : (
        <SummaryPanel summary={summaryData} revealed={summaryOpen} />
      )}

      <div className="text-center text-slate-400 text-xs mt-6 pb-4">
        © SL Corporation · TurtleBot3 Autonomous Driving Project · KDT 10기
      </div>
    </div>
  );
}
