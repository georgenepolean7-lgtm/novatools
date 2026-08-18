export interface PdfEngineResult {
  success: boolean;
  output: string;
  breakdown?: Record<string, string | number>;
  error?: string;
  blobUrl?: string;
}

export function parsePdfMetadata(meta: { title?: string; author?: string; subject?: string; keywords?: string }): PdfEngineResult {
  return {
    success: true,
    output: `Title: ${meta.title || "Untitled Document"}\nAuthor: ${meta.author || "Unknown Author"}\nSubject: ${meta.subject || "None"}\nKeywords: ${meta.keywords || "None"}`,
    breakdown: {
      "PDF Title": meta.title || "(Empty)",
      "Author": meta.author || "(Empty)",
      "Subject": meta.subject || "(Empty)",
      "Keywords": meta.keywords || "(Empty)",
      "Metadata Standard": "Adobe PDF 1.7 / ISO 32000-1",
    },
  };
}

export function convertMarkdownToHtml(markdown: string): PdfEngineResult {
  if (!markdown.trim()) return { success: true, output: "" };

  let html = markdown
    // Headers
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    // Bold & Italic
    .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/gim, "<em>$1</em>")
    // Code blocks & inline code
    .replace(/```([\s\S]*?)```/gim, "<pre><code>$1</code></pre>")
    .replace(/`([^`]+)`/gim, "<code>$1</code>")
    // Links & Images
    .replace(/!\[(.*?)\]\((.*?)\)/gim, '<img alt="$1" src="$2" />')
    .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>')
    // Blockquotes
    .replace(/^\> (.*$)/gim, "<blockquote>$1</blockquote>")
    // Unordered lists
    .replace(/^\- (.*$)/gim, "<ul><li>$1</li></ul>")
    // Paragraphs
    .replace(/\n\n/gim, "</p><p>");

  html = `<article>\n  <p>${html}</p>\n</article>`;

  return {
    success: true,
    output: html,
    breakdown: {
      "Source Markdown Chars": markdown.length,
      "Generated HTML Chars": html.length,
      "Semantic Elements": "h1-h3, p, strong, em, code, pre, a, img, blockquote",
    },
  };
}

export function convertHtmlToMarkdown(html: string): PdfEngineResult {
  if (!html.trim()) return { success: true, output: "" };

  const md = html
    .replace(/<h1>([\s\S]*?)<\/h1>/gi, "# $1\n\n")
    .replace(/<h2>([\s\S]*?)<\/h2>/gi, "## $1\n\n")
    .replace(/<h3>([\s\S]*?)<\/h3>/gi, "### $1\n\n")
    .replace(/<strong>([\s\S]*?)<\/strong>/gi, "**$1**")
    .replace(/<b>([\s\S]*?)<\/b>/gi, "**$1**")
    .replace(/<em>([\s\S]*?)<\/em>/gi, "*$1*")
    .replace(/<i>([\s\S]*?)<\/i>/gi, "*$1*")
    .replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/gi, "```\n$1\n```\n\n")
    .replace(/<code>([\s\S]*?)<\/code>/gi, "`$1`")
    .replace(/<a[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi, "[$2]($1)")
    .replace(/<img[^>]*src=["']([^"']*)["'][^>]*alt=["']([^"']*)["'][^>]*>/gi, "![$2]($1)")
    .replace(/<li>([\s\S]*?)<\/li>/gi, "- $1\n")
    .replace(/<p>([\s\S]*?)<\/p>/gi, "$1\n\n")
    .replace(/<[^>]+>/g, "")
    .trim();

  return {
    success: true,
    output: md,
    breakdown: {
      "HTML Input Length": `${html.length} chars`,
      "Markdown Output Length": `${md.length} chars`,
      "Format": "GitHub Flavored Markdown (GFM)",
    },
  };
}

export function estimateDocumentStats(text: string): PdfEngineResult {
  const clean = text.trim();
  if (!clean) return { success: true, output: "Empty document" };

  const words = clean.match(/\b\w+\b/g)?.length || 0;
  const chars = clean.length;
  const charsNoSpaces = clean.replace(/\s/g, "").length;
  const sentences = clean.split(/[.!?]+/).filter(Boolean).length || 1;
  const paragraphs = clean.split(/\n\s*\n/).filter(Boolean).length || 1;

  const estimatedPages = (words / 300).toFixed(1); // Standard 300 words per page (double spaced 12pt)
  const readingTimeMin = (words / 200).toFixed(1); // 200 wpm
  const speakingTimeMin = (words / 130).toFixed(1); // 130 wpm

  return {
    success: true,
    output: `Words: ${words.toLocaleString()}\nEstimated Standard Pages: ${estimatedPages} Pages\nReading Time: ~${readingTimeMin} Minutes`,
    breakdown: {
      "Total Word Count": words.toLocaleString(),
      "Character Count": chars.toLocaleString(),
      "Characters (No Spaces)": charsNoSpaces.toLocaleString(),
      "Sentences": sentences,
      "Paragraphs": paragraphs,
      "Estimated Standard Pages (~300 w/p)": `${estimatedPages} Pages`,
      "Estimated Reading Time": `${readingTimeMin} Min`,
      "Estimated Speech Time": `${speakingTimeMin} Min`,
    },
  };
}
