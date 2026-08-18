"use client";

import React, { useState } from "react";
import { ToolDefinition } from "@/lib/tools/tool-types";
import {
  generateStrongPassword,
  checkPasswordStrength,
  generateHmac,
  validateAndParseUuid,
  calculateIpv4Subnet,
  convertIpv4Format,
  compressExpandIpv6,
  validateIpv6,
  validateMacAddress,
  parseUserAgent,
  lookupHttpStatusCode,
  lookupMimeType,
  encodeBase32,
  decodeBase32,
  encodeBase58,
  decodeBase58,
  encodeUnicodeEscape,
  decodeUnicodeEscape,
  rot13Cipher,
  calculateCrc32,
  lookupPortNumber,
  convertPunycode,
  calculateMd5,
  estimateArgon2BcryptWorkCost,
  identifyHashType,
  calculateSha3,
  SecurityEngineResult,
} from "@/lib/engines/security-engine";
import { Copy, Check, Shield, Lock, Play, Sparkles, RefreshCw } from "lucide-react";

interface SecurityWidgetProps {
  tool: ToolDefinition;
}

export function SecurityWidget({ tool }: SecurityWidgetProps) {
  const action = (tool.customParams?.action as string) || tool.slug;
  const [input, setInput] = useState(
    action === "password-generator"
      ? ""
      : action === "ipv4-subnet"
      ? "192.168.1.0/24"
      : action === "ipv4-convert"
      ? "192.168.1.1"
      : action === "ipv6-expand"
      ? "2001:db8::1"
      : action === "mac-lookup"
      ? "00:1A:2B:3C:4D:5E"
      : action === "http-status"
      ? "404"
      : action === "port-lookup"
      ? "443"
      : action === "mime-lookup"
      ? "pdf"
      : ""
  );

  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [breakdown, setBreakdown] = useState<Record<string, string | number> | undefined>(undefined);

  // Password Generator options
  const [passLength, setPassLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);

  // HMAC options
  const [hmacSecret, setHmacSecret] = useState("my-secret-key");
  const [hmacAlgo, setHmacAlgo] = useState<"SHA-256" | "SHA-512" | "SHA-384">("SHA-256");

  // Cost calculation
  const [costFactor, setCostFactor] = useState(12);

  const handleProcess = async () => {
    setError(null);
    let res: SecurityEngineResult = { success: true, output: "" };

    if (action === "password-generator") {
      res = generateStrongPassword(passLength, useUpper, useLower, useNumbers, useSymbols);
    } else if (action === "password-strength") {
      res = checkPasswordStrength(input);
    } else if (action === "hmac-generator") {
      res = await generateHmac(input, hmacSecret, hmacAlgo);
    } else if (action === "uuid-validator") {
      res = validateAndParseUuid(input);
    } else if (action === "ipv4-subnet") {
      res = calculateIpv4Subnet(input);
    } else if (action === "ipv4-convert") {
      res = convertIpv4Format(input);
    } else if (action === "ipv6-expand") {
      res = compressExpandIpv6(input, "expand");
    } else if (action === "ipv6-compress") {
      res = compressExpandIpv6(input, "compress");
    } else if (action === "ipv6-validator") {
      res = validateIpv6(input);
    } else if (action === "mac-lookup") {
      res = validateMacAddress(input);
    } else if (action === "user-agent") {
      res = parseUserAgent(input || (typeof navigator !== "undefined" ? navigator.userAgent : ""));
    } else if (action === "http-status") {
      res = lookupHttpStatusCode(input);
    } else if (action === "mime-lookup") {
      res = lookupMimeType(input);
    } else if (action === "base32-encode") {
      res = encodeBase32(input);
    } else if (action === "base32-decode") {
      res = decodeBase32(input);
    } else if (action === "base58-encode") {
      res = encodeBase58(input);
    } else if (action === "base58-decode") {
      res = decodeBase58(input);
    } else if (action === "unicode-escape-encode") {
      res = encodeUnicodeEscape(input);
    } else if (action === "unicode-escape-decode") {
      res = decodeUnicodeEscape(input);
    } else if (action === "rot13") {
      res = rot13Cipher(input);
    } else if (action === "crc32") {
      res = calculateCrc32(input);
    } else if (action === "port-lookup") {
      res = lookupPortNumber(input);
    } else if (action === "punycode-convert") {
      res = convertPunycode(input, "toPunycode");
    } else if (action === "md5-checksum") {
      res = calculateMd5(input);
    } else if (action === "argon2-bcrypt-cost") {
      res = estimateArgon2BcryptWorkCost("bcrypt", costFactor);
    } else if (action === "hash-identifier") {
      res = identifyHashType(input);
    } else if (action === "sha3-hash") {
      res = calculateSha3(input);
    }

    if (!res.success) {
      setError(res.error || "Operation failed");
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
      {/* Password Generator Custom Controls */}
      {action === "password-generator" && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex justify-between items-center text-xs text-slate-300">
            <span className="font-semibold uppercase tracking-wider text-rose-400">Password Length:</span>
            <span className="font-mono text-base font-bold text-white">{passLength} Characters</span>
          </div>
          <input
            type="range"
            min={8}
            max={64}
            value={passLength}
            onChange={(e) => setPassLength(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-300">
            <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={useUpper} onChange={(e) => setUseUpper(e.target.checked)} className="rounded accent-rose-500" />
              <span>Uppercase (A-Z)</span>
            </label>
            <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={useLower} onChange={(e) => setUseLower(e.target.checked)} className="rounded accent-rose-500" />
              <span>Lowercase (a-z)</span>
            </label>
            <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={useNumbers} onChange={(e) => setUseNumbers(e.target.checked)} className="rounded accent-rose-500" />
              <span>Numbers (0-9)</span>
            </label>
            <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={useSymbols} onChange={(e) => setUseSymbols(e.target.checked)} className="rounded accent-rose-500" />
              <span>Symbols (!@#$)</span>
            </label>
          </div>
        </div>
      )}

      {/* HMAC Custom Secret Key Bar */}
      {action === "hmac-generator" && (
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-wrap gap-4 text-xs">
          <div className="flex-1 min-w-[240px] space-y-1">
            <label className="text-slate-400 font-semibold uppercase">Secret Key / Salt</label>
            <input
              type="text"
              value={hmacSecret}
              onChange={(e) => setHmacSecret(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-slate-400 font-semibold uppercase">Hash Algorithm</label>
            <select
              value={hmacAlgo}
              onChange={(e) => setHmacAlgo(e.target.value as "SHA-256" | "SHA-512" | "SHA-384")}
              className="p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm"
            >
              <option value="SHA-256">HMAC-SHA-256</option>
              <option value="SHA-512">HMAC-SHA-512</option>
              <option value="SHA-384">HMAC-SHA-384</option>
            </select>
          </div>
        </div>
      )}

      {/* Cost factor for Argon2/Bcrypt */}
      {action === "argon2-bcrypt-cost" && (
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
          <div className="flex justify-between items-center text-slate-300">
            <span className="font-semibold uppercase text-rose-400">Work Factor (Cost):</span>
            <span className="font-mono text-sm font-bold text-white">{costFactor} (2^{costFactor} iterations)</span>
          </div>
          <input
            type="range"
            min={4}
            max={20}
            value={costFactor}
            onChange={(e) => setCostFactor(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
          />
        </div>
      )}

      {/* Input Field (hidden for password generator) */}
      {action !== "password-generator" && (
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-rose-400 uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <Lock className="w-4 h-4" />
              <span>Input Parameter</span>
            </div>
            {input && (
              <button
                type="button"
                onClick={() => { setInput(""); setOutput(""); setError(null); setBreakdown(undefined); }}
                className="text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Enter input for ${tool.name}...`}
            rows={4}
            className="w-full p-4 rounded-2xl bg-slate-900/80 border border-slate-800 focus:border-rose-500 text-slate-100 font-mono text-sm outline-none transition-all placeholder:text-slate-600 resize-y"
          />
        </div>
      )}

      {/* Action Button */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={handleProcess}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-slate-950 font-bold shadow-lg shadow-rose-500/20 active:scale-98 transition-all cursor-pointer"
        >
          {action === "password-generator" ? <RefreshCw className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          <span>{action === "password-generator" ? "Generate Strong Password" : `Execute ${tool.name}`}</span>
        </button>

        {output && (
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
            <span>{copied ? "Copied!" : "Copy Result"}</span>
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
          {error}
        </div>
      )}

      {/* Output Display */}
      {output && (
        <div className="space-y-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-rose-400" />
            <span>Cryptographic / Network Result</span>
          </div>
          <pre className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-rose-300 font-mono text-sm overflow-x-auto whitespace-pre-wrap max-h-[400px]">
            {output}
          </pre>
        </div>
      )}

      {/* Breakdown Metrics */}
      {breakdown && (
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-rose-400" />
            <span>Security Analysis Details</span>
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
