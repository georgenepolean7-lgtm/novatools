"use client";

import React, { useState } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { submitToolFeedback } from "@/lib/supabase/client";
import { Star, MessageSquare, Check, Send, Sparkles } from "lucide-react";

interface ToolFeedbackWidgetProps {
  toolSlug: string;
  toolName: string;
}

export function ToolFeedbackWidget({ toolSlug, toolName }: ToolFeedbackWidgetProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) return;
    setIsSubmitting(true);
    setError(null);

    const res = await submitToolFeedback(toolSlug, rating, feedback, user?.id);
    setIsSubmitting(false);

    if (res.success) {
      setSubmitted(true);
    } else {
      setError(res.error || "Failed to submit feedback.");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Community Feedback</span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1">Rate this tool</h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          {toolName}
        </span>
      </div>

      {submitted ? (
        <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <Check className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-white">Thank you for your rating!</h4>
          <p className="text-xs text-slate-300">
            Your feedback helps us continuously refine and improve Nova Tools.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs text-slate-300">How was your experience?</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => {
                const active = (hoverRating !== null ? hoverRating : rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-1 text-slate-600 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 transition-colors ${
                        active ? "fill-amber-400 text-amber-400" : "text-slate-600"
                      }`}
                    />
                  </button>
                );
              })}
              <span className="ml-3 text-xs font-bold text-amber-300">
                {rating === 5
                  ? "5 / 5 (Excellent)"
                  : rating === 4
                  ? "4 / 5 (Good)"
                  : rating === 3
                  ? "3 / 5 (Average)"
                  : rating === 2
                  ? "2 / 5 (Poor)"
                  : "1 / 5 (Needs Improvement)"}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-300 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
              <span>Optional thoughts or feature suggestions:</span>
            </label>
            <textarea
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell us what you liked or how we can improve this tool..."
              maxLength={1000}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-400">
              {user ? `Posting as ${user.email}` : "Anonymous submission"}
            </span>
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2 px-5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 disabled:opacity-50"
            >
              <span>{isSubmitting ? "Sending..." : "Submit Rating"}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
