import { DEFAULT_UPDF_CONFIG } from "./updf-config";

export const affiliatePartners = {
  updf: {
    name: "UPDF - Professional PDF Editor",
    url: DEFAULT_UPDF_CONFIG.trackingUrl,
    description:
      "Advanced desktop and mobile PDF editor with OCR text recognition, page reordering, annotation tools, and form editing for power users.",
    badge: "Desktop PDF Software",
  },
} as const;