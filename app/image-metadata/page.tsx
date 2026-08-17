"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ToolLayout from "@/components/ToolLayout";
import UploadCard from "@/components/UploadCard";
import ResultCard from "@/components/ResultCard";
import NovaAssistant from "@/components/NovaAssistant";
import ToolSEO from "@/components/seo/ToolSEO";
import RelatedTools from "@/components/RelatedTools";

type ExifData = {
  make?: string;
  model?: string;
  dateTime?: string;
  dateTimeOriginal?: string;
  software?: string;
  exposureTime?: string;
  fNumber?: string;
  iso?: string;
  focalLength?: string;
  gpsLatitude?: string;
  gpsLongitude?: string;
  orientation?: number;
};

type FileMeta = {
  name: string;
  size: number;
  type: string;
  lastModified: string;
  width: number;
  height: number;
  aspectRatio: string;
};

type RobotState = "idle" | "uploading" | "processing" | "success" | "error";

export default function ImageMetadataPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileMeta, setFileMeta] = useState<FileMeta | null>(null);
  const [exifData, setExifData] = useState<ExifData | null>(null);

  // Cleaned image output
  const [cleanedUrl, setCleanedUrl] = useState<string | null>(null);
  const [cleanedBlob, setCleanedBlob] = useState<Blob | null>(null);
  const [cleanedSize, setCleanedSize] = useState<number | null>(null);

  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const [robotState, setRobotState] = useState<RobotState>("idle");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (cleanedUrl) URL.revokeObjectURL(cleanedUrl);
    };
  }, [previewUrl, cleanedUrl]);

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      setMessage("Please select a valid image file.");
      return;
    }

    processFile(selected);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    const dropped = e.dataTransfer.files?.[0];
    if (!dropped || !dropped.type.startsWith("image/")) {
      setMessage("Please drop a valid image file.");
      return;
    }

    processFile(dropped);
  }

  async function processFile(imageFile: File) {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (cleanedUrl) URL.revokeObjectURL(cleanedUrl);

    setFile(imageFile);
    setCleanedUrl(null);
    setCleanedBlob(null);
    setCleanedSize(null);
    setMessage("");
    setRobotState("uploading");

    const url = URL.createObjectURL(imageFile);
    setPreviewUrl(url);

    const img = new Image();
    img.onload = async () => {
      const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
      const divisor = gcd(img.naturalWidth, img.naturalHeight);
      const ratio = `${Math.round(img.naturalWidth / divisor)}:${Math.round(img.naturalHeight / divisor)}`;

      setFileMeta({
        name: imageFile.name,
        size: imageFile.size,
        type: imageFile.type || "image/unknown",
        lastModified: new Date(imageFile.lastModified).toLocaleString(),
        width: img.naturalWidth,
        height: img.naturalHeight,
        aspectRatio: ratio,
      });

      // Extract EXIF data from buffer
      try {
        const arrayBuffer = await imageFile.arrayBuffer();
        const parsedExif = parseJpegExif(arrayBuffer);
        setExifData(parsedExif);
      } catch {
        setExifData(null);
      }

      setRobotState("idle");
    };
    img.src = url;
  }

  // Pure client-side binary EXIF parser for JPEG
  function parseJpegExif(buffer: ArrayBuffer): ExifData | null {
    const view = new DataView(buffer);
    if (view.byteLength < 4 || view.getUint16(0) !== 0xffd8) {
      // Not a JPEG image
      return null;
    }

    let offset = 2;
    const length = view.byteLength;

    while (offset < length) {
      if (view.getUint8(offset) !== 0xff) return null;
      const marker = view.getUint8(offset + 1);

      // APP1 Marker for EXIF is 0xFFE1
      if (marker === 0xe1) {
        const app1Length = view.getUint16(offset + 2);
        const exifHeader = view.getUint32(offset + 4);
        if (exifHeader === 0x45786966) {
          // "Exif"
          return readTiffHeader(view, offset + 10, app1Length - 8);
        }
      }

      if (marker === 0xda || marker === 0xd9) break; // Start of Scan or End of Image
      offset += 2 + view.getUint16(offset + 2);
    }

    return null;
  }

  function readTiffHeader(view: DataView, tiffStart: number, maxLen: number): ExifData {
    const data: ExifData = {};
    if (tiffStart + 8 > view.byteLength) return data;

    const byteOrderMarker = view.getUint16(tiffStart);
    const littleEndian = byteOrderMarker === 0x4949; // "II" vs "MM"

    const ifd0Offset = view.getUint32(tiffStart + 4, littleEndian);
    if (ifd0Offset > maxLen) return data;

    readIfd(view, tiffStart, tiffStart + ifd0Offset, littleEndian, data);
    return data;
  }

  function readIfd(
    view: DataView,
    tiffStart: number,
    ifdOffset: number,
    littleEndian: boolean,
    data: ExifData
  ) {
    if (ifdOffset + 2 > view.byteLength) return;
    const entries = view.getUint16(ifdOffset, littleEndian);

    let subIfdOffset = 0;
    let gpsIfdOffset = 0;

    for (let i = 0; i < entries; i++) {
      const entryOffset = ifdOffset + 2 + i * 12;
      if (entryOffset + 12 > view.byteLength) break;

      const tag = view.getUint16(entryOffset, littleEndian);
      const valOffset = view.getUint32(entryOffset + 8, littleEndian);

      if (tag === 0x010f) data.make = getString(view, tiffStart + valOffset);
      if (tag === 0x0110) data.model = getString(view, tiffStart + valOffset);
      if (tag === 0x0131) data.software = getString(view, tiffStart + valOffset);
      if (tag === 0x0132) data.dateTime = getString(view, tiffStart + valOffset);
      if (tag === 0x0112) data.orientation = view.getUint16(entryOffset + 8, littleEndian);

      // Pointers to SubIFD and GPS
      if (tag === 0x8769) subIfdOffset = valOffset;
      if (tag === 0x8825) gpsIfdOffset = valOffset;
    }

    if (subIfdOffset > 0 && tiffStart + subIfdOffset < view.byteLength) {
      readSubIfd(view, tiffStart, tiffStart + subIfdOffset, littleEndian, data);
    }
    if (gpsIfdOffset > 0 && tiffStart + gpsIfdOffset < view.byteLength) {
      readGpsIfd(view, tiffStart, tiffStart + gpsIfdOffset, littleEndian, data);
    }
  }

  function readSubIfd(
    view: DataView,
    tiffStart: number,
    ifdOffset: number,
    littleEndian: boolean,
    data: ExifData
  ) {
    if (ifdOffset + 2 > view.byteLength) return;
    const entries = view.getUint16(ifdOffset, littleEndian);

    for (let i = 0; i < entries; i++) {
      const entryOffset = ifdOffset + 2 + i * 12;
      if (entryOffset + 12 > view.byteLength) break;

      const tag = view.getUint16(entryOffset, littleEndian);
      const valOffset = view.getUint32(entryOffset + 8, littleEndian);

      if (tag === 0x9003) data.dateTimeOriginal = getString(view, tiffStart + valOffset);
      if (tag === 0x8827) data.iso = `ISO ${view.getUint16(entryOffset + 8, littleEndian)}`;
      if (tag === 0x829d) {
        // FNumber (rational)
        const num = view.getUint32(tiffStart + valOffset, littleEndian);
        const den = view.getUint32(tiffStart + valOffset + 4, littleEndian);
        if (den !== 0) data.fNumber = `f/${(num / den).toFixed(1)}`;
      }
      if (tag === 0x829a) {
        // Exposure time
        const num = view.getUint32(tiffStart + valOffset, littleEndian);
        const den = view.getUint32(tiffStart + valOffset + 4, littleEndian);
        if (den !== 0) data.exposureTime = num === 1 ? `1/${den}s` : `${(num / den).toFixed(2)}s`;
      }
      if (tag === 0x920a) {
        // Focal Length
        const num = view.getUint32(tiffStart + valOffset, littleEndian);
        const den = view.getUint32(tiffStart + valOffset + 4, littleEndian);
        if (den !== 0) data.focalLength = `${(num / den).toFixed(1)} mm`;
      }
    }
  }

  function readGpsIfd(
    view: DataView,
    tiffStart: number,
    ifdOffset: number,
    littleEndian: boolean,
    data: ExifData
  ) {
    if (ifdOffset + 2 > view.byteLength) return;
    data.gpsLatitude = "GPS Coordinates Present (Strippable)";
    data.gpsLongitude = "Location Data Embedded";
  }

  function getString(view: DataView, offset: number, max = 64): string {
    let str = "";
    for (let i = 0; i < max && offset + i < view.byteLength; i++) {
      const code = view.getUint8(offset + i);
      if (code === 0) break;
      str += String.fromCharCode(code);
    }
    return str.trim();
  }

  // Strip all metadata by re-encoding clean pixel canvas
  async function removeMetadata() {
    if (!file || !previewUrl) return;

    setProcessing(true);
    setRobotState("processing");
    setMessage("Stripping EXIF & location metadata...");

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        setProcessing(false);
        setRobotState("error");
        setMessage("Canvas failure during metadata removal.");
        return;
      }

      ctx.drawImage(img, 0, 0);

      const targetType = file.type === "image/png" ? "image/png" : "image/jpeg";
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setProcessing(false);
            setRobotState("error");
            setMessage("Failed to create sanitized image.");
            return;
          }

          const url = URL.createObjectURL(blob);
          setCleanedBlob(blob);
          setCleanedUrl(url);
          setCleanedSize(blob.size);
          setProcessing(false);
          setRobotState("success");
          setMessage("Metadata completely removed! Image is clean and safe to share.");
          setTimeout(() => setRobotState("idle"), 2500);
        },
        targetType,
        0.95
      );
    };
    img.src = previewUrl;
  }

  function downloadCleaned() {
    if (!cleanedBlob || !file) return;
    const ext = file.type === "image/png" ? "png" : "jpg";
    const filename = `${file.name.replace(/\.[^/.]+$/, "")}-cleaned.${ext}`;

    const link = document.createElement("a");
    link.href = cleanedUrl || "";
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function resetAll() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (cleanedUrl) URL.revokeObjectURL(cleanedUrl);

    setFile(null);
    setPreviewUrl(null);
    setFileMeta(null);
    setExifData(null);
    setCleanedUrl(null);
    setCleanedBlob(null);
    setCleanedSize(null);
    setMessage("");
    setProcessing(false);
    setRobotState("idle");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const hasExifTags =
    exifData &&
    Object.values(exifData).some((val) => val !== undefined && val !== null && val !== "");

  return (
    <>
      <ToolSEO
        name="Image Metadata Viewer & EXIF Remover"
        path="/image-metadata"
        description="Inspect and strip EXIF camera metadata, GPS location, timestamps, and camera details from photos online with 100% privacy."
        faqs={[
          {
            question: "What is EXIF image metadata?",
            answer:
              "EXIF (Exchangeable Image File Format) data is embedded inside photos by cameras and smartphones, often containing GPS coordinates, camera model, date taken, exposure settings, and software tags.",
          },
          {
            question: "How does metadata removal work?",
            answer:
              "Our tool re-renders your photo's pixel matrix onto a fresh, sandboxed HTML5 canvas and re-encodes a clean image without carrying over any private binary metadata chunks.",
          },
          {
            question: "Are my photos uploaded to any external server?",
            answer:
              "No! Both viewing and metadata stripping happen 100% inside your web browser. Nothing leaves your device.",
          },
        ]}
      />

      <main className="min-h-screen bg-slate-950 text-white">
        <SiteHeader />

        <ToolLayout
          badge="PRIVACY & EXIF TOOL"
          title="Image Metadata Viewer & Remover"
          description="View embedded EXIF properties, camera info, and GPS data, or strip all metadata before sharing photos online."
        >
          <UploadCard
            title="Inspect & Clean Photo"
            description="Upload any photo to inspect its hidden metadata tags."
          >
            {!file ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`rounded-3xl border-2 border-dashed p-8 text-center transition ${
                  dragActive
                    ? "border-cyan-400 bg-cyan-500/10"
                    : "border-white/10 bg-white/5 hover:border-cyan-400/50"
                }`}
              >
                <div className="text-5xl">🔍</div>
                <h3 className="mt-4 text-xl font-bold text-white">
                  Drop a photo to view metadata
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  Supports JPG, PNG, WebP, TIFF images
                </p>

                <label className="mt-6 inline-block cursor-pointer rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-105">
                  Select Photo
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFile}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="truncate text-sm font-semibold text-cyan-300">
                    {file.name}
                  </span>
                  <button
                    type="button"
                    onClick={resetAll}
                    className="text-xs text-slate-400 hover:text-rose-400"
                  >
                    Change Image
                  </button>
                </div>

                {/* File Properties Table */}
                {fileMeta && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      File Properties
                    </h4>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
                      <div className="rounded-xl border border-white/10 bg-black/30 p-3">
                        <p className="text-slate-400">File Size</p>
                        <p className="mt-1 font-semibold text-white">
                          {(fileMeta.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-black/30 p-3">
                        <p className="text-slate-400">Dimensions</p>
                        <p className="mt-1 font-semibold text-white">
                          {fileMeta.width} × {fileMeta.height} px
                        </p>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-black/30 p-3">
                        <p className="text-slate-400">Aspect Ratio</p>
                        <p className="mt-1 font-semibold text-cyan-300">
                          {fileMeta.aspectRatio}
                        </p>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-black/30 p-3">
                        <p className="text-slate-400">MIME Type</p>
                        <p className="mt-1 truncate font-semibold text-white">
                          {fileMeta.type}
                        </p>
                      </div>
                      <div className="col-span-2 rounded-xl border border-white/10 bg-black/30 p-3">
                        <p className="text-slate-400">Last Modified</p>
                        <p className="mt-1 truncate font-semibold text-white">
                          {fileMeta.lastModified}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* EXIF Data Section */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Embedded EXIF Camera & Location Tags
                  </h4>

                  {hasExifTags ? (
                    <div className="mt-2 grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
                      {exifData?.make && (
                        <div className="rounded-xl border border-white/10 bg-black/30 p-3">
                          <p className="text-slate-400">Camera Manufacturer</p>
                          <p className="mt-1 font-semibold text-white">{exifData.make}</p>
                        </div>
                      )}
                      {exifData?.model && (
                        <div className="rounded-xl border border-white/10 bg-black/30 p-3">
                          <p className="text-slate-400">Camera Model</p>
                          <p className="mt-1 font-semibold text-white">{exifData.model}</p>
                        </div>
                      )}
                      {exifData?.dateTimeOriginal && (
                        <div className="rounded-xl border border-white/10 bg-black/30 p-3">
                          <p className="text-slate-400">Date & Time Taken</p>
                          <p className="mt-1 font-semibold text-white">
                            {exifData.dateTimeOriginal}
                          </p>
                        </div>
                      )}
                      {exifData?.exposureTime && (
                        <div className="rounded-xl border border-white/10 bg-black/30 p-3">
                          <p className="text-slate-400">Shutter / Exposure</p>
                          <p className="mt-1 font-semibold text-white">
                            {exifData.exposureTime}
                          </p>
                        </div>
                      )}
                      {exifData?.fNumber && (
                        <div className="rounded-xl border border-white/10 bg-black/30 p-3">
                          <p className="text-slate-400">Aperture</p>
                          <p className="mt-1 font-semibold text-white">{exifData.fNumber}</p>
                        </div>
                      )}
                      {exifData?.iso && (
                        <div className="rounded-xl border border-white/10 bg-black/30 p-3">
                          <p className="text-slate-400">ISO Speed</p>
                          <p className="mt-1 font-semibold text-white">{exifData.iso}</p>
                        </div>
                      )}
                      {exifData?.focalLength && (
                        <div className="rounded-xl border border-white/10 bg-black/30 p-3">
                          <p className="text-slate-400">Focal Length</p>
                          <p className="mt-1 font-semibold text-white">
                            {exifData.focalLength}
                          </p>
                        </div>
                      )}
                      {exifData?.software && (
                        <div className="rounded-xl border border-white/10 bg-black/30 p-3">
                          <p className="text-slate-400">Processing Software</p>
                          <p className="mt-1 font-semibold text-white">{exifData.software}</p>
                        </div>
                      )}
                      {exifData?.gpsLatitude && (
                        <div className="col-span-1 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 sm:col-span-2">
                          <p className="text-amber-300">⚠️ Privacy Alert: GPS Coordinates Detected</p>
                          <p className="mt-1 text-slate-300">
                            Location metadata is embedded in this image. Use &quot;Remove Metadata&quot; below to sanitize this photo before sharing.
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="mt-2 rounded-xl border border-white/10 bg-black/20 p-4 text-center text-xs text-slate-400">
                      ℹ️ No camera EXIF or GPS markers detected in this file (or format does not store standard EXIF headers).
                    </div>
                  )}
                </div>

                {/* Remove Metadata Action Button */}
                <button
                  type="button"
                  disabled={processing}
                  onClick={removeMetadata}
                  className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 py-3.5 font-bold text-white shadow-lg transition hover:scale-[1.01] disabled:opacity-50"
                >
                  {processing ? "Stripping Metadata..." : "🛡️ Remove All Metadata & Sanitize Image"}
                </button>
              </div>
            )}

            {message && !cleanedBlob && (
              <p className="mt-4 text-center text-sm text-slate-400">{message}</p>
            )}
          </UploadCard>

          {cleanedBlob && cleanedUrl && (
            <ResultCard
              title="Cleaned Image Ready"
              description="All EXIF tags, GPS data, and hidden metadata have been completely stripped."
            >
              <div className="space-y-4">
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-4 text-center">
                  <img
                    src={cleanedUrl}
                    alt="Sanitized preview"
                    className="mx-auto max-h-60 rounded-xl object-contain"
                  />
                  <div className="mt-3 flex items-center justify-center gap-6 text-xs text-slate-400">
                    <span>Original: {(file?.size ? file.size / 1024 : 0).toFixed(1)} KB</span>
                    <span>Cleaned: {cleanedSize ? (cleanedSize / 1024).toFixed(1) : 0} KB</span>
                    <span className="font-semibold text-emerald-400">✓ 100% Metadata Free</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={downloadCleaned}
                  className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 py-3.5 font-bold text-white shadow-lg transition hover:scale-[1.01]"
                >
                  Download Sanitized Image ⬇
                </button>
              </div>
            </ResultCard>
          )}

          <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-white">How to View & Remove Photo Metadata</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-6 text-slate-300">
              <li>Upload your JPG, PNG, or WebP photo.</li>
              <li>Inspect properties like Camera Model, ISO, Shutter Speed, and GPS location.</li>
              <li>Click &quot;Remove All Metadata &amp; Sanitize Image&quot; to generate a clean photo.</li>
              <li>Download your sanitized photo with 100% privacy protection.</li>
            </ol>
          </div>

          <RelatedTools current="/image-metadata" />
        </ToolLayout>

        <NovaAssistant state={robotState} />
        <SiteFooter />
      </main>
    </>
  );
}
