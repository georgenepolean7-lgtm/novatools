export interface CalculatorResult {
  success: boolean;
  value: number;
  formatted: string;
  breakdown?: Record<string, string | number>;
  error?: string;
}

export function calculateEmi(principal: number, annualRate: number, tenureMonths: number): CalculatorResult {
  if (principal <= 0 || annualRate <= 0 || tenureMonths <= 0) {
    return { success: false, value: 0, formatted: "₹0", error: "Please enter positive values for loan amount, rate, and tenure." };
  }
  const monthlyRate = annualRate / 12 / 100;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  const totalPayment = emi * tenureMonths;
  const totalInterest = totalPayment - principal;

  return {
    success: true,
    value: Math.round(emi),
    formatted: `₹${Math.round(emi).toLocaleString("en-IN")}/mo`,
    breakdown: {
      "Monthly EMI": `₹${Math.round(emi).toLocaleString("en-IN")}`,
      "Principal Amount": `₹${Math.round(principal).toLocaleString("en-IN")}`,
      "Total Interest Payable": `₹${Math.round(totalInterest).toLocaleString("en-IN")}`,
      "Total Payment (Principal + Interest)": `₹${Math.round(totalPayment).toLocaleString("en-IN")}`,
    },
  };
}

export function calculateSip(monthlyInvestment: number, expectedReturnAnnual: number, tenureYears: number): CalculatorResult {
  if (monthlyInvestment <= 0 || expectedReturnAnnual <= 0 || tenureYears <= 0) {
    return { success: false, value: 0, formatted: "₹0", error: "Please enter valid positive numbers." };
  }
  const totalMonths = tenureYears * 12;
  const i = expectedReturnAnnual / 12 / 100;
  const maturityValue = monthlyInvestment * ((Math.pow(1 + i, totalMonths) - 1) / i) * (1 + i);
  const investedAmount = monthlyInvestment * totalMonths;
  const estimatedReturns = maturityValue - investedAmount;

  return {
    success: true,
    value: Math.round(maturityValue),
    formatted: `₹${Math.round(maturityValue).toLocaleString("en-IN")}`,
    breakdown: {
      "Total Invested": `₹${Math.round(investedAmount).toLocaleString("en-IN")}`,
      "Estimated Wealth Gain": `₹${Math.round(estimatedReturns).toLocaleString("en-IN")}`,
      "Total Maturity Value": `₹${Math.round(maturityValue).toLocaleString("en-IN")}`,
    },
  };
}

export function calculateCompoundInterest(
  principal: number,
  annualRate: number,
  tenureYears: number,
  compoundingFrequency: "annually" | "semi-annually" | "quarterly" | "monthly" = "annually"
): CalculatorResult {
  if (principal <= 0 || annualRate <= 0 || tenureYears <= 0) {
    return { success: false, value: 0, formatted: "₹0", error: "Please enter positive numbers for principal, interest rate, and years." };
  }
  const freqMap = { annually: 1, "semi-annually": 2, quarterly: 4, monthly: 12 };
  const n = freqMap[compoundingFrequency] || 1;
  const r = annualRate / 100;
  const amount = principal * Math.pow(1 + r / n, n * tenureYears);
  const interestEarned = amount - principal;

  return {
    success: true,
    value: Math.round(amount),
    formatted: `₹${Math.round(amount).toLocaleString("en-IN")}`,
    breakdown: {
      "Initial Principal": `₹${Math.round(principal).toLocaleString("en-IN")}`,
      "Total Interest Earned": `₹${Math.round(interestEarned).toLocaleString("en-IN")}`,
      "Final Maturity Balance": `₹${Math.round(amount).toLocaleString("en-IN")}`,
      "Compounding Schedule": compoundingFrequency.toUpperCase(),
    },
  };
}

export function calculateSimpleInterest(principal: number, annualRate: number, tenureYears: number): CalculatorResult {
  if (principal <= 0 || annualRate <= 0 || tenureYears <= 0) {
    return { success: false, value: 0, formatted: "₹0", error: "Please enter positive numbers." };
  }
  const interest = (principal * annualRate * tenureYears) / 100;
  const totalAmount = principal + interest;

  return {
    success: true,
    value: Math.round(totalAmount),
    formatted: `₹${Math.round(totalAmount).toLocaleString("en-IN")}`,
    breakdown: {
      "Principal Amount": `₹${Math.round(principal).toLocaleString("en-IN")}`,
      "Simple Interest Earned": `₹${Math.round(interest).toLocaleString("en-IN")}`,
      "Total Maturity Amount": `₹${Math.round(totalAmount).toLocaleString("en-IN")}`,
    },
  };
}

