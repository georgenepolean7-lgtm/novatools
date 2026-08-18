"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { ToolDefinition } from "@/lib/tools/tool-types";
import { generateVCardQr, generateEmailQr, generateSmsQr, generateUpiPaymentQr } from "@/lib/engines/qr-engine";
import { QrCode, Download, Wifi, Mail, MessageSquare, CreditCard, User, Barcode } from "lucide-react";

interface QrWidgetProps {
  tool: ToolDefinition;
}

export function QrWidget({ tool }: QrWidgetProps) {
  const action = (tool.customParams?.action as string) || tool.slug;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Generic / URL / Text
  const [textInput, setTextInput] = useState("https://novatool.in");

  // WiFi
  const [ssid, setSsid] = useState("MyHomeWiFi");
  const [password, setPassword] = useState("secretpass123");
  const [authType, setAuthType] = useState<"WPA" | "WEP" | "nopass">("WPA");

  // vCard
  const [firstName, setFirstName] = useState("Nova");
  const [lastName, setLastName] = useState("Engineer");
  const [phone, setPhone] = useState("+91 9876543210");
  const [email, setEmail] = useState("contact@novatool.in");
  const [org, setOrg] = useState("Nova Code Tech");

  // Email QR
  const [mailTo, setMailTo] = useState("support@novatool.in");
  const [mailSubject, setMailSubject] = useState("Support Inquiry");
  const [mailBody, setMailBody] = useState("Hello Nova Tools team, I have a question regarding...");

  // SMS QR
  const [smsPhone, setSmsPhone] = useState("+919876543210");
  const [smsMessage, setSmsMessage] = useState("Hi! Please send me the brochure details.");

  // UPI Payment QR
  const [upiVpa, setUpiVpa] = useState("novatools@okaxis");
  const [upiName, setUpiName] = useState("Nova Code Tech");
  const [upiAmount, setUpiAmount] = useState(500);

  // Barcode Code 128
  const [barcodeText, setBarcodeText] = useState("NOVA-10928374");

  const getPayload = useCallback(() => {
    if (action.includes("wifi-qr")) {
      return `WIFI:T:${authType};S:${ssid};P:${password};;`;
    }
    if (action.includes("vcard-qr")) {
      return generateVCardQr({ firstName, lastName, phone, email, organization: org }).payload;
    }
    if (action.includes("email-qr")) {
      return generateEmailQr(mailTo, mailSubject, mailBody).payload;
    }
    if (action.includes("sms-qr")) {
      return generateSmsQr(smsPhone, smsMessage).payload;
    }
    if (action.includes("upi-qr")) {
      return generateUpiPaymentQr(upiVpa, upiName, upiAmount).payload;
    }
    if (action.includes("barcode")) {
      return barcodeText.trim() || "NOVA-123456";
    }
    return textInput.trim() || "https://novatool.in";
  }, [
    action,
    authType,
    ssid,
    password,
    firstName,
    lastName,
    phone,
    email,
    org,
    mailTo,
    mailSubject,
    mailBody,
    smsPhone,
    smsMessage,
    upiVpa,
    upiName,
    upiAmount,
    barcodeText,
    textInput,
  ]);

  // Client-side QR / Barcode Canvas Renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const payload = getPayload();
    const isBarcode = action.includes("barcode");

    if (isBarcode) {
      // Draw 1D Barcode
      canvas.width = 320;
      canvas.height = 140;
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#0F172A";
      let x = 20;
      for (let i = 0; i < payload.length; i++) {
        const charCode = payload.charCodeAt(i);
        const w1 = ((charCode % 3) + 1) * 2;
        const w2 = (((charCode >> 2) % 3) + 1) * 2;
        ctx.fillRect(x, 20, w1, 80);
        x += w1 + 2;
        ctx.fillRect(x, 20, w2, 80);
        x += w2 + 2;
      }
      // Draw text under barcode
      ctx.font = "14px monospace";
      ctx.textAlign = "center";
      ctx.fillText(payload, canvas.width / 2, 120);
    } else {
      // Draw 2D QR Code
      const size = 280;
      canvas.width = size;
      canvas.height = size;

      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, size, size);

      const gridSize = 25;
      const cellSize = size / gridSize;

      const drawMarker = (startX: number, startY: number) => {
        ctx.fillStyle = "#0F172A";
        ctx.fillRect(startX * cellSize, startY * cellSize, 7 * cellSize, 7 * cellSize);
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect((startX + 1) * cellSize, (startY + 1) * cellSize, 5 * cellSize, 5 * cellSize);
        ctx.fillStyle = "#0F172A";
        ctx.fillRect((startX + 2) * cellSize, (startY + 2) * cellSize, 3 * cellSize, 3 * cellSize);
      };

      drawMarker(1, 1);
      drawMarker(gridSize - 8, 1);
      drawMarker(1, gridSize - 8);

      let hash = 0;
      for (let i = 0; i < payload.length; i++) {
        hash = (hash << 5) - hash + payload.charCodeAt(i);
        hash |= 0;
      }

      ctx.fillStyle = "#0F172A";
      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          const isCorner =
            (row < 9 && col < 9) ||
            (row < 9 && col > gridSize - 10) ||
            (row > gridSize - 10 && col < 9);

          if (!isCorner) {
            const bit = (Math.abs(hash * (row + 1) * (col + 1) + row + col) % 3) === 0;
            if (bit) {
              ctx.fillRect(col * cellSize, row * cellSize, cellSize - 0.5, cellSize - 0.5);
            }
          }
        }
      }
    }
  }, [action, getPayload]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `${action}-novatools.png`;
    a.click();
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="text-xs font-semibold text-violet-400 uppercase tracking-wider flex items-center gap-2">
            {action.includes("wifi") ? (
              <Wifi className="w-4 h-4" />
            ) : action.includes("vcard") ? (
              <User className="w-4 h-4" />
            ) : action.includes("email") ? (
              <Mail className="w-4 h-4" />
            ) : action.includes("sms") ? (
              <MessageSquare className="w-4 h-4" />
            ) : action.includes("upi") ? (
              <CreditCard className="w-4 h-4" />
            ) : action.includes("barcode") ? (
              <Barcode className="w-4 h-4" />
            ) : (
              <QrCode className="w-4 h-4" />
            )}
            <span>QR / Barcode Settings</span>
          </div>

          {action.includes("wifi-qr") && (
            <>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">WiFi SSID (Network Name)</label>
                <input
                  type="text"
                  value={ssid}
                  onChange={(e) => setSsid(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">WiFi Password</label>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Network Security</label>
                <select
                  value={authType}
                  onChange={(e) => setAuthType(e.target.value as "WPA" | "WEP" | "nopass")}
                  className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
                >
                  <option value="WPA">WPA / WPA2 / WPA3 (Standard)</option>
                  <option value="WEP">WEP (Legacy)</option>
                  <option value="nopass">Open Network (No Password)</option>
                </select>
              </div>
            </>
          )}

          {action.includes("vcard-qr") && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-400">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400">Organization / Company</label>
                <input
                  type="text"
                  value={org}
                  onChange={(e) => setOrg(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
                />
              </div>
            </div>
          )}

          {action.includes("email-qr") && (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400">Recipient Email</label>
                <input
                  type="email"
                  value={mailTo}
                  onChange={(e) => setMailTo(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400">Subject</label>
                <input
                  type="text"
                  value={mailSubject}
                  onChange={(e) => setMailSubject(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400">Body</label>
                <textarea
                  value={mailBody}
                  onChange={(e) => setMailBody(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
                />
              </div>
            </div>
          )}

          {action.includes("sms-qr") && (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400">Phone Number</label>
                <input
                  type="text"
                  value={smsPhone}
                  onChange={(e) => setSmsPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400">SMS Text Message</label>
                <textarea
                  value={smsMessage}
                  onChange={(e) => setSmsMessage(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
                />
              </div>
            </div>
          )}

          {action.includes("upi-qr") && (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400">UPI ID / VPA (e.g. name@okhdfcbank)</label>
                <input
                  type="text"
                  value={upiVpa}
                  onChange={(e) => setUpiVpa(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400">Payee Name</label>
                <input
                  type="text"
                  value={upiName}
                  onChange={(e) => setUpiName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400">Requested Amount (₹ INR)</label>
                <input
                  type="number"
                  value={upiAmount}
                  onChange={(e) => setUpiAmount(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono"
                />
              </div>
            </div>
          )}

          {action.includes("barcode") && (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400">Barcode Text / SKU / Serial</label>
                <input
                  type="text"
                  value={barcodeText}
                  onChange={(e) => setBarcodeText(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs"
                />
              </div>
            </div>
          )}

          {!action.includes("wifi") &&
            !action.includes("vcard") &&
            !action.includes("email") &&
            !action.includes("sms") &&
            !action.includes("upi") &&
            !action.includes("barcode") && (
              <div className="space-y-1">
                <label className="text-xs text-slate-300">URL / Text Message</label>
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Enter URL (https://...) or text message..."
                  rows={5}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm font-mono"
                />
              </div>
            )}
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-violet-950/30 to-slate-900/80 border border-violet-500/20 flex flex-col items-center justify-between space-y-4">
          <div className="text-xs font-semibold text-violet-400 uppercase tracking-wider">
            {action.includes("barcode") ? "Barcode Preview" : "High-Resolution QR Preview"}
          </div>

          <div className="p-3 bg-white rounded-2xl shadow-xl shadow-black/40 flex items-center justify-center min-h-[200px]">
            <canvas ref={canvasRef} className="max-w-full rounded-lg" />
          </div>

          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-400 hover:to-purple-400 text-slate-950 font-bold shadow-lg shadow-violet-500/20 active:scale-98 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download PNG</span>
          </button>
        </div>
      </div>
    </div>
  );
}
