/**
 * Nova Tools Autonomous SEO Agent - Core Type Definitions
 */

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export type ConnectorStatus = "CONNECTED" | "NOT_CONNECTED" | "PENDING" | "ERROR";

export type GA4DataApiStatus = "CONNECTED" | "NOT_CONFIGURED" | "AUTH_ERROR" | "API_ERROR" | "NO_DATA";

export type CycleExecutionStatus = "SUCCESS" | "FAILED" | "SKIPPED" | "ROLLED_BACK" | "BLOCKED_PENDING_REAL_DATA" | "NEEDS_REVIEW";

export interface MetricProvenance {
  source: "GOOGLE_SEARCH_CONSOLE" | "GOOGLE_ANALYTICS_4" | "BING_WEBMASTER_TOOLS" | "MICROSOFT_CLARITY" | "GOOGLE_ADS" | "COMPOSIO" | "INTERNAL_REGISTRY";
  property: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  retrievalTimestamp: string;
  pageOrQuery: string;
  metric: string;
  value: number;
}

export interface GSCPageMetric {
  page: string;
  query?: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  dateRange: { startDate: string; endDate: string };
  provenance: MetricProvenance;
}

export interface GA4TrafficMetric {
  pagePath: string;
  activeUsers: number;
  sessions: number;
  engagementRate: number;
  averageSessionDuration: number;
  dateRange: { startDate: string; endDate: string };
  provenance: MetricProvenance;
}

export interface GA4ReportMetric {
  pagePath?: string;
  channelGroup?: string;
  date?: string;
  activeUsers: number;
  sessions: number;
  screenPageViews: number;
  engagementRate?: number;
  averageSessionDuration?: number;
  dateRange: { startDate: string; endDate: string };
  provenance: MetricProvenance;
}

export interface BingPerformanceMetric {
  page?: string;
  query?: string;
  clicks: number;
  impressions: number;
  date?: string;
  avgClickPosition?: number | null;
  avgImpressionPosition?: number | null;
  dateRange: { startDate: string; endDate: string };
  provenance: MetricProvenance;
}

export interface ClarityUxMetric {
  metricName: string;
  sessionsCount: number;
  pagesViews: number;
  sessionsWithMetricPercent: number;
  subTotal: number;
  averageScrollDepth?: number;
  dateRange: { startDate: string; endDate: string };
  provenance: MetricProvenance;
}

export interface DataSourceMatrixItem {
  sourceName: "Google Search Console" | "Google Analytics 4" | "Bing Webmaster Tools" | "Microsoft Clarity" | "Google Ads";
  connected: boolean;
  healthChecked: boolean;
  healthStatus?: "HEALTHY" | "RATE_LIMITED" | "DEGRADED" | "UNAVAILABLE" | "NOT_CONFIGURED";
  realDataRetrieved: boolean;
  feedsScoring: boolean;
  availableToQwen: boolean;
  recordCount: number;
  dateRange: string;
  actualToolOrApi: string;
  composioToolkitSlug?: string;
  provenanceImplemented: boolean;
  errorReason?: string;
  lastSuccessfulRetrieval?: string;
  provenanceDetails?: string;
}

export interface MultiSourceMetrics {
  gsc: GSCPageMetric[];
  ga4: GA4TrafficMetric[];
  bing: BingPerformanceMetric[];
  clarity: ClarityUxMetric[];
  googleAds: { status: "NOT_AVAILABLE"; reason: string };
  matrix: DataSourceMatrixItem[];
}

export interface SemanticOptimizationResult {
  seoTitle: string;
  seoDescription: string;
  contentSuggestions?: string[];
  internalLinkSuggestions?: string[];
  faqs?: Array<{ question: string; answer: string }>;
  reasoningSummary: string;
  modelUsed: string;
  provenanceType: "model-generated" | "deterministic-fallback" | "rejected";
}

export type OpportunityType =
  | "POSITION_4_10_OPPORTUNITY"
  | "POSITION_11_20_OPPORTUNITY"
  | "HIGH_IMPRESSIONS_LOW_CTR"
  | "HIGH_IMPRESSIONS_LOW_CLICKS"
  | "LOSING_CLICKS"
  | "LOSING_IMPRESSIONS"
  | "GAINING_IMPRESSIONS_NOT_CLICKS"
  | "QUERY_PAGE_MISMATCH"
  | "THIN_PAGE_CONTENT"
  | "WEAK_INTERNAL_LINKING"
  | "MISSING_CONTEXTUAL_LINKS"
  | "WEAK_TITLE"
  | "WEAK_META_DESCRIPTION"
  | "MISSING_OR_WEAK_HEADINGS"
  | "DUPLICATE_METADATA"
  | "MISSING_STRUCTURED_DATA"
  | "CANNIBALIZATION_RISK"
  | "ORPHAN_PAGE"
  | "CATEGORY_ENRICHMENT_NEEDED";

