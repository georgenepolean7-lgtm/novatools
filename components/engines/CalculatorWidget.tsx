"use client";

import React, { useState } from "react";
import { ToolDefinition } from "@/lib/tools/tool-types";
import {
  calculateEmi,
  calculateSip,
  calculateCompoundInterest,
  calculateSimpleInterest,
  calculatePercentage,
  calculateAge,
  calculateDateDifference,
  calculateBmi,
  calculateDiscount,
  calculateSalesTax,
  calculateTip,
  calculateAspectRatio,
  calculateSpeedDistanceTime,
  calculateFuelCost,
  calculateOvertimePay,
  calculateBmr,
  calculateCalorieDeficit,
  calculateSalaryToHourly,
  calculateHourlyToSalary,
  calculateCagr,
  calculateInflation,
  calculateMarkup,
  calculateMargin,
  calculateTimeDuration,
  convertNumberToWords,
  convertUnits,
  convertRomanNumerals,
  calculateWaterIntake,
  CalculatorResult,
} from "@/lib/engines/calculator-engine";
import { Calculator, Sparkles } from "lucide-react";

interface CalculatorWidgetProps {
  tool: ToolDefinition;
}

export function CalculatorWidget({ tool }: CalculatorWidgetProps) {
  const action = (tool.customParams?.action as string) || tool.slug;

  // General numeric inputs
  const [num1, setNum1] = useState(100000);
  const [num2, setNum2] = useState(8.5);
  const [num3, setNum3] = useState(5);
  const [num4, setNum4] = useState(1);

  // Date inputs
  const [date1, setDate1] = useState("1998-05-15");
  const [date2, setDate2] = useState(new Date().toISOString().split("T")[0]);

  // Select/Radio inputs
  const [selectOption] = useState("annually");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [unitType] = useState<"length" | "weight" | "temperature" | "data">("length");
  const [fromUnit, setFromUnit] = useState("km");
  const [toUnit, setToUnit] = useState("mi");
  const [textInput, setTextInput] = useState("2024");

  let result: CalculatorResult = { success: false, value: 0, formatted: "" };

  if (action === "calculate-emi") {
    result = calculateEmi(num1, num2, num3 * 12);
  } else if (action === "calculate-sip") {
    result = calculateSip(num1, num2, num3);
  } else if (action === "compound-interest") {
    result = calculateCompoundInterest(num1, num2, num3, selectOption as "annually" | "semi-annually" | "quarterly" | "monthly");
  } else if (action === "simple-interest") {
    result = calculateSimpleInterest(num1, num2, num3);
  } else if (action === "calculate-percentage") {
    result = calculatePercentage("what_is_p_of_x", num1, num2);
  } else if (action === "percentage-change") {
    result = calculatePercentage("percent_change", num1, num2);
  } else if (action === "calculate-age") {
    result = calculateAge(date1);
  } else if (action === "date-difference") {
    result = calculateDateDifference(date1, date2);
  } else if (action === "calculate-bmi") {
    result = calculateBmi(num1, num2);
  } else if (action === "calculate-discount") {
    result = calculateDiscount(num1, num2);
  } else if (action === "sales-tax") {
    result = calculateSalesTax(num1, num2, selectOption === "inclusive");
  } else if (action === "tip-calculator") {
    result = calculateTip(num1, num2, num3);
  } else if (action === "aspect-ratio") {
    result = calculateAspectRatio(num1, num2, num3 > 0 ? num3 : undefined);
  } else if (action === "speed-distance-time") {
    result = calculateSpeedDistanceTime(selectOption as "speed" | "distance" | "time", num1, num2, num3);
  } else if (action === "fuel-cost") {
    result = calculateFuelCost(num1, num2, num3);
  } else if (action === "overtime-pay") {
    result = calculateOvertimePay(num1, num2, num3, num4);
  } else if (action === "calculate-bmr") {
    result = calculateBmr(num1, num2, num3, gender);
  } else if (action === "calorie-deficit") {
    result = calculateCalorieDeficit(num1, num2);
  } else if (action === "salary-to-hourly") {
    result = calculateSalaryToHourly(num1, num2);
  } else if (action === "hourly-to-salary") {
    result = calculateHourlyToSalary(num1, num2);
  } else if (action === "calculate-cagr") {
    result = calculateCagr(num1, num2, num3);
  } else if (action === "calculate-inflation") {
    result = calculateInflation(num1, num2, num3);
  } else if (action === "calculate-markup") {
    result = calculateMarkup(num1, num2);
  } else if (action === "calculate-margin") {
    result = calculateMargin(num1, num2);
  } else if (action === "time-duration") {
    result = calculateTimeDuration(num1, num2, 0, num3, num4, 0, selectOption === "subtract" ? "subtract" : "add");
  } else if (action === "number-to-words") {
    result = convertNumberToWords(num1, "INR");
  } else if (action === "convert-units") {
    result = convertUnits(num1, fromUnit, toUnit, unitType);
  } else if (action === "roman-numerals" || action.includes("roman-numerals")) {
    result = convertRomanNumerals(textInput);
  } else if (action === "water-intake" || action.includes("water-intake")) {
    result = calculateWaterIntake(num1 > 0 ? num1 : 70, num2 >= 0 ? num2 : 30, "temperate");
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Controls Column */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            <span>Calculation Parameters</span>
          </div>

          {/* Form inputs based on tool action */}
          {action === "calculate-emi" && (
            <>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Loan Principal (₹)</label>
                <input
                  type="number"
                  value={num1}
                  onChange={(e) => setNum1(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Annual Interest Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={num2}
                  onChange={(e) => setNum2(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Loan Tenure (Years)</label>
                <input
                  type="number"
                  value={num3}
                  onChange={(e) => setNum3(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
            </>
          )}

          {action === "calculate-sip" && (
            <>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Monthly SIP Investment (₹)</label>
                <input
                  type="number"
                  value={num1}
                  onChange={(e) => setNum1(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Expected Annual Return Rate (%)</label>
                <input
                  type="number"
                  step="0.5"
                  value={num2}
                  onChange={(e) => setNum2(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Investment Horizon (Years)</label>
                <input
                  type="number"
                  value={num3}
                  onChange={(e) => setNum3(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
            </>
          )}

          {(action === "compound-interest" || action === "simple-interest") && (
            <>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Principal Deposit (₹)</label>
                <input
                  type="number"
                  value={num1}
                  onChange={(e) => setNum1(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Annual Interest Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={num2}
                  onChange={(e) => setNum2(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Tenure (Years)</label>
                <input
                  type="number"
                  value={num3}
                  onChange={(e) => setNum3(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
            </>
          )}

          {action === "calculate-percentage" && (
            <>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Percentage (%)</label>
                <input
                  type="number"
                  value={num1}
                  onChange={(e) => setNum1(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Of Total Value</label>
                <input
                  type="number"
                  value={num2}
                  onChange={(e) => setNum2(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
            </>
          )}

          {action === "percentage-change" && (
            <>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Original Value (From)</label>
                <input
                  type="number"
                  value={num1}
                  onChange={(e) => setNum1(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">New Value (To)</label>
                <input
                  type="number"
                  value={num2}
                  onChange={(e) => setNum2(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
            </>
          )}

          {action === "calculate-age" && (
            <div className="space-y-1">
              <label className="text-xs text-slate-300">Date of Birth</label>
              <input
                type="date"
                value={date1}
                onChange={(e) => setDate1(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
              />
            </div>
          )}

          {action === "date-difference" && (
            <>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Start Date</label>
                <input
                  type="date"
                  value={date1}
                  onChange={(e) => setDate1(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">End Date</label>
                <input
                  type="date"
                  value={date2}
                  onChange={(e) => setDate2(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
            </>
          )}

          {action === "calculate-bmi" && (
            <>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Body Weight (kg)</label>
                <input
                  type="number"
                  value={num1}
                  onChange={(e) => setNum1(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Height (cm)</label>
                <input
                  type="number"
                  value={num2}
                  onChange={(e) => setNum2(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
            </>
          )}

          {action === "calculate-discount" && (
            <>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Original Price (₹)</label>
                <input
                  type="number"
                  value={num1}
                  onChange={(e) => setNum1(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Discount Rate (%)</label>
                <input
                  type="number"
                  value={num2}
                  onChange={(e) => setNum2(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
            </>
          )}

          {action === "sales-tax" && (
            <>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Item Price (₹)</label>
                <input
                  type="number"
                  value={num1}
                  onChange={(e) => setNum1(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Sales Tax Rate (%)</label>
                <input
                  type="number"
                  value={num2}
                  onChange={(e) => setNum2(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
            </>
          )}

          {action === "tip-calculator" && (
            <>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Total Bill (₹)</label>
                <input
                  type="number"
                  value={num1}
                  onChange={(e) => setNum1(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Tip (%)</label>
                <input
                  type="number"
                  value={num2}
                  onChange={(e) => setNum2(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Split Between (People)</label>
                <input
                  type="number"
                  min="1"
                  value={num3}
                  onChange={(e) => setNum3(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
            </>
          )}

          {action === "aspect-ratio" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Original Width (px)</label>
                  <input
                    type="number"
                    value={num1}
                    onChange={(e) => setNum1(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Original Height (px)</label>
                  <input
                    type="number"
                    value={num2}
                    onChange={(e) => setNum2(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Target Width (px)</label>
                <input
                  type="number"
                  value={num3}
                  onChange={(e) => setNum3(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
            </>
          )}

          {action === "fuel-cost" && (
            <>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Distance (km)</label>
                <input
                  type="number"
                  value={num1}
                  onChange={(e) => setNum1(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Vehicle Mileage (km/L)</label>
                <input
                  type="number"
                  value={num2}
                  onChange={(e) => setNum2(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Fuel Price (₹/L)</label>
                <input
                  type="number"
                  value={num3}
                  onChange={(e) => setNum3(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
            </>
          )}

          {action === "overtime-pay" && (
            <>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Hourly Base Rate (₹)</label>
                <input
                  type="number"
                  value={num1}
                  onChange={(e) => setNum1(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Regular Hours Worked</label>
                <input
                  type="number"
                  value={num2}
                  onChange={(e) => setNum2(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Overtime Hours Worked</label>
                <input
                  type="number"
                  value={num3}
                  onChange={(e) => setNum3(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Overtime Multiplier (e.g. 1.5 for 1.5x)</label>
                <input
                  type="number"
                  step="0.1"
                  value={num4}
                  onChange={(e) => setNum4(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
            </>
          )}

          {action === "calculate-bmr" && (
            <>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setGender("male")}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold ${
                    gender === "male" ? "bg-cyan-500 text-slate-950" : "bg-slate-950 text-slate-400"
                  }`}
                >
                  Male
                </button>
                <button
                  type="button"
                  onClick={() => setGender("female")}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold ${
                    gender === "female" ? "bg-cyan-500 text-slate-950" : "bg-slate-950 text-slate-400"
                  }`}
                >
                  Female
                </button>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Weight (kg)</label>
                <input
                  type="number"
                  value={num1}
                  onChange={(e) => setNum1(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Height (cm)</label>
                <input
                  type="number"
                  value={num2}
                  onChange={(e) => setNum2(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Age (Years)</label>
                <input
                  type="number"
                  value={num3}
                  onChange={(e) => setNum3(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
            </>
          )}

          {action === "calorie-deficit" && (
            <>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Daily Maintenance Calories (kcal)</label>
                <input
                  type="number"
                  value={num1}
                  onChange={(e) => setNum1(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Target Deficit (%)</label>
                <input
                  type="number"
                  value={num2}
                  onChange={(e) => setNum2(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
            </>
          )}

          {action === "salary-to-hourly" && (
            <>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Annual Gross Salary (₹)</label>
                <input
                  type="number"
                  value={num1}
                  onChange={(e) => setNum1(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Working Hours Per Week</label>
                <input
                  type="number"
                  value={num2}
                  onChange={(e) => setNum2(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
            </>
          )}

          {action === "hourly-to-salary" && (
            <>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Hourly Rate (₹)</label>
                <input
                  type="number"
                  value={num1}
                  onChange={(e) => setNum1(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Working Hours Per Week</label>
                <input
                  type="number"
                  value={num2}
                  onChange={(e) => setNum2(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
            </>
          )}

          {action === "calculate-cagr" && (
            <>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Initial Investment Value (₹)</label>
                <input
                  type="number"
                  value={num1}
                  onChange={(e) => setNum1(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Ending Portfolio Value (₹)</label>
                <input
                  type="number"
                  value={num2}
                  onChange={(e) => setNum2(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Time Period (Years)</label>
                <input
                  type="number"
                  value={num3}
                  onChange={(e) => setNum3(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
            </>
          )}

          {action === "calculate-inflation" && (
            <>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Present Amount (₹)</label>
                <input
                  type="number"
                  value={num1}
                  onChange={(e) => setNum1(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Annual Inflation Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={num2}
                  onChange={(e) => setNum2(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Years in Future</label>
                <input
                  type="number"
                  value={num3}
                  onChange={(e) => setNum3(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
            </>
          )}

          {action === "calculate-markup" && (
            <>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Cost Price (₹)</label>
                <input
                  type="number"
                  value={num1}
                  onChange={(e) => setNum1(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Markup (%)</label>
                <input
                  type="number"
                  value={num2}
                  onChange={(e) => setNum2(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
            </>
          )}

          {action === "calculate-margin" && (
            <>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Total Revenue (₹)</label>
                <input
                  type="number"
                  value={num1}
                  onChange={(e) => setNum1(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Cost of Goods Sold (COGS) (₹)</label>
                <input
                  type="number"
                  value={num2}
                  onChange={(e) => setNum2(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
            </>
          )}

          {action === "number-to-words" && (
            <div className="space-y-1">
              <label className="text-xs text-slate-300">Enter Number</label>
              <input
                type="number"
                value={num1}
                onChange={(e) => setNum1(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
              />
            </div>
          )}

          {action === "convert-units" && (
            <>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Value</label>
                <input
                  type="number"
                  value={num1}
                  onChange={(e) => setNum1(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">From Unit</label>
                  <input
                    type="text"
                    value={fromUnit}
                    onChange={(e) => setFromUnit(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">To Unit</label>
                  <input
                    type="text"
                    value={toUnit}
                    onChange={(e) => setToUnit(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>
            </>
          )}

          {(action === "roman-numerals" || action.includes("roman-numerals")) && (
            <div className="space-y-1">
              <label className="text-xs text-slate-300">Decimal Number or Roman Numeral (e.g. 2024 or MMXXIV)</label>
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-base uppercase"
                placeholder="2024 or MMXXIV"
              />
            </div>
          )}

          {(action === "water-intake" || action.includes("water-intake")) && (
            <>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Body Weight (kg)</label>
                <input
                  type="number"
                  value={num1}
                  onChange={(e) => setNum1(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Daily Exercise / Physical Activity (Minutes)</label>
                <input
                  type="number"
                  value={num2}
                  onChange={(e) => setNum2(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
            </>
          )}
        </div>

        {/* Results Column */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950 border border-cyan-500/20 flex flex-col justify-between space-y-6 shadow-xl">
          <div>
            <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Calculated Result</span>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight break-words">
              {result.formatted || "—"}
            </div>
          </div>

          {result.error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {result.error}
            </div>
          )}

          {result.breakdown && (
            <div className="space-y-2 border-t border-slate-800 pt-4">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Detailed Breakdown
              </div>
              <dl className="space-y-2 text-xs">
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
