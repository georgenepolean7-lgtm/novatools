"use client";

import React, { useState } from "react";
import { ToolDefinition } from "@/lib/tools/tool-types";
import {
  formatJson,
  minifyJson,
  validateJson,
  formatSql,
  decodeJwt,
  encodeBase64,
  decodeBase64,
  encodeUrl,
  decodeUrl,
  generateUuidV4,
  computeHash,
  testRegex,
  convertTimestamp,
  minifyHtml,
  minifyCss,
  convertHexToRgb,
  convertRgbToHex,
  convertPxToRem,
  encodeHtmlEntities,
  decodeHtmlEntities,
  generateBoxShadow,
  generateGradient,
  convertBinaryToDecimal,
  convertDecimalToBinary,
  convertAsciiToHex,
  convertHexToAscii,
  convertJsonToYaml,
  convertYamlToJson,
  convertCurlToFetch,
  computeTextDiff,
} from "@/lib/engines/developer-engine";
import {
  describeCronExpression,
  validateEnvFile,
  inspectPackageJson,
  escapeJsRegexString,
  convertCodeIndentation,
  calculateApiPayloadSize,
} from "@/lib/engines/devdiag-engine";
import { Copy, Check, Play, RefreshCw, Sliders, Sparkles } from "lucide-react";

interface DeveloperWidgetProps {
  tool: ToolDefinition;
}

