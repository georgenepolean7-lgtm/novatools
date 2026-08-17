"use client";

// QPDF WebAssembly Browser Runner Helper
// All processing is executed client-side inside a Web Worker using explicit HTTP origin URLs.

export type QpdfEncryptionStrength = "256" | "128";

function getQpdfUrls() {
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";

  return {
    workerUrl: `${origin}/qpdf/worker.js`,
    qpdfJsUrl: `${origin}/qpdf/lib/qpdf.js`,
    wasmUrl: `${origin}/qpdf/lib/qpdf.wasm`,
    timeoutMs: 35000,
  };
}

export async function encryptPdfWithQpdf(
  fileBytes: Uint8Array,
  userPass: string,
  ownerPass?: string,
  keyLength: QpdfEncryptionStrength = "256"
): Promise<Uint8Array> {
  const { createQpdfRunner } = await import("qpdf-run");

  const runner = await createQpdfRunner(getQpdfUrls());

  try {
    const owner = ownerPass && ownerPass.trim() ? ownerPass : userPass;
    const result = await runner.run({
      inputs: {
        "input.pdf": fileBytes,
      },
      args: [
        "--encrypt",
        userPass,
        owner,
        keyLength,
        "--",
        "input.pdf",
        "encrypted.pdf",
      ],
      outputs: ["encrypted.pdf"],
    });

    const output = result.outputs["encrypted.pdf"];
    if (!output || output.length === 0) {
      throw new Error("Encryption failed to generate protected PDF output.");
    }
    return output;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    if (errorMsg.toLowerCase().includes("invalid password")) {
      throw new Error("Unable to encrypt with the provided password.");
    }
    throw err;
  } finally {
    try {
      await runner.destroy();
    } catch {
      // Ignored
    }
  }
}

export async function decryptPdfWithQpdf(
  fileBytes: Uint8Array,
  password: string
): Promise<Uint8Array> {
  const { createQpdfRunner } = await import("qpdf-run");

  const runner = await createQpdfRunner(getQpdfUrls());

  try {
    const result = await runner.run({
      inputs: {
        "input.pdf": fileBytes,
      },
      args: [
        `--password=${password}`,
        "--decrypt",
        "--",
        "input.pdf",
        "unlocked.pdf",
      ],
      outputs: ["unlocked.pdf"],
    });

    const output = result.outputs["unlocked.pdf"];
    if (!output || output.length === 0) {
      throw new Error("Decryption failed to produce unlocked PDF output.");
    }
    return output;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    if (
      errorMsg.toLowerCase().includes("invalid password") ||
      errorMsg.toLowerCase().includes("password incorrect") ||
      errorMsg.toLowerCase().includes("status 2") ||
      errorMsg.toLowerCase().includes("status 1")
    ) {
      throw new Error("Incorrect password. Please verify your password and try again.");
    }
    throw err;
  } finally {
    try {
      await runner.destroy();
    } catch {
      // Ignored
    }
  }
}