export function calculatePercentage(type: "what_is_p_of_x" | "x_is_what_p_of_y" | "percent_change", val1: number, val2: number): CalculatorResult {
  if (isNaN(val1) || isNaN(val2)) {
    return { success: false, value: 0, formatted: "0", error: "Please enter valid numbers." };
  }
  if (type === "what_is_p_of_x") {
    const res = (val1 / 100) * val2;
    return { success: true, value: res, formatted: `${res}` };
  } else if (type === "x_is_what_p_of_y") {
    if (val2 === 0) return { success: false, value: 0, formatted: "0", error: "Cannot divide by zero" };
    const res = (val1 / val2) * 100;
    return { success: true, value: res, formatted: `${res.toFixed(2)}%` };
  } else {
    if (val1 === 0) return { success: false, value: 0, formatted: "0", error: "Base value cannot be zero" };
    const diff = val2 - val1;
    const res = (diff / val1) * 100;
    return {
      success: true,
      value: res,
      formatted: `${res >= 0 ? "+" : ""}${res.toFixed(2)}%`,
      breakdown: {
        "Absolute Change": val2 - val1,
        "Percentage Change": `${res.toFixed(2)}%`,
      },
    };
  }
}

export function calculateAge(birthdateStr: string): CalculatorResult {
  const birth = new Date(birthdateStr);
  if (isNaN(birth.getTime())) return { success: false, value: 0, formatted: "0", error: "Invalid date" };
  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  let days = now.getDate() - birth.getDate();

  if (days < 0) {
    months--;
    const prevMonthDays = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    days += prevMonthDays;
  }
  if (months < 0) {
    years--;
    months += 12;
  }
  const totalDays = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);

  return {
    success: true,
    value: years,
    formatted: `${years} Years, ${months} Months, ${days} Days`,
    breakdown: {
      "Age in Years": years,
      "Age in Months": years * 12 + months,
      "Total Weeks Lived": totalWeeks,
      "Total Days Lived": totalDays,
    },
  };
}

export function calculateDateDifference(startDateStr: string, endDateStr: string): CalculatorResult {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { success: false, value: 0, formatted: "0", error: "Please enter valid dates." };
  }
  const diffMs = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);
  const diffHours = diffDays * 24;

  return {
    success: true,
    value: diffDays,
    formatted: `${diffDays} Days`,
    breakdown: {
      "Total Days": diffDays,
      "Total Weeks": diffWeeks,
      "Total Hours": diffHours,
    },
  };
}

export function calculateBmi(weightKg: number, heightCm: number): CalculatorResult {
  if (weightKg <= 0 || heightCm <= 0) {
    return { success: false, value: 0, formatted: "0", error: "Please enter positive numbers for weight and height." };
  }
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  let category = "Normal weight";
  if (bmi < 18.5) category = "Underweight";
  else if (bmi >= 25 && bmi < 30) category = "Overweight";
  else if (bmi >= 30) category = "Obesity";

  return {
    success: true,
    value: Number(bmi.toFixed(1)),
    formatted: `${bmi.toFixed(1)} (${category})`,
    breakdown: {
      "BMI Value": bmi.toFixed(2),
      "Health Category": category,
      "Healthy Range": "18.5 - 24.9 kg/m²",
    },
  };
}

export function calculateDiscount(originalPrice: number, discountPercent: number): CalculatorResult {
  if (originalPrice < 0 || discountPercent < 0 || discountPercent > 100) {
    return { success: false, value: 0, formatted: "0", error: "Please enter valid price and discount percentage (0-100)." };
  }
  const saved = (originalPrice * discountPercent) / 100;
  const finalPrice = originalPrice - saved;

  return {
    success: true,
    value: finalPrice,
    formatted: `₹${finalPrice.toLocaleString("en-IN")}`,
    breakdown: {
      "Original Price": `₹${originalPrice.toLocaleString("en-IN")}`,
      "You Save": `₹${saved.toLocaleString("en-IN")}`,
      "Final Price": `₹${finalPrice.toLocaleString("en-IN")}`,
    },
  };
}

