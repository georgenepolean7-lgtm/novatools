# Nova Tools — Known Technical Limitations & Considerations

**Asset:** Nova Tools ([https://novatool.in](https://novatool.in))  
**Audited For:** Buyer Transparency & Operations

---

## 1. Client-Side Compute & Memory Bounds

Because Nova Tools executes all processing on the visitor's local device rather than a dedicated cloud server cluster:
* **Large Files on Low-End Devices:** Processing multi-hundred-megabyte files (e.g. 500MB+ PDFs or 100-megapixel raw image files) on older mobile phones with limited RAM may experience browser tab memory exhaustion or longer processing durations.
* **Recommended File Size UX Guidance:** For optimal browser responsiveness, file inputs under 100MB perform best.

---

## 2. Browser Compatibility Considerations

* **WebAssembly & Web Workers:** Tools utilizing WebAssembly (such as `/pdf-password-protect` and `/pdf-unlocker`) and Web Workers require modern standards-compliant browsers (Google Chrome, Mozilla Firefox, Apple Safari, Microsoft Edge, Opera, Brave).
* **Legacy Browsers:** Internet Explorer 11 or outdated mobile webviews lacking WebAssembly or modern ES2022 support are unsupported.

---

## 3. Optical Character Recognition (OCR) Network Asset Caching

* **Tesseract Language Data:** On the first execution of `/tamil-image-to-text`, the browser fetches the language traineddata file (`tam.traineddata` / `eng.traineddata`) from the public CDN and caches it in local IndexedDB storage. Subsequent OCR scans run from local cache.

---

## 4. Search Engine Indexation Ramp-Up

* **Organic Indexation:** The complete 30-tool suite and 17 programmatic SEO landing pages are registered in `https://novatool.in/sitemap.xml`. Following DNS and Google Search Console property transfer, Googlebot will crawl and index the newly expanded routes over standard indexing timelines.

---

**© 2026 Nova Code Tech.**
