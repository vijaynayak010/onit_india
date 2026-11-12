import React, { useMemo } from "react";
import { AlertCircle, Copy, ChevronDown } from "lucide-react";

const copyText = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

const layerColors = {
  backend: "bg-orange-100 text-orange-800",
  auth0: "bg-purple-100 text-purple-800",
  frontend: "bg-blue-100 text-blue-800",
  database: "bg-red-100 text-red-800",
};

/**
 * Shows user-facing auth error + expandable debug block for AI/backend triage.
 */
const AuthErrorPanel = ({ detail, onDismiss, defaultOpen = true }) => {
  const debugJson = useMemo(() => {
    if (!detail) return "";
    return JSON.stringify(
      {
        code: detail.code,
        status: detail.status,
        title: detail.title,
        layer: detail.layer,
        phase: detail.phase,
        backendMessage: detail.backendMessage,
        backendError: detail.backendError,
        requestUrl: detail.requestUrl,
        apis: detail.apis,
        session: detail.session,
        cause: detail.cause,
        fixes: detail.fixes,
        timestamp: detail.timestamp,
        raw: detail.raw,
      },
      null,
      2
    );
  }, [detail]);

  if (!detail) return null;

  const layerClass = layerColors[detail.layer] || "bg-gray-100 text-gray-800";

  return (
    <div className="mb-4 overflow-hidden rounded-xl border border-red-200 bg-red-50/90">
      <div className="flex items-start gap-2.5 p-3.5">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span className={`rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-wide ${layerClass}`}>
              {detail.layer}
            </span>
            <span className="rounded-md bg-red-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-red-700">
              {detail.code}
            </span>
            {detail.status ? (
              <span className="text-[10px] font-bold text-red-600">HTTP {detail.status}</span>
            ) : null}
          </div>
          <p className="text-sm font-medium text-red-900">{detail.title}</p>
          <p className="mt-1 text-[13px] font-semibold leading-relaxed text-red-800">
            {detail.userMessage}
          </p>
        </div>
        {onDismiss ? (
          <button
            type="button"
            onClick={onDismiss}
            className="shrink-0 text-xs font-bold text-red-600 hover:underline"
          >
            Dismiss
          </button>
        ) : null}
      </div>

      <details
        open={defaultOpen}
        className="border-t border-red-200/80 bg-white/60 px-3.5 py-2"
      >
        <summary className="flex cursor-pointer list-none items-center gap-1.5 text-xs font-bold text-red-900 [&::-webkit-details-marker]:hidden">
          <ChevronDown className="h-3.5 w-3.5" />
          Debug info — copy and send to AI / backend
        </summary>

        <div className="mt-3 space-y-3 text-xs text-red-950">
          <div>
            <p className="mb-1 font-black uppercase tracking-wide text-red-700">Likely cause</p>
            <p className="leading-relaxed">{detail.cause}</p>
          </div>

          {detail.fixes?.length ? (
            <div>
              <p className="mb-1 font-black uppercase tracking-wide text-red-700">Fixes</p>
              <ul className="list-disc space-y-1 pl-4">
                {detail.fixes.map((fix) => (
                  <li key={fix} className="leading-relaxed">
                    {fix}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {detail.apis?.length ? (
            <p>
              <span className="font-black text-red-700">APIs: </span>
              {detail.apis.join(" · ")}
            </p>
          ) : null}

          <div className="relative">
            <button
              type="button"
              onClick={() => copyText(debugJson)}
              className="absolute right-2 top-2 flex items-center gap-1 rounded-md border border-red-200 bg-white px-2 py-1 text-[10px] font-bold text-red-700 hover:bg-red-50"
            >
              <Copy className="h-3 w-3" />
              Copy JSON
            </button>
            <pre className="max-h-64 overflow-auto rounded-lg border border-red-100 bg-red-50/50 p-3 pr-24 text-[10px] leading-relaxed">
              {debugJson}
            </pre>
          </div>
        </div>
      </details>
    </div>
  );
};

export default AuthErrorPanel;