export function DeveloperWidget({ tool }: DeveloperWidgetProps) {
  const [input, setInput] = useState("");
  const [secondaryInput, setSecondaryInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Dedicated controls for specific tools
  const [regexFlags, setRegexFlags] = useState("g");
  const [regexPattern, setRegexPattern] = useState("");
  const [hashAlgo, setHashAlgo] = useState<"SHA-256" | "SHA-512" | "SHA-1">("SHA-256");

  // Box shadow states
  const [shadowX, setShadowX] = useState(0);
  const [shadowY, setShadowY] = useState(12);
  const [shadowBlur, setShadowBlur] = useState(28);
  const [shadowSpread, setShadowSpread] = useState(-4);
  const [shadowColor, setShadowColor] = useState("#000000");
  const [shadowInset, setShadowInset] = useState(false);

  // Gradient states
  const [gradType, setGradType] = useState<"linear" | "radial">("linear");
  const [gradAngle, setGradAngle] = useState(135);
  const [gradColor1, setGradColor1] = useState("#06B6D4");
  const [gradColor2, setGradColor2] = useState("#3B82F6");
  const [gradColor3, setGradColor3] = useState("#8B5CF6");

  const action = (tool.customParams?.action as string) || tool.slug;

  const handleRun = async () => {
    setError(null);
    try {
      if (action === "format-json") {
        const res = formatJson(input);
        if (!res.success) setError(res.error || "Formatting error");
        else setOutput(res.output);
      } else if (action === "minify-json") {
        const res = minifyJson(input);
        if (!res.success) setError(res.error || "Minification error");
        else setOutput(res.output);
      } else if (action === "validate-json") {
        const res = validateJson(input);
        if (!res.success) setError(res.error || "Syntax error");
        else setOutput(res.output);
      } else if (action === "format-sql") {
        const res = formatSql(input);
        setOutput(res.output);
      } else if (action === "decode-jwt") {
        const res = decodeJwt(input);
        if (!res.success) setError(res.error || "JWT decode error");
        else setOutput(res.output);
      } else if (action === "encode-base64") {
        const res = encodeBase64(input);
        if (!res.success) setError(res.error || "Base64 encode error");
        else setOutput(res.output);
      } else if (action === "decode-base64") {
        const res = decodeBase64(input);
        if (!res.success) setError(res.error || "Base64 decode error");
        else setOutput(res.output);
      } else if (action === "encode-url") {
        const res = encodeUrl(input);
        setOutput(res.output);
      } else if (action === "decode-url") {
        const res = decodeUrl(input);
        if (!res.success) setError(res.error || "URL decode error");
        else setOutput(res.output);
      } else if (action === "generate-uuid") {
        setOutput(generateUuidV4());
      } else if (action === "compute-hash") {
        const res = await computeHash(input, hashAlgo);
        if (!res.success) setError(res.error || "Hash error");
        else setOutput(res.output);
      } else if (action === "test-regex") {
        const res = testRegex(regexPattern, regexFlags, input);
        if (!res.success) setError(res.error || "Regex error");
        else setOutput(res.output);
      } else if (action === "convert-timestamp") {
        const res = convertTimestamp(input);
        if (!res.success) setError(res.error || "Timestamp error");
        else setOutput(res.output);
      } else if (action === "minify-html") {
        const res = minifyHtml(input);
        setOutput(res.output);
      } else if (action === "minify-css") {
        const res = minifyCss(input);
        setOutput(res.output);
      } else if (action === "hex-to-rgb") {
        const res = convertHexToRgb(input);
        if (!res.success) setError(res.error || "Hex conversion error");
        else setOutput(res.output);
      } else if (action === "rgb-to-hex") {
        const res = convertRgbToHex(input);
        if (!res.success) setError(res.error || "RGB conversion error");
        else setOutput(res.output);
      } else if (action === "px-to-rem") {
        const res = convertPxToRem(Number(input));
        if (!res.success) setError(res.error || "Pixel conversion error");
        else setOutput(res.output);
      } else if (action === "encode-html-entities") {
        const res = encodeHtmlEntities(input);
        setOutput(res.output);
      } else if (action === "decode-html-entities") {
        const res = decodeHtmlEntities(input);
        setOutput(res.output);
      } else if (action === "css-box-shadow") {
        const res = generateBoxShadow(shadowX, shadowY, shadowBlur, shadowSpread, shadowColor, shadowInset);
        setOutput(res.output);
      } else if (action === "css-gradient") {
        const res = generateGradient(gradType, gradAngle, gradColor1, gradColor2, gradColor3);
        setOutput(res.output);
      } else if (action === "binary-to-decimal") {
        const res = convertBinaryToDecimal(input);
        if (!res.success) setError(res.error || "Binary conversion error");
        else setOutput(res.output);
      } else if (action === "decimal-to-binary") {
        const res = convertDecimalToBinary(Number(input));
        if (!res.success) setError(res.error || "Decimal conversion error");
        else setOutput(res.output);
      } else if (action === "ascii-to-hex") {
        const res = convertAsciiToHex(input);
        setOutput(res.output);
      } else if (action === "hex-to-ascii") {
        const res = convertHexToAscii(input);
        if (!res.success) setError(res.error || "Hex decoding error");
        else setOutput(res.output);
      } else if (action === "json-to-yaml") {
        const res = convertJsonToYaml(input);
        if (!res.success) setError(res.error || "JSON to YAML error");
        else setOutput(res.output);
      } else if (action === "yaml-to-json") {
        const res = convertYamlToJson(input);
        if (!res.success) setError(res.error || "YAML to JSON error");
        else setOutput(res.output);
      } else if (action === "curl-to-fetch") {
        const res = convertCurlToFetch(input);
        if (!res.success) setError(res.error || "cURL parsing error");
        else setOutput(res.output);
      } else if (action === "text-diff") {
        const res = computeTextDiff(input, secondaryInput);
        setOutput(res.output);
      } else if (action === "describe-cron" || action.includes("cron-expression")) {
        const res = describeCronExpression(input || "*/5 * * * *");
        if (!res.success) setError(res.error || "Cron parse error");
        else setOutput(res.output);
      } else if (action === "validate-env" || action.includes("env-file")) {
        const res = validateEnvFile(input);
        setOutput(res.output);
      } else if (action === "inspect-package-json" || action.includes("package-json")) {
        const res = inspectPackageJson(input);
        if (!res.success) setError(res.error || "JSON parse error");
        else setOutput(res.output);
      } else if (action === "escape-regex" || action.includes("regex-string-escape")) {
        const res = escapeJsRegexString(input);
        setOutput(res.output);
      } else if (action === "convert-indentation" || action.includes("indentation-converter")) {
        const res = convertCodeIndentation(input, "spaces", 2);
        setOutput(res.output);
      } else if (action === "api-payload-size" || action.includes("payload-size")) {
        const res = calculateApiPayloadSize(input);
        setOutput(res.output);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Processing failed");
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
      {/* Visual Box Shadow Generator Controls */}
      {action === "css-box-shadow" && (
        <div className="space-y-6 p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase text-cyan-400">
            <Sliders className="w-4 h-4" />
            <span>Interactive Box Shadow Controls</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Offset X ({shadowX}px)</span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                value={shadowX}
                onChange={(e) => setShadowX(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Offset Y ({shadowY}px)</span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                value={shadowY}
                onChange={(e) => setShadowY(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Blur Radius ({shadowBlur}px)</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={shadowBlur}
                onChange={(e) => setShadowBlur(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Spread Radius ({shadowSpread}px)</span>
              </div>
              <input
                type="range"
                min="-30"
                max="50"
                value={shadowSpread}
                onChange={(e) => setShadowSpread(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="text-xs text-slate-400">Shadow Color</label>
              <input
                type="color"
                value={shadowColor}
                onChange={(e) => setShadowColor(e.target.value)}
                className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
              />
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer ml-4">
                <input
                  type="checkbox"
                  checked={shadowInset}
                  onChange={(e) => setShadowInset(e.target.checked)}
                  className="rounded accent-cyan-400"
                />
                <span>Inset Shadow</span>
              </label>
            </div>
          </div>

          {/* Real-time preview */}
          <div className="p-8 rounded-xl bg-slate-950 flex items-center justify-center border border-slate-800">
            <div
              className="w-48 h-28 rounded-2xl bg-slate-800 flex items-center justify-center text-xs font-semibold text-slate-300"
              style={{
                boxShadow: `${shadowInset ? "inset " : ""}${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowSpread}px ${shadowColor}`,
              }}
            >
              Live Preview
            </div>
          </div>
        </div>
      )}

      {/* Visual Gradient Generator Controls */}
      {action === "css-gradient" && (
        <div className="space-y-6 p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase text-cyan-400">
            <Sparkles className="w-4 h-4" />
            <span>Interactive CSS Gradient Controls</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setGradType("linear")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                  gradType === "linear" ? "bg-cyan-500 text-slate-950" : "bg-slate-800 text-slate-400"
                }`}
              >
                Linear
              </button>
              <button
                type="button"
                onClick={() => setGradType("radial")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                  gradType === "radial" ? "bg-cyan-500 text-slate-950" : "bg-slate-800 text-slate-400"
                }`}
              >
                Radial
              </button>
            </div>

            {gradType === "linear" && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Angle ({gradAngle}°)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={gradAngle}
                  onChange={(e) => setGradAngle(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>
            )}

            <div className="flex items-center gap-4 sm:col-span-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Color 1:</span>
                <input
                  type="color"
                  value={gradColor1}
                  onChange={(e) => setGradColor1(e.target.value)}
                  className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Color 2:</span>
                <input
                  type="color"
                  value={gradColor2}
                  onChange={(e) => setGradColor2(e.target.value)}
                  className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Color 3:</span>
                <input
                  type="color"
                  value={gradColor3}
                  onChange={(e) => setGradColor3(e.target.value)}
                  className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div
            className="w-full h-32 rounded-2xl border border-slate-700 shadow-xl flex items-center justify-center text-sm font-bold text-white shadow-inner"
            style={{
              background:
                gradType === "linear"
                  ? `linear-gradient(${gradAngle}deg, ${gradColor1}, ${gradColor2}, ${gradColor3})`
                  : `radial-gradient(circle, ${gradColor1}, ${gradColor2}, ${gradColor3})`,
            }}
          >
            Gradient Preview
          </div>
        </div>
      )}

      {/* Regex Tester Controls */}
      {action === "test-regex" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="sm:col-span-2 space-y-1">
            <label className="text-xs font-semibold uppercase text-slate-400">Regular Expression Pattern</label>
            <input
              type="text"
              value={regexPattern}
              onChange={(e) => setRegexPattern(e.target.value)}
              placeholder="e.g. [A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"
              className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-700 text-white font-mono"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase text-slate-400">Flags</label>
            <input
              type="text"
              value={regexFlags}
              onChange={(e) => setRegexFlags(e.target.value)}
              placeholder="g, i, m"
              className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-700 text-white font-mono"
            />
          </div>
        </div>
      )}

      {/* Hash Generator Controls */}
      {action === "compute-hash" && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <label className="text-xs font-semibold uppercase text-slate-400">Algorithm:</label>
          {(["SHA-256", "SHA-512", "SHA-1"] as const).map((algo) => (
            <button
              key={algo}
              onClick={() => setHashAlgo(algo)}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                hashAlgo === algo
                  ? "bg-cyan-500 text-slate-950 font-bold"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {algo}
            </button>
          ))}
        </div>
      )}

      {/* Text Diff Checker Two-Column Inputs */}
      {action === "text-diff" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Original Text / Code
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste original version..."
              rows={8}
              className="w-full p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-100 font-mono text-xs resize-y outline-none"
            />
          </div>
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Modified Text / Code
            </div>
            <textarea
              value={secondaryInput}
              onChange={(e) => setSecondaryInput(e.target.value)}
              placeholder="Paste modified version to compare..."
              rows={8}
              className="w-full p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-100 font-mono text-xs resize-y outline-none"
            />
          </div>
        </div>
      ) : action !== "generate-uuid" && action !== "css-box-shadow" && action !== "css-gradient" ? (
        /* Standard Single Textarea Input */
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <span>
              {action === "test-regex"
                ? "Test String Input"
                : action === "hex-to-rgb"
                ? "Hex Color (e.g. #3B82F6)"
                : action === "rgb-to-hex"
                ? "RGB Color (e.g. rgb(59, 130, 246))"
                : action === "px-to-rem"
                ? "Pixel Value (e.g. 24)"
                : action === "curl-to-fetch"
                ? "cURL Command (e.g. curl -X POST https://api.com -H 'Auth: Bearer 123' -d '{\"id\":1}')"
                : "Input Payload / Code"}
            </span>
            {input && (
              <button
                onClick={() => { setInput(""); setOutput(""); setError(null); }}
                className="text-slate-500 hover:text-slate-300 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Enter input for ${tool.name}...`}
            rows={action === "hex-to-rgb" || action === "rgb-to-hex" || action === "px-to-rem" ? 3 : 7}
            className="w-full p-4 rounded-2xl bg-slate-900/80 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-100 font-mono text-sm resize-y outline-none transition-all placeholder:text-slate-600"
          />
        </div>
      ) : null}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={handleRun}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 active:scale-98 transition-all cursor-pointer"
        >
          {action === "generate-uuid" ? <RefreshCw className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          <span>{action === "generate-uuid" ? "Generate New UUID" : `Process ${tool.name}`}</span>
        </button>

        {output && (
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
            <span>{copied ? "Copied!" : "Copy Output"}</span>
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-3">
          <span className="font-bold">Error:</span>
          <span>{error}</span>
        </div>
      )}

      {output && (
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Output Result
          </div>
          <pre className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-sm overflow-x-auto whitespace-pre-wrap">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
