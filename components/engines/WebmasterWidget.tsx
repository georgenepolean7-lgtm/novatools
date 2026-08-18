"use client";

import React, { useState } from "react";
import { ToolDefinition } from "@/lib/tools/tool-types";
import {
  calculateCidr,
  parseUserAgent,
  generateHtaccessRedirect,
  generateSecurityHeaders,
  generateCacheControlHeader,
  generateNginxReverseProxy,
  generateCorsHeaders,
  parseUrlStructure,
  parseHttpRequestHeaders,
  WebmasterEngineResult,
} from "@/lib/engines/webmaster-engine";
import { Copy, Check, Server, Shield, Play } from "lucide-react";

interface WebmasterWidgetProps {
  tool: ToolDefinition;
}

export function WebmasterWidget({ tool }: WebmasterWidgetProps) {
  const action = (tool.customParams?.action as string) || tool.slug;

  const [inputStr, setInputStr] = useState(
    action.includes("cidr")
      ? "192.168.1.0/24"
      : action.includes("user-agent")
      ? (typeof navigator !== "undefined" ? navigator.userAgent : "")
      : action.includes("htaccess")
      ? "/old-blog-post"
      : action.includes("nginx")
      ? "example.com"
      : action.includes("cors")
      ? "https://example.com"
      : action.includes("url")
      ? "https://api.example.com:8080/v1/users?role=admin&limit=25#profile"
      : ""
  );

  const [toUrl, setToUrl] = useState("https://novatool.in/new-page");
  const [upstreamPort, setUpstreamPort] = useState(3000);
  const [cacheTarget, setCacheTarget] = useState<"static" | "ssr" | "api" | "immutable">("static");

  const [output, setOutput] = useState("");
  const [breakdown, setBreakdown] = useState<Record<string, string | number> | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleRun = () => {
    setError(null);
    let res: WebmasterEngineResult = { success: true, output: "" };

    if (action.includes("cidr")) {
      res = calculateCidr(inputStr);
    } else if (action.includes("user-agent")) {
      res = parseUserAgent(inputStr || (typeof navigator !== "undefined" ? navigator.userAgent : ""));
    } else if (action.includes("htaccess")) {
      res = generateHtaccessRedirect(inputStr, toUrl, "301");
    } else if (action.includes("security-header")) {
      res = generateSecurityHeaders({ hsts: true, xFrame: "DENY", xContentType: true, cspPreset: "strict" });
    } else if (action.includes("cache-control")) {
      res = generateCacheControlHeader(cacheTarget, 365);
    } else if (action.includes("nginx")) {
      res = generateNginxReverseProxy(inputStr || "example.com", upstreamPort, true, true);
    } else if (action.includes("cors")) {
      res = generateCorsHeaders(inputStr || "*", "GET, POST, PUT, DELETE, OPTIONS", true);
    } else if (action.includes("url")) {
      res = parseUrlStructure(inputStr);
    } else if (action.includes("header-parser") || action.includes("http-request-header")) {
      res = parseHttpRequestHeaders(inputStr || "Host: api.example.com\nUser-Agent: Mozilla/5.0\nAccept: application/json\nAuthorization: Bearer token123");
    }

    if (!res.success) {
      setError(res.error || "Webmaster utility error");
    } else {
      setOutput(res.output);
      setBreakdown(res.breakdown);
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        {action.includes("htaccess") && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-cyan-400 uppercase">Old Source Path</label>
              <input
                type="text"
                value={inputStr}
                onChange={(e) => setInputStr(e.target.value)}
                placeholder="/old-page"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-cyan-400 uppercase">Target Redirect URL</label>
              <input
                type="text"
                value={toUrl}
                onChange={(e) => setToUrl(e.target.value)}
                placeholder="https://example.com/new-page"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm font-mono"
              />
            </div>
          </div>
        )}

        {action.includes("nginx") && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-cyan-400 uppercase">Domain Name</label>
              <input
                type="text"
                value={inputStr}
                onChange={(e) => setInputStr(e.target.value)}
                placeholder="app.example.com"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-cyan-400 uppercase">Upstream App Port</label>
              <input
                type="number"
                value={upstreamPort}
                onChange={(e) => setUpstreamPort(Number(e.target.value))}
                placeholder="3000"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm font-mono"
              />
            </div>
          </div>
        )}

        {action.includes("cache-control") && (
          <div className="space-y-1">
            <label className="text-xs font-semibold text-cyan-400 uppercase">Resource Strategy</label>
            <select
              value={cacheTarget}
              onChange={(e) => setCacheTarget(e.target.value as "static" | "ssr" | "api" | "immutable")}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
            >
              <option value="static">Static Assets (Images, Fonts, CSS, JS - 1 Year Cache)</option>
              <option value="ssr">Server Rendered HTML / SSR (Stale-While-Revalidate)</option>
              <option value="api">Dynamic API / Private Data (No Cache, Must Revalidate)</option>
              <option value="immutable">Versioned Static Assets (Immutable)</option>
            </select>
          </div>
        )}

        {!action.includes("htaccess") && !action.includes("nginx") && !action.includes("cache-control") && !action.includes("security-header") && (
          <div className="space-y-1">
            <label className="text-xs font-semibold text-cyan-400 uppercase">
              {action.includes("cidr") ? "CIDR Subnet Block (e.g. 192.168.1.0/24)" : action.includes("cors") ? "Allowed Origin (e.g. https://myfrontend.com or *)" : "Input URL / User-Agent"}
            </label>
            <input
              type="text"
              value={inputStr}
              onChange={(e) => setInputStr(e.target.value)}
              placeholder="Enter parameter..."
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm font-mono"
            />
          </div>
        )}
      </div>

      <div className="flex flex-wrap justify-between items-center gap-4">
        <button
          type="button"
          onClick={handleRun}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold shadow-lg shadow-cyan-500/20 active:scale-98 transition-all cursor-pointer"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Execute {tool.name}</span>
        </button>

        {output && (
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
            <span>Copy Configuration</span>
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
          {error}
        </div>
      )}

      {output && (
        <div className="space-y-4">
          <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <Server className="w-4 h-4" />
            <span>Generated Server / Webmaster Result</span>
          </div>
          <pre className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-cyan-300 font-mono text-sm overflow-x-auto whitespace-pre-wrap">
            {output}
          </pre>
        </div>
      )}

      {breakdown && (
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>Configuration Details</span>
          </div>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {Object.entries(breakdown).map(([label, val]) => (
              <div key={label} className="flex justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <dt className="text-slate-400">{label}:</dt>
                <dd className="font-semibold text-slate-200 font-mono">{String(val)}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}
