"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { createWorker } from "tesseract.js";

import ToolSEO from "@/components/seo/ToolSEO";
import RelatedTools from "@/components/RelatedTools";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ToolLayout from "@/components/ToolLayout";
import UploadCard from "@/components/UploadCard";
import ResultCard from "@/components/ResultCard";
import NovaAssistant from "@/components/NovaAssistant";
import jsPDF from "jspdf";

import { tamilCorrections } from "@/lib/tamilDictionary";

export default function TamilImageToTextPage() {

  const [file, setFile] = useState<File | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [text, setText] = useState("");

  const [processing, setProcessing] = useState(false);

  const [progress, setProgress] = useState(0);

  const [message, setMessage] = useState("");

  const [dragActive, setDragActive] = useState(false);

  const [robotState, setRobotState] = useState<
    "idle" |
    "uploading" |
    "processing" |
    "success" |
    "error"
  >("idle");

const [imageQuality, setImageQuality] = useState<
  "Excellent" |
  "Good" |
  "Poor" |
  ""
>("");

const [ocrConfidence, setOcrConfidence] = useState(0);

const [processingTime, setProcessingTime] = useState(0);

const [startTime, setStartTime] = useState(0);


const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);



  function handleFile(
  event: ChangeEvent<HTMLInputElement>
) {

  const selectedFile =
    event.target.files?.[0];

  if (!selectedFile) return;

  processFile(selectedFile);

}
function processFile(selectedFile: File) {

  if (!selectedFile.type.startsWith("image/")) {
    setMessage("Please select a valid image.");
    return;
  }

  if (previewUrl) {
    URL.revokeObjectURL(previewUrl);
  }

  const url = URL.createObjectURL(selectedFile);

  setFile(selectedFile);
  setPreviewUrl(url);
const image = new Image();

image.onload = () => {

  const pixels =
    image.naturalWidth *
    image.naturalHeight;

  if (pixels >= 3000000) {

    setImageQuality("Excellent");

  } else if (pixels >= 1000000) {

    setImageQuality("Good");

  } else {

    setImageQuality("Poor");

  }

};

image.src = url;

  setText("");
  setProgress(0);
  setMessage("");

  setRobotState("uploading");

  setTimeout(() => {
    setRobotState("idle");
  }, 1000);

}

    function clamp(value: number) {

    return Math.max(
      0,
      Math.min(255, value)
    );

  }

  async function preprocessImage(
    file: File
  ): Promise<Blob> {

    const imageUrl =
      URL.createObjectURL(file);

    const image = new Image();

    await new Promise<void>((resolve, reject) => {

      image.onload = () => resolve();

      image.onerror = () =>
        reject(
          new Error("Image load failed.")
        );

      image.src = imageUrl;

    });

    const longestSide = Math.max(
      image.naturalWidth,
      image.naturalHeight
    );

    let scale = 2;

    if (longestSide < 1000) {

      scale = 4;

    } else if (longestSide < 2000) {

      scale = 3;

    }

    const canvas =
      document.createElement("canvas");

    const context =
      canvas.getContext("2d", {
        willReadFrequently: true,
      });

    if (!context) {

      URL.revokeObjectURL(imageUrl);

      throw new Error(
        "Canvas unavailable."
      );

    }

    canvas.width =
      image.naturalWidth * scale;

    canvas.height =
      image.naturalHeight * scale;

    context.imageSmoothingEnabled = true;

    context.imageSmoothingQuality = "high";

    context.filter =
      "contrast(140%) brightness(108%) saturate(0%)";

    context.drawImage(
      image,
      0,
      0,
      canvas.width,
      canvas.height
    );

const marginX = Math.floor(canvas.width * 0.08);
const marginTop = Math.floor(canvas.height * 0.12);
const marginBottom = Math.floor(canvas.height * 0.10);

context.fillStyle = "#ffffff";

// Left decorative border
context.fillRect(
  0,
  0,
  marginX,
  canvas.height
);

// Top decoration
context.fillRect(
  0,
  0,
  canvas.width,
  marginTop
);

// Bottom barcode/logo area
context.fillRect(
  0,
  canvas.height - marginBottom,
  canvas.width,
  marginBottom
);

const cropX = Math.floor(canvas.width * 0.08);
const cropY = Math.floor(canvas.height * 0.10);

const cropWidth = Math.floor(canvas.width * 0.84);
const cropHeight = Math.floor(canvas.height * 0.80);

const croppedCanvas =
  document.createElement("canvas");

croppedCanvas.width = cropWidth;
croppedCanvas.height = cropHeight;

const croppedContext =
  croppedCanvas.getContext("2d");

if (!croppedContext) {
  throw new Error("Canvas unavailable.");
}

croppedContext.drawImage(
  canvas,
  cropX,
  cropY,
  cropWidth,
  cropHeight,
  0,
  0,
  cropWidth,
  cropHeight
);

canvas.width = cropWidth;
canvas.height = cropHeight;

context.drawImage(
  croppedCanvas,
  0,
  0
);
    const imageData =
      context.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      );

    const data = imageData.data;

    for (
      let i = 0;
      i < data.length;
      i += 4
    ) {

      const red = data[i];

      const green = data[i + 1];

      const blue = data[i + 2];

      const luminance =
        red * 0.299 +
        green * 0.587 +
        blue * 0.114;

      let gray =
        (luminance - 128) * 1.8 + 128;

      if (gray > 190) {

        gray = 255;

      } else if (gray < 95) {

        gray = 0;

      } else {

        gray =
          gray > 145
            ? 255
            : 0;

      }

      gray = clamp(gray);

      data[i] = gray;

      data[i + 1] = gray;

      data[i + 2] = gray;

    }

    context.putImageData(
      imageData,
      0,
      0
    );

