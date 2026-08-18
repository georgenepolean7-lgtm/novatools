"use client";

import React, { useState } from "react";
import { ToolDefinition } from "@/lib/tools/tool-types";
import {
  jsonToCsv,
  csvToJson,
  csvToMarkdownTable,
  markdownTableToCsv,
  jsonToTypeScriptInterface,
  formatXml,
  validateXml,
  xmlToJson,
  jsonToXml,
  extractCsvColumns,
  convertCsvDelimiter,
  csvToSqlInsert,
  jsonToSqlInsert,
  flattenJson,
  unflattenJson,
  sortJsonKeys,
  filterCsvRows,
  removeCsvDuplicateRows,
  queryJsonPath,
  csvToHtmlTable,
  htmlTableToCsv,
  calculateJsonStats,
  reorderCsvColumns,
  convertSqlToJson,
  DataEngineResult,
} from "@/lib/engines/data-engine";
import { Copy, Check, Download, Table, Play, Sparkles, Upload } from "lucide-react";

interface DataWidgetProps {
  tool: ToolDefinition;
}

export function DataWidget({ tool }: DataWidgetProps) {
  const action = (tool.customParams?.action as string) || tool.slug;
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [breakdown, setBreakdown] = useState<Record<string, string | number> | undefined>(undefined);

  // Configuration options
  const [delimiter, setDelimiter] = useState(",");
  const [targetDelimiter, setTargetDelimiter] = useState("\t");
  const [customParam1, setCustomParam1] = useState("");
  const [tableName, setTableName] = useState("users_table");

  const handleConvert = () => {
    setError(null);
    let res: DataEngineResult = { success: true, output: "" };

    if (action === "json-to-csv") {
      res = jsonToCsv(input, delimiter);
    } else if (action === "csv-to-json") {
      res = csvToJson(input, delimiter);
    } else if (action === "csv-to-markdown") {
      res = csvToMarkdownTable(input, delimiter);
    } else if (action === "markdown-to-csv") {
      res = markdownTableToCsv(input, delimiter);
    } else if (action === "json-to-typescript") {
      res = jsonToTypeScriptInterface(input, customParam1 || "RootObject");
    } else if (action === "format-xml") {
      res = formatXml(input);
    } else if (action === "validate-xml") {
      res = validateXml(input);
    } else if (action === "xml-to-json") {
      res = xmlToJson(input);
    } else if (action === "json-to-xml") {
      res = jsonToXml(input);
    } else if (action === "extract-csv-columns") {
      res = extractCsvColumns(input, customParam1 || "0, 1", delimiter);
    } else if (action === "convert-csv-delimiter") {
      res = convertCsvDelimiter(input, delimiter, targetDelimiter);
    } else if (action === "csv-to-sql") {
      res = csvToSqlInsert(input, tableName, delimiter);
    } else if (action === "json-to-sql") {
      res = jsonToSqlInsert(input, tableName);
    } else if (action === "tsv-to-csv") {
      res = convertCsvDelimiter(input, "\t", ",");
    } else if (action === "csv-to-tsv") {
      res = convertCsvDelimiter(input, ",", "\t");
    } else if (action === "flatten-json") {
      res = flattenJson(input);
    } else if (action === "unflatten-json") {
      res = unflattenJson(input);
    } else if (action === "sort-json-keys") {
      res = sortJsonKeys(input);
    } else if (action === "filter-csv-rows") {
      res = filterCsvRows(input, customParam1, delimiter);
    } else if (action === "remove-csv-duplicates") {
      res = removeCsvDuplicateRows(input, delimiter);
    } else if (action === "query-json-path") {
      res = queryJsonPath(input, customParam1);
    } else if (action === "csv-to-html-table") {
      res = csvToHtmlTable(input, delimiter);
    } else if (action === "html-table-to-csv") {
      res = htmlTableToCsv(input, delimiter);
    } else if (action === "json-stats") {
      res = calculateJsonStats(input);
    } else if (action === "reorder-csv-columns") {
      res = reorderCsvColumns(input, customParam1 || "1, 0", delimiter);
    } else if (action === "sql-to-json" || action.includes("sql-to-json")) {
      res = convertSqlToJson(input || "INSERT INTO users (id, name, email) VALUES (1, 'Alice', 'alice@example.com'), (2, 'Bob', 'bob@example.com');");
    }

    if (!res.success) {
      setError(res.error || "Processing failed");
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

  const handleDownload = () => {
    if (!output) return;
    let ext = "txt";
    if (action.includes("json")) ext = "json";
    else if (action.includes("csv")) ext = "csv";
    else if (action.includes("xml")) ext = "xml";
    else if (action.includes("sql")) ext = "sql";
    else if (action.includes("typescript")) ext = "ts";
    else if (action.includes("html")) ext = "html";
    else if (action.includes("markdown")) ext = "md";

    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `data-output.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setInput(event.target?.result as string);
    };
    reader.readAsText(file);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Option Toolbar */}
      {(action.includes("csv") || action.includes("delimiter") || action.includes("sql") || action.includes("query") || action.includes("columns")) && (
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center gap-4 text-xs">
          {action.includes("csv") && !action.includes("tsv") && (
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-semibold uppercase">Delimiter:</span>
              <select
                value={delimiter}
                onChange={(e) => setDelimiter(e.target.value)}
                className="p-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono"
              >
                <option value=",">Comma (,)</option>
                <option value=";">Semicolon (;)</option>
                <option value="|">Pipe (|)</option>
                <option value="&#9;">Tab (\t)</option>
              </select>
            </div>
          )}

          {action === "convert-csv-delimiter" && (
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-semibold uppercase">Target Delimiter:</span>
              <select
                value={targetDelimiter}
                onChange={(e) => setTargetDelimiter(e.target.value)}
                className="p-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono"
              >
                <option value="&#9;">Tab (\t)</option>
                <option value=";">Semicolon (;)</option>
                <option value="|">Pipe (|)</option>
                <option value=",">Comma (,)</option>
              </select>
            </div>
          )}

          {(action === "csv-to-sql" || action === "json-to-sql") && (
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <span className="text-slate-400 font-semibold uppercase">Table Name:</span>
              <input
                type="text"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                className="flex-1 p-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono"
              />
            </div>
          )}

          {action === "extract-csv-columns" && (
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <span className="text-slate-400 font-semibold uppercase">Columns (Index or Names):</span>
              <input
                type="text"
                value={customParam1}
                onChange={(e) => setCustomParam1(e.target.value)}
                placeholder="e.g. 0, 2 or name, email"
                className="flex-1 p-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono"
              />
            </div>
          )}

          {action === "filter-csv-rows" && (
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <span className="text-slate-400 font-semibold uppercase">Filter Keyword:</span>
              <input
                type="text"
                value={customParam1}
                onChange={(e) => setCustomParam1(e.target.value)}
                placeholder="Search term..."
                className="flex-1 p-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono"
              />
            </div>
          )}

          {action === "query-json-path" && (
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <span className="text-slate-400 font-semibold uppercase">JSON Path:</span>
              <input
                type="text"
                value={customParam1}
                onChange={(e) => setCustomParam1(e.target.value)}
                placeholder="e.g. users[0].address.city"
                className="flex-1 p-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono"
              />
            </div>
          )}

          {action === "json-to-typescript" && (
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <span className="text-slate-400 font-semibold uppercase">Interface Name:</span>
              <input
                type="text"
                value={customParam1}
                onChange={(e) => setCustomParam1(e.target.value)}
                placeholder="RootObject"
                className="flex-1 p-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono"
              />
            </div>
          )}
        </div>
      )}

      {/* Input Header & Textarea */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-semibold text-blue-400 uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <Table className="w-4 h-4" />
            <span>Data Input Payload</span>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1 text-slate-400 hover:text-slate-200 cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload File</span>
              <input type="file" onChange={handleFileUpload} className="hidden" accept=".csv,.json,.xml,.txt,.tsv" />
            </label>
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
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Enter or paste data for ${tool.name}...`}
          rows={8}
          className="w-full p-4 rounded-2xl bg-slate-900/80 border border-slate-800 focus:border-blue-500 text-slate-100 font-mono text-sm outline-none transition-all placeholder:text-slate-600 resize-y"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={handleConvert}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-400 hover:to-sky-400 text-slate-950 font-bold shadow-lg shadow-blue-500/20 active:scale-98 transition-all cursor-pointer"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Execute {tool.name}</span>
        </button>

        {output && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              <span>{copied ? "Copied!" : "Copy"}</span>
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-400" />
              <span>Download</span>
            </button>
          </div>
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
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Output Payload</span>
          </div>
          <pre className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-sky-400 font-mono text-sm overflow-x-auto whitespace-pre-wrap max-h-[500px]">
            {output}
          </pre>
        </div>
      )}

      {/* Analysis Breakdown */}
      {breakdown && (
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Dataset Breakdown
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
