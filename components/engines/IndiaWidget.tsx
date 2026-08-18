"use client";

import React, { useState } from "react";
import { ToolDefinition } from "@/lib/tools/tool-types";
import {
  calculateGst,
  compareTaxRegimes,
  calculateGratuity,
  validateIfsc,
  calculateEpf,
  validatePanCard,
  validateAadhaarVerhoeff,
  convertNumberToIndianWords,
  validateIndianPinCode,
  IndiaEngineResult,
} from "@/lib/engines/india-engine";
import { Landmark, CheckCircle2 } from "lucide-react";

interface IndiaWidgetProps {
  tool: ToolDefinition;
}

export function IndiaWidget({ tool }: IndiaWidgetProps) {
  const action = (tool.customParams?.action as string) || tool.slug;

  // GST inputs
  const [gstAmount, setGstAmount] = useState(5000);
  const [gstRate, setGstRate] = useState(18);
  const [isInclusive, setIsInclusive] = useState(false);

  // Income tax comparator inputs
  const [salary, setSalary] = useState(1200000);
  const [ded80C, setDed80C] = useState(150000);
  const [ded80D, setDed80D] = useState(25000);
  const [hra, setHra] = useState(100000);

  // Gratuity inputs
  const [basicSalary, setBasicSalary] = useState(60000);
  const [yearsService, setYearsService] = useState(8);

  // Single string inputs
  const [inputCode, setInputCode] = useState(
    action.includes("pan")
      ? "ABCDE1234F"
      : action.includes("aadhaar")
      ? "2345 6789 0123"
      : action.includes("pin")
      ? "600001"
      : action.includes("words")
      ? "1250000"
      : "SBIN0001234"
  );

  // EPF inputs
  const [epfBasic, setEpfBasic] = useState(35000);
  const [currentAge, setCurrentAge] = useState(25);
  const [retireAge, setRetireAge] = useState(58);

  let result: IndiaEngineResult = { success: false, formatted: "" };

  if (action === "calculate-gst" || action === "gst-calculator") {
    result = calculateGst(gstAmount, gstRate, isInclusive);
  } else if (action === "compare-tax-regimes" || action === "income-tax-regime-comparator") {
    result = compareTaxRegimes(salary, ded80C, ded80D, hra);
  } else if (action === "calculate-gratuity" || action === "gratuity-calculator") {
    result = calculateGratuity(basicSalary, yearsService);
  } else if (action === "validate-ifsc" || action === "ifsc-code-validator") {
    result = validateIfsc(inputCode);
  } else if (action === "epf-calculator" || action === "epf-calculator-india") {
    result = calculateEpf(epfBasic, currentAge, retireAge);
  } else if (action === "pan-validator" || action === "pan-card-format-validator") {
    result = validatePanCard(inputCode);
  } else if (action === "aadhaar-validator" || action === "aadhaar-verhoeff-checksum-validator") {
    result = validateAadhaarVerhoeff(inputCode);
  } else if (action === "currency-words" || action === "indian-currency-words-converter") {
    result = convertNumberToIndianWords(Number(inputCode.replace(/,/g, "")));
  } else if (action === "pincode-validator" || action === "pin-code-format-validator-india") {
    result = validateIndianPinCode(inputCode);
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="text-xs font-semibold text-orange-400 uppercase tracking-wider flex items-center gap-2">
            <Landmark className="w-4 h-4" />
            <span>India Specification Inputs</span>
          </div>

          {(action.includes("gst") || action === "calculate-gst") && (
            <>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Amount (₹)</label>
                <input
                  type="number"
                  value={gstAmount}
                  onChange={(e) => setGstAmount(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">GST Slab Rate (%)</label>
                <div className="grid grid-cols-4 gap-2">
                  {[5, 12, 18, 28].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => setGstRate(rate)}
                      className={`py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                        gstRate === rate ? "bg-orange-500 text-slate-950 font-bold" : "bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      {rate}%
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="inclusive"
                  checked={isInclusive}
                  onChange={(e) => setIsInclusive(e.target.checked)}
                  className="rounded border-slate-700 text-orange-500 cursor-pointer"
                />
                <label htmlFor="inclusive" className="text-xs text-slate-300 cursor-pointer">
                  Amount already includes GST (Extract Tax)
                </label>
              </div>
            </>
          )}

          {(action.includes("tax-regime") || action === "compare-tax-regimes") && (
            <>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Gross Annual Salary (₹)</label>
                <input
                  type="number"
                  value={salary}
                  onChange={(e) => setSalary(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">80C Investments (₹)</label>
                  <input
                    type="number"
                    value={ded80C}
                    onChange={(e) => setDed80C(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">80D Health Ins (₹)</label>
                  <input
                    type="number"
                    value={ded80D}
                    onChange={(e) => setDed80D(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">HRA Exemption (₹)</label>
                <input
                  type="number"
                  value={hra}
                  onChange={(e) => setHra(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
            </>
          )}

          {(action.includes("gratuity") || action === "calculate-gratuity") && (
            <>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Last Drawn Basic Salary + DA (₹)</label>
                <input
                  type="number"
                  value={basicSalary}
                  onChange={(e) => setBasicSalary(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Continuous Service Tenure (Years)</label>
                <input
                  type="number"
                  value={yearsService}
                  onChange={(e) => setYearsService(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
            </>
          )}

          {(action.includes("epf") || action === "epf-calculator") && (
            <>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Monthly Basic Salary + DA (₹)</label>
                <input
                  type="number"
                  value={epfBasic}
                  onChange={(e) => setEpfBasic(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Current Age</label>
                  <input
                    type="number"
                    value={currentAge}
                    onChange={(e) => setCurrentAge(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Retirement Age</label>
                  <input
                    type="number"
                    value={retireAge}
                    onChange={(e) => setRetireAge(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs"
                  />
                </div>
              </div>
            </>
          )}

          {["ifsc", "pan", "aadhaar", "pin", "words"].some((k) => action.includes(k)) && (
            <div className="space-y-1">
              <label className="text-xs text-slate-300">
                {action.includes("pan")
                  ? "10-Character PAN (e.g. ABCDE1234F)"
                  : action.includes("aadhaar")
                  ? "12-Digit Aadhaar Number"
                  : action.includes("pin")
                  ? "6-Digit Postal PIN Code"
                  : action.includes("words")
                  ? "Amount in Numbers (₹)"
                  : "11-Character IFSC Code"}
              </label>
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono uppercase"
              />
            </div>
          )}
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-950/30 to-slate-900/80 border border-orange-500/20 flex flex-col justify-between space-y-6">
          <div>
            <div className="text-xs font-semibold text-orange-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Output Summary</span>
            </div>
            <div className="text-2xl font-extrabold text-white">
              {result.formatted || "—"}
            </div>
          </div>

          {result.breakdown && (
            <div className="space-y-2 border-t border-slate-800 pt-4">
              <dl className="space-y-1.5 text-xs">
                {Object.entries(result.breakdown).map(([label, val]) => (
                  <div key={label} className="flex justify-between py-1 border-b border-slate-800/60">
                    <dt className="text-slate-400">{label}:</dt>
                    <dd className="font-semibold text-slate-200 font-mono">{String(val)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