export type SeoActionType = "TITLE_OPTIMIZATION" | "DESCRIPTION_OPTIMIZATION" | "FAQ_ENRICHMENT" | "EDITORIAL_EXPANSION" | "INTERNAL_LINKS" | "CANONICAL_CHECK";

export interface SeoOpportunity {
  id: string;
  pageSlug: string;
  pageUrl: string;
  type: OpportunityType;
  primaryQuery?: string;
  currentMetrics?: {
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
    trafficSessions?: number;
    bingImpressions?: number;
    bingClicks?: number;
    clarityDeadClicks?: number;
    clarityScrollDepth?: number;
  };
  detectedAt: string;
  reason: string;
  riskLevel: RiskLevel;
  targetFile?: string;
  opportunityScore: number;
  scoreBreakdown: {
    impressionPotential: number;
    positionOpportunity: number;
    ctrOpportunity: number;
    trafficTrend: number;
    businessRelevance: number;
    pageQuality: number;
    riskPenalty: number;
  };
  proposedAction: {
    type: SeoActionType;
    targetFile: string;
    summary: string;
  };
  provenance: MetricProvenance[];
}

export interface SeoOptimizationProposal {
  opportunityId: string;
  pageSlug: string;
  riskLevel: RiskLevel;
  targetFile: string;
  category: string;
  previousState: {
    seoTitle?: string;
    seoDescription?: string;
    faqCount?: number;
    relatedTools?: string[];
    editorialGuideSummary?: string;
  };
  newState: {
    seoTitle?: string;
    seoDescription?: string;
    addedFaqs?: Array<{ question: string; answer: string }>;
    addedRelatedTools?: string[];
    addedEditorialSection?: { heading: string; content: string };
  };
  justification: string;
  evidence: MetricProvenance[];
}

export interface ValidationCheckResult {
  name: string;
  passed: boolean;
  message: string;
  durationMs?: number;
}

export interface ValidationSummary {
  overallPassed: boolean;
  typecheckPassed: boolean;
  lintPassed: boolean;
  buildPassed: boolean;
  canonicalValid: boolean;
  sitemapValid: boolean;
  robotsValid: boolean;
  structuredDataValid: boolean;
  internalLinksValid: boolean;
  checks: ValidationCheckResult[];
  failureReason?: string;
}

export interface StageAValidationResult {
  passed: boolean;
  slug: string;
  failureReason?: string;
  durationMs: number;
  checks: ValidationCheckResult[];
}

export interface PostDeployCheckResult {
  url: string;
  statusCode: number;
  canonicalMatches: boolean;
  titleMatches: boolean;
  descriptionMatches: boolean;
  h1Present: boolean;
  passed: boolean;
  error?: string;
}

export interface OptimizationRecord {
  id: string;
  pageSlug: string;
  opportunityType: OpportunityType;
  actionType: SeoActionType;
  contentFingerprint: string;
  timestamp: string;
  commitStatus: "COMMITTED" | "DEPLOYED" | "ROLLED_BACK" | "SIMULATED";
  commitHash?: string;
  details?: {
    faqCount?: number;
    title?: string;
    description?: string;
    faqQuestions?: string[];
    relatedTools?: string[];
    reasoningSummary?: string;
  };
}

export interface FilteredOpportunityInfo {
  opportunity: SeoOpportunity;
  filterType: "ALREADY_OPTIMIZED" | "COOLDOWN_ACTIVE" | "NO_OP" | "HIGH_RISK" | "BUDGET_EXCEEDED";
  reason: string;
  remainingDays?: number;
  lastOptimizedAt?: string;
}

export interface OpportunitySelectionResult {
  actionable: SeoOpportunity[];
  filteredAlreadyOptimized: FilteredOpportunityInfo[];
  filteredCooldown: FilteredOpportunityInfo[];
  filteredNoOp: FilteredOpportunityInfo[];
  skippedHighRisk: SeoOpportunity[];
  budgetExceeded: SeoOpportunity[];
}

export interface SeoAuditRecord {
  id: string;
  timestamp: string;
  action: string;
  status: CycleExecutionStatus;
  riskLevel: RiskLevel;
  pageSlug?: string;
  pageUrl?: string;
  commitHash?: string;
  commitMessage?: string;
  validationSummary?: ValidationSummary;
  indexNowSubmitted?: string[];
  metricsBefore?: Record<string, number>;
  metricsAfter?: Record<string, number>;
  details: Record<string, unknown>;
  provenance: MetricProvenance[];
}

