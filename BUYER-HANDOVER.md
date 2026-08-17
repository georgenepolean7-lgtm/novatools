# Nova Tools — Buyer Handover & Operational Guide

**Asset:** Nova Tools ([https://novatool.in](https://novatool.in))  
**Seller:** Nova Code Tech  
**Target Buyer:** New Platform Owner / Operator

---

## 1. Overview of Handover Deliverables

As part of the asset transfer, the buyer receives:
1. **Full Source Code Repository:** Complete Next.js 16 + TypeScript codebase with 30 production tools and 17 programmatic pages.
2. **Domain Ownership:** Complete control and registrar push for `novatool.in`.
3. **Static Assets & WebAssembly Binaries:** In-browser QPDF WebAssembly runner assets (`public/qpdf/`) and brand assets.
4. **SEO & Structured Metadata Suite:** Pre-configured XML sitemap, `robots.txt`, and Schema.org JSON-LD definitions.

---

## 2. Infrastructure & Hosting Setup

Nova Tools requires **zero backend servers** (no Node servers to manage, no Redis, no PostgreSQL/MySQL databases). It deploys as a static/edge-rendered web application.

### Recommended Hosting Providers (Free or Low-Cost Tiers)
* **Vercel (Recommended):** Connect GitHub repository $\rightarrow$ Auto-detect Next.js $\rightarrow$ Deploy.
* **Netlify:** Connect repo $\rightarrow$ Build command: `npm run build` $\rightarrow$ Publish directory: `.next`.
* **Cloudflare Pages:** Connect repo $\rightarrow$ Next.js preset.

### Deployment Instructions:
```bash
# 1. Clone repository
git clone <your-repo-url>
cd novatools

# 2. Install dependencies
npm install

# 3. Verify production build
npm run build

# 4. Run locally
npm run start
```

---

## 3. Post-Handover Configuration Checklist

Following the asset transfer, update the following identifiers with your own credentials:

### A. Google AdSense (Monetization)
1. Open [app/layout.tsx](file:///c:/Users/georg/OneDrive/Desktop/novatools/app/layout.tsx).
2. Locate the AdSense script tag:
   ```tsx
   src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
   ```
3. Replace `ca-pub-7888119602395886` with your approved publisher ID.

### B. Microsoft Clarity (Session Recording & Heatmaps)
1. Open [components/MicrosoftClarity.tsx](file:///c:/Users/georg/OneDrive/Desktop/novatools/components/MicrosoftClarity.tsx).
2. Replace `const CLARITY_ID = "xy4h271jps";` with your Clarity Project ID.

### C. Google Search Console & Webmaster Verification
1. Open Google Search Console $\rightarrow$ Add property `https://novatool.in`.
2. Verify ownership via DNS TXT record or HTML meta tag in `app/layout.tsx`.
3. Submit the sitemap index: `https://novatool.in/sitemap.xml`.

### D. Legal & Contact Details
1. Open [app/privacy/page.tsx](file:///c:/Users/georg/OneDrive/Desktop/novatools/app/privacy/page.tsx), [app/terms/page.tsx](file:///c:/Users/georg/OneDrive/Desktop/novatools/app/terms/page.tsx), and [app/contact/page.tsx](file:///c:/Users/georg/OneDrive/Desktop/novatools/app/contact/page.tsx).
2. Update the support email and legal entity name to your business details.

---

## 4. Maintenance & Operations

* **Server Maintenance:** **None.** Because there is no database or backend API, there are no database migrations, server patches, or API uptime alarms.
* **Cost of Operation:** Minimal to zero. Standard bandwidth on Vercel/Cloudflare is well within free hobby/pro tier limits.
* **Client-Side Scalability:** Nova Tools handles traffic surges seamlessly because all file processing happens on the visitor's device. 100 concurrent visitors consume zero server CPU.

---

## 5. Summary of Key Files

| File Path | Description |
|---|---|
| `app/` | Contains all 30 tool route folders + 17 programmatic page routes |
| `components/AllToolsSection.tsx` | Main directory component rendering all 30 tool cards with live search |
| `components/ToolCarousel.tsx` | Top-of-page interactive 3D featured tools showcase |
| `components/seo/ToolMetadata.ts` | Central metadata factory for title, description, OG, and canonical tags |
| `components/seo/ToolSEO.tsx` | Schema.org JSON-LD injector (`WebApplication`, `BreadcrumbList`, `FAQPage`) |
| `lib/qpdf.ts` | Browser WebAssembly engine for client-side PDF encryption and decryption |
| `public/qpdf/` | QPDF WebAssembly binaries (`qpdf.wasm`, `qpdf.js`, `worker.js`) |

---

**© 2026 Nova Code Tech.**
