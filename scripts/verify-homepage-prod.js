/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

function runVerification() {
  console.log("==================================================");
  console.log("🔍 Nova Tools Production Verification Script");
  console.log("==================================================");

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

  // 1. Check Prerendered Homepage HTML file
  const htmlPath = path.join(__dirname, "..", ".next", "server", "app", "index.html");
  assert(fs.existsSync(htmlPath), "Prerendered homepage HTML (.next/server/app/index.html) exists");

  if (!fs.existsSync(htmlPath)) {
    console.error("❌ Fatal: index.html not found. Run 'npm run build' first.");
    process.exit(1);
  }

  const html = fs.readFileSync(htmlPath, "utf-8");

  // 2. Exactly one <header> (SiteHeader)
  const headerMatches = html.match(/<header\b/gi) || [];
  assert(headerMatches.length === 1, `Exactly one SiteHeader found on homepage (found ${headerMatches.length})`);

  // 3. Canonical URL is unchanged
  const hasCanonical = html.includes('rel="canonical"') && html.includes('href="https://novatool.in"');
  assert(hasCanonical, 'Canonical link tag is present and points to "https://novatool.in"');

  // 4. Robots metadata
  const hasRobots = html.includes('name="robots"') && html.includes("index") && html.includes("follow");
  assert(hasRobots, 'Robots metadata is present with "index, follow"');

  // 5. AdSense publisher ID exists in HTML
  const hasAdSensePubId = html.includes("ca-pub-7888119602395886");
  assert(hasAdSensePubId, 'AdSense publisher ID "ca-pub-7888119602395886" is present in homepage HTML');

  const hasAdSenseMeta = html.includes('name="google-adsense-account"') && html.includes("ca-pub-7888119602395886");
  assert(hasAdSenseMeta, '<meta name="google-adsense-account"> tag is present with correct publisher ID');

  // 6. ads.txt is valid
  const adsTxtPath = path.join(__dirname, "..", "public", "ads.txt");
  assert(fs.existsSync(adsTxtPath), "public/ads.txt exists");
  if (fs.existsSync(adsTxtPath)) {
    const adsTxtContent = fs.readFileSync(adsTxtPath, "utf-8");
    assert(adsTxtContent.includes("pub-7888119602395886"), "public/ads.txt contains valid publisher ID pub-7888119602395886");
  }

  // 7. Approved UPDF affiliate URL exists
  const hasUpdfUrl = html.includes("https://www.dpbolvw.net/click-101855940-15717946");
  assert(hasUpdfUrl, "Approved UPDF affiliate tracking URL exists in homepage HTML");

  // 8. No disallowed affiliate links
  const hasCanva = html.includes("partner.canva.com") || html.includes("canva.com/affiliate");
  assert(!hasCanva, "No Canva affiliate link exists");

  const hasHostinger = html.includes("hostinger.com?REFERRALCODE") || html.includes("hostg.com");
  assert(!hasHostinger, "No Hostinger affiliate link exists");

  const hasNamecheap = html.includes("namecheap.pxf.io");
  assert(!hasNamecheap, "No Namecheap affiliate link exists");

  const hasPdfelement = html.includes("wondershare.com/affiliate") || html.includes("pdf.wondershare.com/?aff=");
  assert(!hasPdfelement, "No PDFelement affiliate link exists");

  // 9. Structured data exists and is valid
  const schemaRegex = /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi;
  const schemas = [];
  let match;
  while ((match = schemaRegex.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(match[1]);
      schemas.push(parsed);
    } catch (e) {
      assert(false, `JSON-LD structured data is invalid JSON: ${e.message}`);
    }
  }
  assert(schemas.length >= 1, `Found ${schemas.length} valid JSON-LD schema script(s)`);

  const hasFaqSchema = schemas.some(s => s["@type"] === "FAQPage" || s.mainEntity);
  assert(hasFaqSchema, "FAQPage JSON-LD structured data is valid and present");

  // 10. Check key internal links point to valid routes in .next
  const appDir = path.join(__dirname, "..", ".next", "server", "app");
  const keyRoutes = [
    "tools.html",
    "categories.html",
    "blog.html",
    "about.html",
    "contact.html",
    "privacy.html",
    "terms.html",
    "compress-image.html",
    "compress-pdf.html",
    "image-resizer.html",
    "signature-resizer.html",
    "merge-pdf.html",
    "jpg-to-pdf.html",
    "pdf-to-jpg.html",
    "split-pdf.html",
    "rotate-pdf.html",
    "tamil-image-to-text.html",
    "gst-calculator.html",
    "loan-emi-calculator.html",
    "json-formatter.html"
  ];

  let missingRoutes = [];
  for (const route of keyRoutes) {
    const routePath = path.join(appDir, route);
    if (!fs.existsSync(routePath)) {
      missingRoutes.push(route);
    }
  }
  assert(missingRoutes.length === 0, `All ${keyRoutes.length} key homepage destination routes exist in build (missing: ${missingRoutes.join(", ") || "none"})`);

  // 11. No accidental duplicate scripts
  const scriptSrcs = [];
  const scriptRegex = /<script\b[^>]*\bsrc=["']([^"']+)["']/gi;
  while ((match = scriptRegex.exec(html)) !== null) {
    scriptSrcs.push(match[1]);
  }
  const duplicates = scriptSrcs.filter((src, idx) => scriptSrcs.indexOf(src) !== idx);
  assert(duplicates.length === 0, `No duplicate script sources found (duplicates: ${duplicates.join(", ") || "none"})`);

  console.log("==================================================");
  console.log(`📊 Verification Summary: ${passed} Passed, ${failed} Failed`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runVerification();
