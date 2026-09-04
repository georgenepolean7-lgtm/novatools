const path = require("path");
const fs = require("fs");

// Load local environment variables if available
const envLocalPath = path.join(__dirname, "..", ".env.local");
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, "utf8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const idx = trimmed.indexOf("=");
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  });
}

const createJiti = require("jiti");
const jiti = createJiti(__filename, {
  alias: { "@": path.join(__dirname, "..") },
});

const { SeoDataConnector } = jiti("../lib/seo-agent/data-connector");
const { SeoOpportunityEngine } = jiti("../lib/seo-agent/opportunity-engine");
const { SeoScoringEngine } = jiti("../lib/seo-agent/scoring-engine");
const { HermesQwenClient } = jiti("../lib/seo-agent/hermes-qwen-client");
const { FactualContentSafetyValidator } = jiti("../lib/seo-agent/factual-safety");
const { getToolBySlug } = jiti("../lib/tools/registry");

async function runAudit() {
  console.log("================================================================================");
  console.log("🔍 NOVA TOOLS AUTONOMOUS SEO AGENT — 80-OPPORTUNITY QUALITY AUDIT");
  console.log("================================================================================\n");

  const connector = new SeoDataConnector();
  const opportunityEngine = new SeoOpportunityEngine();
  const scoringEngine = new SeoScoringEngine();
  const llmClient = new HermesQwenClient();

  const now = new Date();
  const endDate = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const priorStartDate = new Date(now.getTime() - 58 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  console.log("⏳ Fetching real telemetry from GSC, GA4, Bing, Clarity, and Google Ads...");
  const [multiSource, priorGscResult] = await Promise.all([
    connector.fetchAllMultiSourceMetrics({ startDate, endDate }),
    connector.fetchSearchConsoleMetrics({ startDate: priorStartDate, endDate: startDate }),
  ]);

  console.log("✅ Multi-source telemetry ingested.");
  console.log(`   - GSC rows: ${multiSource.gsc.length}`);
  console.log(`   - GA4 rows: ${multiSource.ga4.length}`);
  console.log(`   - Bing rows: ${multiSource.bing.length}`);
  console.log(`   - Clarity rows: ${multiSource.clarity.length}`);
  console.log(`   - Google Ads status: ${multiSource.googleAds.status}`);

  console.log("\n⏳ Detecting opportunities across 250 tools...");
  const allOpportunities = opportunityEngine.detectOpportunities(
    multiSource.gsc,
    multiSource.ga4,
    priorGscResult.metrics,
    multiSource.bing,
    multiSource.clarity
  );
  console.log(`Total opportunities detected: ${allOpportunities.length}`);

  console.log("\n⏳ Scoring and prioritizing opportunities...");
  const scoredOpportunities = scoringEngine.scoreAndPrioritize(allOpportunities);
  const selection = scoringEngine.selectActionableOpportunities(scoredOpportunities, 0, 0);
  const selectedOpportunities = selection.actionable.slice(0, 80);
  console.log(`Selected opportunities for cycle: ${selectedOpportunities.length}\n`);

  // Classify each opportunity
  const auditResults = [];
  const zeroTrafficPages = [];
  const metadataChangesProposed = [];
  const internalLinkOnlyChanges = [];

  for (let i = 0; i < selectedOpportunities.length; i++) {
    const opp = selectedOpportunities[i];
    const realTool = getToolBySlug(opp.pageSlug);
    const toolName = realTool ? realTool.name : opp.pageSlug;
    const category = realTool ? realTool.category : "utility";
    let currentTitle = realTool ? (realTool.seoTitle || "") : "";
    let currentDesc = realTool ? (realTool.seoDescription || "") : "";
    const currentRelated = realTool ? (realTool.relatedTools || []) : [];

    const gscImp = opp.currentMetrics?.impressions || 0;
    const gscClicks = opp.currentMetrics?.clicks || 0;
    const gscPos = opp.currentMetrics?.position || 0;
    const ga4Sessions = opp.currentMetrics?.trafficSessions || 0;
    const bingImp = opp.currentMetrics?.bingImpressions || 0;
    const clarityDead = opp.currentMetrics?.clarityDeadClicks || 0;

    const hasRealSearchTraffic = gscImp > 0 || gscClicks > 0 || ga4Sessions > 0 || bingImp > 0;
    if (!hasRealSearchTraffic) {
      zeroTrafficPages.push({
        slug: opp.pageSlug,
        url: `https://novatool.in/${opp.pageSlug}`,
        type: opp.type,
        score: opp.opportunityScore,
      });
    }

    // Determine optimization details
    const isInternalLinkOnly = opp.proposedAction.type === "INTERNAL_LINKS";
    const isMetadataAction = opp.proposedAction.type === "TITLE_OPTIMIZATION" || opp.proposedAction.type === "DESCRIPTION_OPTIMIZATION";
    const isFaqAction = opp.proposedAction.type === "FAQ_ENRICHMENT";

    // Independent metadata issue check
    const titleTooShort = currentTitle.length < 30;
    const titleTooLong = currentTitle.length > 65;
    const descTooShort = currentDesc.length < 80;
    const descTooLong = currentDesc.length > 165;
    const hasLegacyBoilerplate = currentTitle.includes("Free, Fast & Private") || 
                                 currentDesc.includes("Free, Fast & Private") ||
                                 (currentDesc.includes("zero file uploads") && category !== "pdf" && category !== "image" && category !== "file");
    const hasIndependentMetadataIssue = titleTooShort || titleTooLong || descTooShort || descTooLong || hasLegacyBoilerplate;

    // Use deterministic generator for fast inspection of the proposed payload
    const semanticFallback = llmClient.generateDeterministicSemanticFallback(
      (realTool || { id: opp.pageSlug, slug: opp.pageSlug, name: toolName, category, seoTitle: currentTitle, seoDescription: currentDesc }),
      opp.proposedAction.type,
      {
        primaryQuery: opp.primaryQuery,
        reason: opp.reason,
        multiSourceContext: `GSC imp: ${gscImp}, clicks: ${gscClicks}, pos: ${gscPos.toFixed(1)}, GA4 sessions: ${ga4Sessions}, Bing imp: ${bingImp}, Clarity dead clicks: ${clarityDead}`,
      }
    );

    let proposedTitle = isInternalLinkOnly ? currentTitle : semanticFallback.seoTitle;
    let proposedDesc = isInternalLinkOnly ? currentDesc : semanticFallback.seoDescription;
    let proposedFaqs = isFaqAction ? semanticFallback.faqs : undefined;
    let proposedInternalLinks = isInternalLinkOnly ? semanticFallback.internalLinkSuggestions : undefined;

    // Sanitize any pre-existing boilerplate
    if (proposedTitle && proposedTitle.includes("Free, Fast & Private")) {
      proposedTitle = proposedTitle.replace(/ - Free, Fast & Private/g, "").replace(/ Online - Free, Fast & Private/g, " Online Tool | Nova Tools");
    }
    if (proposedDesc && proposedDesc.includes("zero file uploads") && category !== "pdf" && category !== "image" && category !== "file") {
      proposedDesc = `${toolName} — instant browser-based calculation tool with accurate real-time results on Nova Tools.`;
    }

    // Check for boilerplate violations
    const containsBannedBoilerplate = 
      (proposedTitle && proposedTitle.includes("Free, Fast & Private")) ||
      (proposedDesc && proposedDesc.includes("Free, Fast & Private")) ||
      (proposedDesc && proposedDesc.includes("zero file uploads") && category !== "pdf" && category !== "image" && category !== "file");

    // Strict Factual Safety Gate check
    const safetyCheck = FactualContentSafetyValidator.validate(
      (realTool || { id: opp.pageSlug, slug: opp.pageSlug, name: toolName, category, seoTitle: currentTitle, seoDescription: currentDesc }),
      opp.proposedAction.type,
      {
        seoTitle: proposedTitle,
        seoDescription: proposedDesc,
        faqs: proposedFaqs,
        contentSuggestions: semanticFallback.contentSuggestions,
        internalLinks: proposedInternalLinks,
      },
      {
        hasMeasurableTraffic: hasRealSearchTraffic,
        objectiveDefect: hasIndependentMetadataIssue,
      }
    );

    // Classification Logic
    let classification = "SAFE_TO_EXECUTE";
    let classificationReason = "";

    // Rule 1: High risk is permanently blocked
    if (opp.riskTier === "HIGH" || opp.riskLevel === "HIGH") {
      classification = "SKIP";
      classificationReason = "High-risk structural change blocked by autonomous safety policy";
    }
    // Rule 2: Boilerplate violation
    else if (containsBannedBoilerplate) {
      classification = "SKIP";
      classificationReason = "Proposed metadata contains prohibited generic boilerplate template";
    }
    // Rule 3: Internal links only -> ALWAYS SAFE_TO_EXECUTE (zero factual content)
    else if (isInternalLinkOnly) {
      classification = "SAFE_TO_EXECUTE";
      classificationReason = "Safe internal link graph enhancement; existing metadata 100% preserved";
      internalLinkOnlyChanges.push({
        slug: opp.pageSlug,
        url: `https://novatool.in/${opp.pageSlug}`,
        score: opp.opportunityScore || opp.score,
        proposedLinks: proposedInternalLinks || ["/related-tool-1", "/related-tool-2"],
        currentRelatedCount: currentRelated.length,
      });
    }
    // Rule 4: Factual Safety Check caught unverified claims, buzzwords, or high-risk domain assertions
    else if (!safetyCheck.isSafe && safetyCheck.classification === "NEEDS_REVIEW") {
      classification = "NEEDS_REVIEW";
      classificationReason = `Editorial verification required: ${safetyCheck.unverifiedClaims.slice(0, 2).join("; ")}`;
    }
    else if (!safetyCheck.isSafe && safetyCheck.classification === "SKIP") {
      classification = "SKIP";
      classificationReason = safetyCheck.reason;
    }
    // Rule 5: Zero-traffic page with NO independent metadata defect
    else if (!hasRealSearchTraffic && isMetadataAction && !hasIndependentMetadataIssue) {
      classification = "SKIP";
      classificationReason = "Zero-traffic page with already compliant metadata; rewrite prohibited without independent evidence";
    }
    // Rule 6: Real search traffic with metadata optimization
    else if (hasRealSearchTraffic && isMetadataAction) {
      classification = "SAFE_TO_EXECUTE";
      classificationReason = `Evidence-backed metadata refinement driven by real search demand (${gscImp} GSC imp / ${ga4Sessions} GA4 sessions)`;
      metadataChangesProposed.push({
        slug: opp.pageSlug,
        url: `https://novatool.in/${opp.pageSlug}`,
        score: opp.opportunityScore || opp.score,
        currentTitle,
        proposedTitle,
        currentDesc,
        proposedDesc,
        evidence: `GSC imp: ${gscImp}, clicks: ${gscClicks}, pos: ${gscPos.toFixed(1)}, GA4 sessions: ${ga4Sessions}`,
      });
    }
    // Rule 7: Zero traffic but independent metadata defect (too short / legacy boilerplate)
    else if (!hasRealSearchTraffic && isMetadataAction && hasIndependentMetadataIssue) {
      classification = "SAFE_TO_EXECUTE";
      classificationReason = "Independent metadata compliance fix (correcting non-compliant length or legacy boilerplate)";
      metadataChangesProposed.push({
        slug: opp.pageSlug,
        url: `https://novatool.in/${opp.pageSlug}`,
        score: opp.opportunityScore || opp.score,
        currentTitle,
        proposedTitle,
        currentDesc,
        proposedDesc,
        evidence: `Independent defect: titleLen=${currentTitle.length}, descLen=${currentDesc.length}`,
      });
    }
    // Rule 8: FAQ action that passed factual safety
    else if (isFaqAction && safetyCheck.isSafe) {
      classification = "SAFE_TO_EXECUTE";
      classificationReason = `Factually verified browser-based tool explanation derived directly from tool implementation (${toolName})`;
    } else {
      classification = "NEEDS_REVIEW";
      classificationReason = "Requires manual editorial confirmation";
    }

    auditResults.push({
      index: i + 1,
      slug: opp.pageSlug,
      url: `https://novatool.in/${opp.pageSlug}`,
      type: opp.type,
      score: opp.opportunityScore,
      gscImp,
      gscClicks,
      gscPos: gscPos.toFixed(1),
      ga4Sessions,
      bingImp,
      clarityDead,
      action: opp.proposedAction.type,
      provenance: semanticFallback.provenanceType,
      currentTitle,
      proposedTitle,
      currentDesc,
      proposedDesc,
      faqs: proposedFaqs,
      internalLinks: proposedInternalLinks,
      classification,
      classificationReason,
      safetyAudit: {
        isSafe: safetyCheck.isSafe,
        claimsChecked: safetyCheck.claimsChecked,
        unverifiedClaims: safetyCheck.unverifiedClaims,
        bannedWordsFound: safetyCheck.bannedWordsFound,
        highRiskAreaDetected: safetyCheck.highRiskAreaDetected,
      },
    });
  }

  const safeList = auditResults.filter((r) => r.classification === "SAFE_TO_EXECUTE");
  const reviewList = auditResults.filter((r) => r.classification === "NEEDS_REVIEW");
  const skipList = auditResults.filter((r) => r.classification === "SKIP");

  console.log("================================================================================");
  console.log("📊 AUDIT CLASSIFICATION SUMMARY");
  console.log("================================================================================");
  console.log(`Total Opportunities Detected:     ${allOpportunities.length}`);
  console.log(`Total Opportunities Selected:     ${selectedOpportunities.length}`);
  console.log(`🟢 SAFE_TO_EXECUTE:                ${safeList.length}`);
  console.log(`🟡 NEEDS_REVIEW:                   ${reviewList.length}`);
  console.log(`🔴 SKIP:                           ${skipList.length}`);
  console.log(`Zero-Traffic / Zero-Impression:   ${zeroTrafficPages.length}`);
  console.log(`Metadata Changes Proposed:        ${metadataChangesProposed.length}`);
  console.log(`Internal-Link Only Changes:       ${internalLinkOnlyChanges.length}`);
  console.log("================================================================================\n");

  console.log("--- TOP 20 SAFEST PAGES ---");
  safeList.slice(0, 20).forEach((item, idx) => {
    console.log(`${idx + 1}. [Score: ${item.score}] ${item.url} (${item.type}) -> Reason: ${item.classificationReason}`);
  });

  console.log("\n--- TOP 20 PAGES REQUIRING REVIEW ---");
  reviewList.slice(0, 20).forEach((item, idx) => {
    console.log(`${idx + 1}. [Score: ${item.score}] ${item.url} (${item.type}) -> Reason: ${item.classificationReason}`);
  });

  console.log("\n--- ALL SKIPPED PAGES ---");
  skipList.forEach((item, idx) => {
    console.log(`${idx + 1}. [Score: ${item.score}] ${item.url} (${item.type}) -> Reason: ${item.classificationReason}`);
  });

  console.log("\n--- ALL PAGES WITH ZERO REAL SEARCH/TRAFFIC EVIDENCE (Sample 20) ---");
  zeroTrafficPages.slice(0, 20).forEach((item, idx) => {
    console.log(`${idx + 1}. [Score: ${item.score}] ${item.url} (${item.type})`);
  });

  // Write full audit data to JSON artifact for inspection
  const fs = require("fs");
  fs.writeFileSync(
    path.join(__dirname, "audit_results.json"),
    JSON.stringify(
      {
        totalDetected: allOpportunities.length,
        totalSelected: selectedOpportunities.length,
        safeCount: safeList.length,
        needsReviewCount: reviewList.length,
        skipCount: skipList.length,
        zeroTrafficCount: zeroTrafficPages.length,
        safeList,
        reviewList,
        skipList,
        zeroTrafficPages,
        metadataChangesProposed,
        internalLinkOnlyChanges,
      },
      null,
      2
    )
  );
  console.log("\n✅ Audit data exported to scripts/audit_results.json");
}

runAudit().catch(console.error);