export function calculateSalesTax(price: number, taxRate: number, isInclusive: boolean = false): CalculatorResult {
  if (price < 0 || taxRate < 0) {
    return { success: false, value: 0, formatted: "0", error: "Please enter positive price and tax rate." };
  }
  if (isInclusive) {
    const preTax = price / (1 + taxRate / 100);
    const taxAmount = price - preTax;
    return {
      success: true,
      value: price,
      formatted: `₹${price.toLocaleString("en-IN")}`,
      breakdown: {
        "Net Price Before Tax": `₹${preTax.toFixed(2)}`,
        "Sales Tax Amount": `₹${taxAmount.toFixed(2)}`,
        "Total Final Price": `₹${price.toFixed(2)}`,
      },
    };
  } else {
    const taxAmount = (price * taxRate) / 100;
    const totalPrice = price + taxAmount;
    return {
      success: true,
      value: totalPrice,
      formatted: `₹${totalPrice.toLocaleString("en-IN")}`,
      breakdown: {
        "Base Price": `₹${price.toFixed(2)}`,
        "Sales Tax Amount": `₹${taxAmount.toFixed(2)}`,
        "Total Price After Tax": `₹${totalPrice.toFixed(2)}`,
      },
    };
  }
}

export function calculateTip(billAmount: number, tipPercent: number, splitCount: number = 1): CalculatorResult {
  if (billAmount <= 0 || tipPercent < 0 || splitCount <= 0) {
    return { success: false, value: 0, formatted: "0", error: "Please enter valid bill amount and split number." };
  }
  const tipAmount = (billAmount * tipPercent) / 100;
  const totalAmount = billAmount + tipAmount;
  const perPerson = totalAmount / splitCount;

  return {
    success: true,
    value: perPerson,
    formatted: `₹${perPerson.toFixed(2)} / person`,
    breakdown: {
      "Total Tip": `₹${tipAmount.toFixed(2)}`,
      "Total Bill + Tip": `₹${totalAmount.toFixed(2)}`,
      "Amount Per Person": `₹${perPerson.toFixed(2)}`,
    },
  };
}

export function calculateAspectRatio(origW: number, origH: number, targetW?: number, targetH?: number): CalculatorResult {
  if (origW <= 0 || origH <= 0) {
    return { success: false, value: 0, formatted: "0", error: "Original dimensions must be positive numbers." };
  }
  const ratio = origW / origH;
  if (targetW && targetW > 0) {
    const calcH = Math.round(targetW / ratio);
    return {
      success: true,
      value: calcH,
      formatted: `${targetW} × ${calcH} px`,
      breakdown: { "Aspect Ratio": `${ratio.toFixed(2)}:1`, "Calculated Height": `${calcH}px` },
    };
  } else if (targetH && targetH > 0) {
    const calcW = Math.round(targetH * ratio);
    return {
      success: true,
      value: calcW,
      formatted: `${calcW} × ${targetH} px`,
      breakdown: { "Aspect Ratio": `${ratio.toFixed(2)}:1`, "Calculated Width": `${calcW}px` },
    };
  }
  return {
    success: true,
    value: ratio,
    formatted: `${ratio.toFixed(2)}:1`,
    breakdown: { "Width / Height Ratio": ratio.toFixed(4) },
  };
}

export function calculateSpeedDistanceTime(
  solveFor: "speed" | "distance" | "time",
  speed?: number,
  distance?: number,
  time?: number
): CalculatorResult {
  if (solveFor === "speed") {
    if (!distance || !time || time <= 0) return { success: false, value: 0, formatted: "0", error: "Time must be > 0" };
    const s = distance / time;
    return { success: true, value: s, formatted: `${s.toFixed(2)} km/h` };
  } else if (solveFor === "distance") {
    if (!speed || !time) return { success: false, value: 0, formatted: "0", error: "Speed and time are required" };
    const d = speed * time;
    return { success: true, value: d, formatted: `${d.toFixed(2)} km` };
  } else {
    if (!distance || !speed || speed <= 0) return { success: false, value: 0, formatted: "0", error: "Speed must be > 0" };
    const t = distance / speed;
    return { success: true, value: t, formatted: `${t.toFixed(2)} hours` };
  }
}

