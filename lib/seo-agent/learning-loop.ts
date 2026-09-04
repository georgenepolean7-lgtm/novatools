/**
 * Nova Tools Autonomous SEO Agent - Learning & Post-Change Measurement Loop
 * Tracks pre-change baseline metrics, schedules checkpoints at 7d, 14d, 28d,
 * and derives pattern effectiveness scores.
 */

import { LearningPatternRecord, OpportunityType, GSCPageMetric } from "./types";

export class SeoLearningLoop {
  /**
   * Initializes a learning pattern record when a new autonomous optimization is deployed.
   */
  createPatternRecord(
    opportunityType: OpportunityType,
    changeType: string,
    pageSlug: string,
    currentMetrics?: { impressions: number; clicks: number; ctr: number; position: number }
  ): LearningPatternRecord {
    return {
      id: `pattern-${pageSlug}-${Date.now()}`,
      patternType: opportunityType,
      changeType,
      appliedDate: new Date().toISOString(),
      pageSlug,
      baselineMetrics: {
        impressions: currentMetrics?.impressions || 0,
        clicks: currentMetrics?.clicks || 0,
        ctr: currentMetrics?.ctr || 0,
        position: currentMetrics?.position || 0,
      },
      successConfidenceScore: 50, // Starts neutral
    };
  }

  /**
   * Evaluates mature patterns against newer GSC metrics (7d, 14d, 28d checkpoints).
   */
  evaluatePatterns(
    existingPatterns: LearningPatternRecord[],
    latestGscMetrics: GSCPageMetric[]
  ): LearningPatternRecord[] {
    const now = Date.now();
    const metricsMap = new Map<string, GSCPageMetric>();
    latestGscMetrics.forEach((m) => {
      const slug = m.page.replace(/^https?:\/\/[^/]+\//, "").replace(/\/$/, "");
      metricsMap.set(slug, m);
    });

    return existingPatterns.map((pattern) => {
      const appliedTime = new Date(pattern.appliedDate).getTime();
      const daysElapsed = Math.floor((now - appliedTime) / (1000 * 60 * 60 * 24));
      const current = metricsMap.get(pattern.pageSlug);

      if (!current) return pattern;

      const updated = { ...pattern };
      const baseline = pattern.baselineMetrics;

      // Checkpoint 7 Days
      if (daysElapsed >= 7 && !updated.metrics7d) {
        const clickDiff = current.clicks - baseline.clicks;
        const changePct = baseline.clicks > 0 ? (clickDiff / baseline.clicks) * 100 : clickDiff > 0 ? 100 : 0;
        updated.metrics7d = {
          impressions: current.impressions,
          clicks: current.clicks,
          ctr: current.ctr,
          position: current.position,
          effectiveChangePercent: Math.round(changePct),
        };
      }

      // Checkpoint 14 Days
      if (daysElapsed >= 14 && !updated.metrics14d) {
        const clickDiff = current.clicks - baseline.clicks;
        const changePct = baseline.clicks > 0 ? (clickDiff / baseline.clicks) * 100 : clickDiff > 0 ? 100 : 0;
        updated.metrics14d = {
          impressions: current.impressions,
          clicks: current.clicks,
          ctr: current.ctr,
          position: current.position,
          effectiveChangePercent: Math.round(changePct),
        };
      }

      // Checkpoint 28 Days
      if (daysElapsed >= 28 && !updated.metrics28d) {
        const clickDiff = current.clicks - baseline.clicks;
        const changePct = baseline.clicks > 0 ? (clickDiff / baseline.clicks) * 100 : clickDiff > 0 ? 100 : 0;
        updated.metrics28d = {
          impressions: current.impressions,
          clicks: current.clicks,
          ctr: current.ctr,
          position: current.position,
          effectiveChangePercent: Math.round(changePct),
        };
      }

      // Calculate confidence score based on multi-period trajectory
      updated.successConfidenceScore = this.computePatternConfidence(updated);

      return updated;
    });
  }

  private computePatternConfidence(record: LearningPatternRecord): number {
    let score = 50;

    if (record.metrics7d) {
      if (record.metrics7d.effectiveChangePercent > 10) score += 15;
      else if (record.metrics7d.effectiveChangePercent < -10) score -= 15;
    }

    if (record.metrics14d) {
      if (record.metrics14d.effectiveChangePercent > 15) score += 20;
      else if (record.metrics14d.effectiveChangePercent < -15) score -= 20;
    }

    if (record.metrics28d) {
      if (record.metrics28d.effectiveChangePercent > 20) score += 25;
      else if (record.metrics28d.effectiveChangePercent < -20) score -= 25;
    }

    return Math.min(100, Math.max(0, score));
  }
}
