export default function StatusCard({ label, value }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg px-4 py-3 shadow-sm">
      <div className="text-xs text-slate-400 mb-1">{label}</div>
      <div className="font-bold text-[#1D3461] text-sm truncate">{value}</div>
    </div>
  );
}