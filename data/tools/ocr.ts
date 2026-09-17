import { ToolDefinition } from "@/lib/tools/tool-types";

export const ocrTools: ToolDefinition[] = [
  {
    id: "tamil-image-to-text",
    slug: "tamil-image-to-text",
    name: "Tamil Image to Text (OCR)",
    shortDescription: "Extract editable Tamil and English text from images, photos, and scanned documents using in-browser neural OCR.",
    longDescription: "High-accuracy Optical Character Recognition (OCR) for Tamil script (தமிழ் எழுத்துக்கள்) and English text. Converts printed and photographed documents into editable Unicode text 100% locally in your browser.",
    category: "ocr",
    subcategory: "tamil",
    keywords: [
      "tamil image to text",
      "tamil ocr online",
      "extract tamil text from image",
      "photo to tamil text",
      "tamil font extractor",
      "ocr image to text",
      "browser ocr online",
      "extract text from image"
    ],
    searchTerms: [
      "tamil ocr",
      "extract tamil text",
      "image to tamil text",
      "tamil scan to text",
      "ocr online",
      "image text extractor"
    ],
    synonyms: [
      "tamil ocr converter",
      "tamil photo reader",
      "tamil text scanner",
      "image to text ocr"
    ],
    problemStatements: [
      "Extract Tamil text from book photo",
      "Convert printed Tamil document into editable text",
      "Recognize text in screenshots without uploading to server"
    ],
    inputTypes: ["image"],
    outputTypes: ["text"],
    features: [
      "100% Client-side Neural OCR",
      "Tesseract.js + OpenCV engine",
      "Multilingual support (Tamil + English)",
      "One-click copy & text export",
      "No file uploads required"
    ],
    howToSteps: [
      { step: 1, title: "Upload Image", instruction: "Select or drop your text image (PNG, JPG, WebP)." },
      { step: 2, title: "Extract", instruction: "Neural OCR scans and detects characters locally via WebAssembly." },
      { step: 3, title: "Copy Text", instruction: "Copy the extracted Unicode text or download it as TXT." },
    ],
    faq: [
      {
        question: "Is my image uploaded to a server?",
        answer: "No. The OCR neural network runs entirely inside your browser via WebAssembly (Tesseract.js). Your documents never leave your device."
      },
      {
        question: "Which languages are supported?",
        answer: "The neural recognition model is trained on both Tamil (tam) and English (eng) typography."
      }
    ],
    relatedTools: [
      "bamini-to-unicode-converter",
      "tanglish-to-tamil-transliteration",
      "word-counter"
    ],
    seoTitle: "Tamil Image to Text (OCR) Online Tool | Nova Tools",
    seoDescription: "Extract editable Tamil and English text from images and photos online with 100% in-browser privacy. Fast, accurate, free neural OCR tool.",
    canonicalUrl: "/tamil-image-to-text",
    processingType: "wasm",
    privacyMessage: "Processed 100% on-device with zero server uploads.",
    browserSupport: "All modern browsers",
    difficulty: "beginner",
    priority: 100,
    isPremium: false,
    isFeatured: true,
    isEnabled: true,
    iconName: "ScanText",
    engineComponent: "tamil-ocr", // Dedicated high-performance worker route
  },
];
