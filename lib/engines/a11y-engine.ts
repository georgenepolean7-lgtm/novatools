export interface A11yEngineResult {
  success: boolean;
  ratio?: number;
  formatted: string;
  breakdown?: Record<string, string | number>;
  error?: string;
}

function hexToRgb(hex: string): [number, number, number] | null {
  const clean = hex.replace("#", "").trim();
  if (clean.length === 3) {
    return [
      parseInt(clean[0] + clean[0], 16),
      parseInt(clean[1] + clean[1], 16),
      parseInt(clean[2] + clean[2], 16),
    ];
  }
  if (clean.length === 6) {
    return [
      parseInt(clean.substring(0, 2), 16),
      parseInt(clean.substring(2, 4), 16),
      parseInt(clean.substring(4, 6), 16),
    ];
  }
  return null;
}

function getLuminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

export function checkColorContrast(foregroundHex: string, backgroundHex: string): A11yEngineResult {
  const fg = hexToRgb(foregroundHex);
  const bg = hexToRgb(backgroundHex);

  if (!fg || !bg) {
    return { success: false, ratio: 1, formatted: "1:1", error: "Please enter valid 3 or 6 digit hex colors (e.g. #FFFFFF)." };
  }

  const lum1 = getLuminance(fg[0], fg[1], fg[2]);
  const lum2 = getLuminance(bg[0], bg[1], bg[2]);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  const ratio = (brightest + 0.05) / (darkest + 0.05);
  const roundedRatio = Number(ratio.toFixed(2));

  const passAaNormal = ratio >= 4.5;
  const passAaLarge = ratio >= 3.0;
  const passAaaNormal = ratio >= 7.0;
  const passAaaLarge = ratio >= 4.5;

  return {
    success: true,
    ratio: roundedRatio,
    formatted: `${roundedRatio}:1 Ratio`,
    breakdown: {
      "Contrast Ratio": `${roundedRatio}:1`,
      "WCAG AA Normal Text (≥ 4.5:1)": passAaNormal ? "PASS ✓" : "FAIL ✗",
      "WCAG AA Large Text (≥ 3.0:1)": passAaLarge ? "PASS ✓" : "FAIL ✗",
      "WCAG AAA Normal Text (≥ 7.0:1)": passAaaNormal ? "PASS ✓" : "FAIL ✗",
      "WCAG AAA Large Text (≥ 4.5:1)": passAaaLarge ? "PASS ✓" : "FAIL ✗",
      "Overall Verdict": passAaaNormal ? "WCAG AAA Compliant (Exceptional)" : passAaNormal ? "WCAG AA Compliant (Standard)" : "Non-Compliant Contrast",
    },
  };
}

export function checkImageAltAttributes(html: string): A11yEngineResult {
  if (!html.trim()) return { success: true, formatted: "No HTML input" };

  const imgTags = html.match(/<img[^>]*>/gi) || [];
  let missingAlt = 0;
  let emptyAlt = 0;
  let validAlt = 0;

  imgTags.forEach((tag) => {
    if (!tag.toLowerCase().includes("alt=")) {
      missingAlt++;
    } else if (tag.includes('alt=""') || tag.includes("alt=''")) {
      emptyAlt++;
    } else {
      validAlt++;
    }
  });

  const isCompliant = missingAlt === 0;

  return {
    success: isCompliant,
    formatted: `${imgTags.length} Image(s) Scanned: ${validAlt} Valid, ${missingAlt} Missing Alt`,
    breakdown: {
      "Total Images Found": imgTags.length,
      "Images with Descriptive Alt Text": `${validAlt} ✓`,
      "Images with Decorative Alt (alt='')": `${emptyAlt} (Acceptable if decorative)`,
      "Images MISSING Alt Attribute": `${missingAlt} ${missingAlt > 0 ? "✗ (WCAG 1.1.1 Violation)" : "✓"}`,
      "Compliance Status": isCompliant ? "PASS ✓" : "FAIL (Missing Alt Attributes)",
    },
  };
}

export function validateAriaAttributes(html: string): A11yEngineResult {
  if (!html.trim()) return { success: true, formatted: "No HTML provided" };

  const roles = html.match(/role=["']([^"']*)["']/gi) || [];
  const ariaLabels = html.match(/aria-label=["']([^"']*)["']/gi) || [];
  const ariaExpanded = html.match(/aria-expanded=["']([^"']*)["']/gi) || [];
  const ariaHidden = html.match(/aria-hidden=["']([^"']*)["']/gi) || [];

  return {
    success: true,
    formatted: `WAI-ARIA Attributes: ${roles.length} Roles, ${ariaLabels.length} Labels, ${ariaExpanded.length} State Flags`,
    breakdown: {
      "Explicit ARIA Roles": roles.length,
      "aria-label Directives": ariaLabels.length,
      "aria-expanded State Attributes": ariaExpanded.length,
      "aria-hidden Obscured Elements": ariaHidden.length,
      "ARIA Standard": "W3C WAI-ARIA 1.2 Specification",
    },
  };
}

export function checkTouchTargetSize(widthPx: number, heightPx: number): A11yEngineResult {
  const minWcag = 44; // WCAG 2.5.5 Level AAA
  const minGoogle = 48; // Google Material Design Guidelines

  const passWcag = widthPx >= minWcag && heightPx >= minWcag;
  const passGoogle = widthPx >= minGoogle && heightPx >= minGoogle;

  return {
    success: passWcag,
    formatted: `${widthPx} × ${heightPx} px (${passWcag ? "Compliant Touch Target ✓" : "Too Small for Touch Screen ⚠️"})`,
    breakdown: {
      "Element Dimensions": `${widthPx} × ${heightPx} px`,
      "WCAG 2.5.5 AAA Target (≥ 44×44px)": passWcag ? "PASS ✓" : "FAIL (Under 44px)",
      "Apple HIG Standard (≥ 44×44px)": passWcag ? "PASS ✓" : "FAIL (Under 44px)",
      "Google Material Standard (≥ 48×48px)": passGoogle ? "PASS ✓" : "Marginal (Under 48px)",
      "Touch Screen Usability": passWcag ? "Comfortable tap target for all finger sizes" : "High risk of accidental mis-taps on mobile devices",
    },
  };
}

export function checkFormLabels(html: string): A11yEngineResult {
  if (!html.trim()) return { success: true, formatted: "No HTML input" };

  const inputs = html.match(/<(input|select|textarea)[^>]*>/gi) || [];
  let labeled = 0;
  let unlabeled = 0;

  inputs.forEach((tag) => {
    if (tag.includes("id=") || tag.includes("aria-label=") || tag.includes("aria-labelledby=")) {
      labeled++;
    } else {
      unlabeled++;
    }
  });

  return {
    success: unlabeled === 0,
    formatted: `${inputs.length} Form Control(s): ${labeled} Labeled, ${unlabeled} Unlabeled`,
    breakdown: {
      "Total Form Controls": inputs.length,
      "Properly Labeled Fields": labeled,
      "Unlabeled / Inaccessible Fields": `${unlabeled} ${unlabeled > 0 ? "✗ (WCAG 3.3.2 Issue)" : "✓"}`,
      "Best Practice": "Every input must have an associated <label for='...'> or aria-label",
    },
  };
}
