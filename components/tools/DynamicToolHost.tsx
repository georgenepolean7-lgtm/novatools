"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import ToolLayout from "@/components/ToolLayout";
import ToolSEO from "@/components/seo/ToolSEO";
import { ToolDefinition } from "@/lib/tools/tool-types";
import { getRelatedToolsFor } from "@/lib/tools/registry";
import { renderToolWidget } from "@/lib/tools/engine-dispatcher";
import { ToolFavoriteButton } from "@/components/tools/ToolFavoriteButton";
import { ToolFeedbackWidget } from "@/components/tools/ToolFeedbackWidget";
import { trackToolUsage } from "@/lib/supabase/client";
import { CheckCircle2, ArrowRight, Shield, Zap, Sparkles } from "lucide-react";

interface DynamicToolHostProps {
  tool: ToolDefinition;
}

export function DynamicToolHost({ tool }: DynamicToolHostProps) {
  const related = getRelatedToolsFor(tool.slug, 4);

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
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Client-Side Engine Active</span>
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
              <span>100% Free & Unlimited Usage</span>
            </div>
          </div>

          {/* Features Grid */}
          {tool.features && tool.features.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Key Features & Capabilities
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
        </div>
      </ToolLayout>
    </>
  );
}
