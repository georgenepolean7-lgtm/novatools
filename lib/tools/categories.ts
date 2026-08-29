import { CategoryMetadata, ToolCategory } from "./tool-types";

export interface CategoryEditorialGuide {
  overview: string;
  whoIsItFor: string[];
  keyCapabilities: string[];
  technicalArchitecture: string;
  faqs: {
    question: string;
    answer: string;
  }[];
}

export const CATEGORIES: Record<ToolCategory, CategoryMetadata> = {
  pdf: {
    id: "pdf",
    name: "PDF Utilities",
    description: "Compress, merge, split, encrypt, rotate, and manipulate PDF documents with 100% in-browser privacy.",
    iconName: "FileText",
    badgeColor: "rose",
    gradient: "from-rose-500/20 to-red-500/20 border-rose-500/30",
    popularKeywords: ["compress pdf", "merge pdf", "pdf password", "split pdf", "rotate pdf"],
  },
  image: {
    id: "image",
    name: "Image Processing",
    description: "Resize, compress, crop, convert formats, and optimize images directly on your device.",
    iconName: "Image",
    badgeColor: "cyan",
    gradient: "from-cyan-500/20 to-blue-500/20 border-cyan-500/30",
    popularKeywords: ["compress image", "image resizer", "jpg to png", "crop image", "webp converter"],
  },
  text: {
    id: "text",
    name: "Text & Writing",
    description: "Word counters, case converters, line sorters, text formatters, and typography utilities.",
    iconName: "Type",
    badgeColor: "emerald",
    gradient: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30",
    popularKeywords: ["word counter", "case converter", "lorem ipsum", "text cleaner", "line sorter"],
  },
  developer: {
    id: "developer",
    name: "Developer Utilities",
    description: "Formatters, minifiers, encoders, decoders, regex testers, and data conversion tools for engineers.",
    iconName: "Code2",
    badgeColor: "amber",
    gradient: "from-amber-500/20 to-orange-500/20 border-amber-500/30",
    popularKeywords: ["json formatter", "jwt decoder", "sql formatter", "base64", "uuid generator"],
  },
  calculators: {
    id: "calculators",
    name: "Calculators & Math",
    description: "Financial, geometric, mathematical, date, health, and everyday calculations with instant results.",
    iconName: "Calculator",
    badgeColor: "indigo",
    gradient: "from-indigo-500/20 to-violet-500/20 border-indigo-500/30",
    popularKeywords: ["emi calculator", "percentage calculator", "age calculator", "sip calculator", "bmi calculator"],
  },
  india: {
    id: "india",
    name: "India Utilities",
    description: "Government exam photo resizers, GST tax calculators, income tax regime tools, and Indian financial utilities.",
    iconName: "Landmark",
    badgeColor: "orange",
    gradient: "from-orange-500/20 to-amber-500/20 border-orange-500/30",
    popularKeywords: ["passport photo resize", "gst calculator", "signature 20kb", "old vs new tax", "upsc photo"],
  },
  tamil: {
    id: "tamil",
    name: "Tamil Utilities",
    description: "Tamil OCR, Tanglish transliteration, BAMINI to Unicode converter, and Tamil text processing tools.",
    iconName: "Languages",
    badgeColor: "purple",
    gradient: "from-purple-500/20 to-fuchsia-500/20 border-purple-500/30",
    popularKeywords: ["tamil ocr", "tanglish to tamil", "bamini to unicode", "tamil word counter"],
  },
  data: {
    id: "data",
    name: "Data & Format Tools",
    description: "Convert, transform, validate, and extract datasets across JSON, CSV, XML, YAML, and SQL formats.",
    iconName: "Database",
    badgeColor: "blue",
    gradient: "from-blue-500/20 to-sky-500/20 border-blue-500/30",
    popularKeywords: ["json to csv", "csv to json", "csv to markdown", "json to typescript", "yaml to json"],
  },
  seo: {
    id: "seo",
    name: "SEO & Search Tools",
    description: "Generate meta tags, robots.txt, XML sitemaps, slugify URLs, and analyze search keyword density.",
    iconName: "Search",
    badgeColor: "teal",
    gradient: "from-teal-500/20 to-emerald-500/20 border-teal-500/30",
    popularKeywords: ["meta tag generator", "robots.txt", "sitemap generator", "url slug", "keyword density"],
  },
  webmaster: {
    id: "webmaster",
    name: "Webmaster & Network",
    description: "CIDR subnet calculators, HTTP status lookups, DNS record builders, and server redirect generators.",
    iconName: "Globe",
    badgeColor: "sky",
    gradient: "from-sky-500/20 to-blue-500/20 border-sky-500/30",
    popularKeywords: ["cidr calculator", "http status codes", "htaccess redirect", "user agent parser"],
  },
  finance: {
    id: "finance",
    name: "Finance & Business",
    description: "Profit margin, ROI, break-even, sales tax, currency, and invoice calculation utilities.",
    iconName: "DollarSign",
    badgeColor: "emerald",
    gradient: "from-emerald-500/20 to-green-500/20 border-emerald-500/30",
    popularKeywords: ["profit margin", "roi calculator", "break even calculator", "hourly to salary"],
  },
  education: {
    id: "education",
    name: "Education & Students",
    description: "GPA / CGPA calculators, citation builders (APA/MLA), grade conversions, and scientific tools.",
    iconName: "GraduationCap",
    badgeColor: "yellow",
    gradient: "from-yellow-500/20 to-amber-500/20 border-yellow-500/30",
    popularKeywords: ["gpa calculator", "percentage to cgpa", "apa citation generator", "scientific notation"],
  },
  accessibility: {
    id: "accessibility",
    name: "Accessibility (A11y)",
    description: "WCAG color contrast checkers, alt text builders, and dyslexic-friendly text previewers.",
    iconName: "Eye",
    badgeColor: "lime",
    gradient: "from-lime-500/20 to-green-500/20 border-lime-500/30",
    popularKeywords: ["color contrast checker", "wcag contrast", "image alt text", "accessible palette"],
  },
  privacy: {
    id: "privacy",
    name: "Privacy & Security",
    description: "Password generators, hash verifiers, string obfuscators, and client-side entropy testers.",
    iconName: "ShieldCheck",
    badgeColor: "cyan",
    gradient: "from-cyan-500/20 to-teal-500/20 border-cyan-500/30",
    popularKeywords: ["password generator", "password strength", "sha256 verifier", "token generator"],
  },
  qr: {
    id: "qr",
    name: "QR & Barcodes",
    description: "Generate and scan custom QR codes for URLs, WiFi, vCards, and industrial barcodes.",
    iconName: "QrCode",
    badgeColor: "violet",
    gradient: "from-violet-500/20 to-purple-500/20 border-violet-500/30",
    popularKeywords: ["qr code generator", "wifi qr code", "barcode generator", "vcard qr"],
  },
  file: {
    id: "file",
    name: "File & Checksum Tools",
    description: "Compute file hashes (SHA-256), sanitize filenames, compare file sizes, and slice text documents.",
    iconName: "FileArchive",
    badgeColor: "slate",
    gradient: "from-slate-500/20 to-gray-500/20 border-slate-500/30",
    popularKeywords: ["file checksum", "sha256 hash", "sanitize filename", "file size comparator"],
  },
  ocr: {
    id: "ocr",
    name: "OCR & Vision",
    description: "Extract editable text from images, scanned documents, screenshots, and business cards.",
    iconName: "ScanText",
    badgeColor: "indigo",
    gradient: "from-indigo-500/20 to-blue-500/20 border-indigo-500/30",
    popularKeywords: ["ocr image to text", "screenshot ocr", "extract text from image"],
  },
  business: {
    id: "business",
    name: "Business Tools",
    description: "NDAs, purchase order summaries, pricing tier matrices, and business document helpers.",
    iconName: "Briefcase",
    badgeColor: "blue",
    gradient: "from-blue-500/20 to-indigo-500/20 border-blue-500/30",
    popularKeywords: ["nda generator", "pricing table generator", "business invoice"],
  },
  productivity: {
    id: "productivity",
    name: "Productivity Tools",
    description: "Pomodoro focus timers, time zone difference planners, habit streak math, and daily organizers.",
    iconName: "Clock",
    badgeColor: "amber",
    gradient: "from-amber-500/20 to-yellow-500/20 border-amber-500/30",
    popularKeywords: ["pomodoro timer", "time zone planner", "meeting cost calculator"],
  },
  ai: {
    id: "ai",
    name: "AI & Prompts",
    description: "AI prompt formatters, token count estimators, few-shot example builders, and prompt cleaners.",
    iconName: "Sparkles",
    badgeColor: "fuchsia",
    gradient: "from-fuchsia-500/20 to-pink-500/20 border-fuchsia-500/30",
    popularKeywords: ["prompt formatter", "token counter", "system prompt builder"],
  },
  audio: {
    id: "audio",
    name: "Audio Utilities",
    description: "In-browser waveform analyzers, BPM beat counters, tone generators, and audio converters.",
    iconName: "Music",
    badgeColor: "rose",
    gradient: "from-rose-500/20 to-pink-500/20 border-rose-500/30",
    popularKeywords: ["bpm counter", "audio waveform", "tone generator", "audio base64"],
  },
  video: {
    id: "video",
    name: "Video Utilities",
    description: "Video frame extractors, aspect ratio calculators, resolution scalers, and GIF makers.",
    iconName: "Video",
    badgeColor: "red",
    gradient: "from-red-500/20 to-rose-500/20 border-red-500/30",
    popularKeywords: ["video to gif", "aspect ratio calculator", "video frame extractor"],
  },
  social: {
    id: "social",
    name: "Social Media",
    description: "Format Instagram captions, clean YouTube tags, check character limits, and generate hashtags.",
    iconName: "Share2",
    badgeColor: "pink",
    gradient: "from-pink-500/20 to-rose-500/20 border-pink-500/30",
    popularKeywords: ["instagram line break", "youtube tags", "tweet character counter", "hashtag cleaner"],
  },
  marketing: {
    id: "marketing",
    name: "Marketing & Growth",
    description: "UTM campaign builders, SERP previewers, headline capitalizers, and email subject analyzers.",
    iconName: "TrendingUp",
    badgeColor: "emerald",
    gradient: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30",
    popularKeywords: ["utm builder", "serp preview", "email subject analyzer", "headline capitalizer"],
  },
  design: {
    id: "design",
    name: "Design & CSS",
    description: "Generate CSS box shadows, gradients, glassmorphism filters, grid layouts, and color palettes.",
    iconName: "Palette",
    badgeColor: "violet",
    gradient: "from-violet-500/20 to-indigo-500/20 border-violet-500/30",
    popularKeywords: ["css box shadow", "css gradient", "glassmorphism generator", "flexbox playground"],
  },
};

