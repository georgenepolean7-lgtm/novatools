export interface SeoEngineResult {
  success: boolean;
  output: string;
  breakdown?: Record<string, string | number>;
  error?: string;
}

export function generateMetaTags(params: {
  title: string;
  description: string;
  canonicalUrl: string;
  author?: string;
  ogImage?: string;
}): SeoEngineResult {
  const tags = [
    `<!-- Standard HTML Meta Tags -->`,
    `<title>${params.title}</title>`,
    `<meta name="description" content="${params.description}">`,
    `<link rel="canonical" href="${params.canonicalUrl}">`,
    params.author ? `<meta name="author" content="${params.author}">` : "",
    ``,
    `<!-- Open Graph / Facebook -->`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:url" content="${params.canonicalUrl}">`,
    `<meta property="og:title" content="${params.title}">`,
    `<meta property="og:description" content="${params.description}">`,
    params.ogImage ? `<meta property="og:image" content="${params.ogImage}">` : "",
    ``,
    `<!-- Twitter Summary Card -->`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${params.title}">`,
    `<meta name="twitter:description" content="${params.description}">`,
    params.ogImage ? `<meta name="twitter:image" content="${params.ogImage}">` : "",
  ].filter(Boolean);

  return {
    success: true,
    output: tags.join("\n"),
    breakdown: {
      "Title Length": `${params.title.length} characters (Optimal: 50-60)`,
      "Description Length": `${params.description.length} characters (Optimal: 140-160)`,
      "Tags Generated": tags.length,
    },
  };
}

export function generateRobotsTxt(params: {
  allowAll?: boolean;
  sitemapUrl?: string;
  disallowPaths?: string[];
}): SeoEngineResult {
  const lines = [
    `User-agent: *`,
    params.allowAll !== false ? `Allow: /` : "",
    ...(params.disallowPaths || ["/admin", "/api/private"]).map((p) => `Disallow: ${p}`),
    ``,
    params.sitemapUrl ? `Sitemap: ${params.sitemapUrl}` : `Sitemap: https://novatool.in/sitemap.xml`,
  ].filter(Boolean);

  return {
    success: true,
    output: lines.join("\n"),
    breakdown: {
      "Rules Count": lines.length,
      "Robots Standard": "RFC 9309 Compliant ✓",
    },
  };
}

