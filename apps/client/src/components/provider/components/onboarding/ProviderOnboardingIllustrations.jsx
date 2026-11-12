import React from "react";

function WavyHeader({ children }) {
  return (
    <div className="relative overflow-hidden bg-[#E8F8F1] px-6 pb-8 pt-10">
      <svg
        className="pointer-events-none absolute bottom-0 left-0 w-full text-white"
        viewBox="0 0 400 40"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          fill="currentColor"
          d="M0,24 C80,8 120,36 200,20 C280,4 320,32 400,16 L400,40 L0,40 Z"
        />
      </svg>
      <div className="relative z-[1] flex min-h-[220px] items-center justify-center">
        {children}
      </div>
    </div>
  );
}

export function PostTaskIllustration() {
  return (
    <WavyHeader>
      <div className="relative h-[200px] w-full max-w-[280px]">
        <div className="absolute left-1/2 top-1/2 h-[150px] w-[88px] -translate-x-1/2 -translate-y-1/2 rounded-[22px] border-[3px] border-gray-800 bg-white shadow-lg">
          <div className="mx-auto mt-3 h-1.5 w-10 rounded-full bg-gray-200" />
          <div className="mt-4 flex flex-col items-center px-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FDE68A] text-2xl">
              👋
            </div>
            <p className="mt-2 text-[11px] font-bold text-gray-800">Hello!</p>
          </div>
        </div>
        {[
          { top: "8%", left: "6%", label: "📍" },
          { top: "18%", right: "4%", label: "⚙️" },
          { top: "58%", left: "0%", label: "🔗" },
          { top: "62%", right: "2%", label: "✉️" },
          { bottom: "8%", left: "18%", label: "🔒" },
        ].map((item, i) => (
          <span
            key={i}
            className="absolute flex h-9 w-9 items-center justify-center rounded-lg bg-white text-base shadow-md"
            style={{
              top: item.top,
              left: item.left,
              right: item.right,
              bottom: item.bottom,
            }}
          >
            {item.label}
          </span>
        ))}
      </div>
    </WavyHeader>
  );
}

export function BestMatchesIllustration() {
  return (
    <WavyHeader>
      <div className="relative flex h-[200px] w-full max-w-[300px] items-end justify-center gap-1">
        <div className="mb-2 flex h-24 w-16 flex-col items-center justify-end">
          <div className="h-10 w-10 rounded-full bg-[#BFDBFE] border-2 border-white shadow" />
          <div className="mt-1 h-12 w-full rounded-t-2xl bg-[#93C5FD]" />
        </div>
        <div className="relative z-10 mb-0">
          <div className="absolute -left-8 top-6 h-20 w-20 rounded-full border-4 border-[#10605F]/30 bg-white/40" />
          <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-[5px] border-[#10605F] bg-white shadow-lg">
            <div className="h-16 w-16 rounded-full bg-[#FCD34D] border-4 border-white" />
          </div>
          <div className="absolute -right-3 bottom-2 h-10 w-14 rounded-lg bg-[#10605F] shadow" />
        </div>
        <div className="mb-4 flex h-20 w-14 flex-col items-center justify-end">
          <div className="h-9 w-9 rounded-full bg-[#F9A8D4] border-2 border-white shadow" />
          <div className="mt-1 h-10 w-full rounded-t-xl bg-[#F472B6]" />
        </div>
        <div className="mb-6 flex h-16 w-12 flex-col items-center justify-end opacity-80">
          <div className="h-8 w-8 rounded-full bg-[#A7F3D0] border-2 border-white shadow" />
          <div className="mt-1 h-8 w-full rounded-t-lg bg-[#34D399]" />
        </div>
      </div>
    </WavyHeader>
  );
}

export function TrackPayIllustration() {
  return (
    <WavyHeader>
      <div className="relative h-[200px] w-full max-w-[300px]">
        <div className="absolute left-1/2 top-1/2 h-[140px] w-[90px] -translate-x-1/2 -translate-y-1/2 rounded-[22px] border-[3px] border-gray-800 bg-white shadow-lg">
          <div className="mx-auto mt-3 h-1.5 w-10 rounded-full bg-gray-200" />
          <div className="mt-6 space-y-2 px-3">
            <div className="h-2 rounded-full bg-gray-100" />
            <div className="h-2 w-3/4 rounded-full bg-gray-100" />
            <div className="mx-auto mt-3 h-8 w-8 rounded-lg bg-[#10605F]/20" />
          </div>
        </div>
        <div className="absolute left-[8%] top-[28%] flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-[#FDE68A] border-2 border-white shadow" />
          <div className="mt-1 h-10 w-8 rounded-t-xl bg-[#F59E0B]" />
          <div className="absolute -right-6 top-0 rounded-xl bg-white px-2 py-1 text-[10px] shadow">💬</div>
        </div>
        <div className="absolute right-[6%] top-[32%] flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-[#BFDBFE] border-2 border-white shadow" />
          <div className="mt-1 h-10 w-8 rounded-t-xl bg-[#3B82F6]" />
          <div className="absolute -left-6 top-2 rounded-xl bg-white px-2 py-1 text-[10px] shadow">✓</div>
        </div>
        <div className="absolute left-[22%] top-[8%] rounded-xl bg-white px-2 py-1 text-[10px] shadow">💬</div>
        <div className="absolute right-[20%] top-[6%] rounded-xl bg-white px-2 py-1 text-[10px] shadow">💬</div>
      </div>
    </WavyHeader>
  );
}
