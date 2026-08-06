export const relatedTools = {
  "compress-image": [
    "image-resizer",
    "signature-resizer",
    "jpg-to-pdf",
  ],

  "image-resizer": [
    "compress-image",
    "signature-resizer",
    "jpg-to-pdf",
  ],

  "compress-pdf": [
    "merge-pdf",
    "split-pdf",
    "rotate-pdf",
    "pdf-to-jpg",
  ],

  "merge-pdf": [
    "compress-pdf",
    "split-pdf",
    "rotate-pdf",
  ],

  "split-pdf": [
    "merge-pdf",
    "compress-pdf",
    "rotate-pdf",
  ],

  "rotate-pdf": [
    "merge-pdf",
    "split-pdf",
    "compress-pdf",
  ],

  "pdf-to-jpg": [
    "jpg-to-pdf",
    "compress-pdf",
  ],

  "jpg-to-pdf": [
    "pdf-to-jpg",
    "compress-image",
  ],

  "signature-resizer": [
    "image-resizer",
    "compress-image",
  ],

  "tamil-image-to-text": [
    "compress-image",
    "image-resizer",
  ],
};