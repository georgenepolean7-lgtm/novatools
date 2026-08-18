"use client";

import React, { useState } from "react";
import { ToolDefinition } from "@/lib/tools/tool-types";
import { formatFileSize, previewBatchRenaming, detectMagicNumbers } from "@/lib/engines/file-engine";
import { FileCheck, Copy, Check, Shield, Download, FileText, Layers, Split, Eye } from "lucide-react";

interface FileWidgetProps {
  tool: ToolDefinition;
}

export function FileWidget({ tool }: FileWidgetProps) {
  const action = (tool.customParams?.action as string) || tool.slug;

  // Single file state
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [fileType, setFileType] = useState("");
  const [lastModified, setLastModified] = useState("");
  const [sha256Hash, setSha256Hash] = useState("");
  const [magicType, setMagicType] = useState("");
  const [dataUrl, setDataUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Batch Renamer State
  const [batchNames, setBatchNames] = useState("IMG_001.jpg\nIMG_002.jpg\nIMG_003.jpg\nscreenshot_final.png\ndocument-draft.pdf");
  const [prefix, setPrefix] = useState("Nova_");
  const [suffix, setSuffix] = useState("2024");
  const [useSequential, setUseSequential] = useState(true);

  // Text Merger / Splitter State
  const [textContent, setTextContent] = useState("Line 1: Customer Record Alpha\nLine 2: Customer Record Beta\nLine 3: Customer Record Gamma\nLine 4: Customer Record Delta\nLine 5: Customer Record Epsilon\nLine 6: Customer Record Zeta");
  const [splitLines, setSplitLines] = useState(2);

  // Handle single file inspection / checksum / data url
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setFileSize(formatFileSize(file.size));
    setFileType(file.type || "application/octet-stream");
    setLastModified(new Date(file.lastModified).toLocaleString());
    setLoading(true);
    setSha256Hash("");
    setMagicType("");
    setDataUrl("");

    try {
      const buffer = await file.arrayBuffer();

      // Checksum
      const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
      setSha256Hash(hashHex);

      // Magic numbers (first 16 bytes)
      const headBytes = Array.from(new Uint8Array(buffer.slice(0, 16)))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      setMagicType(detectMagicNumbers(headBytes));

      // Data URL
      if (file.size < 5 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = () => {
          setDataUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setDataUrl("File too large for Data URL preview (>5MB)");
      }
    } catch {
      setSha256Hash("Error computing file digest");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string) => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadText = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renameResult = previewBatchRenaming(
    batchNames.split("\n").filter((n) => n.trim().length > 0),
    { prefix, suffix, useSequential, startNumber: 1, digits: 3 }
  );

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Batch Renamer Tool View */}
      {action.includes("batch-file-renamer") && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span>Batch Renaming Rules</span>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-300">File Names (One per line)</label>
              <textarea
                value={batchNames}
                onChange={(e) => setBatchNames(e.target.value)}
                rows={6}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Prefix</label>
                <input
                  type="text"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Suffix</label>
                <input
                  type="text"
                  value={suffix}
                  onChange={(e) => setSuffix(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="seq"
                checked={useSequential}
                onChange={(e) => setUseSequential(e.target.checked)}
                className="rounded border-slate-700 bg-slate-950 text-cyan-500"
              />
              <label htmlFor="seq" className="text-xs text-slate-300">Sequential Numbers (001, 002...)</label>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-950/30 to-slate-900/80 border border-cyan-500/20 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                Renaming Preview ({renameResult.filesList?.length || 0} Files)
              </div>
              <div className="max-h-64 overflow-y-auto space-y-2 pr-1 text-xs font-mono">
                {renameResult.filesList?.map((item, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-slate-950/70 border border-slate-800 space-y-0.5">
                    <div className="text-slate-500 line-through truncate">{item.original}</div>
                    <div className="text-emerald-400 font-semibold truncate">➔ {item.renamed}</div>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={() => handleCopy(renameResult.filesList?.map((f) => f.renamed).join("\n") || "")}
              className="w-full inline-flex justify-center items-center gap-2 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4" />}
              <span>Copy Renamed List</span>
            </button>
          </div>
        </div>
      )}

      {/* Text Splitter / Merger Tool View */}
      {(action.includes("text-file-splitter") || action.includes("text-file-merger")) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
              {action.includes("splitter") ? <Split className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
              <span>Text Document Input</span>
            </div>
            <textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              rows={8}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs"
            />
            {action.includes("splitter") && (
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Split Every N Lines</label>
                <input
                  type="number"
                  min={1}
                  value={splitLines}
                  onChange={(e) => setSplitLines(Number(e.target.value))}
                  className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs"
                />
              </div>
            )}
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/30 to-slate-900/80 border border-indigo-500/20 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                Processed Output
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap max-h-56 overflow-y-auto">
                {textContent}
              </div>
            </div>
            <button
              onClick={() => handleDownloadText(textContent, "novatools-document.txt")}
              className="w-full inline-flex justify-center items-center gap-2 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Consolidated Text</span>
            </button>
          </div>
        </div>
      )}

      {/* General Single File Inspector / Checksum / Data URL View */}
      {!action.includes("batch-file-renamer") && !action.includes("text-file-splitter") && !action.includes("text-file-merger") && (
        <>
          <div className="p-8 rounded-2xl bg-slate-900/80 border-2 border-dashed border-slate-700 hover:border-slate-500 text-center space-y-4 transition-all">
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
              <FileCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-white cursor-pointer">
                <span>Select any local file to inspect</span>
                <input type="file" onChange={handleFileChange} className="hidden" />
              </label>
              <p className="text-xs text-slate-400">Streamed 100% locally via Web APIs. Zero server upload.</p>
            </div>
          </div>

          {fileName && (
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                  <div className="text-slate-500">File Name</div>
                  <div className="font-semibold text-slate-200 truncate">{fileName}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                  <div className="text-slate-500">File Size</div>
                  <div className="font-semibold text-slate-200">{fileSize}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                  <div className="text-slate-500">MIME Type</div>
                  <div className="font-semibold text-slate-200 truncate">{fileType}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                  <div className="text-slate-500">Last Modified</div>
                  <div className="font-semibold text-slate-200 truncate">{lastModified}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                  <div className="text-slate-500">Magic Signature</div>
                  <div className="font-semibold text-cyan-400 truncate">{magicType || "Analyzing..."}</div>
                </div>
              </div>

              {/* SHA-256 */}
              <div className="space-y-1">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>SHA-256 Cryptographic Checksum</span>
                </div>
                {loading ? (
                  <div className="p-4 rounded-xl bg-slate-950 text-amber-400 text-sm font-mono animate-pulse">
                    Streaming and computing cryptographic digest in local hardware...
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-xs break-all flex justify-between items-center gap-3">
                    <span>{sha256Hash}</span>
                    <button
                      onClick={() => handleCopy(sha256Hash)}
                      className="shrink-0 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                      title="Copy Hash"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                )}
              </div>

              {/* Data URL */}
              {action.includes("data-url") && dataUrl && (
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-purple-400" />
                    <span>Base64 Data URL Scheme</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-xs break-all max-h-32 overflow-y-auto">
                    {dataUrl}
                  </div>
                  <button
                    onClick={() => handleCopy(dataUrl)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Data URL</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
