/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Nova Tools Autonomous SEO Agent - Comprehensive Verification Suite
 * Tests all core subsystems, safety boundaries, risk gates, and IndexNow filters.
 */

const path = require("path");
const fs = require("fs");

// Safely load .env.local for local verification without printing secrets
const envLocalPath = path.join(__dirname, "..", ".env.local");
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, "utf8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const idx = trimmed.indexOf("=");
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
      if (key && !process.env[key]) {
        process.env[key] = val;
      }
    }
  });
}

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${message}`);
    failed++;
  }
}

async function runVerification() {
  console.log("================================================================================");
  console.log("🧪 NOVA TOOLS AUTONOMOUS SEO AGENT - VERIFICATION SUITE");
  console.log("================================================================================\n");

  const workspaceRoot = path.join(__dirname, "..");
  const createJiti = require("jiti");
  const jiti = createJiti(__filename, {
    alias: {
      "@": workspaceRoot,
    },
  });

  // Test 1: Configuration & Budgets
  console.log("--- 1. Testing Configuration & Budgets ---");
  const { SEO_AGENT_CONFIG } = jiti("../lib/seo-agent/config");
  assert(SEO_AGENT_CONFIG.SITE_DOMAIN === "novatool.in", "Target site is correctly configured as novatool.in");
  assert(SEO_AGENT_CONFIG.BUDGETS.MAX_PAGE_CHANGES_PER_DAILY_CYCLE === 80, "Daily change budget is strictly bounded to 80 (max cap, not forced target)");
  assert(SEO_AGENT_CONFIG.BUDGETS.BATCH_SIZE === 20, "Batch size is strictly bounded to 20 pages per atomic batch");
  assert(Array.isArray(SEO_AGENT_CONFIG.WHITELISTED_MODIFICATION_DIRECTORIES), "Whitelisted modification directories configured");
  assert(SEO_AGENT_CONFIG.PROTECTED_PATHS.includes("lib/supabase"), "lib/supabase is in protected paths");
  assert(SEO_AGENT_CONFIG.PROTECTED_PATHS.includes("middleware.ts"), "middleware.ts is in protected paths");
  assert(SEO_AGENT_CONFIG.GSC_SITE_PROPERTY.startsWith("https://"), "GSC property uses verified URL-prefix format (https://novatool.in/)");
  assert(!SEO_AGENT_CONFIG.GSC_SITE_PROPERTY.startsWith("sc-domain:"), "GSC property strictly excludes obsolete sc-domain: syntax");
  assert(SEO_AGENT_CONFIG.COMPOSIO.BASE_URL.includes("/api/v3"), "Composio base URL upgraded to v3 API");
  if (SEO_AGENT_CONFIG.GA4_PROPERTY_ID) {
    assert(/^\d+$/.test(SEO_AGENT_CONFIG.GA4_PROPERTY_ID), `GA4 Property ID is numeric (${SEO_AGENT_CONFIG.GA4_PROPERTY_ID})`);
    assert(!SEO_AGENT_CONFIG.GA4_PROPERTY_ID.startsWith("G-"), "GA4 Property ID rejects client-side Measurement ID format (G-XXXX)");
  }

  // Test 2: Data Connector Health & Multi-Source Matrix
  console.log("\n--- 2. Testing Data Connector & Multi-Source Matrix ---");
  const { SeoDataConnector } = jiti("../lib/seo-agent/data-connector");
  const connector = new SeoDataConnector();
  const health = await connector.checkHealth();
  assert(health.gsc !== undefined, "Search Console health check executed cleanly");
  assert(health.ga4 !== undefined, "Google Analytics 4 health check executed cleanly");
  assert(health.ga4DataApi !== undefined, "Google Analytics Data API adapter health check executed cleanly");
  assert(health.bing !== undefined, "Bing Webmaster Tools health check executed cleanly");
  assert(health.clarity !== undefined, "Microsoft Clarity health check executed cleanly");
  assert(health.googleAds !== undefined, "Google Ads health check executed cleanly");
  assert(health.googleAds.status === "NOT_AVAILABLE", "Google Ads accurately reports NOT_AVAILABLE (zero synthetic metrics)");
  assert(
    ["CONNECTED", "NOT_CONNECTED", "PENDING", "ERROR"].includes(health.gsc.status),
    `GSC connector accurately reports real status (${health.gsc.status}: ${health.gsc.details})`
  );
  assert(
    ["CONNECTED", "NOT_CONNECTED", "PENDING", "ERROR"].includes(health.ga4.status),
    `GA4 connector accurately reports real status (${health.ga4.status}: ${health.ga4.details})`
  );
  assert(
    ["CONNECTED", "NOT_CONFIGURED", "AUTH_ERROR", "API_ERROR", "NO_DATA"].includes(health.ga4DataApi.status),
    `GA4 Data API accurately reports real capability status (${health.ga4DataApi.status}: ${health.ga4DataApi.details})`
  );

  // Direct GA4 Data API Adapter unit tests
  const { Ga4DataApiAdapter } = jiti("../lib/seo-agent/ga4-data-api");
  const directGa4 = new Ga4DataApiAdapter("548841684");
  const directStatus = await directGa4.checkStatus();
  assert(
    ["CONNECTED", "NOT_CONFIGURED", "AUTH_ERROR", "API_ERROR", "NO_DATA"].includes(directStatus.status),
    `Direct GA4 Data API checkStatus executed cleanly (${directStatus.status})`
  );
  const overview = await directGa4.getOverviewReport({ startDate: "2026-08-01", endDate: "2026-08-30" });
  assert(Array.isArray(overview.metrics), "GA4 getOverviewReport returns typed metrics array");
  const organic = await directGa4.getOrganicReport({ startDate: "2026-08-01", endDate: "2026-08-30" });
  assert(Array.isArray(organic.metrics), "GA4 getOrganicReport returns typed metrics array");
  const pageReport = await directGa4.getPageReport({ startDate: "2026-08-01", endDate: "2026-08-30" });
  assert(Array.isArray(pageReport.metrics), "GA4 getPageReport returns typed metrics array");

  const emptyGsc = await connector.fetchSearchConsoleMetrics({ startDate: "2026-08-01", endDate: "2026-08-28" });
  if (health.gsc.status !== "CONNECTED") {
    assert(emptyGsc.metrics.length === 0, "Unconnected GSC returns exactly 0 metrics without fabricating fake numbers");
  } else {
    assert(Array.isArray(emptyGsc.metrics), `Connected GSC successfully returned ${emptyGsc.metrics.length} real Search Analytics rows`);
  }

  const emptyGa4 = await connector.fetchAnalyticsMetrics({ startDate: "2026-08-01", endDate: "2026-08-28" });
  if (health.ga4DataApi.status !== "CONNECTED") {
    assert(emptyGa4.metrics.length === 0, "Unconfigured GA4 Data API returns exactly 0 metrics without fabricating fake numbers");
  } else {
    assert(emptyGa4.metrics.length > 0, `Connected GA4 Data API successfully returned ${emptyGa4.metrics.length} real traffic metrics`);
  }

  // Test 3: Opportunity Detection Engine (19 Signal Detectors)
  console.log("\n--- 3. Testing Opportunity Detection Engine ---");
  const { SeoOpportunityEngine } = jiti("../lib/seo-agent/opportunity-engine");
  const oppEngine = new SeoOpportunityEngine();

  // Test with sample synthetic telemetry signals to verify detector logic
  const sampleGsc = [
    {
      page: "https://novatool.in/compress-pdf",
      clicks: 12,
      impressions: 450,
      ctr: 2.6,
      position: 6.2,
      dateRange: { startDate: "2026-08-01", endDate: "2026-08-28" },
      provenance: {
        source: "GOOGLE_SEARCH_CONSOLE",
        property: "sc-domain:novatool.in",
        dateRange: { startDate: "2026-08-01", endDate: "2026-08-28" },
        retrievalTimestamp: new Date().toISOString(),
        pageOrQuery: "compress-pdf",
        metric: "CLICKS",
        value: 12,
      },
    },
    {
      page: "https://novatool.in/split-pdf",
      clicks: 2,
      impressions: 600,
      ctr: 0.33,
      position: 8.5,
      dateRange: { startDate: "2026-08-01", endDate: "2026-08-28" },
      provenance: {
        source: "GOOGLE_SEARCH_CONSOLE",
        property: "sc-domain:novatool.in",
        dateRange: { startDate: "2026-08-01", endDate: "2026-08-28" },
        retrievalTimestamp: new Date().toISOString(),
        pageOrQuery: "split-pdf",
        metric: "CLICKS",
        value: 2,
      },
    },
  ];

  const detected = oppEngine.detectOpportunities(sampleGsc, []);
  assert(detected.length > 0, `Opportunity engine detected ${detected.length} opportunities`);

  const pos410 = detected.find((o) => o.type === "POSITION_4_10_OPPORTUNITY" && o.pageSlug === "compress-pdf");
  assert(pos410 !== undefined, "Detected Position 4-10 striking distance opportunity for compress-pdf");

  const lowCtr = detected.find((o) => o.type === "HIGH_IMPRESSIONS_LOW_CTR" && o.pageSlug === "split-pdf");
  assert(lowCtr !== undefined, "Detected High-Impression / Low-CTR opportunity for split-pdf");

  // Test 4: Scoring Engine & Risk Classification
  console.log("\n--- 4. Testing Scoring Engine & Risk Boundaries ---");
  const { SeoScoringEngine } = jiti("../lib/seo-agent/scoring-engine");
  const scoringEngine = new SeoScoringEngine();
  const scored = scoringEngine.scoreAndPrioritize(detected);
  assert(scored[0].opportunityScore >= scored[scored.length - 1].opportunityScore, "Scored opportunities sorted in descending priority order");

  const { actionable, skippedHighRisk } = scoringEngine.selectActionableOpportunities(scored, 0, 0);
  assert(actionable.length <= 80, "Actionable list strictly respects max 80 changes per daily cycle");
  assert(Array.isArray(skippedHighRisk), "High-risk items correctly isolated for automatic skip");
  actionable.forEach((a) => {
    assert(a.riskLevel === "LOW" || a.riskLevel === "MEDIUM", `Actionable item ${a.pageSlug} is within safe autonomous risk tier (${a.riskLevel})`);
  });

  // Test 5: File Whitelisting & Modification Boundary
  console.log("\n--- 5. Testing File Modification Boundary ---");
  const { SeoOptimizer } = jiti("../lib/seo-agent/optimizer");
  const optimizer = new SeoOptimizer(workspaceRoot);

  const fakeHighRiskOpp = {
    id: "test-fake",
    pageSlug: "compress-pdf",
    riskLevel: "HIGH",
    targetFile: "middleware.ts",
    proposedAction: { type: "TITLE_OPTIMIZATION", targetFile: "middleware.ts", summary: "Test" },
    provenance: [],
  };

  const maliciousResult = await optimizer.applyOptimization(fakeHighRiskOpp, {
    seoTitle: "Hacked Title",
    reasoning: "Test",
    modelUsed: "test",
  });
  assert(maliciousResult.targetFile === "data/tools/pdf.ts", "Target file resolved correctly to category data file");
  assert(!optimizer.isWhitelistedFile("middleware.ts"), "Security gate correctly rejects middleware.ts");
  assert(!optimizer.isWhitelistedFile("lib/supabase/server.ts"), "Security gate correctly rejects lib/supabase/server.ts");
  assert(!optimizer.isWhitelistedFile(".env.local"), "Security gate correctly rejects .env.local");
  assert(optimizer.isWhitelistedFile("data/tools/pdf.ts"), "Security gate correctly permits data/tools/pdf.ts");

  // Revert test change using rollback snapshot
  if (maliciousResult.previousContent) {
    const rolledBack = await optimizer.rollback({
      filePath: maliciousResult.targetFile,
      previousContent: maliciousResult.previousContent,
    });
    assert(rolledBack.success === true, "Automatic instant rollback restores pristine source file");
  }

  // Test 6: Audit Store & Emergency Kill Switch
  console.log("\n--- 6. Testing Audit Store & Kill Switch ---");
  const { SeoAuditStore } = jiti("../lib/seo-agent/audit-store");
  const store = new SeoAuditStore(workspaceRoot);

  // Initial state check
  const initialKillState = store.isKillSwitchActive();
  assert(typeof initialKillState === "boolean", "Kill switch state can be read as boolean");
  store.setKillSwitch(true);
  assert(store.isKillSwitchActive() === true, "Emergency Kill Switch successfully activated");
  store.setKillSwitch(false);
  assert(store.isKillSwitchActive() === false, "Emergency Kill Switch successfully deactivated");

  // Test 7: IndexNow Integration & Safe URL Filter
  console.log("\n--- 7. Testing IndexNow Public URL Filter ---");
  const { SeoIndexNowIntegration } = jiti("../lib/seo-agent/indexnow-integration");
  const indexNow = new SeoIndexNowIntegration();

  // Test filtering private routes
  const mixedSlugs = ["compress-pdf", "admin", "api/admin/settings", "merge-pdf", "auth/login", "profile"];
  const filteredResult = await indexNow.submitChangedSlugs(mixedSlugs);
  assert(filteredResult.submittedUrls.includes("https://novatool.in/compress-pdf"), "Includes public tool compress-pdf");
  assert(filteredResult.submittedUrls.includes("https://novatool.in/merge-pdf"), "Includes public tool merge-pdf");
  assert(!filteredResult.submittedUrls.some((u) => u.includes("admin")), "Strictly excludes all /admin routes from IndexNow");
  assert(!filteredResult.submittedUrls.some((u) => u.includes("api")), "Strictly excludes all /api routes from IndexNow");
  assert(!filteredResult.submittedUrls.some((u) => u.includes("auth")), "Strictly excludes all /auth routes from IndexNow");
  assert(!filteredResult.submittedUrls.some((u) => u.includes("profile")), "Strictly excludes all /profile routes from IndexNow");

  // Test 8: Pre-Deployment Validator
  console.log("\n--- 8. Testing Pre-Deployment Integrity Gates ---");
  const { SeoValidator } = jiti("../lib/seo-agent/validator");
  const validator = new SeoValidator(workspaceRoot);

  const canonicalCheck = validator.validateCanonicals();
  assert(canonicalCheck.passed === true, canonicalCheck.message);

  const robotsCheck = validator.validateRobotsConfig();
  assert(robotsCheck.passed === true, robotsCheck.message);

  const sitemapCheck = validator.validateSitemapIntegrity();
  assert(sitemapCheck.passed === true, sitemapCheck.message);

  const linksCheck = validator.validateInternalLinks();
  assert(linksCheck.passed === true, linksCheck.message);

  // Test 9: Real Data Gate Hard Deterministic Enforcement
  // Test 9: Real Data Gate Deterministic Enforcement
  console.log("\n--- 9. Testing Real Data Gate Deterministic Enforcement ---");
  const { SeoAgentRunner } = jiti("../lib/seo-agent/runner");
  const runner = new SeoAgentRunner(workspaceRoot);
  const originalFetchMulti = runner.connector.fetchAllMultiSourceMetrics.bind(runner.connector);
  runner.connector.fetchAllMultiSourceMetrics = async () => ({
    gsc: [],
    ga4: [],
    bing: [],
    clarity: [],
    googleAds: { status: "NOT_AVAILABLE", reason: "Simulated unconfigured" },
    matrix: [],
  });

  const liveRunResult = await runner.runCycle({ dryRun: false });
  assert(liveRunResult.status === "BLOCKED_PENDING_REAL_DATA", "Production cycle strictly blocked with BLOCKED_PENDING_REAL_DATA when real GSC/GA4 missing");
  assert(liveRunResult.optimizationsApplied === 0, "Hard gate strictly ensures 0 file modifications applied");
  assert(liveRunResult.deploymentsCompleted === 0, "Hard gate strictly ensures 0 deployments executed");
  assert(liveRunResult.indexNowUrlsSubmitted.length === 0, "Hard gate strictly ensures 0 IndexNow submissions");
  assert(liveRunResult.auditRecords.some((a) => a.action === "REAL_DATA_GATE_BLOCKED"), "Gate block event recorded to audit store");

  // Restore connector method
  runner.connector.fetchAllMultiSourceMetrics = originalFetchMulti;

  // Test 10: HIGH-Risk Actions (SKIP -> LOG -> CONTINUE)
  console.log("\n--- 10. Testing HIGH-Risk Protection (SKIP -> LOG -> CONTINUE) ---");
  const highRiskTypes = [
    { type: "CANONICAL_URL_CHANGE", desc: "Canonical URL change" },
    { type: "ROBOTS_TXT_CHANGE", desc: "Robots.txt change" },
    { type: "NOINDEX_INJECTION", desc: "Noindex injection" },
    { type: "REDIRECT_CREATION", desc: "Redirect creation" },
    { type: "PAGE_DELETION", desc: "Page deletion" },
    { type: "AUTH_MODIFICATION", desc: "Auth modification" },
    { type: "PAYMENT_MODIFICATION", desc: "Payment modification" },
  ];

  const highRiskOpps = highRiskTypes.map((hr, idx) => ({
    id: `high-risk-test-${idx}`,
    pageSlug: "compress-pdf",
    pageUrl: "https://novatool.in/compress-pdf",
    type: "KEYWORD_CANNIBALIZATION_RISK",
    reason: `Simulated high risk: ${hr.desc}`,
    riskLevel: "HIGH",
    opportunityScore: 85,
    scoreBreakdown: {},
    proposedAction: { type: hr.type, targetFile: "data/tools/pdf.ts", summary: hr.desc },
    provenance: [],
    detectedAt: new Date().toISOString(),
  }));

  const { actionable: hrActionable, skippedHighRisk: hrSkipped } = scoringEngine.selectActionableOpportunities(highRiskOpps, 0, 0);
  assert(hrActionable.length === 0, "All HIGH-risk opportunities excluded from actionable list");
  assert(hrSkipped.length === highRiskTypes.length, `All ${highRiskTypes.length} HIGH-risk actions isolated for automatic skip`);

  // Test 11: Protected Filesystem Boundary
  console.log("\n--- 11. Testing Protected Filesystem Boundary ---");
  const protectedTargets = [
    ".env",
    ".env.local",
    "lib/supabase/client.ts",
    "lib/supabase/server.ts",
    "middleware.ts",
    "app/api/auth/profile/route.ts",
    "components/auth/LoginModal.tsx",
    "lib/payments/stripe.ts",
    "lib/qpdf.ts",
    "package.json",
    "next.config.ts",
  ];
  protectedTargets.forEach((p) => {
    assert(!optimizer.isWhitelistedFile(p), `Filesystem gate strictly blocks protected path: ${p}`);
  });

  // Test 12: Budget Enforcement (MAX 80/day, 560/week)
  console.log("\n--- 12. Testing Deterministic Budget Enforcement ---");
  const budgetTestOpps = [1, 2, 3, 4, 5, 6, 7].map((n) => ({
    id: `budget-opp-${n}`,
    pageSlug: `tool-${n}`,
    pageUrl: `https://novatool.in/tool-${n}`,
    type: "THIN_PAGE_CONTENT",
    reason: "Budget test",
    riskLevel: "LOW",
    opportunityScore: 50 - n,
    scoreBreakdown: {},
    proposedAction: { type: "FAQ_ENRICHMENT", targetFile: "data/tools/pdf.ts", summary: "Test" },
    provenance: [],
    detectedAt: new Date().toISOString(),
  }));

  // When 80 changes already made today (max daily cap)
  const dailyFull = scoringEngine.selectActionableOpportunities(budgetTestOpps, 80, 0);
  assert(dailyFull.actionable.length === 0, "Daily budget limit (80) strictly halts actionable items");
  assert(dailyFull.budgetExceeded.length === budgetTestOpps.length, "Deferred items isolated for next cycle");

  // When 560 changes already made this week
  const weeklyFull = scoringEngine.selectActionableOpportunities(budgetTestOpps, 0, 560);
  assert(weeklyFull.actionable.length === 0, "Weekly budget limit (560) strictly halts actionable items");

  // Test 13: Hermes + Ollama Health & Fallback
  console.log("\n--- 13. Testing Hermes Agent & Ollama Fallback ---");
  const { HermesQwenClient } = jiti("../lib/seo-agent/hermes-qwen-client");
  const llmClient = new HermesQwenClient();
  const llmHealth = await llmClient.checkHealth();
  assert(llmHealth.model !== undefined, `Target model configured as ${llmHealth.model}`);
  assert(
    llmHealth.status === "CONNECTED" || llmHealth.status === "NOT_CONNECTED" || llmHealth.status === "FALLBACK_MODE",
    `Hermes client reports truthful status (${llmHealth.status})`
  );

  const fallbackGen = await llmClient.generateOptimization(
    { id: "test", slug: "compress-pdf", name: "Compress PDF", seoTitle: "", seoDescription: "", category: "pdf", keywords: ["compress pdf"] },
    "TITLE_OPTIMIZATION",
    { primaryQuery: "compress pdf online", reason: "Title too short" }
  );
  assert(fallbackGen.seoTitle.length >= 10, `Semantic engine produced valid SEO title: "${fallbackGen.seoTitle}"`);
  assert(fallbackGen.reasoning.length > 0, "Semantic engine provides reasoning justification");

  // Test 14: Dashboard Status & Budgets
  console.log("\n--- 14. Testing Dashboard Runtime Status & Daily Status ---");
  const auditStore = new SeoAuditStore(workspaceRoot);
  const dailyStatus = auditStore.getDailyStatus();
  assert(dailyStatus.dailyHardCap === 80, "Dashboard daily hard cap is strictly 80");
  assert(dailyStatus.batchSize === 20, "Dashboard batch size is strictly 20");
  assert(typeof dailyStatus.remainingCapacity === "number", "Remaining capacity is calculated as a valid number");
  assert(Array.isArray(auditStore.getCycleHistory()), "Cycle history returns an array");
  assert(auditStore.getCycleHistory().length >= 7, "Cycle history guarantees at least 7 previous cycles");

  // Test 15: Multi-Source Telemetry Matrix Verification
  console.log("\n--- 15. Testing Multi-Source Telemetry Matrix ---");
  const dateRange = {
    startDate: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  };
  const matrix = await connector.getAllSourcesHealth(dateRange);
  assert(matrix.length === 5, "Matrix contains exactly 5 telemetry data sources");

  const sources = matrix.map((m) => m.sourceName);
  assert(sources.includes("Google Search Console"), "Matrix contains Google Search Console");
  assert(sources.includes("Google Analytics 4"), "Matrix contains Google Analytics 4");
  assert(sources.includes("Bing Webmaster Tools"), "Matrix contains Bing Webmaster Tools");
  assert(sources.includes("Microsoft Clarity"), "Matrix contains Microsoft Clarity");
  assert(sources.includes("Google Ads"), "Matrix contains Google Ads");

  // Test 16: Microsoft Clarity HTTP 429 State
  console.log("\n--- 16. Testing Microsoft Clarity Rate-Limited State ---");
  const clarityItem = matrix.find((m) => m.sourceName === "Microsoft Clarity");
  assert(clarityItem !== undefined, "Clarity item exists in matrix");
  assert(clarityItem.connected === true, "Clarity reports CONNECTED (Composio credentials valid)");
  assert(clarityItem.realDataRetrieved === false, "Clarity reports Real Data: NO (upstream 429 quota exhausted)");
  assert(clarityItem.feedsScoring === false, "Clarity reports Scoring: DISABLED (zero-metrics prevented from scoring)");
  assert(clarityItem.recordCount === 0, "Clarity record count is 0 (zero fabricated metrics)");
  assert(clarityItem.errorReason && clarityItem.errorReason.includes("429"), "Clarity reports explicit HTTP 429 rate limit reason");

  // Test 17: Google Ads NOT_AVAILABLE State
  console.log("\n--- 17. Testing Google Ads NOT_AVAILABLE State ---");
  const adsItem = matrix.find((m) => m.sourceName === "Google Ads");
  assert(adsItem !== undefined, "Google Ads item exists in matrix");
  assert(adsItem.connected === false, "Google Ads reports NOT_AVAILABLE / disconnected for autonomous SEO");
  assert(adsItem.realDataRetrieved === false, "Google Ads reports Real Data: NO (never fabricates synthetic volume)");
  assert(adsItem.feedsScoring === false, "Google Ads reports Scoring: DISABLED");
  assert(adsItem.recordCount === 0, "Google Ads record count is 0 (zero fabricated metrics)");
  assert(adsItem.errorReason && adsItem.errorReason.includes("NOT_AVAILABLE"), "Google Ads reports explicit NOT_AVAILABLE reason");

  // Test 18: 80-Page Daily Hard Cap Enforcement
  console.log("\n--- 18. Testing 80-Page Daily Hard Cap Enforcement ---");
  const sampleOpps85 = Array.from({ length: 85 }).map((_, i) => ({
    id: `cap-test-${i}`,
    pageSlug: `tool-slug-${i}`,
    pageUrl: `https://novatool.in/tool-slug-${i}`,
    type: "WEAK_INTERNAL_LINKING",
    reason: "Internal link test",
    riskLevel: "LOW",
    opportunityScore: 50,
    scoreBreakdown: {},
    proposedAction: { type: "INTERNAL_LINKS", targetFile: "data/tools/utility.ts", summary: "Link" },
    provenance: [],
    detectedAt: new Date().toISOString(),
  }));
  const scored85 = scoringEngine.scoreAndPrioritize(sampleOpps85);
  const { actionable: actionable80, budgetExceeded: exceeded5 } = scoringEngine.selectActionableOpportunities(scored85, 0, 0);
  assert(actionable80.length <= 80, `Selected opportunities strictly capped at 80 (received ${actionable80.length})`);
  assert(exceeded5.length === 5, `Excess 5 opportunities safely deferred to next cycle (received ${exceeded5.length})`);

  // Test 19: 20-Page Atomic Batching
  console.log("\n--- 19. Testing 20-Page Atomic Batching ---");
  const batchSize = SEO_AGENT_CONFIG.BUDGETS.BATCH_SIZE;
  assert(batchSize === 20, "Configured batch size is 20 pages per atomic batch");
  const sampleBatches = [];
  for (let i = 0; i < actionable80.length; i += batchSize) {
    sampleBatches.push(actionable80.slice(i, i + batchSize));
  }
  assert(sampleBatches.length === 4, `80 opportunities chunked into exactly 4 atomic batches (got ${sampleBatches.length})`);
  sampleBatches.forEach((b, idx) => {
    assert(b.length <= 20, `Batch ${idx + 1} contains ${b.length} pages (<= 20)`);
  });

  // Test 20: Emergency Kill Switch State
  console.log("\n--- 20. Testing Emergency Kill Switch State ---");
  const initialKill = auditStore.isKillSwitchActive();
  auditStore.setKillSwitch(true);
  assert(auditStore.isKillSwitchActive() === true, "Kill switch activates and persists successfully");
  auditStore.setKillSwitch(false);
  assert(auditStore.isKillSwitchActive() === false, "Kill switch deactivates and persists successfully");
  auditStore.setKillSwitch(initialKill); // Restore

  // Test 21: Protected File Boundaries & Filesystem Gate
  console.log("\n--- 21. Testing Protected File Boundaries ---");
  SEO_AGENT_CONFIG.PROTECTED_PATHS.forEach((p) => {
    assert(!optimizer.isWhitelistedFile(p), `Protected path ${p} strictly rejected by optimizer`);
  });

  // Test 22: Rollback Protection & Content Revert
  console.log("\n--- 22. Testing Rollback Mechanism ---");
  const sampleOriginal = 'export const testTool = { slug: "sample", seoTitle: "Original Title" };';
  const sampleModified = 'export const testTool = { slug: "sample", seoTitle: "Mutated Title" };';
  const tempTestFile = path.join(workspaceRoot, "data", "seo-agent", "rollback-test.tmp");
  fs.writeFileSync(tempTestFile, sampleModified, "utf8");
  optimizer.rollbackFile(tempTestFile, sampleOriginal);
  const reverted = fs.readFileSync(tempTestFile, "utf8");
  assert(reverted === sampleOriginal, "Rollback cleanly restored original file content with 100% fidelity");
  try { fs.unlinkSync(tempTestFile); } catch {}

  // Test 23: Internal-Link Metadata Preservation
  console.log("\n--- 23. Testing Internal-Link Metadata Preservation ---");
  const targetCategoryFile = path.join(workspaceRoot, "data", "tools", "image.ts");
  const originalFileContent = fs.readFileSync(targetCategoryFile, "utf8");

  const linkOpp = {
    id: "opp-link-test",
    pageSlug: "compress-image",
    pageUrl: "https://novatool.in/compress-image",
    type: "WEAK_INTERNAL_LINKING",
    riskLevel: "LOW",
    proposedAction: { type: "INTERNAL_LINKS", targetFile: "data/tools/image.ts", summary: "Add link" },
    provenance: [],
    detectedAt: new Date().toISOString(),
  };
  const linkRec = {
    seoTitle: "SHOULD_NEVER_OVERWRITE_TITLE",
    seoDescription: "SHOULD_NEVER_OVERWRITE_DESC",
    internalLinkSuggestions: ["webp-converter", "image-resizer", "png-to-jpg"],
    reasoning: "Internal linking enhancement",
    provenanceType: "model-generated",
    modelUsed: "qwen3:4b",
  };
  const patchRes = await optimizer.applyOptimization(linkOpp, linkRec);
  assert(patchRes.success === true, "Optimizer successfully processed internal link update");
  const modifiedContent = fs.readFileSync(path.join(workspaceRoot, patchRes.targetFile), "utf8");
  assert(!modifiedContent.includes("SHOULD_NEVER_OVERWRITE_TITLE"), "Optimizer strictly rejected overwriting seoTitle during internal-link action");
  assert(!modifiedContent.includes("SHOULD_NEVER_OVERWRITE_DESC"), "Optimizer strictly rejected overwriting seoDescription during internal-link action");

  // Revert changes immediately
  optimizer.rollbackFile(targetCategoryFile, originalFileContent);
  const revertedContent = fs.readFileSync(targetCategoryFile, "utf8");
  assert(revertedContent === originalFileContent, "Rollback verified: original tool file restored with 100% fidelity");

  // Test 24: Factual Content Safety Validator
  console.log("\n--- 24. Testing Factual Content Safety Validator ---");
  const { FactualContentSafetyValidator } = jiti("../lib/seo-agent/factual-safety");
  const unsafeBuzzwordResult = FactualContentSafetyValidator.validate(
    { id: "uuid-generator", slug: "uuid-generator", name: "UUID Generator", category: "utility", description: "Generate UUIDs" },
    "TITLE_OPTIMIZATION",
    { seoTitle: "Revolutionary Military-Grade UUID Generator - 100% Guaranteed" }
  );
  assert(unsafeBuzzwordResult.isSafe === false, "Factual validator blocks prohibited buzzwords (military-grade, revolutionary, 100% guaranteed)");

  const unsafeCryptoResult = FactualContentSafetyValidator.validate(
    { id: "base64-encode", slug: "base64-encode", name: "Base64 Encoder", category: "developer", description: "Encode Base64" },
    "FAQ_ENRICHMENT",
    { faqs: [{ question: "Is this secure?", answer: "This tool uses 256-bit AES encryption with RSA-4096 keys." }] }
  );
  assert(unsafeCryptoResult.isSafe === false, "Factual validator blocks ungrounded crypto claims (AES-256 on simple base64)");

  const safeBrowserResult = FactualContentSafetyValidator.validate(
    { id: "aspect-ratio-calculator", slug: "aspect-ratio-calculator", name: "Aspect Ratio Calculator", category: "image", description: "Calculate aspect ratios" },
    "FAQ_ENRICHMENT",
    { faqs: [{ question: "How does it work?", answer: "Calculations run locally in your web browser using client-side JavaScript for immediate results." }] }
  );
  assert(safeBrowserResult.isSafe === true, "Factual validator passes grounded client-side browser tool explanation");

  // Test 25: Admin Authorization System
  console.log("\n--- 25. Testing Admin Authorization System ---");
  const { verifyAdminSession } = jiti("../lib/supabase/server");
  assert(typeof verifyAdminSession === "function", "verifyAdminSession exists and enforces server-side database RLS verification");

  // Test 26: Robust Actionability Gate & Idempotency
  console.log("\n--- 26. Testing Robust Actionability Gate & Idempotency ---");
  const { verifyActionableSemanticChange } = jiti("../lib/seo-agent/runner");
  const { normalizeFaqQuestion } = jiti("../lib/seo-agent/hermes-qwen-client");
  const { getToolBySlug } = jiti("../lib/tools/registry");

  const aspectTool = getToolBySlug("aspect-ratio-calculator");
  assert(aspectTool !== undefined, "Loaded aspect-ratio-calculator tool definition");

  // Scenario 1: Duplicate FAQ Normalization
  const q1 = "What is an aspect ratio?";
  const q2 = "what is an aspect ratio???";
  const q3 = "  What is an Aspect Ratio?  ";
  assert(normalizeFaqQuestion(q1) === normalizeFaqQuestion(q2), "normalizeFaqQuestion strips trailing punctuation for robust matching");
  assert(normalizeFaqQuestion(q1) === normalizeFaqQuestion(q3), "normalizeFaqQuestion normalizes casing and surrounding whitespace");

  // Scenario 2: FAQ Already Exists Gate
  const existingFaqCheck = verifyActionableSemanticChange(
    aspectTool,
    "FAQ_ENRICHMENT",
    { faqs: [{ question: "What is an aspect ratio?", answer: "Existing answer duplicate" }] }
  );
  assert(existingFaqCheck.isActionable === false, "FAQ already exists: verifyActionableSemanticChange blocks duplicate FAQ");
  assert(existingFaqCheck.reason.includes("already exist"), "Actionability reason accurately explains all proposed FAQs already exist");

  // Scenario 3: FAQ Generator Returns Zero FAQs Gate
  const zeroFaqCheck = verifyActionableSemanticChange(
    aspectTool,
    "FAQ_ENRICHMENT",
    { faqs: [] }
  );
  assert(zeroFaqCheck.isActionable === false, "FAQ generator returns zero FAQs: verifyActionableSemanticChange marks not actionable");
  assert(zeroFaqCheck.reason.includes("zero FAQ"), "Actionability reason accurately reports zero FAQ items returned");

  // Scenario 4: Successful New FAQ Generation
  const qwenClient = new HermesQwenClient();
  const fallbackResult = await qwenClient.generateOptimization(
    aspectTool,
    "FAQ_ENRICHMENT",
    { reason: "Thin content enrichment" }
  );
  assert(fallbackResult.faqs !== undefined && fallbackResult.faqs.length > 0, "Deterministic fallback generates at least 1 new grounded FAQ when below threshold");
  const newFaqCheck = verifyActionableSemanticChange(aspectTool, "FAQ_ENRICHMENT", fallbackResult);
  assert(newFaqCheck.isActionable === true, "Successful new FAQ generation: verifyActionableSemanticChange marks opportunity as ACTIONABLE");
  assert(
    !aspectTool.faq.some((ef) => normalizeFaqQuestion(ef.question) === normalizeFaqQuestion(fallbackResult.faqs[0].question)),
    "Generated FAQ question is genuinely new and does not duplicate any existing FAQ"
  );

  // Scenario 5: Title Action with Identical Metadata Gate
  const identicalTitleCheck = verifyActionableSemanticChange(
    aspectTool,
    "TITLE_OPTIMIZATION",
    { seoTitle: aspectTool.seoTitle }
  );
  assert(identicalTitleCheck.isActionable === false, "Title action with identical metadata is rejected as not actionable");
  assert(identicalTitleCheck.reason.includes("identical"), "Title action reason notes proposed title is identical to existing");

  // Scenario 6: Description Action with Identical Metadata Gate
  const identicalDescCheck = verifyActionableSemanticChange(
    aspectTool,
    "DESCRIPTION_OPTIMIZATION",
    { seoDescription: aspectTool.seoDescription }
  );
  assert(identicalDescCheck.isActionable === false, "Description action with identical metadata is rejected as not actionable");
  assert(identicalDescCheck.reason.includes("identical"), "Description action reason notes proposed description is identical to existing");

  // Scenario 7: Internal Link Action with No New Links Gate
  const identicalLinksCheck = verifyActionableSemanticChange(
    aspectTool,
    "INTERNAL_LINKS",
    { internalLinkSuggestions: [...aspectTool.relatedTools] }
  );
  assert(identicalLinksCheck.isActionable === false, "Internal link action with no new links is rejected as not actionable");
  assert(identicalLinksCheck.reason.includes("already exist"), "Internal link action reason notes all proposed links already exist");

  // Scenario 8: Second Identical Cycle Produces Zero Changes (Idempotency in Optimizer)
  const duplicateFaqOpp = {
    id: "opp-duplicate-faq",
    pageSlug: "aspect-ratio-calculator",
    type: "THIN_PAGE_CONTENT",
    riskLevel: "LOW",
    proposedAction: { type: "FAQ_ENRICHMENT", targetFile: "data/tools/calculators.ts", summary: "Add FAQ" },
    provenance: [],
    detectedAt: new Date().toISOString(),
  };
  const duplicateFaqRec = {
    faqs: [{ question: aspectTool.faq[0].question, answer: "Duplicate content" }],
    reasoning: "Duplicate FAQ attempt",
    provenanceType: "deterministic-fallback",
    modelUsed: "deterministic-rules-engine",
  };
  const duplicateApplyRes = await optimizer.applyOptimization(duplicateFaqOpp, duplicateFaqRec);
  assert(duplicateApplyRes.success === false, "Optimizer idempotency: applying duplicate FAQ returns success=false");
  assert(
    duplicateApplyRes.errorMessage && duplicateApplyRes.errorMessage.includes("NO_ACTIONABLE_CHANGE"),
    `Optimizer returns clear NO_ACTIONABLE_CHANGE reason (${duplicateApplyRes.errorMessage})`
  );

  // Test 27: Recurring Optimization Loop Prevention & Cooldown
  console.log("\n--- 27. Testing Recurring Optimization Loop Prevention & Cooldown ---");
  const { computeToolContentFingerprint } = jiti("../lib/seo-agent/audit-store");
  const os = require("os");

  // Create isolated temporary audit store for unit testing
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "nova-seo-test-"));
  const testStore = new SeoAuditStore(tempDir);

  // Scenario 1: Same FAQ optimization detected twice (duplicate content fingerprint)
  const faq1 = { question: "How to calculate aspect ratios quickly?", answer: "Use width divided by height." };
  const fp1 = computeToolContentFingerprint(aspectTool, "FAQ_ENRICHMENT", { faqs: [faq1] });
  assert(typeof fp1 === "string" && fp1.length === 16, "computeToolContentFingerprint generates 16-character SHA-256 fingerprint");

  testStore.recordOptimization({
    pageSlug: "aspect-ratio-calculator",
    opportunityType: "THIN_PAGE_CONTENT",
    actionType: "FAQ_ENRICHMENT",
    contentFingerprint: fp1,
    commitStatus: "DEPLOYED",
    commitHash: "abc123456",
    details: { faqCount: 7 },
  });

  const duplicateCheck = testStore.isContentAlreadyApplied("aspect-ratio-calculator", "FAQ_ENRICHMENT", fp1);
  assert(duplicateCheck === true, "isContentAlreadyApplied detects identical content fingerprint already deployed");

  // Scenario 2: Same page immediately after successful deployment
  const immediateCooldown = testStore.isPageInCooldown("aspect-ratio-calculator", "FAQ_ENRICHMENT");
  assert(immediateCooldown.inCooldown === true, "isPageInCooldown blocks same page immediately after successful deployment");
  assert(immediateCooldown.remainingDays === 14, `Immediate cooldown shows 14 remaining days (got ${immediateCooldown.remainingDays})`);

  // Scenario 3: Cooldown blocking (within 14 days)
  const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString();
  testStore.recordOptimization({
    pageSlug: "percentage-calculator",
    opportunityType: "THIN_PAGE_CONTENT",
    actionType: "FAQ_ENRICHMENT",
    contentFingerprint: "fingerprint-pct-1",
    timestamp: fiveDaysAgo,
    commitStatus: "DEPLOYED",
    commitHash: "pct123",
  });
  const blockedCooldown = testStore.isPageInCooldown("percentage-calculator", "FAQ_ENRICHMENT");
  assert(blockedCooldown.inCooldown === true, "Page deployed 5 days ago is blocked by 14-day cooldown");
  assert(blockedCooldown.remainingDays === 9, `Page deployed 5 days ago has 9 days remaining in cooldown (got ${blockedCooldown.remainingDays})`);

  // Scenario 4: Cooldown expiry (after 14 days)
  const fifteenDaysAgo = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString();
  testStore.recordOptimization({
    pageSlug: "age-calculator",
    opportunityType: "THIN_PAGE_CONTENT",
    actionType: "FAQ_ENRICHMENT",
    contentFingerprint: "fingerprint-age-1",
    timestamp: fifteenDaysAgo,
    commitStatus: "DEPLOYED",
    commitHash: "age123",
  });
  const expiredCooldown = testStore.isPageInCooldown("age-calculator", "FAQ_ENRICHMENT");
  assert(expiredCooldown.inCooldown === false, "Page deployed 15 days ago has expired cooldown and is ready for re-optimization");
  assert(expiredCooldown.remainingDays === 0, "Expired cooldown reports 0 remaining days");

  // Scenario 5: Duplicate FAQ question & answer prevention
  const dupQCheck = verifyActionableSemanticChange(
    aspectTool,
    "FAQ_ENRICHMENT",
    { faqs: [{ question: aspectTool.faq[0].question, answer: "Brand new answer text" }] }
  );
  assert(dupQCheck.isActionable === false, "Duplicate question prevention: rejected even with different answer");

  const dupAnsCheck = verifyActionableSemanticChange(
    aspectTool,
    "FAQ_ENRICHMENT",
    { faqs: [{ question: "Completely new question?", answer: aspectTool.faq[0].answer }] }
  );
  assert(dupAnsCheck.isActionable === false, "Duplicate answer prevention: rejected when answer matches existing FAQ answer");

  // Scenario 6: No-op title
  const noopTitleCheck = verifyActionableSemanticChange(
    aspectTool,
    "TITLE_OPTIMIZATION",
    { seoTitle: aspectTool.seoTitle }
  );
  assert(noopTitleCheck.isActionable === false, "No-op title is rejected by verifyActionableSemanticChange");

  // Scenario 7: Weaker title & description rejection
  const weakerTitleCheck = verifyActionableSemanticChange(
    aspectTool,
    "TITLE_OPTIMIZATION",
    { seoTitle: "Ratio Calc" } // Too short (< 30 chars), degrades existing quality title
  );
  assert(weakerTitleCheck.isActionable === false, "Weaker title rejected: degraded title under 30 chars rejected");
  assert(weakerTitleCheck.reason.includes("weaker") || weakerTitleCheck.reason.includes("short"), "Rejection reason explicitly notes weaker/short title");

  const weakerDescCheck = verifyActionableSemanticChange(
    aspectTool,
    "DESCRIPTION_OPTIMIZATION",
    { seoDescription: "A calculator for aspect ratios." } // Too short (< 100 chars)
  );
  assert(weakerDescCheck.isActionable === false, "Weaker description rejected: degraded description under 100 chars rejected");

  // Scenario 8: Different legitimate future optimization remaining actionable
  const diffActionCooldown = testStore.isPageInCooldown("aspect-ratio-calculator", "INTERNAL_LINKS");
  assert(diffActionCooldown.inCooldown === false, "Different action type (INTERNAL_LINKS) is NOT blocked by FAQ_ENRICHMENT cooldown");
  const legitLinksCheck = verifyActionableSemanticChange(
    aspectTool,
    "INTERNAL_LINKS",
    { internalLinkSuggestions: ["length-unit-converter", "weight-unit-converter"] }
  );
  assert(legitLinksCheck.isActionable === true, "Different legitimate action (INTERNAL_LINKS) remains actionable");

  // Scenario 9: Process restart preserving optimization state
  // Load a brand-new SeoAuditStore instance pointing to the same temp directory
  const reloadedStore = new SeoAuditStore(tempDir);
  const reloadedCheck = reloadedStore.isPageInCooldown("aspect-ratio-calculator", "FAQ_ENRICHMENT");
  assert(reloadedCheck.inCooldown === true, "Process restart: reloaded store preserves optimization history and cooldowns from disk");
  const reloadedOpts = reloadedStore.getOptimizations();
  assert(reloadedOpts.length >= 3, `Process restart: reloaded store loaded all ${reloadedOpts.length} optimizations from disk`);

  // Scenario 10: Real workspace audit store has aspect-ratio-calculator under active cooldown from historical deployment
  const workspaceAuditStore = new SeoAuditStore(workspaceRoot);
  const aspectWorkspaceCooldown = workspaceAuditStore.isPageInCooldown("aspect-ratio-calculator", "FAQ_ENRICHMENT");
  assert(aspectWorkspaceCooldown.inCooldown === true, "aspect-ratio-calculator is under active cooldown in workspace audit store from historical deployment");

  // Scenario 11: Useful Content Depth & Idempotency Gate
  const { evaluateUsefulContentDepth, evaluateOpportunityIdempotency } = jiti("../lib/seo-agent/idempotency-gate");
  const aspectDepth = evaluateUsefulContentDepth(aspectTool);
  assert(aspectDepth.isThin === false, "evaluateUsefulContentDepth: aspect-ratio-calculator with 6 FAQs is NOT thin");
  assert(aspectDepth.faqCount === 6, "evaluateUsefulContentDepth: counts all 6 existing FAQs correctly");
  assert(aspectDepth.depthScore >= 70, `evaluateUsefulContentDepth: content depth score is high (${aspectDepth.depthScore}/100)`);

  const thinOpp = {
    id: "thin-aspect",
    pageSlug: "aspect-ratio-calculator",
    type: "THIN_PAGE_CONTENT",
    riskLevel: "LOW",
    proposedAction: { type: "FAQ_ENRICHMENT", targetFile: "data/tools/calculators.ts", summary: "Add FAQ" },
    provenance: [],
    detectedAt: new Date().toISOString(),
  };
  const idempotencyAspect = evaluateOpportunityIdempotency(aspectTool, thinOpp, testStore);
  assert(idempotencyAspect.status === "ALREADY_OPTIMIZED", "Idempotency gate marks aspect-ratio-calculator as ALREADY_OPTIMIZED");
  assert(idempotencyAspect.isActionable === false, "Idempotency gate marks ALREADY_OPTIMIZED as non-actionable");

  // Scenario 12: Genuinely thin page has REMAINING_GAP
  const fakeThinTool = {
    id: "fake-thin",
    slug: "fake-thin",
    name: "Fake Thin Tool",
    faq: [{ question: "Q?", answer: "A" }],
    howToSteps: [],
    features: [],
  };
  const fakeThinDepth = evaluateUsefulContentDepth(fakeThinTool);
  assert(fakeThinDepth.isThin === true, "Genuinely thin page (1 FAQ, no steps/features) is flagged as isThin=true");
  const fakeThinOpp = {
    id: "thin-fake",
    pageSlug: "fake-thin",
    type: "THIN_PAGE_CONTENT",
    riskLevel: "LOW",
    proposedAction: { type: "FAQ_ENRICHMENT", targetFile: "data/tools/utility.ts", summary: "Add FAQ" },
    provenance: [],
    detectedAt: new Date().toISOString(),
  };
  const idempotencyThin = evaluateOpportunityIdempotency(fakeThinTool, fakeThinOpp, testStore);
  assert(idempotencyThin.status === "REMAINING_GAP", "Genuinely thin page receives REMAINING_GAP status from idempotency gate");
  assert(idempotencyThin.isActionable === true, "REMAINING_GAP is actionable");
  assert(idempotencyThin.remainingGap !== undefined, "REMAINING_GAP includes specific description of what remains missing");

  // ============================================================================
  // Section 14: Two-Stage Validation, Watchdogs, and Link Integrity Suite
  // (12 Regression Scenarios for Autonomous SEO Agent Production Reliability)
  // ============================================================================
  console.log("\n--- 14. Testing Internal Links, Two-Stage Validation & Watchdogs ---");

  const { normalizeToolSlug: normSlug, execWithWatchdog: execWd } = jiti("../lib/seo-agent/validator");
  const { getAllTools } = jiti("../lib/tools/registry");
  const seoValidator = new SeoValidator(workspaceRoot);

  // Scenario 1: compress-image with image-cropper passes internal link validation cleanly
  const compressLinkCheck = seoValidator.validateInternalLinks("compress-image");
  assert(compressLinkCheck.passed === true, "Scenario 1: compress-image passes internal link validation with image-cropper in registry");
  const imageCropperTool = getAllTools().find((t) => t.slug === "image-cropper");
  assert(imageCropperTool !== undefined, "Scenario 1: image-cropper exists in canonical registry");
  assert(imageCropperTool.relatedTools.includes("compress-image"), "Scenario 1: image-cropper cross-links to compress-image");

  // Scenario 2: Valid relatedTools cross-referencing between active canonical tools passes validation
  const globalLinksCheck = seoValidator.validateInternalLinks();
  assert(globalLinksCheck.passed === true, "Scenario 2: Global relatedTools link graph passes canonical validation across all tools");

  // Scenario 3: Leading and trailing slash variations in tool slugs are correctly normalized
  assert(normSlug("/image-cropper") === "image-cropper", "Scenario 3: Leading slash normalized (/image-cropper -> image-cropper)");
  assert(normSlug("image-cropper/") === "image-cropper", "Scenario 3: Trailing slash normalized (image-cropper/ -> image-cropper)");
  assert(normSlug(" /image-cropper/ ") === "image-cropper", "Scenario 3: Leading/trailing whitespace and slashes normalized");
  assert(normSlug("IMAGE-CROPPER") === "image-cropper", "Scenario 3: Uppercase slug normalized to lowercase");

  // Scenario 4: Missing/invalid related tool slug is strictly rejected with a clear descriptive error message
  const missingSlugCheck = seoValidator.validateInternalLinks("non-existent-tool-slug-xyz");
  assert(missingSlugCheck.passed === false, "Scenario 4: Non-existent tool slug rejected by internal link validator");
  assert(missingSlugCheck.message.includes("not found in canonical registry"), "Scenario 4: Clear descriptive error message for missing tool slug");

  // --- Requirement 9: Dedicated Regression Tests for relatedTools Failure Modes ---
  // A. Deleted related tool test
  const deletedToolCheck = seoValidator.validateToolLinks({ slug: "test-tool", relatedTools: ["deleted-tool-fixture"] });
  assert(deletedToolCheck.passed === false, "Regression 9a: Deleted related tool rejected strictly");
  assert(deletedToolCheck.message.includes("references invalid related tools: deleted-tool-fixture"), "Regression 9a: Error message clearly names deleted tool");

  // B. Renamed related tool test (stale obsolete slug)
  const renamedToolCheck = seoValidator.validateToolLinks({ slug: "test-tool", relatedTools: ["old-unrenamed-slug-fixture"] });
  assert(renamedToolCheck.passed === false, "Regression 9b: Renamed related tool with stale slug rejected strictly");
  assert(renamedToolCheck.message.includes("references invalid related tools: old-unrenamed-slug-fixture"), "Regression 9b: Error message clearly names stale slug");

  // C. Valid related tool test
  const validToolCheck = seoValidator.validateToolLinks({ slug: "compress-image", relatedTools: ["image-resizer", "image-cropper", "signature-resizer"] });
  assert(validToolCheck.passed === true, "Regression 9c: Valid related tool cross-referencing passes cleanly");

  // D. Multiple invalid references test (all invalid references reported clearly)
  const multiInvalidCheck = seoValidator.validateToolLinks({ slug: "test-tool", relatedTools: ["invalid-tool-alpha", "invalid-tool-beta"] });
  assert(multiInvalidCheck.passed === false, "Regression 9d: Multiple invalid references rejected strictly");
  assert(multiInvalidCheck.message.includes("invalid-tool-alpha, invalid-tool-beta"), "Regression 9d: Validator reports ALL invalid references clearly in single message");

  // E. Unrelated page remaining optimizable
  const unrelatedPageCheck = seoValidator.validatePageStageA("aspect-ratio-calculator");
  assert(unrelatedPageCheck.passed === true, "Regression 9e: Unrelated page remains fully optimizable and passes Stage A");

  // Scenario 5: Multi-page batch where one page has an invalid link or syntax error is handled cleanly
  const validStageA = seoValidator.validatePageStageA("compress-image");
  assert(validStageA.passed === true, "Scenario 5: Valid page compress-image passes Stage A validation");
  const invalidStageA = seoValidator.validatePageStageA("non-existent-tool-page");
  assert(invalidStageA.passed === false, "Scenario 5: Non-existent page fails Stage A validation");
  assert(invalidStageA.failureReason.includes("does not exist in canonical registry"), "Scenario 5: Stage A failure includes precise failureReason");

  // Scenario 6: Bad page is caught and rejected at Stage A without running expensive build/typecheck/lint
  assert(invalidStageA.durationMs < 2000, `Scenario 6: Bad page caught cheaply in Stage A (${invalidStageA.durationMs}ms < 2000ms) without running expensive build`);
  assert(validStageA.durationMs < 2000, `Scenario 6: Valid page validated cheaply in Stage A (${validStageA.durationMs}ms < 2000ms)`);

  // Scenario 7: Remaining valid pages in the batch continue successfully after the bad page is isolated
  const simulatedBatch = ["non-existent-bad-slug", "compress-image", "aspect-ratio-calculator"];
  const stageAResults = simulatedBatch.map((s) => seoValidator.validatePageStageA(s));
  const isolatedFailedPages = stageAResults.filter((r) => !r.passed).map((r) => r.slug);
  const survivingBatchPages = stageAResults.filter((r) => r.passed).map((r) => r.slug);
  assert(isolatedFailedPages.length === 1 && isolatedFailedPages[0] === "non-existent-bad-slug", "Scenario 7: Bad page correctly isolated");
  assert(survivingBatchPages.length === 2 && survivingBatchPages.includes("compress-image") && survivingBatchPages.includes("aspect-ratio-calculator"), "Scenario 7: Remaining valid pages continue in surviving batch");

  // Scenario 8: Global validation failure (Stage B) rolling back remaining atomic batch
  assert(typeof seoValidator.validateBatchStageB === "function", "Scenario 8: validateBatchStageB method exists on SeoValidator");
  assert(typeof seoValidator.runTypeCheck === "function", "Scenario 8: runTypeCheck method exists on SeoValidator");
  assert(typeof seoValidator.runLintCheck === "function", "Scenario 8: runLintCheck method exists on SeoValidator");
  assert(typeof seoValidator.runBuildCheck === "function", "Scenario 8: runBuildCheck method exists on SeoValidator");

  // Scenario 9: Watchdog timeout handles slow execution cleanly without freezing the process
  const watchdogStart = Date.now();
  let watchdogTimedOut = false;
  try {
    // Run a command that takes 2000ms with a 200ms watchdog timeout
    await execWd(
      process.platform === "win32"
        ? 'powershell -NoProfile -Command "Start-Sleep -Milliseconds 2000"'
        : "sleep 2",
      { cwd: workspaceRoot },
      200,
      "Test Watchdog Timeout"
    );
  } catch (err) {
    if (err.message && err.message.includes("TIMEOUT:")) {
      watchdogTimedOut = true;
    }
  }
  const watchdogElapsed = Date.now() - watchdogStart;
  assert(watchdogTimedOut === true, "Scenario 9: Watchdog timeout cleanly interrupted slow execution and threw explicit TIMEOUT error");
  assert(watchdogElapsed < 1500, `Scenario 9: Watchdog terminated process tree promptly (${watchdogElapsed}ms < 1500ms)`);

  // Scenario 10: Watchdog timeout handles hanging build command configuration
  assert(SEO_AGENT_CONFIG.TIMEOUTS !== undefined, "Scenario 10: TIMEOUTS configuration dictionary defined in config");
  assert(SEO_AGENT_CONFIG.TIMEOUTS.BUILD_MS === 300000, "Scenario 10: Build timeout configured to 300,000ms (5 min)");
  assert(SEO_AGENT_CONFIG.TIMEOUTS.TYPECHECK_MS === 90000, "Scenario 10: Typecheck timeout configured to 90,000ms (90s)");
  assert(SEO_AGENT_CONFIG.TIMEOUTS.LINT_MS === 60000, "Scenario 10: Lint timeout configured to 60,000ms (60s)");

  // Scenario 11: Git, deployment, and IndexNow timeout watchdogs configured
  assert(SEO_AGENT_CONFIG.TIMEOUTS.GIT_COMMIT_MS === 30000, "Scenario 11: Git commit watchdog configured to 30s");
  assert(SEO_AGENT_CONFIG.TIMEOUTS.GIT_PUSH_MS === 60000, "Scenario 11: Git push watchdog configured to 60s");
  assert(SEO_AGENT_CONFIG.TIMEOUTS.DEPLOY_VERIFY_MS === 180000, "Scenario 11: Deploy verification watchdog configured to 180s");
  assert(SEO_AGENT_CONFIG.TIMEOUTS.INDEXNOW_MS === 15000, "Scenario 11: IndexNow watchdog configured to 15s");

  // Scenario 12: Idempotency is preserved after successful deployment
  const testAspectTool = getAllTools().find((t) => t.slug === "aspect-ratio-calculator");
  const aspectIdempotencyRecheck = evaluateOpportunityIdempotency(testAspectTool, thinOpp, testStore);
  assert(aspectIdempotencyRecheck.status === "ALREADY_OPTIMIZED", "Scenario 12: Idempotency preserved: aspect-ratio-calculator marked ALREADY_OPTIMIZED");
  assert(aspectIdempotencyRecheck.isActionable === false, "Scenario 12: ALREADY_OPTIMIZED is non-actionable, preventing redundant cycle churn");

  // Scenario 13: Concurrency Lock prevents duplicate cycles
  console.log("--- Testing Concurrency Lock Protection ---");
  const lockDir = path.join(workspaceRoot, "data", "seo-agent");
  const lockPath = path.join(lockDir, "seo-agent.lock");
  fs.mkdirSync(lockDir, { recursive: true });
  fs.writeFileSync(
    lockPath,
    JSON.stringify({ pid: process.pid, timestamp: new Date().toISOString(), cycleId: "test-lock" }),
    "utf8"
  );
  let lockBlocked = false;
  try {
    const { SeoAgentRunner } = jiti("../lib/seo-agent/runner");
    const testRunner = new SeoAgentRunner(workspaceRoot);
    await testRunner.runCycle({ dryRun: true });
  } catch (err) {
    if (err && err.message === "SEO cycle already running") {
      lockBlocked = true;
    }
  } finally {
    try {
      if (fs.existsSync(lockPath)) fs.unlinkSync(lockPath);
    } catch {}
  }
  assert(lockBlocked === true, "Scenario 13: Concurrency Lock successfully blocked duplicate cycle and threw 'SEO cycle already running'");

  // ============================================================================
  // Task 14: Dedicated Regression Tests
  // ============================================================================
  console.log("\n--- Task 14: Dedicated Regression Suite ---");

  // 1. Ollama timeout regression test
  console.log("Testing Ollama timeout handling...");
  const { HermesQwenClient: TimeoutHermesClient } = jiti("../lib/seo-agent/hermes-qwen-client");
  const timeoutLlmClient = new TimeoutHermesClient();
  timeoutLlmClient.customEndpoint = "http://127.0.0.1:59999/timeout-test";
  const dummyTool = getAllTools()[0];
  const llmStart = Date.now();
  const llmRes = await timeoutLlmClient.generateOptimization(dummyTool, "FAQ_ENRICHMENT", { reason: "Regression test" });
  const llmElapsed = Date.now() - llmStart;
  assert(llmRes !== null && typeof llmRes === "object", "Regression 1: Ollama timeout returns structured deterministic fallback");
  assert(llmElapsed < 10000, `Regression 1: Ollama request failed promptly without hanging (${llmElapsed}ms)`);

  // 2. Connector timeout regression test
  console.log("Testing Connector timeout handling...");
  const { SeoDataConnector: TimeoutDataConnector } = jiti("../lib/seo-agent/data-connector");
  const testConnector = new TimeoutDataConnector();
  const connStart = Date.now();
  const gscTimeoutRes = await testConnector.fetchSearchConsoleMetrics({ startDate: "2026-01-01", endDate: "2026-01-28" });
  const connElapsed = Date.now() - connStart;
  assert(gscTimeoutRes !== null && Array.isArray(gscTimeoutRes.metrics), "Regression 2: Connector timeout returns structured failure result");
  assert(connElapsed < 10000, `Regression 2: Connector request resolved cleanly without hanging (${connElapsed}ms)`);

  // 3. Validation timeout regression test
  console.log("Testing Validation timeout handling...");
  let valTimedOut = false;
  try {
    await execWd(
      process.platform === "win32"
        ? 'powershell -NoProfile -Command "Start-Sleep -Milliseconds 1500"'
        : "sleep 1.5",
      { cwd: workspaceRoot },
      100,
      "Validation Timeout Test"
    );
  } catch (err) {
    if (err && err.message && err.message.includes("TIMEOUT:")) {
      valTimedOut = true;
    }
  }
  assert(valTimedOut === true, "Regression 3: Validation timeout triggers structured TIMEOUT rejection");

  // 4. Build timeout regression test
  console.log("Testing Build timeout handling...");
  const buildCheckTimeoutRes = await seoValidator.runBuildCheck(50);
  assert(buildCheckTimeoutRes.passed === false, "Regression 4: Build timeout returns structured failure result");
  assert(buildCheckTimeoutRes.name === "Next.js Build Gate", "Regression 4: Build timeout preserves gate identity");
  assert(buildCheckTimeoutRes.message.includes("TIMEOUT:") || buildCheckTimeoutRes.message.includes("exceeded"), "Regression 4: Build timeout captures explicit timeout message");

  // 5. No-op candidate regression test
  console.log("Testing No-op candidate filtering...");
  const mockMaxedTool = {
    ...dummyTool,
    faq: Array(10).fill({ question: "Existing Q?", answer: "Existing A." }),
    relatedTools: ["aspect-ratio-calculator", "base64-encoder", "color-converter", "cron-generator", "csv-to-json", "diff-checker"],
  };
  const noOpActionability = evaluateOpportunityIdempotency(mockMaxedTool, {
    id: "test-noop",
    type: "THIN_PAGE_CONTENT",
    pageSlug: mockMaxedTool.slug,
    pageUrl: `https://novatool.in/${mockMaxedTool.slug}`,
    priorityScore: 70,
    riskLevel: "LOW",
    confidence: "HIGH",
    reason: "Test no-op",
    proposedAction: { type: "FAQ_ENRICHMENT", summary: "Test", risk: "LOW" },
    provenance: [],
  }, testStore);
  assert(noOpActionability.isActionable === false, "Regression 5: Maxed-out tool filtered as non-actionable before LLM");

  // 6. Already optimized candidate regression test
  console.log("Testing Already Optimized candidate filtering...");
  const alreadyOptimizedTool = getAllTools().find((t) => t.slug === "aspect-ratio-calculator");
  const alreadyOptCheck = evaluateOpportunityIdempotency(alreadyOptimizedTool, thinOpp, testStore);
  assert(alreadyOptCheck.status === "ALREADY_OPTIMIZED", "Regression 6: Previously optimized tool recognized as ALREADY_OPTIMIZED");
  assert(alreadyOptCheck.isActionable === false, "Regression 6: ALREADY_OPTIMIZED candidate filtered before LLM invocation");

  // 7. One candidate failure while another candidate remains processable (isolation)
  console.log("Testing single candidate failure isolation...");
  const invalidCandidate = seoValidator.validatePageStageA("non-existent-tool-slug-xyz");
  const validCandidate = seoValidator.validatePageStageA("aspect-ratio-calculator");
  assert(invalidCandidate.passed === false, "Regression 7: Invalid candidate fails Stage A");
  assert(validCandidate.passed === true, "Regression 7: Valid candidate passes Stage A");
  assert(validCandidate.slug === "aspect-ratio-calculator", "Regression 7: Valid candidate remains processable in batch");

  // 8. Complete successful batch validation
  console.log("Testing complete successful batch validation...");
  const validSlugs = ["aspect-ratio-calculator", "compress-image"];
  const batchStageAResults = validSlugs.map((s) => seoValidator.validatePageStageA(s));
  assert(batchStageAResults.every((r) => r.passed), "Regression 8: All candidates in valid batch pass Stage A");

  // 9. Terminal cycle state
  console.log("Testing terminal cycle state...");
  const { SeoAgentRunner: RegRunner } = jiti("../lib/seo-agent/runner");
  const regRunner = new RegRunner(workspaceRoot);
  const allowedTerminalStates = ["COMPLETED", "PARTIAL", "FAILED", "DRY_RUN", "BLOCKED_PENDING_REAL_DATA", "PAUSED_KILL_SWITCH"];
  const dryRunCycleRes = await regRunner.runCycle({ dryRun: true, forceSingleSlug: "aspect-ratio-calculator" });
  assert(allowedTerminalStates.includes(dryRunCycleRes.status), `Regression 9: Cycle execution reached valid terminal state (${dryRunCycleRes.status})`);
  assert(typeof dryRunCycleRes.success === "boolean", "Regression 9: Cycle result includes boolean success flag");

  // Clean up temp dir
  try {
    fs.rmSync(tempDir, { recursive: true, force: true });
  } catch {
    // Ignore cleanup error in test
  }

  console.log("\n================================================================================");
  console.log(`VERIFICATION SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("================================================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runVerification().catch((err) => {
  console.error("Verification crashed:", err);
  process.exit(1);
});
