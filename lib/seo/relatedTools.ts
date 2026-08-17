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

  "jpg-to-png": [
    "png-to-jpg",
    "webp-converter",
    "compress-image",
    "image-resizer",
  ],

  "png-to-jpg": [
    "jpg-to-png",
    "webp-converter",
    "compress-image",
    "image-resizer",
  ],

  "webp-converter": [
    "jpg-to-png",
    "png-to-jpg",
    "compress-image",
    "image-resizer",
  ],

  "image-cropper": [
    "image-rotator",
    "image-resizer",
    "compress-image",
    "signature-resizer",
  ],

  "image-rotator": [
    "image-cropper",
    "image-resizer",
    "compress-image",
    "rotate-pdf",
  ],

  "image-to-base64": [
    "jpg-to-png",
    "png-to-jpg",
    "webp-converter",
    "image-metadata",
  ],

  "image-to-pdf": [
    "jpg-to-pdf",
    "compress-pdf",
    "merge-pdf",
    "pdf-to-jpg",
  ],

  "image-metadata": [
    "image-to-base64",
    "compress-image",
    "image-resizer",
    "png-to-jpg",
  ],

  "gif-to-png": [
    "jpg-to-png",
    "png-to-jpg",
    "webp-converter",
    "compress-image",
  ],

  "bmp-to-jpg": [
    "png-to-jpg",
    "jpg-to-png",
    "webp-converter",
    "compress-image",
  ],

  "pdf-page-extractor": [
    "split-pdf",
    "pdf-page-deleter",
    "merge-pdf",
    "compress-pdf",
  ],

  "pdf-page-deleter": [
    "pdf-page-extractor",
    "split-pdf",
    "merge-pdf",
    "compress-pdf",
  ],

  "pdf-watermark": [
    "compress-pdf",
    "rotate-pdf",
    "merge-pdf",
    "pdf-to-jpg",
  ],

  "pdf-password-protect": [
    "pdf-unlocker",
    "compress-pdf",
    "merge-pdf",
    "pdf-watermark",
  ],

  "pdf-unlocker": [
    "pdf-password-protect",
    "compress-pdf",
    "merge-pdf",
    "split-pdf",
  ],

  "word-counter": [
    "character-counter",
    "case-converter",
    "text-cleaner",
    "tamil-image-to-text",
  ],

  "character-counter": [
    "word-counter",
    "case-converter",
    "text-cleaner",
    "lorem-ipsum-generator",
  ],

  "case-converter": [
    "text-cleaner",
    "word-counter",
    "character-counter",
    "lorem-ipsum-generator",
  ],

  "text-cleaner": [
    "case-converter",
    "word-counter",
    "character-counter",
    "lorem-ipsum-generator",
  ],

  "lorem-ipsum-generator": [
    "word-counter",
    "character-counter",
    "case-converter",
    "text-cleaner",
  ],
};