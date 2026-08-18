export interface ImageEngineResult {
  success: boolean;
  output: string;
  breakdown?: Record<string, string | number>;
  error?: string;
  palette?: string[];
}

export function calculatePrintDimensions(widthPx: number, heightPx: number, dpi: number = 300): ImageEngineResult {
  if (widthPx <= 0 || heightPx <= 0 || dpi <= 0) {
    return { success: false, output: "", error: "Dimensions and DPI must be positive numbers." };
  }

  const widthInches = (widthPx / dpi).toFixed(2);
  const heightInches = (heightPx / dpi).toFixed(2);
  const widthCm = ((widthPx / dpi) * 2.54).toFixed(2);
  const heightCm = ((heightPx / dpi) * 2.54).toFixed(2);
  const megapixels = ((widthPx * heightPx) / 1000000).toFixed(2);

  const printQuality = dpi >= 300 ? "High Quality (Professional Print / Photo)" : dpi >= 150 ? "Standard Quality (Brochure / Magazine)" : "Screen Resolution (Web / Monitor)";

  return {
    success: true,
    output: `Print Size at ${dpi} DPI:\n${widthInches}" × ${heightInches}" (${widthCm} cm × ${heightCm} cm)`,
    breakdown: {
      "Pixel Resolution": `${widthPx} × ${heightPx} px (${megapixels} MP)`,
      "Print Dimensions (Inches)": `${widthInches} × ${heightInches} in`,
      "Print Dimensions (CM)": `${widthCm} × ${heightCm} cm`,
      "DPI Density": `${dpi} DPI`,
      "Print Rating": printQuality,
    },
  };
}

export function calculateSocialMediaPresets(width: number, height: number): ImageEngineResult {
  const currentRatio = (width / height).toFixed(2);



  return {
    success: true,
    output: `Current Dimensions: ${width} × ${height} px (Ratio: ${currentRatio}:1)`,
    breakdown: {
      "Current Dimensions": `${width} × ${height} px`,
      "Current Aspect Ratio": `${currentRatio}:1`,
      "Standard Preset 1": "Instagram Square (1080×1080, 1:1)",
      "Standard Preset 2": "Story / Reels (1080×1920, 9:16)",
      "Standard Preset 3": "YouTube Thumbnail (1280×720, 16:9)",
      "Standard Preset 4": "OpenGraph Share (1200×630, 1.91:1)",
    },
  };
}
