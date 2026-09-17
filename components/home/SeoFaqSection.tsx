import React from "react";
import { ChevronDown, HelpCircle, ShieldCheck, Zap, Laptop } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "What is Nova Tools and how do in-browser tools work?",
    answer:
      "Nova Tools is a suite of 250+ free, high-performance web utilities for PDFs, images, code formatting, calculations, India compliance, Tamil linguistic tools, and data conversions. All processing runs 100% locally inside your web browser using WebAssembly, Web Audio, HTML5 Canvas, and modern browser APIs. Your files, documents, and data are never uploaded to any remote server or third-party queue.",
  },
  {
    question: "Are Nova Tools free to use, and is signup required?",
    answer:
      "Yes, all 250+ utilities on Nova Tools are completely free to use with zero registration, no software downloads, and no watermarks. You can convert, compress, calculate, or format files immediately upon loading the page.",
  },
  {
    question: "Are my sensitive files (such as Aadhaar, PAN, invoices, and PDFs) secure?",
    answer:
      "Yes. Because processing happens strictly on your local device (client-side), your files never leave your computer or phone. No file data, text, or images are transmitted over the internet or saved to external databases.",
  },
  {
    question: "How do I compress images or PDFs to exact government portal sizes (e.g. 50KB, 100KB, 200KB)?",
    answer:
      "Nova Tools includes specialized target-size compressors such as 'Compress Image to 50KB', 'Compress Image to 100KB', 'Compress Image to 200KB', and 'Signature Resizer'. Simply upload your file, select your desired dimensions and file size threshold, and download the portal-ready file.",
  },
  {
    question: "Does Nova Tools support regional and Tamil language processing?",
    answer:
      "Yes! Nova Tools features a dedicated suite of Tamil utilities including BAMINI to Unicode converter, Tanglish to Tamil transliteration, Tamil Image OCR, Tamil Number to Words converter, and Tamil Typing Speed Tester.",
  },
  {
    question: "Can I use Nova Tools on mobile phones and tablets?",
    answer:
      "Absolutely. Nova Tools is engineered with a responsive, touch-optimized interface that works seamlessly on iPhones, iPads, Android smartphones, Windows PCs, Macs, and Linux devices without requiring app installations.",
  },
];

export default function SeoFaqSection() {
  // Structured Data for Google Rich Snippets (FAQPage)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="relative overflow-hidden bg-slate-950 py-16 text-white border-t border-slate-900 [content-visibility:auto] [contain-intrinsic-size:1px_600px]">
      {/* JSON-LD Schema for Google Search Rich Results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Heading */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold text-cyan-300">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Everything you need to know about our browser-based privacy model, file processing limits, and utility features.
          </p>
        </div>

        {/* Feature Highlights Trust Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-800 bg-slate-900/40 text-xs text-slate-300">
            <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Instant Client Execution</span>
          </div>
          <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-800 bg-slate-900/40 text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>100% On-Device Privacy</span>
          </div>
          <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-800 bg-slate-900/40 text-xs text-slate-300">
            <Laptop className="w-4 h-4 text-violet-400 shrink-0" />
            <span>Mobile &amp; Desktop Ready</span>
          </div>
        </div>

        {/* Interactive FAQ Accordion (Native HTML Details/Summary) */}
        <div className="space-y-3">
          {FAQS.map((faq, index) => (
            <details
              key={index}
              open={index === 0}
              className="group rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden transition-colors"
            >
              <summary className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-white text-sm sm:text-base hover:text-cyan-300 transition-colors cursor-pointer list-none select-none">
                <span>{faq.question}</span>
                <ChevronDown className="w-4 h-4 text-cyan-400 shrink-0 transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
