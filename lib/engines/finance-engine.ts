export interface FinanceEngineResult {
  success: boolean;
  formatted: string;
  breakdown?: Record<string, string | number>;
  error?: string;
}

export function calculateProfitMargin(costPrice: number, sellingPrice: number): FinanceEngineResult {
  if (costPrice < 0 || sellingPrice < 0) {
    return { success: false, formatted: "0%", error: "Prices cannot be negative." };
  }
  if (sellingPrice === 0) {
    return { success: false, formatted: "0%", error: "Selling price cannot be zero." };
  }

  const grossProfit = sellingPrice - costPrice;
  const profitMarginPercent = (grossProfit / sellingPrice) * 100;
  const markupPercent = costPrice > 0 ? (grossProfit / costPrice) * 100 : 0;

  return {
    success: true,
    formatted: `${profitMarginPercent.toFixed(2)}% Margin`,
    breakdown: {
      "Cost Price": `₹${costPrice.toLocaleString("en-IN")}`,
      "Selling Price": `₹${sellingPrice.toLocaleString("en-IN")}`,
      "Gross Profit": `₹${grossProfit.toLocaleString("en-IN")}`,
      "Profit Margin": `${profitMarginPercent.toFixed(2)}%`,
      "Markup Percentage": `${markupPercent.toFixed(2)}%`,
    },
  };
}

export function calculateRoi(investmentAmount: number, returnedAmount: number): FinanceEngineResult {
  if (investmentAmount <= 0) {
    return { success: false, formatted: "0%", error: "Initial investment amount must be greater than zero." };
  }
  const netProfit = returnedAmount - investmentAmount;
  const roi = (netProfit / investmentAmount) * 100;

  return {
    success: true,
    formatted: `${roi.toFixed(2)}% ROI`,
    breakdown: {
      "Initial Investment": `₹${investmentAmount.toLocaleString("en-IN")}`,
      "Total Returned Value": `₹${returnedAmount.toLocaleString("en-IN")}`,
      "Net Profit / Loss": `₹${netProfit.toLocaleString("en-IN")}`,
      "Return on Investment (ROI)": `${roi.toFixed(2)}%`,
    },
  };
}

export function calculateBreakEven(fixedCosts: number, unitSellingPrice: number, unitVariableCost: number): FinanceEngineResult {
  if (fixedCosts < 0 || unitSellingPrice <= 0 || unitVariableCost < 0) {
    return { success: false, formatted: "0 units", error: "Please enter valid positive values." };
  }
  const contributionMargin = unitSellingPrice - unitVariableCost;
  if (contributionMargin <= 0) {
    return { success: false, formatted: "0 units", error: "Selling price must be greater than variable cost per unit." };
  }
  const breakEvenUnits = Math.ceil(fixedCosts / contributionMargin);
  const breakEvenRevenue = breakEvenUnits * unitSellingPrice;

  return {
    success: true,
    formatted: `${breakEvenUnits.toLocaleString("en-IN")} Units`,
    breakdown: {
      "Fixed Costs": `₹${fixedCosts.toLocaleString("en-IN")}`,
      "Unit Contribution Margin": `₹${contributionMargin.toLocaleString("en-IN")}`,
      "Break-Even Quantity": `${breakEvenUnits.toLocaleString("en-IN")} units`,
      "Break-Even Total Revenue": `₹${breakEvenRevenue.toLocaleString("en-IN")}`,
    },
  };
}

export function calculateCashFlowBurnRate(cashBalance: number, monthlyRevenue: number, monthlyExpenses: number): FinanceEngineResult {
  if (cashBalance < 0 || monthlyRevenue < 0 || monthlyExpenses < 0) {
    return { success: false, formatted: "0 Months", error: "Values cannot be negative." };
  }

  const grossBurn = monthlyExpenses;
  const netBurn = Math.max(0, monthlyExpenses - monthlyRevenue);
  const runwayMonths = netBurn > 0 ? (cashBalance / netBurn).toFixed(1) : "Infinite (Profitable)";

  return {
    success: true,
    formatted: `${runwayMonths} Months Runway`,
    breakdown: {
      "Current Cash Balance": `₹${cashBalance.toLocaleString("en-IN")}`,
      "Monthly Gross Burn": `₹${grossBurn.toLocaleString("en-IN")}`,
      "Monthly Net Burn": `₹${netBurn.toLocaleString("en-IN")}`,
      "Estimated Runway": typeof runwayMonths === "string" ? runwayMonths : `${runwayMonths} Months`,
    },
  };
}

export function calculateLoanAmortization(principal: number, annualRate: number, years: number): FinanceEngineResult {
  if (principal <= 0 || annualRate <= 0 || years <= 0) {
    return { success: false, formatted: "₹0", error: "Please enter valid positive numbers." };
  }

  const monthlyRate = annualRate / (12 * 100);
  const totalMonths = years * 12;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
  const totalPayment = emi * totalMonths;
  const totalInterest = totalPayment - principal;

  return {
    success: true,
    formatted: `₹${Math.round(emi).toLocaleString("en-IN")} / Month`,
    breakdown: {
      "Principal Loan Amount": `₹${principal.toLocaleString("en-IN")}`,
      "Monthly EMI": `₹${Math.round(emi).toLocaleString("en-IN")}`,
      "Total Interest Payable": `₹${Math.round(totalInterest).toLocaleString("en-IN")}`,
      "Total Payment (P + I)": `₹${Math.round(totalPayment).toLocaleString("en-IN")}`,
      "Loan Tenure": `${years} Years (${totalMonths} Months)`,
    },
  };
}