export function calculateFuelCost(distanceKm: number, mileageKmpl: number, fuelPricePerLiter: number): CalculatorResult {
  if (distanceKm <= 0 || mileageKmpl <= 0 || fuelPricePerLiter <= 0) {
    return { success: false, value: 0, formatted: "₹0", error: "Please enter positive values for trip distance, mileage, and fuel price." };
  }
  const litersNeeded = distanceKm / mileageKmpl;
  const totalCost = litersNeeded * fuelPricePerLiter;

  return {
    success: true,
    value: Math.round(totalCost),
    formatted: `₹${Math.round(totalCost).toLocaleString("en-IN")}`,
    breakdown: {
      "Fuel Required": `${litersNeeded.toFixed(2)} Liters`,
      "Total Fuel Expense": `₹${Math.round(totalCost).toLocaleString("en-IN")}`,
      "Cost Per KM": `₹${(totalCost / distanceKm).toFixed(2)}/km`,
    },
  };
}

export function calculateOvertimePay(
  hourlyRate: number,
  regularHours: number,
  overtimeHours: number,
  overtimeMultiplier: number = 1.5
): CalculatorResult {
  if (hourlyRate <= 0 || regularHours < 0 || overtimeHours < 0) {
    return { success: false, value: 0, formatted: "₹0", error: "Please enter valid hourly rate and hours worked." };
  }
  const regularPay = hourlyRate * regularHours;
  const overtimeRate = hourlyRate * overtimeMultiplier;
  const overtimePay = overtimeRate * overtimeHours;
  const totalGross = regularPay + overtimePay;

  return {
    success: true,
    value: totalGross,
    formatted: `₹${totalGross.toFixed(2)}`,
    breakdown: {
      "Regular Pay": `₹${regularPay.toFixed(2)}`,
      "Overtime Rate": `₹${overtimeRate.toFixed(2)}/hr (${overtimeMultiplier}x)`,
      "Overtime Pay": `₹${overtimePay.toFixed(2)}`,
      "Total Gross Earnings": `₹${totalGross.toFixed(2)}`,
    },
  };
}

export function calculateBmr(weightKg: number, heightCm: number, ageYears: number, gender: "male" | "female"): CalculatorResult {
  if (weightKg <= 0 || heightCm <= 0 || ageYears <= 0) {
    return { success: false, value: 0, formatted: "0", error: "Please enter positive values for weight, height, and age." };
  }
  // Mifflin-St Jeor Equation
  const base = 10 * weightKg + 6.25 * heightCm - 5 * ageYears;
  const bmr = gender === "male" ? base + 5 : base - 161;

  return {
    success: true,
    value: Math.round(bmr),
    formatted: `${Math.round(bmr)} kcal/day`,
    breakdown: {
      "Basal Metabolic Rate": `${Math.round(bmr)} kcal/day`,
      "Sedentary Daily Burn (1.2x)": `${Math.round(bmr * 1.2)} kcal`,
      "Moderate Active Burn (1.55x)": `${Math.round(bmr * 1.55)} kcal`,
    },
  };
}

export function calculateCalorieDeficit(maintenanceCalories: number, deficitPercent: number = 20): CalculatorResult {
  if (maintenanceCalories <= 0 || deficitPercent <= 0 || deficitPercent >= 50) {
    return { success: false, value: 0, formatted: "0", error: "Please enter valid maintenance calories and deficit percentage." };
  }
  const deficit = (maintenanceCalories * deficitPercent) / 100;
  const targetCalories = maintenanceCalories - deficit;

  return {
    success: true,
    value: Math.round(targetCalories),
    formatted: `${Math.round(targetCalories)} kcal/day`,
    breakdown: {
      "Maintenance Intake": `${maintenanceCalories} kcal`,
      "Daily Deficit Cut": `${Math.round(deficit)} kcal`,
      "Daily Calorie Target": `${Math.round(targetCalories)} kcal`,
      "Estimated Fat Loss": `~${((deficit * 7) / 7700).toFixed(2)} kg/week`,
    },
  };
}

