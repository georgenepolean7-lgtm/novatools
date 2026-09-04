-- ==============================================================================
-- NOVA TOOLS - AUTONOMOUS SEO AGENT DATABASE SCHEMA
-- ==============================================================================

-- 1. SEO AGENT RUNS
CREATE TABLE IF NOT EXISTS public.seo_agent_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cycle_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('SUCCESS', 'FAILED', 'SKIPPED', 'ROLLED_BACK')),
  opportunities_detected INTEGER NOT NULL DEFAULT 0,
  high_risk_skipped INTEGER NOT NULL DEFAULT 0,
  optimizations_applied INTEGER NOT NULL DEFAULT 0,
  deployments_completed INTEGER NOT NULL DEFAULT 0,
  indexnow_submitted INTEGER NOT NULL DEFAULT 0,
  summary TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_seo_runs_created_at ON public.seo_agent_runs(created_at DESC);
ALTER TABLE public.seo_agent_runs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "seo_runs_admin_all" ON public.seo_agent_runs;
CREATE POLICY "seo_runs_admin_all" ON public.seo_agent_runs
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 2. SEO OPPORTUNITIES DETECTED
CREATE TABLE IF NOT EXISTS public.seo_opportunities (
  id TEXT PRIMARY KEY,
  page_slug TEXT NOT NULL,
  opportunity_type TEXT NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH')),
  opportunity_score NUMERIC(5, 1) NOT NULL DEFAULT 0,
  current_metrics JSONB NOT NULL DEFAULT '{}'::jsonb,
  score_breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
  proposed_action JSONB NOT NULL DEFAULT '{}'::jsonb,
  provenance JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'DETECTED' CHECK (status IN ('DETECTED', 'APPLIED', 'SKIPPED', 'DISMISSED')),
  detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_seo_opp_slug ON public.seo_opportunities(page_slug);
CREATE INDEX IF NOT EXISTS idx_seo_opp_score ON public.seo_opportunities(opportunity_score DESC);
ALTER TABLE public.seo_opportunities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "seo_opportunities_admin_all" ON public.seo_opportunities;
CREATE POLICY "seo_opportunities_admin_all" ON public.seo_opportunities
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 3. SEO LEARNING PATTERNS (7d, 14d, 28d measurement)
CREATE TABLE IF NOT EXISTS public.seo_learning_patterns (
  id TEXT PRIMARY KEY,
  pattern_type TEXT NOT NULL,
  change_type TEXT NOT NULL,
  page_slug TEXT NOT NULL,
  applied_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  baseline_metrics JSONB NOT NULL DEFAULT '{}'::jsonb,
  metrics_7d JSONB,
  metrics_14d JSONB,
  metrics_28d JSONB,
  success_confidence_score INTEGER NOT NULL DEFAULT 50 CHECK (success_confidence_score >= 0 AND success_confidence_score <= 100),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_seo_patterns_type ON public.seo_learning_patterns(pattern_type);
ALTER TABLE public.seo_learning_patterns ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "seo_patterns_admin_all" ON public.seo_learning_patterns;
CREATE POLICY "seo_patterns_admin_all" ON public.seo_learning_patterns
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