export function calculateDividendYield(sharePrice: number, annualDividendPerShare: number, totalShares: number = 100): FinanceEngineResult {
  if (sharePrice <= 0 || annualDividendPerShare < 0) {
    return { success: false, formatted: "0%", error: "Please enter positive share price and dividend." };
  }

  const yieldPercent = (annualDividendPerShare / sharePrice) * 100;
  const totalInvestment = sharePrice * totalShares;
  const annualIncome = annualDividendPerShare * totalShares;

  return {
    success: true,
    formatted: `${yieldPercent.toFixed(2)}% Dividend Yield`,
    breakdown: {
      "Share Price": `₹${sharePrice.toLocaleString("en-IN")}`,
      "Dividend Per Share": `₹${annualDividendPerShare.toLocaleString("en-IN")}`,
      "Dividend Yield": `${yieldPercent.toFixed(2)}%`,
      "Total Portfolio Value": `₹${totalInvestment.toLocaleString("en-IN")}`,
      "Annual Dividend Income": `₹${annualIncome.toLocaleString("en-IN")}`,
    },
  };
}

export function calculateFreelanceHourlyRate(
  targetAnnualIncome: number,
  billableHoursPerWeek: number = 25,
  vacationWeeks: number = 4,
  monthlyExpenses: number = 20000,
  taxRatePercent: number = 20
): FinanceEngineResult {
  if (targetAnnualIncome <= 0 || billableHoursPerWeek <= 0) {
    return { success: false, formatted: "₹0/hr", error: "Please enter valid income targets." };
  }

  const workWeeks = Math.max(1, 52 - vacationWeeks);
  const totalBillableHoursYear = workWeeks * billableHoursPerWeek;
  const totalAnnualExpenses = monthlyExpenses * 12;
  const grossNeededBeforeTax = (targetAnnualIncome + totalAnnualExpenses) / (1 - (taxRatePercent / 100));
  const hourlyRate = Math.ceil(grossNeededBeforeTax / totalBillableHoursYear);

  return {
    success: true,
    formatted: `₹${hourlyRate.toLocaleString("en-IN")} / Hour`,
    breakdown: {
      "Target Take-Home Income": `₹${targetAnnualIncome.toLocaleString("en-IN")}`,
      "Annual Business Costs": `₹${totalAnnualExpenses.toLocaleString("en-IN")}`,
      "Total Billable Hours/Year": `${totalBillableHoursYear} Hours`,
      "Recommended Minimum Hourly Rate": `₹${hourlyRate.toLocaleString("en-IN")}/hr`,
    },
  };
}

export function calculateSavingsGoal(
  targetAmount: number,
  targetYears: number,
  annualInterestPercent: number = 7,
  initialDeposit: number = 0
): FinanceEngineResult {
  if (targetAmount <= 0 || targetYears <= 0) {
    return { success: false, formatted: "₹0", error: "Please enter valid goal amount and duration." };
  }

  const months = targetYears * 12;
  const r = (annualInterestPercent / 100) / 12;

  let futureValOfInitial = initialDeposit;
  if (r > 0) {
    futureValOfInitial = initialDeposit * Math.pow(1 + r, months);
  }

  const remainingGoal = Math.max(0, targetAmount - futureValOfInitial);
  let monthlyDeposit = remainingGoal / months;
  if (r > 0) {
    monthlyDeposit = (remainingGoal * r) / (Math.pow(1 + r, months) - 1);
  }

  return {
    success: true,
    formatted: `₹${Math.round(monthlyDeposit).toLocaleString("en-IN")} / Month`,
    breakdown: {
      "Savings Target": `₹${targetAmount.toLocaleString("en-IN")}`,
      "Timeframe": `${targetYears} Years (${months} Months)`,
      "Assumed Annual Return": `${annualInterestPercent}%`,
      "Required Monthly Savings": `₹${Math.round(monthlyDeposit).toLocaleString("en-IN")}`,
    },
  };
}

export function calculateDiscountSavings(
  originalPrice: number,
  discountPercent: number,
  taxPercent: number = 0
): FinanceEngineResult {
  if (originalPrice <= 0 || discountPercent < 0) {
    return { success: false, formatted: "₹0", error: "Please enter valid original price and discount percentage." };
  }

  const discountAmount = (originalPrice * discountPercent) / 100;
  const discountedPrice = Math.max(0, originalPrice - discountAmount);
  const taxAmount = (discountedPrice * taxPercent) / 100;
  const finalPrice = discountedPrice + taxAmount;

  return {
    success: true,
    formatted: `₹${finalPrice.toFixed(2)} (Save ₹${discountAmount.toFixed(2)})`,
    breakdown: {
      "Original Retail Price": `₹${originalPrice.toFixed(2)}`,
      "Discount Applied": `${discountPercent}% (-₹${discountAmount.toFixed(2)})`,
      "Price After Discount": `₹${discountedPrice.toFixed(2)}`,
      "Sales Tax / GST": `+₹${taxAmount.toFixed(2)} (${taxPercent}%)`,
      "Total Final Price": `₹${finalPrice.toFixed(2)}`,
      "Total Money Saved": `₹${discountAmount.toFixed(2)}`,
    },
  };
}