export function calculateSalaryToHourly(annualSalary: number, hoursPerWeek: number = 40, weeksPerYear: number = 52): CalculatorResult {
  if (annualSalary <= 0 || hoursPerWeek <= 0) {
    return { success: false, value: 0, formatted: "₹0", error: "Please enter a valid salary amount." };
  }
  const totalHours = hoursPerWeek * weeksPerYear;
  const hourly = annualSalary / totalHours;
  const monthly = annualSalary / 12;
  const weekly = annualSalary / weeksPerYear;

  return {
    success: true,
    value: Number(hourly.toFixed(2)),
    formatted: `₹${hourly.toFixed(2)} / hour`,
    breakdown: {
      "Hourly Wage": `₹${hourly.toFixed(2)}`,
      "Weekly Pay": `₹${weekly.toFixed(2)}`,
      "Monthly Salary": `₹${monthly.toFixed(2)}`,
      "Annual Salary": `₹${annualSalary.toLocaleString("en-IN")}`,
    },
  };
}

export function calculateHourlyToSalary(hourlyWage: number, hoursPerWeek: number = 40, weeksPerYear: number = 52): CalculatorResult {
  if (hourlyWage <= 0 || hoursPerWeek <= 0) {
    return { success: false, value: 0, formatted: "₹0", error: "Please enter a valid hourly rate." };
  }
  const annual = hourlyWage * hoursPerWeek * weeksPerYear;
  const monthly = annual / 12;
  const weekly = hourlyWage * hoursPerWeek;

  return {
    success: true,
    value: Math.round(annual),
    formatted: `₹${Math.round(annual).toLocaleString("en-IN")} / year`,
    breakdown: {
      "Weekly Gross": `₹${weekly.toFixed(2)}`,
      "Monthly Gross": `₹${monthly.toFixed(2)}`,
      "Annual Gross Salary": `₹${Math.round(annual).toLocaleString("en-IN")}`,
    },
  };
}

export function calculateCagr(beginValue: number, endValue: number, periods: number): CalculatorResult {
  if (beginValue <= 0 || endValue <= 0 || periods <= 0) {
    return { success: false, value: 0, formatted: "0%", error: "Please enter positive values." };
  }
  const cagr = (Math.pow(endValue / beginValue, 1 / periods) - 1) * 100;

  return {
    success: true,
    value: Number(cagr.toFixed(2)),
    formatted: `${cagr.toFixed(2)}%`,
    breakdown: {
      "Beginning Value": `₹${beginValue.toLocaleString("en-IN")}`,
      "Ending Value": `₹${endValue.toLocaleString("en-IN")}`,
      "Compound Annual Growth Rate": `${cagr.toFixed(2)}%`,
    },
  };
}

export function calculateInflation(currentAmount: number, inflationRate: number, years: number): CalculatorResult {
  if (currentAmount <= 0 || inflationRate < 0 || years <= 0) {
    return { success: false, value: 0, formatted: "₹0", error: "Please enter positive values." };
  }
  const futureValue = currentAmount * Math.pow(1 + inflationRate / 100, years);
  const purchasingPower = currentAmount / Math.pow(1 + inflationRate / 100, years);

  return {
    success: true,
    value: Math.round(futureValue),
    formatted: `₹${Math.round(futureValue).toLocaleString("en-IN")}`,
    breakdown: {
      "Future Equivalent Cost": `₹${Math.round(futureValue).toLocaleString("en-IN")}`,
      "Future Value of Current Cash": `₹${Math.round(purchasingPower).toLocaleString("en-IN")}`,
      "Cumulative Inflation Impact": `${((futureValue / currentAmount - 1) * 100).toFixed(1)}%`,
    },
  };
}

export function calculateMarkup(costPrice: number, markupPercent: number): CalculatorResult {
  if (costPrice <= 0 || markupPercent < 0) {
    return { success: false, value: 0, formatted: "₹0", error: "Please enter positive cost price and markup." };
  }
  const profit = (costPrice * markupPercent) / 100;
  const sellingPrice = costPrice + profit;
  const marginPercent = (profit / sellingPrice) * 100;

  return {
    success: true,
    value: sellingPrice,
    formatted: `₹${sellingPrice.toFixed(2)}`,
    breakdown: {
      "Cost Price": `₹${costPrice.toFixed(2)}`,
      "Profit Markup Amount": `₹${profit.toFixed(2)}`,
      "Selling Price": `₹${sellingPrice.toFixed(2)}`,
      "Equivalent Profit Margin": `${marginPercent.toFixed(2)}%`,
    },
  };
}

