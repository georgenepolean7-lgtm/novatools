"use client";

import React, { useState } from "react";
import { ToolDefinition } from "@/lib/tools/tool-types";
import {
  calculateProfitMargin,
  calculateRoi,
  calculateBreakEven,
  calculateCashFlowBurnRate,
  calculateLoanAmortization,
  calculateDividendYield,
  calculateFreelanceHourlyRate,
  calculateSavingsGoal,
  calculateDiscountSavings,
  FinanceEngineResult,
} from "@/lib/engines/finance-engine";
import { DollarSign } from "lucide-react";

interface FinanceWidgetProps {
  tool: ToolDefinition;
}

export function FinanceWidget({ tool }: FinanceWidgetProps) {
  const action = (tool.customParams?.action as string) || tool.slug;

  const [costPrice, setCostPrice] = useState(500);
  const [sellingPrice, setSellingPrice] = useState(800);

  const [invested, setInvested] = useState(50000);
  const [returned, setReturned] = useState(75000);

  const [fixedCosts, setFixedCosts] = useState(100000);
  const [unitPrice, setUnitPrice] = useState(250);
  const [unitVariableCost, setUnitVariableCost] = useState(150);

  // Cash flow
  const [cashBalance, setCashBalance] = useState(500000);
  const [monthlyRevenue, setMonthlyRevenue] = useState(50000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(100000);

  // Loan amortization
  const [loanAmount, setLoanAmount] = useState(1000000);
  const [loanRate, setLoanRate] = useState(8.5);
  const [loanYears, setLoanYears] = useState(15);

  // Dividend yield
  const [sharePrice, setSharePrice] = useState(1200);
  const [annualDividend, setAnnualDividend] = useState(48);

  // Freelance rate
  const [targetIncome, setTargetIncome] = useState(1200000);
  const [billableHours, setBillableHours] = useState(25);

  // Savings goal
  const [savingsTarget, setSavingsTarget] = useState(2000000);
  const [savingsYears, setSavingsYears] = useState(5);
  const [savingsInterest, setSavingsInterest] = useState(8);

  let result: FinanceEngineResult = { success: false, formatted: "" };

  if (action === "calculate-profit-margin" || action === "profit-margin-calculator") {
    result = calculateProfitMargin(costPrice, sellingPrice);
  } else if (action === "calculate-roi" || action === "roi-calculator") {
    result = calculateRoi(invested, returned);
  } else if (action === "calculate-break-even" || action === "break-even-calculator") {
    result = calculateBreakEven(fixedCosts, unitPrice, unitVariableCost);
  } else if (action === "cash-flow-burn-rate" || action === "cash-flow-burn-rate-calculator") {
    result = calculateCashFlowBurnRate(cashBalance, monthlyRevenue, monthlyExpenses);
  } else if (action === "loan-amortization" || action === "loan-amortization-schedule-calculator") {
    result = calculateLoanAmortization(loanAmount, loanRate, loanYears);
  } else if (action === "dividend-yield" || action === "dividend-yield-calculator") {
    result = calculateDividendYield(sharePrice, annualDividend, 100);
  } else if (action === "freelance-hourly-rate" || action === "freelance-hourly-rate-calculator") {
    result = calculateFreelanceHourlyRate(targetIncome, billableHours, 4, 15000, 20);
  } else if (action === "savings-goal-planner" || action === "savings-goal-planner-calculator") {
    result = calculateSavingsGoal(savingsTarget, savingsYears, savingsInterest, 50000);
  } else if (action === "discount-percentage" || action.includes("discount-percentage")) {
    result = calculateDiscountSavings(costPrice > 0 ? costPrice : 1000, 20, 18);
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            <span>Financial Inputs</span>
          </div>

          {(action.includes("profit-margin") || action === "calculate-profit-margin") && (
            <>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Cost Price (₹)</label>
                <input
                  type="number"
                  value={costPrice}
                  onChange={(e) => setCostPrice(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Selling Price (₹)</label>
                <input
                  type="number"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
            </>
          )}

          {(action.includes("roi") || action === "calculate-roi") && (
            <>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Initial Investment (₹)</label>
                <input
                  type="number"
                  value={invested}
                  onChange={(e) => setInvested(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Total Returned Value (₹)</label>
                <input
                  type="number"
                  value={returned}
                  onChange={(e) => setReturned(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
            </>
          )}

          {(action.includes("break-even") || action === "calculate-break-even") && (
            <>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Total Fixed Costs (₹)</label>
                <input
                  type="number"
                  value={fixedCosts}
                  onChange={(e) => setFixedCosts(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Unit Price (₹)</label>
                  <input
                    type="number"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Unit Var Cost (₹)</label>
                  <input
                    type="number"
                    value={unitVariableCost}
                    onChange={(e) => setUnitVariableCost(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs"
                  />
                </div>
              </div>
            </>
          )}

          {action.includes("burn-rate") && (
            <>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Total Cash Balance (₹)</label>
                <input
                  type="number"
                  value={cashBalance}
                  onChange={(e) => setCashBalance(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Monthly Revenue (₹)</label>
                  <input
                    type="number"
                    value={monthlyRevenue}
                    onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Monthly Expenses (₹)</label>
                  <input
                    type="number"
                    value={monthlyExpenses}
                    onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs"
                  />
                </div>
              </div>
            </>
          )}

          {action.includes("amortization") && (
            <>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Loan Amount (₹)</label>
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Interest Rate (% p.a.)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={loanRate}
                    onChange={(e) => setLoanRate(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Tenure (Years)</label>
                  <input
                    type="number"
                    value={loanYears}
                    onChange={(e) => setLoanYears(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs"
                  />
                </div>
              </div>
            </>
          )}

          {action.includes("dividend") && (
            <>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Current Share Price (₹)</label>
                <input
                  type="number"
                  value={sharePrice}
                  onChange={(e) => setSharePrice(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Annual Dividend Per Share (₹)</label>
                <input
                  type="number"
                  value={annualDividend}
                  onChange={(e) => setAnnualDividend(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
            </>
          )}

          {action.includes("freelance") && (
            <>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Target Annual Take-Home Income (₹)</label>
                <input
                  type="number"
                  value={targetIncome}
                  onChange={(e) => setTargetIncome(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Billable Hours / Week</label>
                <input
                  type="number"
                  value={billableHours}
                  onChange={(e) => setBillableHours(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
            </>
          )}

          {action.includes("savings-goal") && (
            <>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Target Goal Amount (₹)</label>
                <input
                  type="number"
                  value={savingsTarget}
                  onChange={(e) => setSavingsTarget(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Time Horizon (Years)</label>
                  <input
                    type="number"
                    value={savingsYears}
                    onChange={(e) => setSavingsYears(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Expected Return (% p.a.)</label>
                  <input
                    type="number"
                    value={savingsInterest}
                    onChange={(e) => setSavingsInterest(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/30 to-slate-900/80 border border-emerald-500/20 flex flex-col justify-between space-y-6">
          <div>
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
              Financial Outcome
            </div>
            <div className="text-3xl font-extrabold text-white">
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
