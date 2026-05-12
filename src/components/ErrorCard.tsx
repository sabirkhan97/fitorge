export function ErrorCard({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-[rgba(255,107,107,0.06)] border border-[rgba(255,107,107,0.2)] rounded-2xl mb-6">
      <span className="text-3xl">⚠️</span>
      <div className="text-center">
        <p className="text-[13px] font-bold text-[#FF6B6B] mb-1 font-sans">Generation Failed</p>
        <p className="text-[12px] text-[#888] font-sans">{message}</p>
      </div>
      <button
        onClick={onRetry}
        className="px-6 py-2.5 bg-[rgba(255,107,107,0.12)] border border-[rgba(255,107,107,0.3)] rounded-xl text-[12px] font-bold text-[#FF6B6B] font-sans tracking-[0.08em] uppercase transition-all hover:-translate-y-px active:scale-95"
      >
        ↻ Try Again
      </button>
    </div>
  );
}