export interface LearningPatternRecord {
  id: string;
  patternType: OpportunityType;
  changeType: string;
  appliedDate: string;
  pageSlug: string;
  baselineMetrics: {
    impressions: number;
    clicks: number;
    ctr: number;
    position: number;
  };
  metrics7d?: {
    impressions: number;
    clicks: number;
    ctr: number;
    position: number;
    effectiveChangePercent: number;
  };
  metrics14d?: {
    impressions: number;
    clicks: number;
    ctr: number;
    position: number;
    effectiveChangePercent: number;
  };
  metrics28d?: {
    impressions: number;
    clicks: number;
    ctr: number;
    position: number;
    effectiveChangePercent: number;
  };
  successConfidenceScore: number; // 0 to 100
}

export interface CycleHistoryRecord {
  date: string;
  cycleId: string;
  opportunities: number;
  selected: number;
  processed: number;
  successful: number;
  failed: number;
  rollback: number;
  deployment: number;
  indexNow: number;
  finalStatus: "COMPLETED" | "COMPLETED_WITH_ROLLBACKS" | "DRY_RUN" | "BLOCKED_PENDING_REAL_DATA" | "PAUSED_KILL_SWITCH" | "FAILED";
  summary?: string;
  isDryRun?: boolean;
}

export interface DailyCycleStatus {
  opportunitiesDetected: number;
  selectedOpportunities: number;
  dailyHardCap: number; // 80
  processedToday: number;
  remainingCapacity: number;
  currentAtomicBatch: string; // e.g. "Batch 1 of 4" or "Idle"
  batchSize: number; // 20
  successfulBatches: number;
  failedBatches: number;
  rollbacks: number;
  changesApplied: number;
  deployments: number;
  indexNowBroadcasts: number;
  lastCycleAt: string | null;
  currentCycleStatus: "IDLE" | "RUNNING" | "COMPLETED" | "COMPLETED_WITH_ROLLBACKS" | "DRY_RUN" | "PAUSED_KILL_SWITCH" | "BLOCKED_PENDING_REAL_DATA" | "FAILED";
  killSwitchActive: boolean;
}

export interface QwenHealthDetails {
  ollamaConnected: boolean;
  modelAvailable: boolean;
  modelName: string;
  reasoningStatus: "ACTIVE_AUTONOMOUS" | "DETERMINISTIC_FALLBACK";
  responseParsingStatus: "STRICT_JSON_VALIDATED";
  factualSafetyGateStatus: "ACTIVE_DEFENSE_IN_DEPTH";
  endpoint: string;
  details: string;
}

export interface SafetyGovernanceDetails {
  killSwitchActive: boolean;
  protectedPaths: readonly string[];
  highRiskActionsBlocked: readonly string[];
  factualContentValidation: {
    active: boolean;
    prohibitedBuzzwordsCount: number;
    groundTruthEnforced: boolean;
  };
  metadataSeparationEnforced: boolean;
  rollbackProtectionActive: boolean;
}

export interface SeoAgentRuntimeStatus {
  enabled: boolean;
  killSwitchActive: boolean;
  lastCycleAt: string | null;
  nextScheduledCycleAt: string | null;
  dailyChangesCount: number;
  dailyChangesBudget: number;
  weeklyChangesCount: number;
  weeklyChangesBudget: number;
  dailyStatus?: DailyCycleStatus;
  multiSourceMatrix?: DataSourceMatrixItem[];
  qwenStatus?: QwenHealthDetails;
  safetyStatus?: SafetyGovernanceDetails;
  cycleHistory?: CycleHistoryRecord[];
  connectors: {
    googleSearchConsole: {
      status: ConnectorStatus;
      mode: "COMPOSIO" | "DIRECT" | "UNCONFIGURED";
      details: string;
    };
    googleAnalytics: {
      status: ConnectorStatus;
      mode: "COMPOSIO" | "DIRECT" | "UNCONFIGURED";
      details: string;
    };
    ollamaQwen: {
      status: ConnectorStatus;
      endpoint: string;
      model: string;
      details: string;
    };
    gitAndVercel: {
      status: ConnectorStatus;
      branch: string;
      details: string;
    };
    indexNow: {
      status: ConnectorStatus;
      host: string;
      details: string;
    };
  };
  recentOpportunities: SeoOpportunity[];
  recentAudits: SeoAuditRecord[];
  activeLearningPatterns: LearningPatternRecord[];
}
