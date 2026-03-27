export default function VideoPlayer({ label, src, videoRef }) {
  return (
    <div className="dash-card overflow-hidden flex flex-col">
      {/* Title bar */}
      <div
        className="flex items-center justify-between px-3 py-2"
        style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
          <span className="text-xs font-semibold tracking-wide" style={{ color: "var(--text-secondary)" }}>{label}</span>
        </div>
        <span className="text-[0.6rem] font-mono" style={{ color: "var(--text-muted)" }}>LIVE</span>
      </div>
      {/* Video - preload metadata for smoother playback */}
      <video
        ref={videoRef}
        src={src}
        controls
        preload="auto"
        playsInline
        className="w-full"
        style={{ height: 340, objectFit: "cover", background: "var(--video-bg)" }}
      />
    </div>
  );
}
