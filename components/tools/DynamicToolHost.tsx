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
import NovaBuddy from "@/components/tools/NovaBuddy";
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

          {/* Step-by-Step Tutorial / How to Use */}
          {tool.howToSteps && tool.howToSteps.length > 0 && (
            <div className="space-y-4 border-t border-slate-800 pt-8">
              <h2 className="text-xl font-bold text-white tracking-tight">
                How to Use {tool.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {tool.howToSteps.map((step) => (
                  <div
                    key={step.step}
                    className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2 relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <span className="w-7 h-7 rounded-xl bg-cyan-500/10 text-cyan-400 font-bold font-mono text-sm flex items-center justify-center border border-cyan-500/20">
                        {step.step}
                      </span>
                    </div>
                    <h3 className="font-semibold text-white text-sm pt-1">{step.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{step.instruction}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* In-Depth Technical Editorial Guide & Documentation */}
          {tool.editorialGuide && (
            <div className="space-y-8 border-t border-slate-800 pt-8">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>TECHNICAL DOCUMENTATION &amp; GUIDE</span>
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  {tool.editorialGuide.title}
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
                  {tool.editorialGuide.summary}
                </p>
              </div>

              <div className="space-y-6">
                {tool.editorialGuide.sections.map((section, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3"
                  >
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <span className="text-cyan-400 font-mono text-sm">#{idx + 1}</span>
                      <span>{section.heading}</span>
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                      {section.content}
                    </p>
                    {section.codeExample && (
                      <div className="mt-3 rounded-xl bg-slate-950 p-4 border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto">
                        <pre>{section.codeExample}</pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQ Accordion Section */}
          {tool.faq && tool.faq.length > 0 && (
            <div className="space-y-4 border-t border-slate-800 pt-8">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Frequently Asked Questions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tool.faq.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2"
                  >
                    <h3 className="font-semibold text-white text-sm flex items-start gap-2">
                      <span className="text-cyan-400 font-bold">Q:</span>
                      <span>{item.question}</span>
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed pl-5">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Articles / Blog Posts */}
          {relatedArticles && relatedArticles.length > 0 && (
            <div className="space-y-4 border-t border-slate-800 pt-8">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Related Guides &amp; Tutorials
                </h2>
                <Link href="/blog" className="text-xs text-cyan-400 hover:underline">
                  View All Guides →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedArticles.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/blog/${article.slug}`}
                    className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900/80 transition-all flex flex-col justify-between group space-y-3"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase text-cyan-400">
                        {article.category}
                      </span>
                      <h3 className="font-semibold text-white text-sm group-hover:text-cyan-300 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2">{article.summary}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-cyan-400 font-medium">
                      <span>Read Guide</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Tool Community Feedback */}
          <ToolFeedbackWidget toolSlug={tool.slug} toolName={tool.name} />

          {/* Related Tools Links */}
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

      {/* Registry-Driven Universal NovaBuddy Assistant */}
      <NovaBuddy tool={tool} />
    </>
  );
}
