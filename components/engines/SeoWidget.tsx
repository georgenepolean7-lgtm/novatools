"use client";

import React, { useState } from "react";
import { ToolDefinition } from "@/lib/tools/tool-types";
import {
  generateMetaTags,
  generateRobotsTxt,
  analyzeKeywordDensity,
  generateSerpPreview,
  generateOpenGraphMeta,
  generateSchemaMarkup,
  generateHreflangTags,
  generateCanonicalUrl,
  analyzeHeadingStructure,
  SeoEngineResult,
} from "@/lib/engines/seo-engine";
import { Copy, Check, Globe, Shield, Play } from "lucide-react";

interface SeoWidgetProps {
  tool: ToolDefinition;
}

export function SeoWidget({ tool }: SeoWidgetProps) {
  const action = (tool.customParams?.action as string) || tool.slug;

  const [title, setTitle] = useState("Best Online Tools Platform | Nova Tools");
  const [description, setDescription] = useState("Fast, free, 100% private in-browser online tools for PDF, images, developers, and calculations.");
  const [canonicalUrl, setCanonicalUrl] = useState("https://novatool.in");
  const [imageUrl, setImageUrl] = useState("https://novatool.in/icon.png");

  const [textContent, setTextContent] = useState(
    action === "heading-structure-analyzer"
      ? "<h1>Main Page Headline</h1>\n<p>Some introduction...</p>\n<h2>Section 1: Features</h2>\n<p>Details...</p>\n<h3>Feature 1.1</h3>\n<h2>Section 2: FAQ</h2>"
      : ""
  );
  const [targetKeyword, setTargetKeyword] = useState("tools");
  const [schemaType, setSchemaType] = useState<"Article" | "Organization" | "LocalBusiness" | "FAQPage" | "Product">("Article");
  const [languages, setLanguages] = useState("en, ta, hi, es, fr");

  const [output, setOutput] = useState("");
  const [breakdown, setBreakdown] = useState<Record<string, string | number> | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleRun = () => {
    setError(null);
    let res: SeoEngineResult = { success: true, output: "" };

    if (action === "generate-meta-tags" || action === "meta-tag-generator") {
      res = generateMetaTags({ title, description, canonicalUrl, ogImage: imageUrl });
    } else if (action === "generate-robots-txt" || action === "robots-txt-generator") {
      res = generateRobotsTxt({ sitemapUrl: `${canonicalUrl.replace(/\/$/, "")}/sitemap.xml` });
    } else if (action === "analyze-keyword-density" || action === "keyword-density-checker") {
      res = analyzeKeywordDensity(textContent, targetKeyword);
    } else if (action === "serp-preview" || action === "serp-snippet-preview") {
      res = generateSerpPreview(title, description, canonicalUrl);
    } else if (action === "open-graph-meta" || action === "open-graph-meta-generator") {
      res = generateOpenGraphMeta({ title, description, url: canonicalUrl, image: imageUrl });
    } else if (action === "schema-markup" || action === "schema-markup-generator") {
      res = generateSchemaMarkup(schemaType, { headline: title, description, name: title, url: canonicalUrl });
    } else if (action === "hreflang-tags" || action === "hreflang-tag-generator") {
      res = generateHreflangTags(canonicalUrl, languages.split(","));
    } else if (action === "canonical-url" || action === "canonical-url-generator") {
      res = generateCanonicalUrl(canonicalUrl, true, false);
    } else if (action === "heading-structure" || action === "heading-structure-analyzer") {
      res = analyzeHeadingStructure(textContent);
    }

    if (!res.success) {
      setError(res.error || "SEO operation failed");
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
      {/* Title, Desc, URL inputs for tag & preview tools */}
      {["generate-meta-tags", "meta-tag-generator", "serp-preview", "serp-snippet-preview", "open-graph-meta", "open-graph-meta-generator", "schema-markup", "schema-markup-generator", "canonical-url", "canonical-url-generator", "hreflang-tags", "hreflang-tag-generator", "generate-robots-txt", "robots-txt-generator"].includes(action) && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-teal-400 uppercase">Page Title (50-60 Characters)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-teal-400 uppercase">Meta Description (120-160 Characters)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-teal-400 uppercase">Canonical URL</label>
              <input
                type="url"
                value={canonicalUrl}
                onChange={(e) => setCanonicalUrl(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-teal-400 uppercase">Social Share Image (OG Image)</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm font-mono"
              />
            </div>
          </div>

          {action === "schema-markup-generator" && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-teal-400 uppercase">Schema.org Entity Type</label>
              <select
                value={schemaType}
                onChange={(e) => setSchemaType(e.target.value as "Article" | "Organization" | "LocalBusiness" | "FAQPage" | "Product")}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
              >
                <option value="Article">Article / BlogPosting</option>
                <option value="Organization">Organization / Brand</option>
                <option value="FAQPage">FAQPage (Accordion Rich Result)</option>
                <option value="Product">Product / Ecommerce</option>
                <option value="LocalBusiness">Local Business</option>
              </select>
            </div>
          )}

          {action === "hreflang-tag-generator" && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-teal-400 uppercase">Target Languages & Regions (comma-separated)</label>
              <input
                type="text"
                value={languages}
                onChange={(e) => setLanguages(e.target.value)}
                placeholder="e.g. en, ta, hi, es, fr, de"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm font-mono"
              />
            </div>
          )}
        </div>
      )}

      {/* Content Analysis & Heading Structure tools */}
      {["analyze-keyword-density", "keyword-density-checker", "heading-structure", "heading-structure-analyzer"].includes(action) && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          {action.includes("keyword") && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-teal-400 uppercase">Target Keyword / Phrase</label>
              <input
                type="text"
                value={targetKeyword}
                onChange={(e) => setTargetKeyword(e.target.value)}
                placeholder="e.g. tools"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
              />
            </div>
          )}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-teal-400 uppercase">
              {action.includes("heading") ? "HTML Page Snippet with <h1>-<h6> tags" : "Article / Webpage Content"}
            </label>
            <textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Paste content here..."
              rows={6}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm font-mono"
            />
          </div>
        </div>
      )}

      <div className="flex flex-wrap justify-between items-center gap-4">
        <button
          type="button"
          onClick={handleRun}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold shadow-lg shadow-teal-500/20 active:scale-98 transition-all cursor-pointer"
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
            <span>Copy Output</span>
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
          <div className="text-xs font-semibold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
            <Globe className="w-4 h-4" />
            <span>Generated SEO Output</span>
          </div>
          <pre className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-teal-300 font-mono text-sm overflow-x-auto whitespace-pre-wrap">
            {output}
          </pre>
        </div>
      )}

      {breakdown && (
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-teal-400" />
            <span>SEO Analysis Metrics</span>
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
