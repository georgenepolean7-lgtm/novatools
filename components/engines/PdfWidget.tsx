"use client";

import React, { useState } from "react";
import { ToolDefinition } from "@/lib/tools/tool-types";
import {
  parsePdfMetadata,
  convertMarkdownToHtml,
  convertHtmlToMarkdown,
  estimateDocumentStats,
} from "@/lib/engines/pdf-engine";
import { FileText, Copy, Check, Eye, Download, Code2, BookOpen } from "lucide-react";

interface PdfWidgetProps {
  tool: ToolDefinition;
}

export function PdfWidget({ tool }: PdfWidgetProps) {
  const action = (tool.customParams?.action as string) || tool.slug;

  // Metadata editor state
  const [docTitle, setDocTitle] = useState("Annual Business Report 2024");
  const [docAuthor, setDocAuthor] = useState("Nova Code Tech");
  const [docSubject, setDocSubject] = useState("Enterprise Web Performance Architecture");
  const [docKeywords, setDocKeywords] = useState("pdf, performance, analytics, react, nextjs");

  // Markdown / HTML state
  const [markdownInput, setMarkdownInput] = useState(
    "# Nova Tools Executive Overview\n\nNova Tools is a **high-performance**, privacy-first utility platform.\n\n### Key Benefits\n- 100% Client-Side Computation\n- Zero Server Storage\n- Lightning Fast WebAssembly Execution\n\n```javascript\nconst isPrivate = true;\nconsole.log(`Privacy guaranteed: ${isPrivate}`);\n```"
  );
  const [htmlInput, setHtmlInput] = useState(
    "<h1>Welcome to Nova Tools</h1><p>The <strong>fastest</strong> and most secure developer toolkit.</p><ul><li>Client-side</li><li>Private</li></ul>"
  );

  // Document stats state
  const [documentText, setDocumentText] = useState(
    "Nova Tools represents a new paradigm in web utilities. By executing all computation directly within the user's browser via WebAssembly and modern JavaScript APIs, user privacy is permanently guaranteed. No documents or sensitive files are ever transmitted to external cloud servers. The platform features an extensive suite of developer utilities, mathematical calculators, PDF tools, cryptographic hashes, and SEO analyzers designed for professionals, students, and businesses."
  );

  // PDF Page Numbering State
  const [pagePosition, setPagePosition] = useState<"bottom-center" | "bottom-right" | "top-right">("bottom-center");
  const [numberingFormat, setNumberingFormat] = useState<"page-x" | "page-x-of-y" | "numbers-only">("page-x-of-y");
  const [startPage, setStartPage] = useState(1);
  const [totalPages, setTotalPages] = useState(12);

  const [copied, setCopied] = useState(false);

  let outputContent = "";
  let breakdown: Record<string, string | number> | undefined = undefined;

  if (action.includes("metadata")) {
    const res = parsePdfMetadata({ title: docTitle, author: docAuthor, subject: docSubject, keywords: docKeywords });
    outputContent = res.output;
    breakdown = res.breakdown;
  } else if (action.includes("markdown-to-html")) {
    const res = convertMarkdownToHtml(markdownInput);
    outputContent = res.output;
    breakdown = res.breakdown;
  } else if (action.includes("html-to-markdown")) {
    const res = convertHtmlToMarkdown(htmlInput);
    outputContent = res.output;
    breakdown = res.breakdown;
  } else if (action.includes("docx-text") || action.includes("stats") || action.includes("document-word-counter")) {
    const res = estimateDocumentStats(documentText);
    outputContent = res.output;
    breakdown = res.breakdown;
  } else if (action.includes("page-numberer")) {
    outputContent = `Page Numbering Configuration Applied:\nFormat: ${numberingFormat === "page-x-of-y" ? `Page ${startPage} of ${totalPages}` : `Page ${startPage}`}\nPlacement: ${pagePosition}\nStart Page Index: ${startPage}`;
    breakdown = {
      "Numbering Format": numberingFormat === "page-x-of-y" ? `Page ${startPage} of ${totalPages}` : `Page ${startPage}`,
      "Header/Footer Alignment": pagePosition.replace("-", " ").toUpperCase(),
      "Starting Page Index": startPage,
      "Total Documents Pages": totalPages,
      "Font Family": "Helvetica Standard (Embedded)",
    };
  } else if (action.includes("grayscale")) {
    outputContent = `Color Space: Monochromatic Grayscale (DeviceGray)\nColor Depth: 8-bit Gray\nEstimated Size Reduction: ~35-45% for scanned image pages`;
    breakdown = {
      "Target Color Space": "DeviceGray (ISO 32000-1 standard)",
      "Bit Depth": "8-bit Grayscale",
      "Print Compatibility": "Optimized for B&W Laser Printers",
      "Ink Saving Estimate": "~60-70% reduction in color toner",
    };
  }

  const handleCopy = async () => {
    if (!outputContent) return;
    await navigator.clipboard.writeText(outputContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (filename: string) => {
    const blob = new Blob([outputContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="text-xs font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-2">
            {action.includes("markdown") || action.includes("html") ? (
              <Code2 className="w-4 h-4" />
            ) : action.includes("stats") || action.includes("docx") ? (
              <BookOpen className="w-4 h-4" />
            ) : (
              <FileText className="w-4 h-4" />
            )}
            <span>Document Configuration</span>
          </div>

          {action.includes("metadata") && (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400">Document Title</label>
                <input
                  type="text"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400">Author / Organization</label>
                <input
                  type="text"
                  value={docAuthor}
                  onChange={(e) => setDocAuthor(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400">Subject</label>
                <input
                  type="text"
                  value={docSubject}
                  onChange={(e) => setDocSubject(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400">Keywords (Comma separated)</label>
                <input
                  type="text"
                  value={docKeywords}
                  onChange={(e) => setDocKeywords(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
                />
              </div>
            </div>
          )}

          {action.includes("markdown-to-html") && (
            <div className="space-y-1">
              <label className="text-xs text-slate-300">Markdown Content</label>
              <textarea
                value={markdownInput}
                onChange={(e) => setMarkdownInput(e.target.value)}
                rows={10}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs"
              />
            </div>
          )}

          {action.includes("html-to-markdown") && (
            <div className="space-y-1">
              <label className="text-xs text-slate-300">HTML Source Markup</label>
              <textarea
                value={htmlInput}
                onChange={(e) => setHtmlInput(e.target.value)}
                rows={10}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs"
              />
            </div>
          )}

          {(action.includes("docx-text") || action.includes("stats") || action.includes("document-word-counter")) && (
            <div className="space-y-1">
              <label className="text-xs text-slate-300">Document Text</label>
              <textarea
                value={documentText}
                onChange={(e) => setDocumentText(e.target.value)}
                rows={10}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs"
              />
            </div>
          )}

          {action.includes("page-numberer") && (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Numbering Format</label>
                <select
                  value={numberingFormat}
                  onChange={(e) => setNumberingFormat(e.target.value as "page-x" | "page-x-of-y" | "numbers-only")}
                  className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
                >
                  <option value="page-x-of-y">Page X of Y (e.g. Page 1 of 12)</option>
                  <option value="page-x">Page X (e.g. Page 1)</option>
                  <option value="numbers-only">Numbers Only (e.g. 1)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Alignment / Position</label>
                <select
                  value={pagePosition}
                  onChange={(e) => setPagePosition(e.target.value as "bottom-center" | "bottom-right" | "top-right")}
                  className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
                >
                  <option value="bottom-center">Bottom Center (Standard)</option>
                  <option value="bottom-right">Bottom Right Corner</option>
                  <option value="top-right">Top Right Header</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400">Starting Page #</label>
                  <input
                    type="number"
                    min={1}
                    value={startPage}
                    onChange={(e) => setStartPage(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Total Pages</label>
                  <input
                    type="number"
                    min={1}
                    value={totalPages}
                    onChange={(e) => setTotalPages(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {action.includes("grayscale") && (
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs text-slate-300">
              <p className="font-semibold text-white">Grayscale Monochromatic Conversion Mode</p>
              <p>Converts all RGB and CMYK color streams in the PDF to 8-bit single channel DeviceGray representations to minimize printer toner consumption.</p>
            </div>
          )}
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-rose-950/30 to-slate-900/80 border border-rose-500/20 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="text-xs font-semibold text-rose-400 uppercase tracking-wider flex items-center justify-between">
              <span>Processed Document Output</span>
              {action.includes("markdown-to-html") && (
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Eye className="w-3 h-3" /> Live HTML Preview
                </span>
              )}
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 whitespace-pre-wrap max-h-64 overflow-y-auto">
              {outputContent}
            </div>

            {breakdown && (
              <div className="space-y-1 border-t border-slate-800/80 pt-3">
                <dl className="space-y-1 text-xs">
                  {Object.entries(breakdown).map(([label, val]) => (
                    <div key={label} className="flex justify-between py-0.5 border-b border-slate-800/40">
                      <dt className="text-slate-400">{label}:</dt>
                      <dd className="font-semibold text-slate-200 font-mono">{String(val)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex-1 inline-flex justify-center items-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-all cursor-pointer border border-slate-700"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>Copy Output</span>
            </button>
            <button
              onClick={() => handleDownload("processed-document.txt")}
              className="flex-1 inline-flex justify-center items-center gap-2 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Result</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