export function analyzeKeywordDensity(text: string, targetKeyword?: string): SeoEngineResult {
  if (!text.trim()) return { success: true, output: "" };
  const words = text.toLowerCase().match(/\b[\w'-]+\b/g) || [];
  if (words.length === 0) return { success: true, output: "" };

  const target = targetKeyword ? targetKeyword.toLowerCase().trim() : "";
  let targetCount = 0;

  if (target) {
    targetCount = (text.toLowerCase().match(new RegExp(`\\b${target}\\b`, "g")) || []).length;
    const density = ((targetCount / words.length) * 100).toFixed(2);
    return {
      success: true,
      output: `Keyword: "${target}"\nOccurrences: ${targetCount}\nDensity: ${density}%\nAssessment: ${
        Number(density) >= 1 && Number(density) <= 2.5
          ? "Optimal (1% - 2.5%) ✓"
          : Number(density) < 1
          ? "Low (Under 1%)"
          : "High / Potential Keyword Stuffing (> 2.5%)"
      }`,
      breakdown: {
        "Total Words": words.length,
        "Keyword Frequency": targetCount,
        "Keyword Density": `${density}%`,
      },
    };
  }

  return {
    success: true,
    output: `Total Words: ${words.length}\nEnter a target keyword to compute density percentage.`,
  };
}

export function generateSerpPreview(title: string, description: string, url: string): SeoEngineResult {
  const cleanTitle = title.trim() || "Example Page Title - Brand Name";
  const cleanDesc = description.trim() || "This is a meta description preview for search engine result snippets.";
  const cleanUrl = url.trim() || "https://example.com/page-url";

  const titleChars = cleanTitle.length;
  const descChars = cleanDesc.length;
  const titlePixelsApprox = Math.round(titleChars * 9.5); // ~9.5px per character in Arial 18px

  const titleStatus = titleChars > 60 ? "Warning: May be truncated on Google (over 60 chars)" : "Optimal (50-60 chars) ✓";
  const descStatus = descChars > 160 ? "Warning: May be truncated on Google (over 160 chars)" : descChars < 120 ? "Short (Under 120 chars)" : "Optimal (120-160 chars) ✓";

  const formattedOutput = `GOOGLE SERP SNIPPET PREVIEW:
----------------------------------------
${cleanUrl}
${cleanTitle}
${cleanDesc}
----------------------------------------`;

  return {
    success: true,
    output: formattedOutput,
    breakdown: {
      "Title Length": `${titleChars} characters (~${titlePixelsApprox}px / Max ~600px)`,
      "Title Truncation Risk": titleStatus,
      "Description Length": `${descChars} characters (Max ~960px)`,
      "Description Status": descStatus,
    },
  };
}

export function generateOpenGraphMeta(params: {
  title: string;
  description: string;
  url: string;
  image: string;
  siteName?: string;
  type?: string;
}): SeoEngineResult {
  const { title, description, url, image, siteName = "Nova Tools", type = "website" } = params;

  const tags = [
    `<!-- Open Graph Meta Tags (Facebook, LinkedIn, Pinterest) -->`,
    `<meta property="og:title" content="${title}">`,
    `<meta property="og:description" content="${description}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:image" content="${image}">`,
    `<meta property="og:site_name" content="${siteName}">`,
    `<meta property="og:type" content="${type}">`,
    ``,
    `<!-- Twitter Card Meta Tags -->`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${title}">`,
    `<meta name="twitter:description" content="${description}">`,
    `<meta name="twitter:image" content="${image}">`,
  ];

  return {
    success: true,
    output: tags.join("\n"),
    breakdown: {
      "OpenGraph Tags": "6 tags generated",
      "Twitter Card": "summary_large_image configured",
      "Social Media Support": "Facebook, LinkedIn, X/Twitter, Pinterest",
    },
  };
}

export function generateSchemaMarkup(type: "Article" | "Organization" | "LocalBusiness" | "FAQPage" | "Product", data: Record<string, string>): SeoEngineResult {
  let schemaObj: Record<string, unknown> = { "@context": "https://schema.org" };

  if (type === "Article") {
    schemaObj = {
      ...schemaObj,
      "@type": "Article",
      headline: data.headline || "Article Title",
      description: data.description || "Article Summary",
      author: { "@type": "Person", name: data.author || "Author Name" },
      publisher: { "@type": "Organization", name: data.publisher || "Publisher Name" },
      datePublished: data.datePublished || new Date().toISOString().split("T")[0],
    };
  } else if (type === "Organization") {
    schemaObj = {
      ...schemaObj,
      "@type": "Organization",
      name: data.name || "Company Name",
      url: data.url || "https://example.com",
      logo: data.logo || "https://example.com/logo.png",
      sameAs: data.socialUrls ? data.socialUrls.split(",").map((s) => s.trim()) : [],
    };
  } else if (type === "FAQPage") {
    schemaObj = {
      ...schemaObj,
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: data.q1 || "What is this service?",
          acceptedAnswer: { "@type": "Answer", text: data.a1 || "This service provides free online developer tools." },
        },
      ],
    };
  } else if (type === "Product") {
    schemaObj = {
      ...schemaObj,
      "@type": "Product",
      name: data.name || "Product Name",
      description: data.description || "Product Details",
      offers: {
        "@type": "Offer",
        priceCurrency: data.currency || "INR",
        price: data.price || "999",
        availability: "https://schema.org/InStock",
      },
    };
  } else {
    schemaObj = {
      ...schemaObj,
      "@type": "LocalBusiness",
      name: data.name || "Local Business",
      address: data.address || "Main Street, City",
      telephone: data.phone || "+91 9876543210",
    };
  }

  const jsonLd = `<script type="application/ld+json">\n${JSON.stringify(schemaObj, null, 2)}\n</script>`;

  return {
    success: true,
    output: jsonLd,
    breakdown: {
      "Schema Type": type,
      "Format": "JSON-LD (Google Recommended)",
      "Standard": "Schema.org 2024+",
    },
  };
}

