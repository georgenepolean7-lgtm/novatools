#!/usr/bin/env node
/**
 * Nova Tools Autonomous SEO Agent - Cloud & 404 Resolution Verification Suite
 * Validates:
 * 1. AIProvider Cloud / Local abstraction
 * 2. 404 URL classification (SAFE_FIX, IGNORED_EXTERNAL, REVIEW_REQUIRED)
 * 3. 301 Permanent Redirects in next.config.ts for the 4 crawled tool typos
 * 4. Robots.txt and robots.ts /cdn-cgi/ disallow rule
 * 5. Email obfuscation protection in SiteFooter and contact page
 * 6. Autonomous cycle hard safety limits (40 pages/cycle, 2 batches of 20)
 * 7. High-risk change rejection
 */

const path = require("path");
const fs = require("fs");
const assert = require("assert");

const workspaceRoot = path.join(__dirname, "..");
const createJiti = require("jiti");
const jiti = createJiti(__filename, {
  alias: {
    "@": workspaceRoot,
  },
});

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`❌ FAIL: ${name}`);
    console.error(`   Error: ${err.message}`);
    failed++;
  }
}

async function runAsyncTest(name, fn) {
  try {
    await fn();
    console.log(`✅ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`❌ FAIL: ${name}`);
    console.error(`   Error: ${err.message}`);
    failed++;
  }
}

async function runAllCloudTests() {
  console.log("================================================================================");
  console.log("🧪 NOVA TOOLS CLOUD SEO & 404 INTEGRATION TEST SUITE");
  console.log("================================================================================\n");

  // ---------------------------------------------------------------------------
  // 1. AI Provider Abstraction Tests
  // ---------------------------------------------------------------------------
  console.log("--- 1. Testing AI Provider Abstraction ---");
  const { getAIProvider, LocalOllamaProvider, CloudAIProvider } = jiti("../lib/seo-agent/ai-provider");

  test("getAIProvider returns LocalOllamaProvider when CLOUD_AI_API_KEY is not set", () => {
    const origKey = process.env.CLOUD_AI_API_KEY;
    delete process.env.CLOUD_AI_API_KEY;
    try {
      const provider = getAIProvider();
      assert(provider instanceof LocalOllamaProvider, "Should be LocalOllamaProvider");
      assert(provider.name === "LocalOllamaProvider", "Provider name must be LocalOllamaProvider");
    } finally {
      if (origKey) process.env.CLOUD_AI_API_KEY = origKey;
    }
  });

  test("getAIProvider returns CloudAIProvider when CLOUD_AI_API_KEY is provided", () => {
    const origKey = process.env.CLOUD_AI_API_KEY;
    process.env.CLOUD_AI_API_KEY = "test-cloud-api-key-12345";
    try {
      const provider = getAIProvider();
      assert(provider instanceof CloudAIProvider, "Should be CloudAIProvider");
      assert(provider.name === "CloudAIProvider", "Provider name must be CloudAIProvider");
    } finally {
      if (origKey) process.env.CLOUD_AI_API_KEY = origKey;
      else delete process.env.CLOUD_AI_API_KEY;
    }
  });

  await runAsyncTest("LocalOllamaProvider cleanly reports unavailable on unreachable port without throwing unhandled crash", async () => {
    const provider = new LocalOllamaProvider("http://127.0.0.1:59998", "qwen3:4b", 500);
    const available = await provider.isAvailable();
    assert(available === false, "Unreachable port returns false cleanly");
  });

  // ---------------------------------------------------------------------------
  // 2. Deterministic 404 Health Check & Classification Tests
  // ---------------------------------------------------------------------------
  console.log("\n--- 2. Testing 404 URL Classification & Route Health ---");
  const { classify404Url, KNOWN_HISTORICAL_SLUG_REDIRECTS } = jiti("../lib/seo-agent/health-check-404");

  test("Classify /text-diff-viewer as SAFE_FIX redirecting to /text-diff-checker", () => {
    const res = classify404Url("https://novatool.in/text-diff-viewer");
    assert(res.classification === "SAFE_FIX", `Expected SAFE_FIX, got ${res.classification}`);
    assert(res.suggestedRedirect === "/text-diff-checker", "Redirect target must be /text-diff-checker");
  });

  test("Classify /base64-file-converter as SAFE_FIX redirecting to /data-url-file-converter", () => {
    const res = classify404Url("https://novatool.in/base64-file-converter");
    assert(res.classification === "SAFE_FIX", `Expected SAFE_FIX, got ${res.classification}`);
    assert(res.suggestedRedirect === "/data-url-file-converter", "Redirect target must be /data-url-file-converter");
  });

  test("Classify /file-hash-calculator as SAFE_FIX redirecting to /file-checksum-sha256", () => {
    const res = classify404Url("https://novatool.in/file-hash-calculator");
    assert(res.classification === "SAFE_FIX", `Expected SAFE_FIX, got ${res.classification}`);
    assert(res.suggestedRedirect === "/file-checksum-sha256", "Redirect target must be /file-checksum-sha256");
  });

  test("Classify /emi-calculator as SAFE_FIX redirecting to /loan-emi-calculator", () => {
    const res = classify404Url("https://novatool.in/emi-calculator");
    assert(res.classification === "SAFE_FIX", `Expected SAFE_FIX, got ${res.classification}`);
    assert(res.suggestedRedirect === "/loan-emi-calculator", "Redirect target must be /loan-emi-calculator");
  });

  test("Classify /cdn-cgi/l/email-protection as IGNORED_EXTERNAL with robots recommendation", () => {
    const res = classify404Url("https://novatool.in/cdn-cgi/l/email-protection");
    assert(res.classification === "IGNORED_EXTERNAL", `Expected IGNORED_EXTERNAL, got ${res.classification}`);
    assert(res.robotsRuleRecommended === "Disallow: /cdn-cgi/", "Recommends Disallow: /cdn-cgi/");
  });

  test("Classify bot scans (/wp-login.php, /.env) as IGNORED_EXTERNAL", () => {
    const wpRes = classify404Url("https://novatool.in/wp-login.php");
    assert(wpRes.classification === "IGNORED_EXTERNAL");
    const envRes = classify404Url("https://novatool.in/.env");
    assert(envRes.classification === "IGNORED_EXTERNAL");
  });

  test("Classify completely unknown tool route as REVIEW_REQUIRED", () => {
    const res = classify404Url("https://novatool.in/completely-unknown-random-tool-xyz-123");
    assert(res.classification === "REVIEW_REQUIRED");
  });

  // ---------------------------------------------------------------------------
  // 3. Permanent 301 Redirects Verification in next.config.ts
  // ---------------------------------------------------------------------------
  console.log("\n--- 3. Testing next.config.ts 301 Redirects ---");
  await runAsyncTest("next.config.ts configures all 4 permanent 301 redirects for historical GSC 404s", async () => {
    const nextConfigPath = path.join(workspaceRoot, "next.config.ts");
    const content = fs.readFileSync(nextConfigPath, "utf8");

    assert(content.includes("/text-diff-viewer"), "Config must include /text-diff-viewer redirect");
    assert(content.includes("/text-diff-checker"), "Config must redirect to /text-diff-checker");

    assert(content.includes("/base64-file-converter"), "Config must include /base64-file-converter redirect");
    assert(content.includes("/data-url-file-converter"), "Config must redirect to /data-url-file-converter");

    assert(content.includes("/file-hash-calculator"), "Config must include /file-hash-calculator redirect");
    assert(content.includes("/file-checksum-sha256"), "Config must redirect to /file-checksum-sha256");

    assert(content.includes("/emi-calculator"), "Config must include /emi-calculator redirect");
    assert(content.includes("/loan-emi-calculator"), "Config must redirect to /loan-emi-calculator");

    assert(content.includes("permanent: true"), "All redirects must be permanent: true (301 status)");
  });

  // ---------------------------------------------------------------------------
  // 4. Robots.txt and robots.ts Verification
  // ---------------------------------------------------------------------------
  console.log("\n--- 4. Testing Robots.txt and robots.ts Disallow Rules ---");
  test("public/robots.txt contains Disallow: /cdn-cgi/", () => {
    const robotsPath = path.join(workspaceRoot, "public", "robots.txt");
    const content = fs.readFileSync(robotsPath, "utf8");
    assert(content.includes("Disallow: /cdn-cgi/"), "public/robots.txt must disallow /cdn-cgi/");
  });

  test("app/robots.ts contains /cdn-cgi/ disallow rule", () => {
    const robotsTsPath = path.join(workspaceRoot, "app", "robots.ts");
    const content = fs.readFileSync(robotsTsPath, "utf8");
    assert(content.includes("/cdn-cgi/"), "app/robots.ts must disallow /cdn-cgi/");
  });

  // ---------------------------------------------------------------------------
  // 5. Email Protection Obfuscation Tag Verification
  // ---------------------------------------------------------------------------
  console.log("\n--- 5. Testing Cloudflare Email Protection Prevention ---");
  test("SiteFooter.tsx wraps mailto link in <!--email_off--> comments", () => {
    const footerPath = path.join(workspaceRoot, "components", "SiteFooter.tsx");
    const content = fs.readFileSync(footerPath, "utf8");
    assert(content.includes("<!--email_off-->") && content.includes("<!--/email_off-->"), "SiteFooter must contain email_off comments");
  });

  test("app/contact/page.tsx wraps mailto link in <!--email_off--> comments", () => {
    const contactPath = path.join(workspaceRoot, "app", "contact", "page.tsx");
    const content = fs.readFileSync(contactPath, "utf8");
    assert(content.includes("<!--email_off-->") && content.includes("<!--/email_off-->"), "Contact page must contain email_off comments");
  });

  // ---------------------------------------------------------------------------
  // 6. Homepage FeaturedToolsSection Correct Canonical Slugs
  // ---------------------------------------------------------------------------
  console.log("\n--- 6. Testing Homepage FeaturedToolsSection Slugs ---");
  test("FeaturedToolsSection links directly to canonical slugs without typos", () => {
    const sectionPath = path.join(workspaceRoot, "components", "home", "FeaturedToolsSection.tsx");
    const content = fs.readFileSync(sectionPath, "utf8");

    assert(content.includes("text-diff-checker"), "Must use canonical text-diff-checker");
    assert(!content.includes('"text-diff-viewer"'), "Must NOT use text-diff-viewer");

    assert(content.includes("data-url-file-converter"), "Must use canonical data-url-file-converter");
    assert(!content.includes('"base64-file-converter"'), "Must NOT use base64-file-converter");

    assert(content.includes("file-checksum-sha256"), "Must use canonical file-checksum-sha256");
    assert(!content.includes('"file-hash-calculator"'), "Must NOT use file-hash-calculator");

    assert(content.includes("loan-emi-calculator"), "Must use canonical loan-emi-calculator");
    assert(!content.includes('"emi-calculator"'), "Must NOT use emi-calculator");
  });

  // ---------------------------------------------------------------------------
  // 7. Safety Limits & Hard Guardrails
  // ---------------------------------------------------------------------------
  console.log("\n--- 7. Testing Safety Limits & Hard Guardrails ---");
  const { SEO_AGENT_CONFIG } = jiti("../lib/seo-agent/config");

  test("SEO_AGENT_CONFIG budgets enforce 40 pages max per cycle", () => {
    assert(SEO_AGENT_CONFIG.BUDGETS.MAX_PAGE_CHANGES_PER_CYCLE === 40, "MAX_PAGE_CHANGES_PER_CYCLE must be 40");
    assert(SEO_AGENT_CONFIG.BUDGETS.MAX_BATCHES_PER_CYCLE === 2, "MAX_BATCHES_PER_CYCLE must be 2");
    assert(SEO_AGENT_CONFIG.BUDGETS.BATCH_SIZE === 20, "BATCH_SIZE must be 20");
  });

  test("High-risk types strictly marked as HIGH risk", () => {
    const { SeoScoringEngine } = jiti("../lib/seo-agent/scoring-engine");
    const engine = new SeoScoringEngine();

    const highRiskOpp = {
      id: "high-risk-test",
      pageSlug: "loan-emi-calculator",
      pageUrl: "https://novatool.in/loan-emi-calculator",
      type: "CANONICAL_CHECK",
      reason: "High risk test",
      riskLevel: "HIGH",
      proposedAction: { type: "CANONICAL_CHECK", summary: "High risk action" },
      opportunityScore: 50,
      scoreBreakdown: {},
      provenance: [],
      detectedAt: new Date().toISOString(),
    };

    const result = engine.selectActionableOpportunities([highRiskOpp], 0, 0);
    assert(result.actionable.length === 0, "Actionable list must exclude high risk items");
    assert(result.skippedHighRisk.length === 1, "Must be routed to skippedHighRisk");
  });

  // ---------------------------------------------------------------------------
  // Summary
  // ---------------------------------------------------------------------------
  console.log("\n================================================================================");
  console.log(`CLOUD TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("================================================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runAllCloudTests().catch((err) => {
  console.error("Unhandled test execution error:", err);
  process.exit(1);
});