export function calculateMargin(revenue: number, cogs: number): CalculatorResult {
  if (revenue <= 0 || cogs < 0 || cogs > revenue) {
    return { success: false, value: 0, formatted: "0%", error: "COGS cannot exceed Revenue." };
  }
  const grossProfit = revenue - cogs;
  const marginPercent = (grossProfit / revenue) * 100;

  return {
    success: true,
    value: Number(marginPercent.toFixed(2)),
    formatted: `${marginPercent.toFixed(2)}%`,
    breakdown: {
      "Gross Profit": `₹${grossProfit.toFixed(2)}`,
      "Gross Profit Margin": `${marginPercent.toFixed(2)}%`,
      "Cost of Goods Sold Ratio": `${((cogs / revenue) * 100).toFixed(2)}%`,
    },
  };
}

export function calculateTimeDuration(
  h1: number = 0,
  m1: number = 0,
  s1: number = 0,
  h2: number = 0,
  m2: number = 0,
  s2: number = 0,
  op: "add" | "subtract" = "add"
): CalculatorResult {
  const totalSec1 = h1 * 3600 + m1 * 60 + s1;
  const totalSec2 = h2 * 3600 + m2 * 60 + s2;
  const resultSec = op === "add" ? totalSec1 + totalSec2 : Math.max(0, totalSec1 - totalSec2);

  const resH = Math.floor(resultSec / 3600);
  const resM = Math.floor((resultSec % 3600) / 60);
  const resS = resultSec % 60;

  return {
    success: true,
    value: resultSec,
    formatted: `${resH}h ${resM}m ${resS}s`,
    breakdown: {
      "Total Seconds": resultSec,
      "Total Minutes": Number((resultSec / 60).toFixed(2)),
      "Total Hours": Number((resultSec / 3600).toFixed(2)),
    },
  };
}

export function convertNumberToWords(num: number, currency: "INR" | "USD" | "NONE" = "INR"): CalculatorResult {
  if (isNaN(num)) return { success: false, value: 0, formatted: "", error: "Please enter a valid number." };

  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  const toWords = (n: number): string => {
    if (n === 0) return "Zero";
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + ones[n % 10] : "");
    if (n < 1000) return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 !== 0 ? " and " + toWords(n % 100) : "");
    if (n < 100000) return toWords(Math.floor(n / 1000)) + " Thousand" + (n % 1000 !== 0 ? " " + toWords(n % 1000) : "");
    if (n < 10000000) return toWords(Math.floor(n / 100000)) + " Lakh" + (n % 100000 !== 0 ? " " + toWords(n % 100000) : "");
    return toWords(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 !== 0 ? " " + toWords(n % 10000000) : "");
  };

  const words = toWords(Math.floor(num));
  let formatted = words;
  if (currency === "INR") formatted = `${words} Rupees Only`;
  if (currency === "USD") formatted = `${words} Dollars Only`;

  return { success: true, value: num, formatted };
}

export function convertUnits(val: number, from: string, to: string, type: "length" | "weight" | "temperature" | "data"): CalculatorResult {
  if (isNaN(val)) return { success: false, value: 0, formatted: "0", error: "Invalid value" };

  if (type === "temperature") {
    let celsius = val;
    if (from === "f") celsius = ((val - 32) * 5) / 9;
    if (from === "k") celsius = val - 273.15;

    let result = celsius;
    if (to === "f") result = (celsius * 9) / 5 + 32;
    if (to === "k") result = celsius + 273.15;
    return { success: true, value: Number(result.toFixed(2)), formatted: `${result.toFixed(2)} °${to.toUpperCase()}` };
  }

  const lengthRates: Record<string, number> = { m: 1, km: 1000, cm: 0.01, mm: 0.001, ft: 0.3048, in: 0.0254, mi: 1609.34 };
  const weightRates: Record<string, number> = { kg: 1, g: 0.001, mg: 0.000001, lb: 0.453592, oz: 0.0283495 };
  const dataRates: Record<string, number> = { b: 1, kb: 1024, mb: 1048576, gb: 1073741824, tb: 1099511627776 };

  let rates = lengthRates;
  if (type === "weight") rates = weightRates;
  if (type === "data") rates = dataRates;

  const base = val * (rates[from.toLowerCase()] || 1);
  const result = base / (rates[to.toLowerCase()] || 1);

  return { success: true, value: result, formatted: `${Number(result.toFixed(4))} ${to}` };
}