const sharpenData = context.getImageData(
  0,
  0,
  canvas.width,
  canvas.height
);

const pixels = sharpenData.data;

for (
  let i = 0;
  i < pixels.length;
  i += 4
) {

  const value = pixels[i];

  const sharpened =
    value > 128
      ? Math.min(255, value + 15)
      : Math.max(0, value - 15);

  pixels[i] = sharpened;
  pixels[i + 1] = sharpened;
  pixels[i + 2] = sharpened;

}

context.putImageData(
  sharpenData,
  0,
  0
);

const noiseData = context.getImageData(
  0,
  0,
  canvas.width,
  canvas.height
);

const noisePixels = noiseData.data;

for (
  let i = 0;
  i < noisePixels.length;
  i += 4
) {

  const gray = noisePixels[i];

  if (gray > 240) {

    noisePixels[i] = 255;
    noisePixels[i + 1] = 255;
    noisePixels[i + 2] = 255;

  }

  if (gray < 15) {

    noisePixels[i] = 0;
    noisePixels[i + 1] = 0;
    noisePixels[i + 2] = 0;

  }

}

context.putImageData(
  noiseData,
  0,
  0
);

    const blob =
      await new Promise<Blob | null>(
        (resolve) => {

          canvas.toBlob(
            resolve,
            "image/png"
          );

        }
      );

    URL.revokeObjectURL(imageUrl);

    if (!blob) {

      throw new Error(
        "Image preprocessing failed."
      );

    }

    return blob;

  }
    async function runOCR(
    worker: Awaited<ReturnType<typeof createWorker>>,
    image: Blob | File
  ) {

    const result =
      await worker.recognize(image);

    return {

      text:
        result.data.text.trim(),

      confidence:
        result.data.confidence ?? 0,

    };

  }

  async function createImageVariant(
    file: File,
    mode: "normal" | "strong"
  ): Promise<Blob> {

    const url =
      URL.createObjectURL(file);

    const image =
      new Image();

    await new Promise<void>((resolve, reject) => {

      image.onload = () => resolve();

      image.onerror = () =>
        reject(
          new Error("Image load failed.")
        );

      image.src = url;

    });

    const canvas =
      document.createElement("canvas");

    const ctx =
      canvas.getContext("2d");

    if (!ctx) {

      URL.revokeObjectURL(url);

      throw new Error(
        "Canvas unavailable."
      );

    }

    canvas.width =
      image.naturalWidth * 3;

    canvas.height =
      image.naturalHeight * 3;

    ctx.filter =
      mode === "strong"
        ? "grayscale(100%) contrast(220%) brightness(120%)"
        : "grayscale(100%) contrast(150%) brightness(108%)";

    ctx.drawImage(
      image,
      0,
      0,
      canvas.width,
      canvas.height
    );

    URL.revokeObjectURL(url);

    const blob =
      await new Promise<Blob | null>((resolve) => {

        canvas.toBlob(
          resolve,
          "image/png"
        );

      });

    if (!blob) {

      throw new Error(
        "Variant creation failed."
      );

    }

    return blob;

  }

  function correctTamilText(
    text: string
  ) {

    let corrected =
      text;

    for (const [wrong, correct] of Object.entries(tamilCorrections)) {

      corrected =
        corrected.replaceAll(
          wrong,
          correct
        );

    }

    corrected = corrected
      .replace(/\s{2,}/g, " ")
      .replace(/ +\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    return corrected;

  }
    async function extractText() {

    if (!file) {

      setMessage(
        "Please select an image first."
      );

      return;

    }

    setProcessing(true);

const started = performance.now();

setStartTime(started);

    setRobotState("processing");

    setProgress(0);

    setMessage(
      "Preparing Tamil OCR..."
    );



    let worker:
      Awaited<
        ReturnType<typeof createWorker>
      > | null = null;

    try {

      worker =
        await createWorker(
          ["tam", "eng"],
          1,
          {
            logger: (info) => {

              if (
                info.status ===
                  "recognizing text" &&
                typeof info.progress ===
                  "number"
              ) {

                setProgress(
                  Math.round(
                    info.progress * 100
                  )
                );

              }

              if (info.status) {

                setMessage(
                  info.status
                );

              }

            },
          }
        );

      setMessage(
        "Enhancing image..."
      );

      const enhancedImage =
        await preprocessImage(file);

      const strongImage =
        await createImageVariant(
          file,
          "strong"
        );

     const processedImage =
  await preprocessImage(file);

const originalOCR =
  await runOCR(
    worker,
    processedImage
  );

      const enhancedOCR =
        await runOCR(
          worker,
          enhancedImage
        );

      const strongOCR =
        await runOCR(
          worker,
          strongImage
        );
        const regionCanvas =
  document.createElement("canvas");

const regionContext =
  regionCanvas.getContext("2d");

if (!regionContext) {
  throw new Error("Canvas unavailable.");
}
const imageBitmap =
  await createImageBitmap(processedImage);

const regionWidth =
  imageBitmap.width;

const regionHeight =
  Math.floor(imageBitmap.height / 4);

const regionResults: string[] = [];

for (let region = 0; region < 4; region++) {

  regionCanvas.width = regionWidth;

  regionCanvas.height = regionHeight;

  regionContext.clearRect(
    0,
    0,
    regionWidth,
    regionHeight
  );

  regionContext.drawImage(
    imageBitmap,
    0,
    region * regionHeight,
    regionWidth,
    regionHeight,
    0,
    0,
    regionWidth,
    regionHeight
  );

  const blob =
    await new Promise<Blob | null>((resolve) => {

      regionCanvas.toBlob(
        resolve,
        "image/png"
      );

    });

  if (!blob) continue;

  const result =
    await runOCR(
      worker,
      blob
    );

  regionResults.push(result.text);

}

const mergedRegionText =
  correctTamilText(
    regionResults.join("\n\n")
  );

         const candidates = [

  originalOCR,

  enhancedOCR,

  strongOCR,

  {
    text: mergedRegionText,
    confidence: 99,
  },

];

      candidates.sort(
        (a, b) => b.confidence - a.confidence
      );

      console.table(candidates);

     const finalText =
  candidates[0].text;

      const bestConfidence =
        candidates[0].confidence;

        setOcrConfidence(
  Math.round(bestConfidence)
);
      console.log(
        "Best OCR Confidence:",
        bestConfidence
      );

      if (!finalText) {

        setText("");

        setMessage(
          "No readable text found. Try a clearer image."
        );

        return;

      }

      setText(finalText);

const finished = performance.now();

setProcessingTime(
  Number(((finished - started) / 1000).toFixed(2))
);

setWordCount(
  finalText.trim()
    ? finalText.trim().split(/\s+/).length
    : 0
);
      setProgress(100);

      setMessage(
        "Text extracted successfully."
      );

      setRobotState("success");

      setTimeout(() => {

        setRobotState("idle");

      }, 2500);

    } catch (error) {

      console.error(error);

      setRobotState("error");

      setTimeout(() => {

        setRobotState("idle");

      }, 2500);

      setMessage(
        "Could not extract text. Please try again."
      );

    } finally {

      if (worker) {

        await worker.terminate();

      }

      setProcessing(false);

    }

  }
    async function copyText() {

    if (!text) return;

    try {

      await navigator.clipboard.writeText(text);

      setMessage(
        "Text copied to clipboard."
      );

    } catch {

      setMessage(
        "Could not copy the text."
      );

    }

  }

  function downloadText() {

    if (!text) return;

    const blob = new Blob(
      [text],
      {
        type:
          "text/plain;charset=utf-8",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      "novatools-tamil-text.txt";

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);

  }

function downloadPDF() {

  if (!text) return;

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  pdf.setFont("helvetica");

  pdf.setFontSize(12);

  const lines = pdf.splitTextToSize(text, 500);

  pdf.text(lines, 40, 40);

  pdf.save("novatools-tamil-text.pdf");

}

  function clearText() {

    setText("");

    setMessage("");

    setProgress(0);

    setRobotState("idle");

    setProcessingTime(0);

    setOcrConfidence(0);

    if (previewUrl) {

      URL.revokeObjectURL(previewUrl);

    }

    setPreviewUrl(null);

    setFile(null);

  }
   return (
  <>
    <ToolSEO
      name="Tamil Image to Text"
      path="/tamil-image-to-text"
      description="Extract Tamil and English text from images online for free using AI OCR."
      faqs={[
        {
          question: "Can this tool read Tamil text?",
          answer: "Yes. It supports Tamil and English OCR.",
        },
        {
          question: "Is this OCR free?",
          answer: "Yes. Nova Tools provides this tool for free.",
        },
        {
          question: "Are my images uploaded?",
          answer: "No. Images are processed locally in your browser.",
        },
        {
          question: "Can I download the extracted text?",
          answer: "Yes. You can download the extracted text as a TXT file.",
        },
      ]}
    />

    <main className="min-h-screen bg-[#030712] text-white">

      <SiteHeader />

      <ToolLayout
        badge="FREE OCR TOOL"
        title="Tamil Image to Text"
        description="Extract Tamil and English text from images using advanced AI OCR."
      >

        <UploadCard
          title="Upload Image"
          description="Upload an image containing Tamil or English text."
        >

          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() =>
              setDragActive(false)
            }
            onDrop={(e) => {

              e.preventDefault();

              setDragActive(false);

              const droppedFile =
                e.dataTransfer.files[0];

              if (!droppedFile) return;

              processFile(droppedFile);

            }}
            className={`block cursor-pointer rounded-3xl border-2 border-dashed p-10 text-center backdrop-blur-xl transition-all duration-300 ${
              dragActive
                ? "scale-[1.02] border-cyan-400 bg-cyan-500/10"
                : "border-cyan-500/30 bg-white/5 hover:border-cyan-400"
            }`}
          >

            <div className="text-6xl">
              📄
            </div>

            <h2 className="mt-5 text-3xl font-bold">
              Upload Image
            </h2>

            <p className="mt-3 text-slate-400">
              Drag & Drop or Click to Browse
            </p>

            <input
              hidden
              type="file"
              accept="image/*"
              onChange={handleFile}
            />

          </label>

          {file && previewUrl && (

            <div className="mt-8 rounded-3xl border border-cyan-500/20 bg-white/5 p-6 backdrop-blur-xl">

              <img
                src={previewUrl}
                alt="Preview"
                className="mx-auto max-h-96 rounded-2xl object-contain"
              />

              <p className="mt-5 break-all text-center font-semibold text-cyan-300">
                {file.name}
              </p>

            </div>

          )}
                    <button
            type="button"
            onClick={extractText}
            disabled={!file || processing}
            className="mt-8 w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-6 py-4 text-lg font-bold text-white shadow-lg shadow-cyan-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-cyan-500/50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {processing
              ? `Extracting... ${progress}%`
              : "🚀 Extract Tamil Text"}
          </button>

          {processing && (

            <div className="mt-6">

              <div className="mb-3 flex justify-between text-sm">

                <span className="text-slate-300">
                  OCR Progress
                </span>

                <span className="font-bold text-cyan-300">
                  {progress}%
                </span>

              </div>

              <div className="h-3 overflow-hidden rounded-full bg-white/10">

                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-500 to-emerald-400 transition-all duration-300"
                  style={{
                    width: `${progress}%`,
                  }}
                />

              </div>

            </div>

          )}

          {message && (

            <div className="mt-6 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4 text-center">

              <p className="font-medium text-cyan-300">

                {message}

              </p>

            </div>

          )}

          {text && (

            <ResultCard
              title="OCR Completed"
              description="Tamil text extracted successfully."
            >
                            <div className="mb-8 rounded-3xl border border-cyan-500/20 bg-white/5 p-6 backdrop-blur-xl">

                <h3 className="mb-6 text-center text-2xl font-bold text-cyan-300">
                  OCR Information
                </h3>

               <div className="grid gap-5 md:grid-cols-7">

  <div className="rounded-2xl bg-black/20 p-5">
    <p className="text-xs uppercase text-slate-500">
      File Name
    </p>

    <p className="mt-2 break-all font-bold text-white">
      {file?.name}
    </p>
  </div>

  <div className="rounded-2xl bg-black/20 p-5">
    <p className="text-xs uppercase text-slate-500">
      Characters
    </p>
<div className="rounded-2xl bg-black/20 p-5">

  <p className="text-xs uppercase text-slate-500">
    Words
  </p>

  <p className="mt-2 text-2xl font-bold text-violet-300">
    {wordCount}
  </p>

</div>
    <p className="mt-2 text-2xl font-bold text-cyan-300">
      {text.length}
    </p>
  </div>

  <div className="rounded-2xl bg-black/20 p-5">
    <p className="text-xs uppercase text-slate-500">
      OCR Status
    </p>

    <p className="mt-2 text-2xl font-bold text-emerald-300">
      Success
    </p>
  </div>

  <div className="rounded-2xl bg-black/20 p-5">
    <p className="text-xs uppercase text-slate-500">
      Image Quality
    </p>

    <p className="mt-2 text-2xl font-bold text-yellow-300">
      {imageQuality || "-"}
    </p>
  </div>

<div className="rounded-2xl bg-black/20 p-5">

  <p className="text-xs uppercase text-slate-500">
    OCR Accuracy
  </p>

  <p className="mt-2 text-2xl font-bold text-emerald-300">
    {ocrConfidence}%
  </p>

<div className="rounded-2xl bg-black/20 p-5">

  <p className="text-xs uppercase text-slate-500">
    Processing Time
  </p>

  <p className="mt-2 text-2xl font-bold text-orange-300">
    {processingTime}s
  </p>

</div>

</div>

                </div>

              </div>

              <textarea
                value={text}
                onChange={(e) =>
                  setText(e.target.value)
                }
                rows={14}
                className="w-full rounded-3xl border border-cyan-500/20 bg-black/20 p-6 text-lg leading-8 text-white outline-none"
              />

              <div className="mt-8 grid gap-4 md:grid-cols-4">

                <button
                  onClick={copyText}
                  className="rounded-2xl bg-cyan-500 px-6 py-4 font-bold text-black transition hover:bg-cyan-400"
                >
                  📋 Copy Text
                </button>

                <button
                  onClick={downloadText}
                  className="rounded-2xl bg-emerald-500 px-6 py-4 font-bold text-white transition hover:bg-emerald-400"
                >
                  ⬇ Download TXT
                </button>

<button
  onClick={downloadPDF}
  className="rounded-2xl bg-violet-500 px-6 py-4 font-bold text-white transition hover:bg-violet-400"
>
  📄 Download PDF
</button>

                <button
                  onClick={clearText}
                  className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 font-bold text-white transition hover:border-cyan-400 hover:bg-cyan-500/10"
                >
                  🔄 New OCR
                </button>

              </div>

            </ResultCard>

          )}

        </UploadCard>
                <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

          <h2 className="text-3xl font-bold">
            How to Convert Tamil Image to Text
          </h2>

          <ol className="mt-6 space-y-4 text-slate-300">

            <li>
              1. Upload a clear image containing Tamil or English text.
            </li>

            <li>
              2. Click <strong>Extract Tamil Text</strong>.
            </li>

            <li>
              3. Wait for the OCR engine to process your image.
            </li>

            <li>
              4. Review the extracted text.
            </li>

            <li>
              5. Edit the text if required.
            </li>

            <li>
              6. Copy the text or download it as a TXT file.
            </li>

          </ol>

        </div>
<div className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

  <h2 className="text-3xl font-bold">
    Frequently Asked Questions
  </h2>

  <div className="mt-8 space-y-8">

    <div>
      <h3 className="text-xl font-semibold text-cyan-300">
        Can this tool extract Tamil text?
      </h3>

      <p className="mt-2 text-slate-300">
        Yes. The OCR engine can recognize both Tamil and English text from images.
      </p>
    </div>

    <div>
      <h3 className="text-xl font-semibold text-cyan-300">
        Can it read handwritten Tamil?
      </h3>

      <p className="mt-2 text-slate-300">
        It can recognize some handwritten text, but printed Tamil documents usually produce much better results.
      </p>
    </div>

    <div>
      <h3 className="text-xl font-semibold text-cyan-300">
        Which image formats are supported?
      </h3>

      <p className="mt-2 text-slate-300">
        JPG, JPEG and PNG image files are supported.
      </p>
    </div>

    <div>
      <h3 className="text-xl font-semibold text-cyan-300">
        Is this OCR tool free?
      </h3>

      <p className="mt-2 text-slate-300">
        Yes. You can extract Tamil text without creating an account.
      </p>
    </div>

    <div>
      <h3 className="text-xl font-semibold text-cyan-300">
        Are my images secure?
      </h3>

      <p className="mt-2 text-slate-300">
        Your images are processed inside your browser and are not permanently stored.
      </p>
    </div>

  </div>

</div>
      </ToolLayout>

<RelatedTools current="/tamil-image-to-text" />

<SiteFooter />

<NovaAssistant state={robotState} />

    </main>
</>
  );

}