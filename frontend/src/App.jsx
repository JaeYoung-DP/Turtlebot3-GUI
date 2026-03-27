import { useState, useEffect, useRef, useCallback } from "react";
import Header from "./components/Header";
import StatusCard from "./components/StatusCard";
import VideoPlayer from "./components/VideoPlayer";
import ChartFPS from "./components/ChartFPS";
import ChartInfer from "./components/ChartInfer";
import ChartScore from "./components/ChartScore";
import ChartDirection from "./components/ChartDirection";
import SummaryPanel from "./components/SummaryPanel";

const API = "http://localhost:8000";

export default function App() {
  const [totalFrames, setTotalFrames] = useState(100);
  const [frameIdx, setFrameIdx] = useState(50);
  const [frameData, setFrameData] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [summaryData, setSummaryData] = useState(null);
  const [activeTab, setActiveTab] = useState("live");
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [connected, setConnected] = useState(false);

  const playRef = useRef(false);
  const timerRef = useRef(null);
  const video1Ref = useRef(null);
  const video2Ref = useRef(null);

  useEffect(() => {
    fetch(`${API}/api/total_frames`)
      .then((r) => r.json())
      .then((d) => {
        setTotalFrames(d.total);
        setFrameIdx(Math.min(50, d.total));
        setConnected(true);
      })
      .catch(() => setConnected(false));
  }, []);

  useEffect(() => {
    fetch(`${API}/api/summary`)
      .then((r) => r.json())
      .then(setSummaryData)
      .catch(() => {});
  }, []);

  const fetchFrames = useCallback((idx) => {
    fetch(`${API}/api/frames/${idx}`)
      .then((r) => r.json())
      .then((d) => setFrameData(d))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchFrames(frameIdx);
  }, [frameIdx, fetchFrames]);

  /* ── Video helpers ─────────────────────────────────── */
  const syncVideoTime = useCallback(
    (idx) => {
      const v1 = video1Ref.current;
      const v2 = video2Ref.current;
      if (v1?.duration) v1.currentTime = (idx / totalFrames) * v1.duration;
      if (v2?.duration) v2.currentTime = (idx / totalFrames) * v2.duration;
    },
    [totalFrames]
  );

  const setVideoRate = useCallback((rate) => {
    const v1 = video1Ref.current;
    const v2 = video2Ref.current;
    if (v1) v1.playbackRate = rate;
    if (v2) v2.playbackRate = rate;
  }, []);

  const playVideos = useCallback(() => {
    video1Ref.current?.play().catch(() => {});
    video2Ref.current?.play().catch(() => {});
  }, []);

  const pauseVideos = useCallback(() => {
    video1Ref.current?.pause();
    video2Ref.current?.pause();
  }, []);

  const revealSummary = useCallback(() => {
    setSummaryOpen(true);
    setActiveTab("summary");
  }, []);

  /* ── Playback ──────────────────────────────────────── */
  const handlePlay = () => {
    if (playRef.current) return;
    playRef.current = true;
    setPlaying(true);
    setActiveTab("live");

    // Sync video to current frame position once, set speed, then let it play naturally
    syncVideoTime(frameIdx);
    setVideoRate(speed);
    playVideos();

    const step = Math.max(10, Math.round(speed * 15));
    const tick = (current) => {
      if (!playRef.current) {
        setPlaying(false);
        pauseVideos();
        return;
      }
      const safeFrame = Math.min(current, totalFrames);
      fetch(`${API}/api/frames/${safeFrame}`)
        .then((r) => r.json())
        .then((d) => {
          setFrameData(d);
          setFrameIdx(safeFrame);
          // Don't call syncVideoTime here — let video play naturally
          if (safeFrame >= totalFrames) {
            playRef.current = false;
            setPlaying(false);
            pauseVideos();
            revealSummary();
            return;
          }
          timerRef.current = setTimeout(() => tick(safeFrame + step), 300);
        })
        .catch(() => {
          playRef.current = false;
          setPlaying(false);
          pauseVideos();
        });
    };
    tick(frameIdx);
  };

  const handleStop = () => {
    playRef.current = false;
    setPlaying(false);
    clearTimeout(timerRef.current);
    pauseVideos();
  };

  const handleSlider = (val) => {
    handleStop();
    setFrameIdx(val);
    syncVideoTime(val);
    if (val >= totalFrames) revealSummary();
  };

  /* ── Derived display values ────────────────────────── */
  const last = frameData[frameData.length - 1];
  const fpsStr = last ? `${last.fps}` : "\u2014";
  const detStr = last
    ? last.score
      ? `${last.label.toUpperCase()} (${last.score.toFixed(2)})`
      : "None"
    : "\u2014";
  const laneMap = { 1: "LEFT", 2: "CENTER", 3: "RIGHT" };
  const laneStr = last ? laneMap[last.lane] ?? String(last.lane) : "\u2014";
  const dirMap = { left: "LEFT", center: "STRAIGHT", right: "RIGHT" };
  const dirStr = last ? dirMap[last.direction] ?? "\u2014" : "\u2014";
  const progress = totalFrames > 0 ? ((frameIdx / totalFrames) * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen flex flex-col grid-pattern">
      <Header connected={connected} />

      <div className="flex-1 p-4 max-w-[1600px] mx-auto w-full">
        {/* Top Row: Status + Videos */}
        <div className="grid grid-cols-12 gap-3 mb-3">
          {/* Status sidebar */}
          <div className="col-span-2 flex flex-col gap-2">
            <StatusCard label="FPS" value={fpsStr} icon="fps" color="blue" />
            <StatusCard label="DETECTION" value={detStr} icon="detection" color="green" />
            <StatusCard label="LANE" value={laneStr} icon="lane" color="amber" />
            <StatusCard label="STEERING" value={dirStr} icon="steering" color="purple" />

            {/* Progress */}
            <div className="dash-card px-4 py-3 mt-auto">
              <div className="text-[0.65rem] font-medium uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>
                PROGRESS
              </div>
              <div className="font-mono text-lg font-bold" style={{ color: "var(--text-heading)" }}>
                {progress}%
              </div>
              <div className="w-full h-1 rounded-full mt-2 overflow-hidden" style={{ background: "var(--border)" }}>
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${progress}%`, background: "var(--accent-blue)" }}
                />
              </div>
              <div className="font-mono text-[0.6rem] mt-1.5" style={{ color: "var(--text-muted)" }}>
                {frameIdx} / {totalFrames} frames
              </div>
            </div>
          </div>

          {/* Video feeds */}
          <div className="col-span-10 grid grid-cols-2 gap-3">
            <VideoPlayer label="OBJECT DETECTION" src="/OBJECT.mov" videoRef={video1Ref} />
            <VideoPlayer label="LANE RECOGNITION" src="/LANE.mov" videoRef={video2Ref} />
          </div>
        </div>

        {/* Controls bar */}
        <div className="dash-card px-4 py-3 mb-3 flex items-center gap-4 flex-wrap">
          {/* Play/Stop */}
          <button
            onClick={handlePlay}
            disabled={playing}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "var(--accent-blue)", color: "#fff" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21" /></svg>
            PLAY
          </button>
          <button
            onClick={handleStop}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{ background: "var(--border)", color: "var(--text-primary)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
            STOP
          </button>

          <div className="w-px h-7" style={{ background: "var(--border)" }} />

          {/* Speed */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>SPEED</span>
            <div className="flex gap-1">
              {[0.5, 1, 2, 4].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className="px-2.5 py-1 rounded text-xs font-mono font-semibold transition-all"
                  style={{
                    background: speed === s ? "var(--accent-blue)" : "var(--border)",
                    color: speed === s ? "#fff" : "var(--text-secondary)",
                  }}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          <div className="w-px h-7" style={{ background: "var(--border)" }} />

          {/* Frame slider */}
          <div className="flex-1 flex items-center gap-3 min-w-[200px]">
            <span className="text-xs font-medium shrink-0" style={{ color: "var(--text-muted)" }}>FRAME</span>
            <input
              type="range"
              min={1}
              max={totalFrames}
              value={frameIdx}
              step={1}
              onChange={(e) => handleSlider(Number(e.target.value))}
              className="flex-1"
            />
            <span className="font-mono text-xs shrink-0 w-24 text-right" style={{ color: "var(--text-secondary)" }}>
              {frameIdx} / {totalFrames}
            </span>
          </div>

          <div className="w-px h-7" style={{ background: "var(--border)" }} />

          {/* Tab switch */}
          <div className="flex gap-1">
            {[
              { key: "live", text: "LIVE" },
              { key: "summary", text: "ANALYSIS" },
            ].map(({ key, text }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className="px-3 py-1.5 rounded text-xs font-semibold transition-all"
                style={{
                  background: activeTab === key ? "rgba(59,130,246,0.15)" : "transparent",
                  color: activeTab === key ? "var(--accent-blue)" : "var(--text-muted)",
                  border: activeTab === key ? "1px solid rgba(59,130,246,0.3)" : "1px solid transparent",
                }}
              >
                {text}
              </button>
            ))}
          </div>
        </div>

        {/* Charts / Summary — fixed equal height for all 4 charts */}
        {activeTab === "live" ? (
          <div className="grid grid-cols-4 gap-3" style={{ height: 320 }}>
            <ChartFPS data={frameData} />
            <ChartInfer data={frameData} />
            <ChartScore data={frameData} />
            <ChartDirection data={frameData} />
          </div>
        ) : (
          <SummaryPanel summary={summaryData} revealed={summaryOpen} />
        )}

        {/* Footer */}
        <div className="text-center text-[0.65rem] mt-6 pb-3 font-medium tracking-wide" style={{ color: "var(--text-muted)" }}>
          SL CORPORATION &middot; TURTLEBOT3 AUTONOMOUS DRIVING &middot; KDT 10
        </div>
      </div>
    </div>
  );
}
