"use client";

import { useEffect, useState } from "react";

/**
 * Debug banner that displays the query params the mini app was launched with.
 *
 * Used to verify that cast/embed query params are forwarded to a launched mini
 * app even when the app declares its own `action.url` (Farcaster monorepo PR
 * #10609 / NEYN-12877). wownar declares `action.url = appUrl` (the bare home
 * URL) in `layout.tsx`, so before that fix the params on the cast URL were
 * dropped; after it they are merged onto the launch URL and land here on
 * `window.location.search`.
 *
 * Reads `window.location.search` directly in an effect (instead of Next's
 * `useSearchParams()`) to avoid the App Router's `<Suspense>` requirement and
 * any prerender bailout. Mounted above the auth gate so it is visible on launch
 * before sign-in.
 */
export function QueryParamsDebug() {
  const [entries, setEntries] = useState<[string, string][]>([]);
  const [href, setHref] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setEntries(Array.from(params.entries()));
    setHref(window.location.href);
  }, []);

  return (
    <div
      data-testid="query-params-debug"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        padding: "8px 12px",
        fontFamily: "monospace",
        fontSize: 12,
        lineHeight: 1.4,
        background: "#111",
        color: "#0f0",
        borderBottom: "1px solid #0f0",
        maxHeight: "40vh",
        overflow: "auto",
      }}
    >
      <div style={{ color: "#888", wordBreak: "break-all" }}>{href}</div>
      {entries.length === 0 ? (
        <div>(no query params received)</div>
      ) : (
        <ul style={{ margin: 0, paddingLeft: 16 }}>
          {entries.map(([key, value]) => (
            <li key={key}>
              <b>{key}</b> = {value}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
