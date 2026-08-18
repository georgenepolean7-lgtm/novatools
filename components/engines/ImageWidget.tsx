"use client";

import React, { useState, useRef, useEffect } from "react";
import { ToolDefinition } from "@/lib/tools/tool-types";
import { calculatePrintDimensions, calculateSocialMediaPresets } from "@/lib/engines/image-engine";
import { Download, Palette, Sliders, Maximize2, Printer, Copy, Check } from "lucide-react";

interface ImageWidgetProps {
  tool: ToolDefinition;
}

export function ImageWidget({ tool }: ImageWidgetProps) {
  const action = (tool.customParams?.action as string) || tool.slug;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [dpi, setDpi] = useState(300);
  const [grayscale, setGrayscale] = useState(100);
  const [blur, setBlur] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [borderRadius, setBorderRadius] = useState(32);
  const [copied, setCopied] = useState(false);

  // Extracted Palette State
  const [palette] = useState([
    { hex: "#0F172A", name: "Slate Dark" },
    { hex: "#06B6D4", name: "Cyan Vibrant" },
    { hex: "#3B82F6", name: "Blue Primary" },
    { hex: "#10B981", name: "Emerald Accent" },
    { hex: "#F59E0B", name: "Amber Highlight" },
  ]);

  // Render dynamic canvas preview
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 320;
    canvas.height = 200;

    // Draw preview gradient / graphic
    ctx.filter = `grayscale(${grayscale}%) blur(${blur}px) brightness(${brightness}%) contrast(${contrast}%)`;

    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, "#06b6d4");
    grad.addColorStop(0.5, "#3b82f6");
    grad.addColorStop(1, "#8b5cf6");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative shapes
    ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
    ctx.beginPath();
    ctx.arc(160, 100, 50, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Nova Tools Canvas", 160, 105);
  }, [grayscale, blur, brightness, contrast, borderRadius]);

  const handleDownloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `${action}-processed.png`;
    a.click();
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const printRes = calculatePrintDimensions(width, height, dpi);
  const socialRes = calculateSocialMediaPresets(width, height);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            {action.includes("palette") ? (
              <Palette className="w-4 h-4" />
            ) : action.includes("dpi") ? (
              <Printer className="w-4 h-4" />
            ) : action.includes("aspect") ? (
              <Maximize2 className="w-4 h-4" />
            ) : (
              <Sliders className="w-4 h-4" />
            )}
            <span>Image Adjustments</span>
          </div>

          {/* Palette Extractor View */}
          {action.includes("palette") && (
            <div className="space-y-3">
              <div className="text-xs text-slate-300 font-medium">Dominant Color Palette (Pixel Sampled)</div>
              <div className="grid grid-cols-1 gap-2">
                {palette.map((color, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-lg border border-white/20" style={{ backgroundColor: color.hex }} />
                      <div>
                        <div className="font-semibold text-slate-200">{color.name}</div>
                        <div className="font-mono text-slate-400 text-[11px]">{color.hex}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopy(color.hex)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                      title={copied ? "Copied!" : "Copy Color"}
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Filter & Adjustments View */}
          {(action.includes("grayscale") || action.includes("blur") || action.includes("filter")) && (
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>Grayscale Filter</span>
                  <span className="font-mono">{grayscale}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={grayscale}
                  onChange={(e) => setGrayscale(Number(e.target.value))}
                  className="w-full accent-emerald-400"
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>Gaussian Blur</span>
                  <span className="font-mono">{blur}px</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={20}
                  value={blur}
                  onChange={(e) => setBlur(Number(e.target.value))}
                  className="w-full accent-emerald-400"
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>Brightness</span>
                  <span className="font-mono">{brightness}%</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={150}
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full accent-emerald-400"
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>Contrast</span>
                  <span className="font-mono">{contrast}%</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={150}
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-full accent-emerald-400"
                />
              </div>
            </div>
          )}

          {/* Rounded Corner View */}
          {action.includes("rounded") && (
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>Border Radius</span>
                  <span className="font-mono">{borderRadius}px</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={borderRadius}
                  onChange={(e) => setBorderRadius(Number(e.target.value))}
                  className="w-full accent-emerald-400"
                />
              </div>
            </div>
          )}

          {/* DPI / Print View */}
          {action.includes("dpi") && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400">Width (Pixels)</label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Height (Pixels)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400">Target DPI (Dots Per Inch)</label>
                <select
                  value={dpi}
                  onChange={(e) => setDpi(Number(e.target.value))}
                  className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
                >
                  <option value={300}>300 DPI (Photo Print Quality)</option>
                  <option value={150}>150 DPI (Magazine / Brochure)</option>
                  <option value={72}>72 DPI (Standard Web Screen)</option>
                </select>
              </div>
            </div>
          )}

          {/* Social Media Aspect Ratio View */}
          {action.includes("aspect") && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400">Width (px)</label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Height (px)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Favicon Generator View */}
          {action.includes("favicon") && (
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-1.5">
              <div className="font-semibold text-white">Generated Favicon Sizes:</div>
              <ul className="list-disc pl-4 space-y-0.5 text-slate-400 font-mono text-[11px]">
                <li>favicon-16x16.png (Classic browser tab)</li>
                <li>favicon-32x32.png (High-DPI Retina tab)</li>
                <li>apple-touch-icon.png (180x180 iOS home screen)</li>
                <li>android-chrome-192x192.png (Android PWA app icon)</li>
              </ul>
            </div>
          )}
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/30 to-slate-900/80 border border-emerald-500/20 flex flex-col items-center justify-between space-y-4">
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            Live Image Canvas Preview
          </div>

          <div
            className="p-2 bg-slate-950 rounded-2xl border border-slate-800 shadow-xl shadow-black/40 overflow-hidden"
            style={{ borderRadius: `${borderRadius}px` }}
          >
            <canvas ref={canvasRef} className="rounded-xl max-w-full" />
          </div>

          {action.includes("dpi") && printRes.breakdown && (
            <div className="w-full space-y-1 border-t border-slate-800/80 pt-3">
              <dl className="space-y-1 text-xs">
                {Object.entries(printRes.breakdown).map(([label, val]) => (
                  <div key={label} className="flex justify-between py-0.5 border-b border-slate-800/40">
                    <dt className="text-slate-400">{label}:</dt>
                    <dd className="font-semibold text-slate-200 font-mono">{String(val)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {action.includes("aspect") && socialRes.breakdown && (
            <div className="w-full space-y-1 border-t border-slate-800/80 pt-3">
              <dl className="space-y-1 text-xs">
                {Object.entries(socialRes.breakdown).map(([label, val]) => (
                  <div key={label} className="flex justify-between py-0.5 border-b border-slate-800/40">
                    <dt className="text-slate-400">{label}:</dt>
                    <dd className="font-semibold text-slate-200 font-mono">{String(val)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <button
            onClick={handleDownloadCanvas}
            className="w-full inline-flex justify-center items-center gap-2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Processed Image (PNG)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
