"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import ToolLayout from "@/components/ToolLayout";
import ToolSEO from "@/components/seo/ToolSEO";
import { ToolDefinition } from "@/lib/tools/tool-types";
import { getRelatedToolsFor } from "@/lib/tools/registry";
import { getArticlesForTool } from "@/lib/blog/posts";
import { renderToolWidget } from "@/lib/tools/engine-dispatcher";
import { ToolFavoriteButton } from "@/components/tools/ToolFavoriteButton";
import { ToolFeedbackWidget } from "@/components/tools/ToolFeedbackWidget";
import { trackToolUsage } from "@/lib/supabase/client";
import { isPdfRelatedTool } from "@/lib/affiliate/updf-config";
import UPDFRecommendation from "@/components/affiliate/UPDFRecommendation";
import { CheckCircle2, ArrowRight, Shield, Zap, Sparkles, BookOpen, Layers } from "lucide-react";

interface DynamicToolHostProps {
  tool: ToolDefinition;
}

export function DynamicToolHost({ tool }: DynamicToolHostProps) {
  const related = getRelatedToolsFor(tool.slug, 4);
  const relatedArticles = getArticlesForTool(tool.slug, 2);

  // Track non-sensitive tool usage metric on mount
  useEffect(() => {
    trackToolUsage(tool.slug);
  }, [tool.slug]);

  return (
    <>
      <ToolSEO
        name={tool.name}
        path={`/${tool.slug}`}
        description={tool.seoDescription}
        faqs={tool.faq.map((f) => ({ question: f.question, answer: f.answer }))}
      />

      <ToolLayout
        title={tool.name}
        description={tool.longDescription}
        badge={tool.category.toUpperCase()}
      >
        <div className="space-y-12">
          {/* Top Quick Actions Bar */}
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Client-Side Engine Active
              </span>
              <span className="hidden sm:inline text-slate-600">|</span>
              <Link
                href={`/categories/${tool.category}`}
                className="hidden sm:flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-sans font-medium"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Explore {tool.category.toUpperCase()} Hub</span>
              </Link>
            </div>
            <ToolFavoriteButton toolSlug={tool.slug} />
          </div>

          {/* Interactive Tool Widget */}
          <div className="rounded-2xl bg-slate-950/60 p-4 sm:p-8 border border-white/5 shadow-2xl">
            {renderToolWidget(tool)}
          </div>

          {/* Privacy & Speed Guarantee Pill */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-400 border-y border-slate-800/80 py-4">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <Shield className="w-4 h-4" />
              <span>{tool.privacyMessage}</span>
            </div>
            <div className="flex items-center gap-1.5 text-cyan-400">
              <Zap className="w-4 h-4" />
              <span>High Performance (Zero Server Queue)</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-400">
              <Sparkles className="w-4 h-4" />
              <span>100% Free &amp; Unlimited Usage</span>
            </div>
          </div>

          {/* Features Grid */}
          {tool.features && tool.features.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Key Features &amp; Capabilities
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tool.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <span className="text-sm text-slate-200">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* How-To Steps */}
          {tool.howToSteps && tool.howToSteps.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white tracking-tight">
                How to Use {tool.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {tool.howToSteps.map((step) => (
                  <div
                    key={step.step}
                    className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2 relative"
                  >
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold flex items-center justify-center">
                      {step.step}
                    </div>
                    <h3 className="font-semibold text-white text-sm">{step.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{step.instruction}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Custom FAQ Section */}
          {tool.faq && tool.faq.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {tool.faq.map((f, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-2"
                  >
                    <h3 className="font-semibold text-slate-100 text-sm">{f.question}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{f.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Deep Technical Editorial Guide (if available) */}
          {tool.editorialGuide && (
            <div className="space-y-6 border-t border-slate-800 pt-8">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-cyan-300">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>TECHNICAL REFERENCE &amp; GUIDE</span>
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  {tool.editorialGuide.title}
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {tool.editorialGuide.summary}
                </p>
              </div>

              <div className="space-y-6">
                {tool.editorialGuide.sections.map((section, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-3"
                  >
                    <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      {section.heading}
                    </h3>
                    <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line space-y-2">
                      {section.content}
                    </div>
                    {section.codeExample && (
                      <div className="mt-3 p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto">
                        <pre>{section.codeExample}</pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technical Boundaries & Limitations */}
          {tool.limitations && tool.limitations.length > 0 && (
            <div className="p-6 rounded-2xl bg-slate-900/30 border border-amber-500/20 space-y-3">
              <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-400" />
                <span>Technical Boundaries &amp; Scope</span>
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {tool.limitations.map((lim, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-400">•</span>
                    <span>{lim}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Related Blog Guides / Tutorials */}
          {relatedArticles && relatedArticles.length > 0 && (
            <div className="space-y-4 border-t border-slate-800 pt-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>STEP-BY-STEP GUIDES &amp; TUTORIALS</span>
                </div>
                <Link href="/blog" className="text-xs text-cyan-400 hover:underline">
                  All Guides
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedArticles.map((art) => (
                  <Link
                    key={art.slug}
                    href={`/blog/${art.slug}`}
                    className="group p-5 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900/80 transition-all flex flex-col justify-between space-y-2"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase">
                        {art.readTime}
                      </span>
                      <h3 className="font-bold text-white text-sm group-hover:text-cyan-300 transition-colors">
                        {art.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2">{art.summary}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-cyan-400 font-semibold pt-2">
                      <span>Read Full Guide</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Tool Community Feedback */}
          <ToolFeedbackWidget toolSlug={tool.slug} toolName={tool.name} />

          {/* Related Tools Internal Linking */}
          {related && related.length > 0 && (
            <div className="space-y-4 border-t border-slate-800 pt-8">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Related Online Utilities
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {related.map((relTool) => (
                  <Link
                    key={relTool.slug}
                    href={`/${relTool.slug}`}
                    className="group p-4 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900/80 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-1">
                      <span className="text-xs font-medium text-cyan-400 uppercase">
                        {relTool.category}
                      </span>
                      <h3 className="font-semibold text-white text-sm group-hover:text-cyan-300 transition-colors">
                        {relTool.name}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2">
                        {relTool.shortDescription}
                      </p>
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-xs text-cyan-400 font-medium">
                      <span>Open Tool</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Dedicated UPDF Recommendation for PDF-related tools only */}
          {isPdfRelatedTool(tool.category, tool.slug) && (
            <div className="border-t border-slate-800/80 pt-8">
              <UPDFRecommendation toolSlug={tool.slug} />
            </div>
          )}
        </div>
      </ToolLayout>
    </>
  );
}