export function generateHreflangTags(baseUrl: string, langCodes: string[]): SeoEngineResult {
  const cleanBase = baseUrl.replace(/\/$/, "");
  const tags: string[] = [];

  for (const lang of langCodes) {
    const cleanLang = lang.trim().toLowerCase();
    if (cleanLang) {
      tags.push(`<link rel="alternate" hreflang="${cleanLang}" href="${cleanBase}/${cleanLang}" />`);
    }
  }
  tags.push(`<link rel="alternate" hreflang="x-default" href="${cleanBase}" />`);

  return {
    success: true,
    output: tags.join("\n"),
    breakdown: {
      "Languages Configured": langCodes.length,
      "x-default Fallback": "Included ✓",
      "Standard": "Google Multi-regional SEO Tagging",
    },
  };
}

export function generateCanonicalUrl(rawUrl: string, removeQueryParams: boolean = true, forceTrailingSlash: boolean = false): SeoEngineResult {
  try {
    const url = new URL(rawUrl.trim());
    if (removeQueryParams) {
      url.search = "";
      url.hash = "";
    }
    let formatted = url.toString();
    if (forceTrailingSlash && !formatted.endsWith("/")) {
      formatted += "/";
    } else if (!forceTrailingSlash && formatted.endsWith("/") && url.pathname !== "/") {
      formatted = formatted.slice(0, -1);
    }

    const tag = `<link rel="canonical" href="${formatted}" />`;

    return {
      success: true,
      output: tag,
      breakdown: {
        "Canonical Tag": tag,
        "Normalized URL": formatted,
        "Query Params Stripped": removeQueryParams ? "Yes" : "No",
      },
    };
  } catch (err: unknown) {
    return { success: false, output: "", error: err instanceof Error ? err.message : "Invalid URL provided" };
  }
}

export function analyzeHeadingStructure(htmlText: string): SeoEngineResult {
  if (!htmlText.trim()) return { success: false, output: "", error: "Please paste HTML content." };

  const hTags = htmlText.match(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi) || [];
  if (hTags.length === 0) {
    return { success: true, output: "No heading tags (<h1> through <h6>) detected in the provided HTML snippet." };
  }

  const counts: Record<string, number> = { h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0 };
  const outline: string[] = [];

  for (const tag of hTags) {
    const match = tag.match(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/i);
    if (match) {
      const level = `h${match[1]}`;
      counts[level] = (counts[level] || 0) + 1;
      const cleanText = match[2].replace(/<[^>]+>/g, "").trim();
      const indent = "  ".repeat(parseInt(match[1], 10) - 1);
      outline.push(`${indent}[H${match[1]}] ${cleanText}`);
    }
  }

  const h1Count = counts.h1 || 0;
  const h1Status = h1Count === 1 ? "Optimal (Single H1) ✓" : h1Count === 0 ? "Missing H1 tag ⚠️" : `Multiple H1 tags (${h1Count}) ⚠️`;

  return {
    success: true,
    output: `Heading Outline:\n${outline.join("\n")}`,
    breakdown: {
      "H1 Count": counts.h1 || 0,
      "H1 Status": h1Status,
      "H2 Count": counts.h2 || 0,
      "H3 Count": counts.h3 || 0,
      "Total Headings": hTags.length,
    },
  };
}
