"use client";

import { sdk } from "@farcaster/miniapp-sdk";
import { useCallback, useEffect, useState } from "react";

/**
 * Debug banner that displays the query params the mini app was launched with,
 * plus a button that re-opens this app via `sdk.actions.openMiniApp` with an
 * incremented counter param.
 *
 * Used to verify that query params are forwarded to a launched mini app even
 * when the app declares its own `action.url` (Farcaster monorepo PR #10609 /
 * NEYN-12877). wownar declares `action.url = appUrl` (the bare home URL) in
 * `layout.tsx`, so before that fix the params were dropped; after it they are
 * merged onto the launch URL and land here on `window.location.search`.
 *
 * The button covers the `openMiniApp` path specifically: it opens this same app
 * with `?openMiniAppCount=N+1`. Because the host resolves the declared
 * `action.url` (no params) and must re-attach the caller URL's params, each tap
 * should increment the counter shown in the banner. Before the fix the counter
 * never appears; after it, it climbs 1, 2, 3, ...
 *
 * Reads `window.location.search` directly in an effect (instead of Next's
 * `useSearchParams()`) to avoid the App Router's `<Suspense>` requirement and
 * any prerender bailout. Mounted above the auth gate so it is visible on launch
 * before sign-in.
 */
export function QueryParamsDebug() {
  const [entries, setEntries] = useState<[string, string][]>([]);
  const [href, setHref] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setEntries(Array.from(params.entries()));
    setHref(window.location.href);
  }, []);

  const openSelfWithParam = useCallback(async () => {
    try {
      const url = new URL(window.location.href);
      const next =
        Number(url.searchParams.get("openMiniAppCount") ?? "0") + 1;
      url.searchParams.set("openMiniAppCount", String(next));
      setStatus(`opening self with openMiniAppCount=${next}...`);
      await sdk.actions.openMiniApp({ url: url.toString() });
    } catch (error) {
      setStatus(`openMiniApp failed: ${String(error)}`);
    }
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
      <button
        type="button"
        onClick={openSelfWithParam}
        style={{
          marginTop: 6,
          padding: "4px 8px",
          fontFamily: "monospace",
          fontSize: 12,
          color: "#0f0",
          background: "transparent",
          border: "1px solid #0f0",
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
        openMiniApp → self (+1 param)
      </button>
      {status ? (
        <div style={{ color: "#888", marginTop: 4 }}>{status}</div>
      ) : null}
    </div>
  );
}
