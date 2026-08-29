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