const CATEGORY_EDITORIAL: Record<string, CategoryEditorialGuide> = {
  pdf: {
    overview:
      "PDF is the world's most trusted document exchange format. Nova Tools PDF utilities allow you to merge disparate documents, compress file sizes for strict portal thresholds, split multi-page reports, encrypt confidential contracts, and convert image formats directly in your browser without uploading files to third-party servers.",
    whoIsItFor: [
      "Job seekers assembling resume packets and certificate transcripts",
      "Accounting and legal professionals handling confidential client records",
      "Students organizing thesis chapters, lecture notes, and assignments",
      "Administrative teams preparing standardized government submissions",
    ],
    keyCapabilities: [
      "Batch PDF collation with interactive drag-and-drop page ordering",
      "Lossless stream compression and intelligent image DPI downsampling",
      "Cryptographic 128-bit & 256-bit AES password encryption and permission locks",
      "High-resolution rasterization to JPG/PNG image archives",
    ],
    technicalArchitecture:
      "All PDF operations are powered by client-side WebAssembly rendering engines (pdf-lib and PDF.js). Documents reside entirely in your browser's sandboxed local memory, guaranteeing 100% data confidentiality and zero server latency.",
    faqs: [
      {
        question: "Are my uploaded PDF files saved on Nova Tools servers?",
        answer:
          "No. Nova Tools operates under a strict zero-upload client-side architecture. File bytes are read into local browser RAM and processed on your CPU. No file data is transmitted over the network.",
      },
      {
        question: "Can I compress a PDF to under 100KB or 200KB for exam portals?",
        answer:
          "Yes. The Compress PDF tool offers multiple compression levels designed specifically to meet strict 100KB, 200KB, and 500KB thresholds required by government and university portals.",
      },
    ],
  },
  image: {
    overview:
      "High-quality imagery is essential for modern web applications, social media feeds, and official identity documents. Nova Tools Image Processing utilities provide fast, client-side tools to resize pixel dimensions, compress JPEG/PNG/WebP assets, crop custom aspect ratios, and convert between modern graphic formats.",
    whoIsItFor: [
      "Frontend developers and SEOs optimizing Core Web Vitals (LCP) performance",
      "Competitive exam applicants resizing photos and signatures to exact millimetric specs",
      "Content creators designing YouTube thumbnails, Instagram posts, and banners",
      "Photographers converting raw camera files to lightweight web formats",
    ],
    keyCapabilities: [
      "Bicubic & bilinear image resampling with locked aspect ratio constraints",
      "WebP conversion delivering 25% to 35% smaller file sizes than legacy JPG/PNG",
      "Granular signature compression targeting strict 10KB to 50KB portal brackets",
      "Lossy and lossless quality tuning with real-time before/after size previews",
    ],
    technicalArchitecture:
      "Image processing is performed directly on HTML5 Canvas and OffscreenCanvas threads using hardware-accelerated GPU shaders. Zero bandwidth is consumed transmitting image payloads.",
    faqs: [
      {
        question: "What is the best format to convert my images for website speed?",
        answer:
          "WebP is currently the recommended standard for web images, supporting both lossy and lossless modes, full alpha transparency, and 25-35% smaller file sizes compared to traditional JPG and PNG.",
      },
      {
        question: "How do I resize a passport photo to 3.5cm x 4.5cm?",
        answer:
          "Use the Image Resizer or India Passport Resizer tool. Enter 413 pixels width by 531 pixels height (which equates to 3.5cm x 4.5cm at 300 DPI) and export as JPG.",
      },
    ],
  },
  text: {
    overview:
      "Writing clean, well-formatted content requires precise tools. Nova Tools Text & Writing suite provides instant character counters, reading time estimators, uppercase/lowercase converters, whitespace sanitizers, and typography generators.",
    whoIsItFor: [
      "Copywriters and authors checking article word counts and readability metrics",
      "SEO specialists ensuring meta title (60 chars) and description (160 chars) limits",
      "Developers cleaning raw text lists, CSV entries, and SQL strings",
      "Students verifying essay word limits for university applications",
    ],
    keyCapabilities: [
      "Real-time word, character (with and without spaces), sentence, and paragraph counting",
      "Calculated adult reading time (225 WPM) and speaking duration (130 WPM)",
      "Multi-case transformations: UPPERCASE, lowercase, Title Case, camelCase, snake_case",
      "Automated whitespace trimming, carriage return normalization, and duplicate removal",
    ],
    technicalArchitecture:
      "Text processing uses native JavaScript Unicode regex engines executing in zero milliseconds on your device.",
    faqs: [
      {
        question: "How accurate is the estimated reading time calculation?",
        answer:
          "Nova Tools calculates reading time based on standard linguistic benchmarks of 200 to 250 words per minute for silent adult reading, and 130 words per minute for formal speaking presentations.",
      },
    ],
  },
  developer: {
    overview:
      "Engineers and system administrators need fast, distraction-free utilities to format JSON payloads, inspect Base64 strings, decode JWT tokens, validate regex patterns, and generate secure UUIDs.",
    whoIsItFor: [
      "Full-stack developers debugging REST APIs, GraphQL queries, and webhooks",
      "DevOps engineers formatting JSON/YAML infrastructure configuration files",
      "Security engineers testing cryptographic hashes and token payloads",
    ],
    keyCapabilities: [
      "2-space and 4-space JSON formatting with syntax error highlighting",
      "RFC 4122 compliant UUID v4 generation and cryptographically secure random tokens",
      "Base64 string and image Data URI encoding and decoding",
      "Unix epoch timestamp conversion to ISO 8601 and local datetime formats",
    ],
    technicalArchitecture:
      "Developer utilities utilize client-side JavaScript V8/SpiderMonkey engines and Web Crypto API (crypto.getRandomValues) for secure token generation.",
    faqs: [
      {
        question: "Is it safe to format proprietary JSON or decode API tokens here?",
        answer:
          "Yes. All JSON validation and Base64 decoding happens purely in your browser's local sandbox memory. Zero strings or tokens are logged or transmitted to external servers.",
      },
    ],
  },
  calculators: {
    overview:
      "Accurate mathematical modeling simplifies everyday life, financial investments, tax compliance, and academic problem-solving. Nova Tools Calculators provide instant equations for loan EMIs, GST tax breakdowns, compound interest SIPs, and chronological age calculations.",
    whoIsItFor: [
      "Home and vehicle loan borrowers planning monthly EMI repayments",
      "Retailers and business owners calculating GST inclusive/exclusive prices",
      "Investors estimating compound growth on systematic investment plans (SIP)",
      "Job applicants calculating exact age for eligibility cutoffs",
    ],
    keyCapabilities: [
      "Reducing balance loan EMI amortization schedule calculation",
      "GST tax splitting across CGST, SGST, and IGST tax slabs",
      "Exact chronological age calculation down to years, months, and days",
      "Percentage increase, discount, and profit margin analysis",
    ],
    technicalArchitecture:
      "Calculations use precision floating-point arithmetic executing instantaneously in your browser with zero latency.",
    faqs: [
      {
        question: "How is monthly loan EMI calculated?",
        answer:
          "Nova Tools uses the global reducing balance formula: EMI = [P x R x (1+R)^N] / [(1+R)^N - 1], where P is Principal, R is monthly interest rate, and N is tenure in months.",
      },
    ],
  },
  file: {
    overview:
      "Managing local files requires robust, dependable tools for verifying cryptographic checksums, analyzing binary properties, inspecting MIME types, generating systematic batch filenames, and merging or splitting large text logs. Nova Tools File Utilities execute directly on your device via the HTML5 File API and Web Crypto API, enabling high-speed verification without uploading confidential documents or multi-gigabyte disk images to remote servers.",
    whoIsItFor: [
      "Software developers and system administrators verifying downloaded OS ISOs, software releases, and package integrity against published SHA-256 hashes",
      "IT professionals and forensic analysts inspecting exact byte lengths, MIME classifications, and timestamp headers of unverified files",
      "Photographers and digital archivists creating clean, sequentially numbered filename structures (e.g. IMG_001, DOC_2026_01) for massive asset lists",
      "Data analysts and engineers merging split log files, CSV records, or segmenting massive text dumps into structured chunks",
    ],
    keyCapabilities: [
      "Cryptographic SHA-256, SHA-512, and MD5 checksum computation with progressive chunk streaming",
      "Deep metadata inspection detailing exact byte count, human-readable storage units (KB, MB, GB), MIME type, and last modified date",
      "Batch file rename pattern generation supporting prefixing, suffixing, find-and-replace, and zero-padded incremental indexing",
      "Client-side text file collation and delimited splitting for structured datasets",
    ],
    technicalArchitecture:
      "File hashing and inspection utilize the native Web Crypto API (SubtleCrypto.digest) and FileReader chunk streaming interfaces. Files of any size are streamed incrementally through your browser's local sandbox memory without network transfer.",
    faqs: [
      {
        question: "Can I verify the SHA-256 checksum of a large 2GB+ installer without uploading it?",
        answer:
          "Yes. Nova Tools uses progressive chunk streaming via the Web Crypto API. The file is read directly from your local hard drive into browser RAM in small chunks, meaning zero bytes are uploaded over your internet connection.",
      },
      {
        question: "What is the difference between SHA-256 and MD5 checksums?",
        answer:
          "SHA-256 generates a 256-bit (64-character hexadecimal) cryptographic hash with virtually zero collision probability, making it the modern standard for verifying software security and file integrity. MD5 generates a 128-bit hash and is legacy, useful primarily for basic transfer verification where security against deliberate tampering is not a factor.",
      },
      {
        question: "How does the Batch File Renamer work?",
        answer:
          "The Batch File Renamer takes a list of raw filenames, applies your custom prefix, suffix, regex replace, or zero-padded numbering rules (e.g. Document_001.pdf), and outputs the formatted list ready to copy into PowerShell, bash rename scripts, or batch renaming utilities.",
      },
    ],
  },
  india: {
    overview:
      "Indian citizens, students, and professionals frequently navigate government recruitment portals, examination boards, and taxation systems with stringent formatting specifications. Nova Tools India Utilities provide specialized tools for resizing photos and signatures to exact examination requirements (UPSC, SSC, TNPSC, NEET, JEE, IBPS), calculating GST breakdowns (CGST/SGST/IGST), and comparing tax liabilities under Old vs. New Tax Regimes.",
    whoIsItFor: [
      "Competitive exam aspirants preparing passport photos and signature scans for UPSC, TNPSC, SSC, IBPS, and state PSC portals",
      "Medical and engineering candidates formatting admit card photos for NEET, JEE Main, and GATE registrations",
      "Indian taxpayers and salaried employees comparing deductions between the Old and New Income Tax Regimes",
      "Small business owners, traders, and accountants computing inclusive and exclusive GST invoice breakdowns",
    ],
    keyCapabilities: [
      "Targeted photo compression matching exact portal thresholds (e.g. 20KB-50KB for UPSC, 10KB-20KB for signatures)",
      "Millimetric passport photo dimension scaling (3.5cm x 4.5cm at 300 DPI)",
      "Comprehensive GST calculation across 0%, 5%, 12%, 18%, and 28% statutory tax slabs",
      "Detailed income tax slab computation incorporating standard deduction, 87A rebate, and surcharge rules",
    ],
    technicalArchitecture:
      "All photo adjustments run on GPU-accelerated HTML5 Canvas shaders in your browser. Financial calculators execute precise decimal math locally with zero storage of personal financial figures.",
    faqs: [
      {
        question: "How do I compress my photo and signature for UPSC/TNPSC portals?",
        answer:
          "Use the UPSC Photo Resizer or Signature Resizer tool. Select your image, set the target file size (e.g., 20KB to 50KB for photos, 10KB to 20KB for signatures), verify the pixel dimensions, and download the portal-ready JPG.",
      },
      {
        question: "How is GST split between CGST and SGST for intra-state transactions?",
        answer:
          "For intra-state transactions within the same state, the applicable GST rate is divided equally into Central GST (CGST, 50%) and State GST (SGST, 50%). For inter-state transactions, the entire tax is levied as Integrated GST (IGST).",
      },
    ],
  },
  tamil: {
    overview:
      "Tamil is one of the world's classical languages with a vibrant global digital footprint. Nova Tools Tamil Utilities provide modern text processing, BAMINI and Vanavil legacy font conversion to standardized Unicode, Tanglish phonetic transliteration, and client-side Tamil OCR for extracting Tamil script from printed books, documents, and screenshots.",
    whoIsItFor: [
      "Tamil writers, journalists, and bloggers typing in Roman characters (Tanglish) and converting phonetically to Tamil script",
      "Archivists, publishers, and desktop publishing (DTP) operators converting legacy BAMINI, Shree-Lipi, or Vanavil texts into Unicode",
      "Researchers, students, and genealogists extracting editable Tamil text from scanned palm-leaf manuscripts and printed books",
    ],
    keyCapabilities: [
      "Client-side Tamil Optical Character Recognition (OCR) powered by trained Tamil Tesseract neural models",
      "Phonetic Tanglish-to-Tamil real-time transliteration engine (e.g., 'vanakkam' -> 'வணக்கம்')",
      "Comprehensive BAMINI, Vanavil, and TAB font glyph mapping to universal UTF-8 Unicode",
      "Tamil character and word statistics accurately counting compound Tamil glyphs (uyir, mei, uyirmei)",
    ],
    technicalArchitecture:
      "Tamil OCR executes directly in the browser using WebAssembly neural network runtimes (Tesseract.js). Font conversion uses comprehensive algorithmic character mapping tables without external API calls.",
    faqs: [
      {
        question: "How does Tanglish transliteration work?",
        answer:
          "Tanglish transliteration maps English phonetic letter combinations to their corresponding Tamil Unicode vowels (உயிர்), consonants (மெய்), and compound letters (உயிர்மெய்) in real time as you type.",
      },
      {
        question: "Can I convert legacy BAMINI font Tamil text to Unicode for websites?",
        answer:
          "Yes. Paste your legacy BAMINI font text into the BAMINI to Unicode Converter. It replaces proprietary glyph codes with standard Unicode characters that can be read on any modern smartphone or computer without installing special fonts.",
      },
    ],
  },
  data: {
    overview:
      "Data engineering, software development, and business intelligence require seamless conversions between structured formats. Nova Tools Data & Format utilities provide lightning-fast transformation between JSON, CSV, TSV, XML, YAML, SQL INSERT queries, and Markdown tables with strict schema validation and customizable delimiters.",
    whoIsItFor: [
      "Data analysts converting large CSV export sheets into formatted JSON records for dashboard ingestion",
      "Frontend and backend developers translating JSON API payloads into SQL INSERT statements or TypeScript interfaces",
      "Technical writers and documentation maintainers converting CSV data into clean Markdown tables",
      "DevOps engineers converting YAML configuration files to JSON and vice-versa",
    ],
    keyCapabilities: [
      "Bi-directional JSON to CSV and CSV to JSON parsing with auto-detected delimiters (comma, tab, semicolon)",
      "JSON to TypeScript interface and type definition generation",
      "Structured CSV to SQL INSERT script builder with column type inference and table customization",
      "YAML to JSON and JSON to YAML parsing with syntax validation and indentation controls",
    ],
    technicalArchitecture:
      "Data parsing and serialization execute in native browser JavaScript memory engines with zero payload limits and zero data retention.",
    faqs: [
      {
        question: "Is it safe to convert proprietary company CSV datasets here?",
        answer:
          "Yes. All conversions happen entirely inside your browser's local JavaScript execution context. No data rows, column names, or records are transmitted to Nova Tools servers.",
      },
      {
        question: "Does the CSV to JSON converter handle nested objects or custom delimiters?",
        answer:
          "Yes. You can select comma, semicolon, tab, or pipe delimiters, toggle header detection, and format the resulting JSON as a flat array of objects or indexed records.",
      },
    ],
  },
  seo: {
    overview:
      "Search Engine Optimization requires precision metadata, valid structured data, and well-configured crawler directives. Nova Tools SEO & Search suite provides webmasters and digital marketers with instant tools to generate HTML meta tags, OpenGraph social cards, XML sitemaps, robots.txt files, URL slugs, and keyword density analyses.",
    whoIsItFor: [
      "Website owners and webmasters setting up proper robots.txt directives and XML sitemaps for Googlebot and Bingbot",
      "Content creators and copywriters verifying keyword density, title tag character limits (60 chars), and meta descriptions (160 chars)",
      "Frontend developers generating OpenGraph and Twitter Card metadata for social media link previews",
    ],
    keyCapabilities: [
      "Google SERP desktop and mobile title/snippet pixel-width preview simulator",
      "Robots.txt rule builder supporting user-agent permissions, crawl-delay, and sitemap references",
      "URL slug generator with Unicode transliteration, lowercase normalization, and stop-word filtering",
      "Real-time keyword frequency and n-gram density analyzer",
    ],
    technicalArchitecture:
      "All SEO analysis runs client-side in your browser, parsing markup and text in milliseconds without web crawler scraping latency.",
    faqs: [
      {
        question: "What is the recommended title and meta description length for SEO?",
        answer:
          "Google typically displays the first 50-60 characters (approximately 580 pixels) of a page title, and 150-160 characters (approximately 960 pixels) of a meta description. The Nova Tools SERP Previewer displays live character counts to keep your snippets within safe thresholds.",
      },
    ],
  },
  webmaster: {
    overview:
      "Network engineers, webmasters, and DevOps specialists rely on quick calculations for subnet allocation, HTTP status troubleshooting, Apache/Nginx redirect rules, and user-agent string inspection. Nova Tools Webmaster utilities deliver instantaneous network mathematics and configuration helpers without terminal clutter.",
    whoIsItFor: [
      "Network engineers calculating CIDR subnets, broadcast addresses, usable IP host ranges, and subnet masks",
      "Web developers configuring .htaccess 301 permanent redirects and HTTPS rewrite rules",
      "System administrators looking up HTTP status codes (200, 301, 404, 500, 503) and diagnostic headers",
    ],
    keyCapabilities: [
      "CIDR subnet calculator computing network address, broadcast address, netmask, wildcard mask, and usable host count",
      "Apache .htaccess and Nginx redirect rule generator for domain migrations, trailing slash normalization, and URL rewrites",
      "HTTP status code dictionary with official RFC definitions, caching rules, and debugging resolutions",
      "Browser User-Agent header parser identifying OS version, rendering engine, and device type",
    ],
    technicalArchitecture:
      "Network and webmaster utilities use bitwise integer math and regex engines running locally in your browser sandbox.",
    faqs: [
      {
        question: "How does a CIDR /24 subnet calculation work?",
        answer:
          "A /24 prefix length allocates 24 bits for the network identifier and 8 bits for host addresses. This creates a subnet mask of 255.255.255.0 with 256 total IP addresses, of which 254 are usable host addresses (subtracting the network address and broadcast address).",
      },
    ],
  },
  finance: {
    overview:
      "Sound financial planning requires accurate modeling of profit margins, return on investment (ROI), break-even thresholds, salary-to-hourly conversions, and sales tax calculations. Nova Tools Finance utilities provide business owners, freelancers, and investors with clean financial equations.",
    whoIsItFor: [
      "E-commerce merchants and business owners calculating gross profit margin, markup percentage, and net profit",
      "Entrepreneurs estimating break-even sales volume and fixed vs. variable cost structures",
      "Freelancers and contractors converting between hourly billing rates and annual salaried equivalents",
      "Retailers calculating sales tax inclusive and exclusive product pricing",
    ],
    keyCapabilities: [
      "Gross profit margin vs. markup percentage calculator with visual margin breakdown",
      "Return on Investment (ROI) and annualized yield formula calculator",
      "Fixed and variable cost break-even point analysis (in units and currency revenue)",
      "Hourly wage to annual gross salary converter factoring standard work hours and weeks",
    ],
    technicalArchitecture:
      "Financial algorithms use high-precision arithmetic running client-side with zero data persistence.",
    faqs: [
      {
        question: "What is the difference between Margin and Markup?",
        answer:
          "Margin is the percentage of profit relative to the selling price: Margin = (Profit / Revenue) x 100. Markup is the percentage added to the original cost price to determine the selling price: Markup = (Profit / Cost) x 100. A 50% markup equals a 33.33% profit margin.",
      },
    ],
  },
  education: {
    overview:
      "Students, educators, and academic researchers need fast, dependable calculators for Grade Point Averages (GPA/CGPA), bibliographic citations (APA, MLA, Chicago), and scientific unit conversions. Nova Tools Education suite provides reliable academic tools without ads blocking primary inputs.",
    whoIsItFor: [
      "University and college students calculating semester GPA, cumulative CGPA, and required future target grades",
      "High school and university students converting percentage scores to 4.0 GPA or 10.0 CGPA scales",
      "Researchers and students formatting academic citations in APA 7th edition, MLA 9th edition, and Chicago formats",
    ],
    keyCapabilities: [
      "Multi-course weighted GPA calculator supporting custom credit hours and standard letter grade scales (A, B, C, D, F)",
      "Percentage to 10-point CGPA and 4.0 scale conversion using standard university formula models",
      "Bibliographic citation builder for books, journal articles, websites, and conference proceedings",
      "Scientific notation to decimal and standard exponent conversion",
    ],
    technicalArchitecture:
      "All calculations run directly in your browser's JavaScript environment with immediate reactive feedback.",
    faqs: [
      {
        question: "How is weighted GPA calculated across multiple subjects?",
        answer:
          "Weighted GPA is computed by multiplying the grade point value of each letter grade by the course's credit hours, summing all grade points, and dividing by the total number of enrolled credit hours: GPA = (Total Grade Points) / (Total Credit Hours).",
      },
    ],
  },
  accessibility: {
    overview:
      "Building an inclusive web requires adherence to Web Content Accessibility Guidelines (WCAG). Nova Tools Accessibility utilities help frontend designers, UX researchers, and compliance auditors verify color contrast ratios (AA/AAA), generate descriptive image alt text, and preview typography for dyslexic readers.",
    whoIsItFor: [
      "UI/UX designers and web developers checking text-to-background color contrast against WCAG 2.1 standards",
      "Accessibility specialists ensuring compliance with Section 508 and European accessibility mandates",
      "Content managers creating meaningful, screen-reader-optimized image alternative text",
    ],
    keyCapabilities: [
      "WCAG 2.1 contrast ratio calculator evaluating Level AA (4.5:1 for normal text, 3:1 for large text) and Level AAA (7:1 normal, 4.5:1 large)",
      "Real-time color luminance calculation using standard sRGB relative luminance formulas",
      "Image alt text structural assistant providing contextual guidance for screen reader clarity",
      "Accessible color palette generator suggesting compliant alternative shades",
    ],
    technicalArchitecture:
      "Color contrast calculations use relative luminance equations defined by W3C WCAG 2.1 specifications executing in native JavaScript.",
    faqs: [
      {
        question: "What is the minimum WCAG contrast ratio for normal body text?",
        answer:
          "Under WCAG 2.1 Level AA, normal text (under 18pt or under 14pt bold) requires a minimum contrast ratio of 4.5:1 against its background. For Level AAA compliance, the minimum ratio is 7:1.",
      },
    ],
  },
  privacy: {
    overview:
      "Protecting sensitive credentials, testing entropy, and verifying cryptographic hashes is foundational to online security. Nova Tools Privacy & Security utilities provide secure password generators, hash checkers, token generators, and entropy estimators that execute 100% in your local browser sandbox without transmitting passwords over the internet.",
    whoIsItFor: [
      "Users generating cryptographically random master passwords and authentication passphrases",
      "Developers creating API bearer tokens, hex session keys, and random salt values",
      "Security-conscious individuals testing password entropy and crack-time resilience",
    ],
    keyCapabilities: [
      "Cryptographically secure pseudo-random number generator (CSPRNG) powered password builder",
      "Customizable character sets: uppercase, lowercase, numbers, special symbols, and excluded ambiguous characters (0, O, l, 1)",
      "Password entropy bit calculation and dictionary vulnerability evaluation",
      "Instant SHA-256 and SHA-512 text hash generation for message authentication",
    ],
    technicalArchitecture:
      "Random token and password generation uses window.crypto.getRandomValues(), ensuring hardware-level entropy from your operating system's cryptographic random pool. Zero passwords are ever logged or uploaded.",
    faqs: [
      {
        question: "Are passwords generated on Nova Tools sent to any server?",
        answer:
          "No. All password generation uses the native Web Crypto API (crypto.getRandomValues) directly in your browser. The generated strings exist solely in your device's local memory until you copy them.",
      },
    ],
  },
  qr: {
    overview:
      "QR codes and barcodes connect physical surfaces to digital destinations. Nova Tools QR & Barcode utilities allow you to create custom, scannable QR codes for website URLs, WiFi network auto-connect configurations, vCard contact cards, plain text, and standard 1D industrial barcodes (Code 128, EAN-13).",
    whoIsItFor: [
      "Businesses and restaurants creating contactless QR menus, table ordering links, and review prompts",
      "Offices and homeowners generating WiFi login QR codes for guests to scan and connect instantly",
      "Event organizers and marketing professionals designing vCard contact cards and promotional campaign codes",
    ],
    keyCapabilities: [
      "High-resolution vector SVG and raster PNG QR code generation with custom color options",
      "WiFi network QR code format supporting WPA/WPA2/WPA3 and hidden SSID flags",
      "vCard 3.0 contact QR code builder encoding name, phone, email, company, and website",
      "Adjustable Reed-Solomon Error Correction Levels (L: 7%, M: 15%, Q: 25%, H: 30%)",
    ],
    technicalArchitecture:
      "QR codes and barcodes are rendered locally on HTML5 Canvas and SVG DOM elements with zero server API dependencies.",
    faqs: [
      {
        question: "What error correction level should I choose for my QR code?",
        answer:
          "Level M (15% recovery) is recommended for standard digital screens and clean print materials. If you plan to print QR codes on outdoor flyers, business cards with logos, or surfaces that might suffer minor wear, choose Level H (30% recovery).",
      },
    ],
  },
  ocr: {
    overview:
      "Digitizing printed books, paper receipts, scanned PDF pages, and mobile screenshots into editable text saves hours of manual transcription. Nova Tools OCR & Vision utilities process your images locally in your browser using neural-network optical character recognition models.",
    whoIsItFor: [
      "Students and researchers transcribing textbook passages, research citations, and lecture slides",
      "Administrative teams extracting text from scanned invoices, receipts, and paper forms",
      "Developers and QA engineers extracting error messages and code snippets from application screenshots",
    ],
    keyCapabilities: [
      "Client-side OCR text extraction supporting English, Tamil, and major global languages",
      "Image pre-processing filters (grayscale, thresholding, contrast enhancement) for higher character accuracy",
      "One-click text copy, whitespace formatting, and plain-text file download",
    ],
    technicalArchitecture:
      "OCR processing executes on your device using WebAssembly builds of Tesseract.js. The neural recognition model runs in a dedicated Web Worker thread to keep the user interface smooth and responsive.",
    faqs: [
      {
        question: "How can I get the highest accuracy from OCR image recognition?",
        answer:
          "For best OCR results, ensure the source image is well-lit, sharp, not rotated, and has a high contrast between dark text and a light background (300 DPI resolution is ideal for scanned paper).",
      },
    ],
  },
  business: {
    overview:
      "Running a business requires rapid drafting of standardized agreements, pricing tables, purchase summaries, and invoice calculations. Nova Tools Business utilities assist entrepreneurs, small businesses, and freelancers with clean document templates and commercial calculators.",
    whoIsItFor: [
      "Freelancers and independent consultants creating non-disclosure agreements (NDAs) and project scope summaries",
      "Startups and SaaS businesses designing multi-tier pricing matrices and feature comparison tables",
      "Procurement and sales teams calculating purchase order totals, volume discounts, and net terms",
    ],
    keyCapabilities: [
      "Standard Non-Disclosure Agreement (NDA) generator with customizable confidentiality terms and jurisdiction",
      "SaaS and agency pricing table generator with responsive HTML/CSS code export",
      "Commercial purchase order and invoice itemization calculator with tax and discount breakdowns",
    ],
    technicalArchitecture:
      "All business document generation runs locally in your browser with zero data retention or tracking.",
    faqs: [
      {
        question: "Are NDA templates generated on Nova Tools legally binding?",
        answer:
          "Nova Tools provides standard, general-purpose NDA templates suitable for routine commercial discussions. However, for specialized mergers, proprietary patent filings, or high-stakes transactions, we recommend having your specific agreement reviewed by qualified legal counsel.",
      },
    ],
  },
  productivity: {
    overview:
      "Focus, time management, and structured daily routines drive personal and professional achievement. Nova Tools Productivity utilities provide distraction-free Pomodoro study/work timers, multi-city timezone difference planners, meeting cost calculators, and habit streak mathematics.",
    whoIsItFor: [
      "Remote workers and students using the Pomodoro technique (25 min focus / 5 min break) to maximize concentration",
      "Global teams planning synchronous meetings across multiple international time zones (UTC, IST, EST, PST, GMT)",
      "Project managers and team leaders calculating the financial cost of recurring group meetings",
    ],
    keyCapabilities: [
      "Configurable Pomodoro interval timer with audio alerts and customizable focus/break cycles",
      "Interactive world timezone converter with visual overlapping business hours indicator",
      "Meeting cost calculator modeling hourly participant rates against meeting duration",
    ],
    technicalArchitecture:
      "Timers use precision browser requestAnimationFrame and Web Audio API oscillators, operating smoothly in background tabs.",
    faqs: [
      {
        question: "How does the Pomodoro focus technique improve productivity?",
        answer:
          "The Pomodoro Technique breaks work into focused 25-minute intervals separated by short 5-minute restorative breaks. After four cycles, a longer 15-30 minute break is taken. This cadence prevents cognitive fatigue and sustains deep focus.",
      },
    ],
  },
  ai: {
    overview:
      "Working effectively with Large Language Models (LLMs) requires clear prompt formatting, accurate token count estimation, and structured few-shot examples. Nova Tools AI & Prompt utilities assist prompt engineers and developers in preparing clean instructions for Gemini, GPT, Claude, and open-source models.",
    whoIsItFor: [
      "Prompt engineers and developers estimating token usage and cost for API context windows",
      "Content creators formatting structured system prompts, user queries, and few-shot examples",
      "Writers cleaning markdown formatting and unwanted artifacts from AI model outputs",
    ],
    keyCapabilities: [
      "Token count estimator using Byte-Pair Encoding (BPE) approximation models",
      "System prompt and few-shot prompt builder with formatted role demarcation",
      "AI response cleaner stripping code block artifacts, trailing whitespace, and markdown discrepancies",
    ],
    technicalArchitecture:
      "Prompt formatting and token estimation execute instantly in your browser without sending your prompts to external AI servers.",
    faqs: [
      {
        question: "How is token count calculated for AI models?",
        answer:
          "Large language models process text in sub-word tokens rather than whole words. In English, 1 token typically represents approximately 4 characters or 0.75 words. Nova Tools uses standard BPE heuristics to give you an accurate estimate of context window utilization.",
      },
    ],
  },
  audio: {
    overview:
      "Inspecting audio waveforms, measuring musical tempos (BPM), and generating calibration tones is effortless with modern browser audio capabilities. Nova Tools Audio Utilities provide lightweight, responsive sound tools powered by the HTML5 Web Audio API.",
    whoIsItFor: [
      "Musicians, producers, and DJs tapping and measuring beats per minute (BPM) for songs and samples",
      "Sound designers and audio engineers generating pure sine, square, sawtooth, and triangle calibration tones",
      "Web developers converting short audio clips to Base64 data URIs for embedded web playback",
    ],
    keyCapabilities: [
      "Tap-tempo BPM counter with rolling average calculation and timing consistency metrics",
      "Audio frequency tone generator (20 Hz to 20,000 Hz) with customizable oscillator waveforms",
      "Audio file to Base64 Data URI encoder for lightweight web embedding",
    ],
    technicalArchitecture:
      "All audio synthesis and waveform generation utilize the native browser Web Audio API (AudioContext) running in real time.",
    faqs: [
      {
        question: "How accurate is the tap-tempo BPM counter?",
        answer:
          "The BPM counter calculates tempo using high-resolution millisecond timestamps (performance.now()) averaged across multiple consecutive taps, delivering precise tempo calculations down to decimal BPM values.",
      },
    ],
  },
  video: {
    overview:
      "Analyzing video aspect ratios, capturing high-resolution still frames, and converting short clips to animated GIFs should not require heavy desktop editing software. Nova Tools Video Utilities offer clean, in-browser video processing tools.",
    whoIsItFor: [
      "Video editors and YouTubers calculating exact pixel dimensions for 16:9, 9:16, 4:3, 1:1, and 21:9 aspect ratios",
      "Content creators extracting crisp, full-resolution thumbnail still frames from MP4 and WebM videos",
      "Designers and social media managers scaling video dimensions for mobile and web feeds",
    ],
    keyCapabilities: [
      "Aspect ratio calculator computing width, height, and crop factors across standard and custom resolutions",
      "Video frame snapshot extractor capturing original-quality PNG/JPG stills at exact video timestamps",
      "Resolution scaler mapping standard 4K, 1080p, 720p, and 480p dimension ratios",
    ],
    technicalArchitecture:
      "Video processing uses client-side HTML5 Video and Canvas 2D contexts, extracting frames directly from local video files.",
    faqs: [
      {
        question: "Can I extract a full-resolution photo frame from a 4K video file?",
        answer:
          "Yes. When you load a local video file, the Video Frame Extractor draws the exact native pixel matrix (e.g. 3840x2160 for 4K) to a canvas at your chosen timestamp, allowing you to download an uncompressed PNG or JPG still.",
      },
    ],
  },
  social: {
    overview:
      "Formatting social media posts with clean line breaks, managing character limits, and organizing hashtags improves engagement across platforms. Nova Tools Social Media utilities help creators optimize content for Twitter/X, Instagram, LinkedIn, and YouTube.",
    whoIsItFor: [
      "Social media managers and creators formatting clean Instagram captions without invisible dot workarounds",
      "Twitter/X users verifying tweet length against the 280-character limit and thread counts",
      "YouTube creators cleaning and organizing video tags and SEO keyword lists",
    ],
    keyCapabilities: [
      "Instagram caption spacer formatting clean paragraphs and line breaks without extra characters",
      "Social platform character counter tracking limits for Twitter (280), LinkedIn (3,000), and Instagram (2,200)",
      "Comma-delimited YouTube tag cleaner and duplicate hashtag remover",
    ],
    technicalArchitecture:
      "Text formatting and character counting execute instantaneously in local JavaScript.",
    faqs: [
      {
        question: "How does the Instagram caption spacer work?",
        answer:
          "Instagram often removes regular line breaks when publishing captions. The caption spacer inserts invisible Unicode zero-width spaces into blank lines, preserving your paragraph layout cleanly across all devices.",
      },
    ],
  },
  marketing: {
    overview:
      "Digital marketing campaigns require organized tracking parameters, compelling email subject lines, and standard headline capitalization. Nova Tools Marketing & Growth utilities assist growth marketers in assembling UTM campaign links and analyzing headline readability.",
    whoIsItFor: [
      "Digital marketers and advertisers building standardized Google Analytics UTM campaign tracking URLs",
      "Email marketers testing subject line character lengths, spam trigger words, and preview text",
      "Copywriters converting blog headlines into APA, Chicago, or AP title case conventions",
    ],
    keyCapabilities: [
      "UTM campaign URL builder encoding Source, Medium, Campaign, Term, and Content parameters",
      "Headline capitalizer formatting titles according to AP, APA, Chicago, or MLA editorial standards",
      "SERP snippet and email subject line preview simulator",
    ],
    technicalArchitecture:
      "All URL encoding and string formatting execute in your browser with zero logging of campaign data.",
    faqs: [
      {
        question: "What are the essential UTM parameters for tracking marketing campaigns?",
        answer:
          "The three essential UTM parameters are utm_source (e.g. newsletter, google, twitter), utm_medium (e.g. email, cpc, social), and utm_campaign (e.g. summer_sale, product_launch). Optional parameters include utm_term for keywords and utm_content for A/B creative testing.",
      },
    ],
  },
  design: {
    overview:
      "Crafting modern user interfaces requires fine-tuning CSS box shadows, multi-stop gradients, glassmorphism blur filters, and responsive grid layouts. Nova Tools Design utilities provide visual sliders and instant CSS code generation for frontend designers.",
    whoIsItFor: [
      "Frontend developers and UI designers creating multi-layer CSS box shadows with realistic depth",
      "Web designers generating smooth linear, radial, and conic CSS gradients",
      "Designers building modern glassmorphism UI cards with backdrop-filter blur and subtle borders",
    ],
    keyCapabilities: [
      "Interactive CSS Box Shadow generator with X/Y offset, blur radius, spread, opacity, and inset controls",
      "Multi-stop CSS gradient generator exporting cross-browser linear and radial gradients",
      "Glassmorphism filter builder with live preview on dark and vibrant backgrounds",
    ],
    technicalArchitecture:
      "CSS generators provide live interactive styling rendered in real time in your browser, copying clean standard CSS3 code to your clipboard.",
    faqs: [
      {
        question: "How do I create a soft, modern drop shadow in CSS?",
        answer:
          "Modern soft shadows use a larger blur radius (e.g. 25px-40px), a slight positive Y-offset (10px-20px), zero spread, and a low opacity shadow color (rgba(0,0,0,0.08) to rgba(0,0,0,0.15)) rather than harsh, dark shadows.",
      },
    ],
  },
};

