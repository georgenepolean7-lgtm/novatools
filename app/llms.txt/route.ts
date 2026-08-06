import { NextResponse } from "next/server";

export async function GET() {
  const text = `# Nova Tools

Nova Tools is a free online productivity platform.

Website:
https://novatool.in

Description:
Nova Tools provides free online PDF tools, image tools, OCR tools, and AI powered utilities.

Primary Categories:
- PDF Tools
- Image Tools
- OCR Tools
- AI Utilities

Available Tools:
- Compress PDF
- Merge PDF
- Split PDF
- Rotate PDF
- PDF to JPG
- JPG to PDF
- Compress Image
- Image Resizer
- Signature Resizer
- Tamil Image to Text OCR

Language:
English
Tamil

Publisher:
Nova Code Tech

Homepage:
https://novatool.in

Sitemap:
https://novatool.in/sitemap.xml

Robots:
https://novatool.in/robots.txt
`;

  return new NextResponse(text, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}