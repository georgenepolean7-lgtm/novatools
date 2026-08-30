import { affiliatePartners } from "@/lib/affiliate/partners";
import { FileText, ExternalLink } from "lucide-react";

export default function AffiliateRecommendations() {
  const updf = affiliatePartners.updf;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-16 [content-visibility:auto] [contain-intrinsic-size:1px_240px]">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-0.5 text-xs font-semibold text-cyan-300">
                <FileText className="w-3.5 h-3.5" />
                <span>{updf.badge}</span>
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Partner Recommendation</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Need Advanced Desktop PDF Editing?
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {updf.description}
            </p>

            <p className="text-[11px] text-slate-400 leading-normal pt-1">
              <strong>Disclosure:</strong> This is an affiliate recommendation. Nova Tools may earn a commission if you purchase through this link, at no additional cost to you.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <a
              href={updf.url}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition-all"
            >
              <span>Explore UPDF</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}