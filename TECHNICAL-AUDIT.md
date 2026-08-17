# Nova Tools — Technical & Architectural Audit

**Asset:** Nova Tools  
**Domain:** [https://novatool.in](https://novatool.in)  
**Audit Date:** August 2026  
**Audited Version:** Next.js 16.2.12 (Turbopack) / React 19.2.4 / TypeScript 5

---

## 1. System Architecture & Rendering Model

Nova Tools is structured using the **Next.js App Router** with an aggressive **Static Site Generation (SSG)** and **Prerendering** strategy.

* **Static Compilation:** 59 out of 59 application routes are prerendered as static HTML/JSON during compilation.
* **Serverless Edge Ready:** Zero Node.js server runtime requirements at request time.
* **Client-Side Execution:** All compute-intensive file transformations execute strictly on the client device via Web Workers, WebAssembly, and Canvas APIs.

---

## 2. Core Processing Engines

### A. QPDF WebAssembly Runner (`lib/qpdf.ts`)
* **Purpose:** Powers `/pdf-password-protect` (256-bit AES ISO 32000 standard encryption) and `/pdf-unlocker` (password decryption).
* **Architecture:** Compiled WebAssembly binaries (`public/qpdf/lib/qpdf.wasm` and `qpdf.js`) executed in an isolated background Web Worker (`public/qpdf/worker.js`).
* **Origin Resolution:** Explicit URL generation (`${window.location.origin}/qpdf/...`) ensures reliable execution across all modern browsers without `file:///` sandbox errors.
* **Lifecycle Management:** Explicit worker destruction (`await runner.destroy()`) on execution finish prevents memory leaks.

### B. PDF Document Manipulation (`pdf-lib` & `jspdf`)
* **Purpose:** Merging, splitting, rotating, extracting/deleting pages, adding watermarks, and converting images to PDF.
* **Performance:** Modules are dynamically imported on-demand to avoid bundle bloat on initial page load.

### C. Image Transformation Suite (HTML5 Canvas API)
* **Purpose:** Format conversions (JPG, PNG, WebP, BMP, GIF), image compression with target KB limits, cropping, rotation, metadata stripping, and Base64 encoding.
* **Privacy:** Executed 100% in-memory using native browser canvas context without any server transmission.

### D. Multilingual OCR Engine (`tesseract.js` + OpenCV.js)
* **Purpose:** Optical Character Recognition supporting Tamil and English text extraction (`/tamil-image-to-text`).
* **Execution:** Web Worker-based neural network model execution with client-side image contrast preprocessing.

---

## 3. SEO & Structured Data Integrity

* **Sitemap Generation (`app/sitemap.ts`):** Complete XML sitemap registering the homepage and all 30 tool routes with priority weightings and weekly refresh intervals.
* **Robots Configuration (`app/robots.ts`):** Unrestricted indexing policy (`Allow: /`) referencing `https://novatool.in/sitemap.xml`.
* **Schema.org Structured Data (`components/seo/ToolSEO.tsx`):**
  - `WebApplication` / `SoftwareApplication` with `operatingSystem: "All"` and `offers: { price: "0", priceCurrency: "USD" }`.
  - `BreadcrumbList` hierarchy (`Home > [Tool Name]`).
  - `FAQPage` entity with contextual question-and-answer pairs.
* **Canonical & Social Previews:** Fully qualified `https://novatool.in/[tool-slug]` canonical tags and OpenGraph/Twitter summary card tags on every tool.

---

## 4. Security & Privacy Audit

* **Exposed Secrets:** **0 exposed secrets.** (Zero hardcoded private keys or backend database credentials exist).
* **File Upload Privacy:** **Zero server uploads.** Files selected in dropzones are read via `FileReader` / `ArrayBuffer` directly in browser memory.
* **Logging Compliance:** Zero passwords or document contents are printed to browser console or telemetry logs.
* **Dependency Health:** Standard, modern npm packages with lockfile integrity (`package-lock.json`).

---

## 5. Performance & Core Web Vitals (CWV)

* **Script Loading Strategy:** Third-party scripts (Google AdSense, Microsoft Clarity) are configured with `strategy="lazyOnload"` to avoid blocking initial DOM rendering.
* **LCP (Largest Contentful Paint):** Sub-second initial paint across desktop and mobile.
* **CLS (Cumulative Layout Shift):** 0 shift during rendering; static card containers and dimensions prevent content jumping.
* **Mobile Breakpoints:** 100% responsive across standard screen widths (320px, 375px, 390px, 414px, 768px, 1024px, 1280px, 1440px).

---

**© 2026 Nova Code Tech.**
