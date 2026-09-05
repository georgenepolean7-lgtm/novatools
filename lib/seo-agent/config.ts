/**
 * Nova Tools Autonomous SEO Agent - Configuration & Guardrails
 */

export const SEO_AGENT_CONFIG = {
  // Domain and Target Site
  SITE_DOMAIN: "novatool.in",
  SITE_URL: "https://novatool.in",
  GSC_SITE_PROPERTY: process.env.GSC_SITE_PROPERTY || "https://novatool.in/",
  // Note: GA4 Data API requires numeric Property ID (e.g. 548841684). G-ZDBD80HH59 is the client-side Measurement ID only.
  GA4_PROPERTY_ID: process.env.GA4_PROPERTY_ID || "",

  // Deterministic Real Data Gate: Production SEO changes strictly require real GSC/GA4 telemetry
  REAL_SEO_DATA_REQUIRED: process.env.REAL_SEO_DATA_REQUIRED !== "false",

  // Autonomous Operation Budgets (Deterministic hard limits)
  BUDGETS: {
    MAX_PAGE_CHANGES_PER_DAILY_CYCLE: 80,
    BATCH_SIZE: 20,
    MAX_PAGE_CHANGES_PER_WEEK: 560, // No artificial weekly bottleneck; daily cap of 80 applies
    MAX_FAQS_PER_OPTIMIZATION: 3,
    FAQ_CONTENT_THRESHOLD: 8,
    MAX_FAQS_PER_PAGE: 8,
    MAX_INTERNAL_LINKS_PER_PAGE: 6,
  },

  // Per-Action Cooldowns (Configurable anti-loop protection)
  COOLDOWNS: {
    FAQ_ENRICHMENT_DAYS: 14,
    TITLE_OPTIMIZATION_DAYS: 14,
    DESCRIPTION_OPTIMIZATION_DAYS: 14,
    INTERNAL_LINKS_DAYS: 7,
    EDITORIAL_EXPANSION_DAYS: 14,
    DEFAULT_DAYS: 14,
  },

  // LLM Engine (Hermes + Ollama / Qwen setup as per architectural guide)
  LLM: {
    MODEL: process.env.SEO_AGENT_MODEL || "qwen3:4b",
    FALLBACK_MODEL: "qwen2.5:3b",
    OLLAMA_BASE_URL: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
    CUSTOM_OPENAI_ENDPOINT: process.env.SEO_AGENT_LLM_ENDPOINT || "",
    TIMEOUT_MS: 30000,
    TEMPERATURE: 0.2, // Low temperature for deterministic factual generation
  },

  // Composio v3 Integration
  COMPOSIO: {
    API_KEY: process.env.COMPOSIO_API_KEY || "",
    GSC_ACTION_NAME: "GOOGLE_SEARCH_CONSOLE_SEARCH_ANALYTICS_QUERY",
    GA4_ACTION_NAME: "GOOGLE_ANALYTICS_LIST_ACCOUNTS",
    BING_SEARCH_PERF_ACTION: "BING_WEBMASTER_TOOLS_GET_SEARCH_PERFORMANCE",
    BING_PAGE_PERF_ACTION: "BING_WEBMASTER_TOOLS_GET_PAGE_PERFORMANCE",
    BING_LIST_SITES_ACTION: "BING_WEBMASTER_TOOLS_LIST_SITES",
    CLARITY_EXPORT_ACTION: "MICROSOFT_CLARITY_DATA_EXPORT",
    GOOGLEADS_ACTION: "GOOGLEADS_GET_CUSTOMER_LISTS",
    BASE_URL: "https://backend.composio.dev/api/v3",
  },

  // Telemetry Ingestion Timeouts (Production-grade timeouts against hung connections)
  TELEMETRY_TIMEOUTS: {
    INDIVIDUAL_REQUEST_MS: 25000,
    OVERALL_INGESTION_MS: 60000,
    GA4_DIRECT_MS: 20000,
    COMPOSIO_ACCOUNTS_MS: 10000,
  },

  // Bounded Execution Timeouts & Watchdogs (Task 4)
  TIMEOUTS: {
    LLM_TIMEOUT_MS: 30000,
    LLM_MS: 30000,
    OPPORTUNITY_PROCESSING_MS: 150000,
    BATCH_VALIDATION_MS: 600000,
    TYPESCRIPT_TIMEOUT_MS: 90000,
    TYPECHECK_MS: 90000,
    ESLINT_TIMEOUT_MS: 60000,
    LINT_MS: 60000,
    BUILD_TIMEOUT_MS: 300000,
    BUILD_MS: 300000,
    GIT_COMMIT_TIMEOUT_MS: 30000,
    GIT_COMMIT_MS: 30000,
    GIT_PUSH_TIMEOUT_MS: 60000,
    GIT_PUSH_MS: 60000,
    DEPLOY_VERIFY_TIMEOUT_MS: 180000,
    DEPLOY_VERIFY_MS: 180000,
    INDEXNOW_TIMEOUT_MS: 15000,
    INDEXNOW_MS: 15000,
  },

  // IndexNow Configuration (Reusing existing Nova Tools infrastructure)
  INDEXNOW: {
    KEY: process.env.INDEXNOW_KEY || "a52a86efe6f041bd931a36f0e2bdadd8",
    ENDPOINTS: [
      "https://api.indexnow.org/indexnow",
      "https://www.bing.com/indexnow",
    ],
  },

  // Whitelisted files that the autonomous agent is permitted to optimize
  WHITELISTED_MODIFICATION_DIRECTORIES: [
    "data/tools/",
  ],

  // Protected paths that the agent is strictly prohibited from touching
  PROTECTED_PATHS: [
    "app/auth",
    "app/api/auth",
    "app/api/admin/settings",
    "components/auth",
    "lib/supabase",
    "lib/payments",
    "lib/qpdf.ts",
    "lib/engines",
    "middleware.ts",
    ".env",
    ".env.local",
    "package.json",
    "next.config.ts",
  ],

  // Risk Classification
  RISK_RULES: {
    LOW: [
      "TITLE_IMPROVEMENT",
      "META_DESCRIPTION_IMPROVEMENT",
      "FAQ_ENRICHMENT",
      "EDITORIAL_GUIDE_ADDITION",
      "CONTEXTUAL_INTERNAL_LINKS",
    ],
    MEDIUM: [
      "STRUCTURED_DATA_EXPANSION",
      "KEYWORD_SYNONYM_EXPANSION",
      "CATEGORY_SUMMARY_ENRICHMENT",
    ],
    HIGH: [
      "CANONICAL_URL_CHANGE",
      "ROBOTS_TXT_CHANGE",
      "NOINDEX_INJECTION",
      "REDIRECT_CREATION",
      "URL_STRUCTURE_CHANGE",
      "PAGE_DELETION",
      "AUTH_MODIFICATION",
      "PAYMENT_MODIFICATION",
      "DATABASE_DESTRUCTIVE_OPERATION",
    ],
  },
} as const;

export function getCooldownDaysForAction(actionType: string): number {
  switch (actionType) {
    case "FAQ_ENRICHMENT":
      return SEO_AGENT_CONFIG.COOLDOWNS.FAQ_ENRICHMENT_DAYS;
    case "TITLE_OPTIMIZATION":
      return SEO_AGENT_CONFIG.COOLDOWNS.TITLE_OPTIMIZATION_DAYS;
    case "DESCRIPTION_OPTIMIZATION":
      return SEO_AGENT_CONFIG.COOLDOWNS.DESCRIPTION_OPTIMIZATION_DAYS;
    case "INTERNAL_LINKS":
      return SEO_AGENT_CONFIG.COOLDOWNS.INTERNAL_LINKS_DAYS;
    case "EDITORIAL_EXPANSION":
      return SEO_AGENT_CONFIG.COOLDOWNS.EDITORIAL_EXPANSION_DAYS;
    default:
      return SEO_AGENT_CONFIG.COOLDOWNS.DEFAULT_DAYS;
  }
}