export function convertRomanNumerals(input: string): CalculatorResult {
  const clean = input.trim().toUpperCase();
  if (!clean) return { success: true, value: 0, formatted: "" };

  const romanMap: [string, number][] = [
    ["M", 1000], ["CM", 900], ["D", 500], ["CD", 400],
    ["C", 100], ["XC", 90], ["L", 50], ["XL", 40],
    ["X", 10], ["IX", 9], ["V", 5], ["IV", 4], ["I", 1]
  ];

  // Check if input is a decimal number
  if (/^\d+$/.test(clean)) {
    let num = parseInt(clean, 10);
    if (num <= 0 || num > 3999) {
      return { success: false, value: 0, formatted: "0", error: "Please enter a number between 1 and 3999." };
    }
    let roman = "";
    const breakdown: Record<string, string> = {};
    for (const [letter, val] of romanMap) {
      while (num >= val) {
        roman += letter;
        num -= val;
      }
    }
    breakdown["Decimal Input"] = clean;
    breakdown["Roman Output"] = roman;
    return { success: true, value: parseInt(clean, 10), formatted: roman, breakdown };
  }

  // Parse Roman to Decimal
  let total = 0;
  let i = 0;
  while (i < clean.length) {
    const two = clean.substring(i, i + 2);
    const foundTwo = romanMap.find(([r]) => r === two);
    if (foundTwo) {
      total += foundTwo[1];
      i += 2;
    } else {
      const one = clean.substring(i, i + 1);
      const foundOne = romanMap.find(([r]) => r === one);
      if (foundOne) {
        total += foundOne[1];
        i += 1;
      } else {
        return { success: false, value: 0, formatted: "0", error: `Invalid Roman numeral character: ${one}` };
      }
    }
  }

  return {
    success: true,
    value: total,
    formatted: `${total}`,
    breakdown: {
      "Roman Input": clean,
      "Standard Decimal Equivalent": total.toLocaleString(),
    },
  };
}

export function calculateWaterIntake(
  weightKg: number,
  exerciseMinutes: number = 30,
  climate: "temperate" | "hot" | "cold" = "temperate"
): CalculatorResult {
  if (weightKg <= 0) {
    return { success: false, value: 0, formatted: "0", error: "Weight must be greater than 0 kg." };
  }

  // Base hydration: ~35ml per kg of body weight
  const baseMl = weightKg * 35;

  // Exercise factor: ~350ml per 30 minutes of exercise
  const exerciseMl = (exerciseMinutes / 30) * 350;

  // Climate factor
  let climateMl = 0;
  if (climate === "hot") climateMl = 500;
  if (climate === "cold") climateMl = -200;

  const totalMl = Math.max(1000, Math.round(baseMl + exerciseMl + climateMl));
  const totalLiters = (totalMl / 1000).toFixed(2);
  const glasses = Math.round(totalMl / 250); // 250ml per standard glass

  return {
    success: true,
    value: parseFloat(totalLiters),
    formatted: `${totalLiters} Liters / Day (~${glasses} Glasses)`,
    breakdown: {
      "Base Hydration (Body Weight)": `${(baseMl / 1000).toFixed(2)} Liters`,
      "Activity Hydration Supplement": `+${(exerciseMl / 1000).toFixed(2)} Liters`,
      "Climate Adjustment": `${climateMl >= 0 ? "+" : ""}${(climateMl / 1000).toFixed(2)} Liters`,
      "Total Daily Intake Goal": `${totalLiters} L (${totalMl.toLocaleString()} ml)`,
      "Standard 250ml Glasses": `~${glasses} Glasses`,
    },
  };
}

