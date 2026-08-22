import { NextResponse } from "next/server";
import { getAllTools } from "@/lib/tools/registry";
import { getAllCategories } from "@/lib/tools/categories";

export async function GET() {
  const tools = getAllTools();
  const categories = getAllCategories();

  const text = `# Nova Tools - 250+ Free In-Browser Online Tools
Production URL: https://novatool.in
Organization: Nova Code Tech
Platform Overview: Nova Tools is a high-performance, privacy-focused, 100% in-browser online utility platform containing 250 production-ready tools across 16 core categories.

## Privacy & Security Architecture
All text processing, image manipulations, audio calculations, cryptographic hashing, and conversions execute 100% client-side inside the user's browser via Web Crypto, Web Audio, and HTML5 Canvas APIs. Zero server uploads, zero storage, zero tracking.

## Core Categories (${categories.length} Total):
${categories.map((c) => `- [${c.name}](https://novatool.in/categories/${c.id}): ${c.description}`).join("\n")}

## Complete Tool Inventory (${tools.length} Working Tools):
${tools.map((t) => `- [${t.name}](https://novatool.in/${t.slug}): ${t.shortDescription}`).join("\n")}

## System Endpoints:
- [Sitemap](https://novatool.in/sitemap.xml)
- [Robots](https://novatool.in/robots.txt)
- [Tools Directory](https://novatool.in/tools)
- [Categories Directory](https://novatool.in/categories)
- [Pricing & Plans](https://novatool.in/pricing)
- [About](https://novatool.in/about)
- [Privacy Policy](https://novatool.in/privacy)
- [Terms & Conditions](https://novatool.in/terms)
- [Disclaimer](https://novatool.in/disclaimer)
`;

  return new NextResponse(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}