export function getAllCategories(): CategoryMetadata[] {
  return Object.values(CATEGORIES);
}

export function getCategoryById(id: string): CategoryMetadata | undefined {
  return CATEGORIES[id as ToolCategory];
}

export function getCategoryEditorial(id: string): CategoryEditorialGuide {
  return (
    CATEGORY_EDITORIAL[id] || {
      overview: `Explore high-performance, free online ${CATEGORIES[id as ToolCategory]?.name || id} utilities. Built with modern client-side architecture to provide instant results with 100% data privacy.`,
      whoIsItFor: [
        "Professionals seeking fast, browser-based workflow utilities",
        "Users requiring zero-upload privacy for confidential files and data",
        "Students and researchers needing accurate calculations and formatting",
      ],
      keyCapabilities: [
        "100% In-browser client-side execution",
        "Zero server file storage or data logging",
        "Universal desktop and mobile compatibility",
        "Fast, free, and unlimited usage",
      ],
      technicalArchitecture:
        "All utilities in this category execute directly within your browser sandbox using modern HTML5, WebAssembly, and Canvas technologies without sending payloads to external backends.",
      faqs: [
        {
          question: `Are ${CATEGORIES[id as ToolCategory]?.name || id} tools free to use?`,
          answer:
            "Yes. All utilities on Nova Tools are 100% free with unlimited daily usage and no mandatory registration required.",
        },
        {
          question: "How is my privacy protected when using these tools?",
          answer:
            "Your files and inputs are processed exclusively inside your computer's local browser memory. No data is stored, cached, or uploaded to remote cloud servers.",
        },
      ],
    }
  );
}
