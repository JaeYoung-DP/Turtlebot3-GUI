export default function VideoPlayer({ label, src, videoRef }) {
  return (
    <div className="bg-slate-100 border border-slate-200 rounded-lg overflow-hidden">
      <div className="text-xs font-semibold text-slate-600 px-3 py-2 bg-white border-b border-slate-200">{label}</div>
      <video ref={videoRef} src={src} controls
        style={{ width:"100%", height:410, objectFit:"cover", background:"#0f172a" }} />
    </div>
  );
}