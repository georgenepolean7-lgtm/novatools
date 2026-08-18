export interface IndiaEngineResult {
  success: boolean;
  formatted: string;
  breakdown?: Record<string, string | number>;
  error?: string;
}

export function calculateGst(amount: number, gstRatePercent: number, isInclusive: boolean = false): IndiaEngineResult {
  if (amount <= 0 || gstRatePercent < 0) {
    return { success: false, formatted: "₹0", error: "Please enter positive amount and valid GST slab rate (5%, 12%, 18%, 28%)." };
  }

  let baseAmount: number;
  let gstAmount: number;
  let totalAmount: number;

  if (isInclusive) {
    baseAmount = (amount * 100) / (100 + gstRatePercent);
    gstAmount = amount - baseAmount;
    totalAmount = amount;
  } else {
    baseAmount = amount;
    gstAmount = (amount * gstRatePercent) / 100;
    totalAmount = amount + gstAmount;
  }

  const cgst = gstAmount / 2;
  const sgst = gstAmount / 2;

  return {
    success: true,
    formatted: `₹${Math.round(totalAmount).toLocaleString("en-IN")}`,
    breakdown: {
      "Base Amount": `₹${baseAmount.toFixed(2)}`,
      "GST Rate": `${gstRatePercent}%`,
      "CGST (Central Tax)": `₹${cgst.toFixed(2)} (${(gstRatePercent / 2).toFixed(1)}%)`,
      "SGST / UTGST (State Tax)": `₹${sgst.toFixed(2)} (${(gstRatePercent / 2).toFixed(1)}%)`,
      "Total GST Amount": `₹${gstAmount.toFixed(2)}`,
      "Final Total (Invoice Amount)": `₹${totalAmount.toFixed(2)}`,
    },
  };
}

export function compareTaxRegimes(annualIncome: number, deductions80C: number = 150000, deductions80D: number = 25000, hra: number = 0): IndiaEngineResult {
  if (annualIncome <= 0) return { success: false, formatted: "₹0", error: "Please enter a valid annual income." };

  // New Tax Regime (FY 2024-25 / AY 2025-26 Budget Slabs)
  const standardDeductionNew = 75000;
  const taxableIncomeNew = Math.max(0, annualIncome - standardDeductionNew);
  let taxNew = 0;

  if (taxableIncomeNew > 1500000) {
    taxNew += (taxableIncomeNew - 1500000) * 0.30;
    taxNew += 300000 * 0.20;
    taxNew += 300000 * 0.15;
    taxNew += 300000 * 0.10;
    taxNew += 300000 * 0.05;
  } else if (taxableIncomeNew > 1200000) {
    taxNew += (taxableIncomeNew - 1200000) * 0.20;
    taxNew += 300000 * 0.15;
    taxNew += 300000 * 0.10;
    taxNew += 300000 * 0.05;
  } else if (taxableIncomeNew > 900000) {
    taxNew += (taxableIncomeNew - 900000) * 0.15;
    taxNew += 300000 * 0.10;
    taxNew += 300000 * 0.05;
  } else if (taxableIncomeNew > 600000) {
    taxNew += (taxableIncomeNew - 600000) * 0.10;
    taxNew += 300000 * 0.05;
  } else if (taxableIncomeNew > 300000) {
    taxNew += (taxableIncomeNew - 300000) * 0.05;
  }

  // Section 87A Rebate for New Regime (up to 7 Lakhs taxable = 0 tax)
  if (taxableIncomeNew <= 700000) {
    taxNew = 0;
  } else {
    taxNew += taxNew * 0.04; // 4% cess
  }

  // Old Tax Regime
  const standardDeductionOld = 50000;
  const totalDeductionsOld = standardDeductionOld + Math.min(150000, deductions80C) + Math.min(50000, deductions80D) + hra;
  const taxableIncomeOld = Math.max(0, annualIncome - totalDeductionsOld);
  let taxOld = 0;

  if (taxableIncomeOld > 1000000) {
    taxOld += (taxableIncomeOld - 1000000) * 0.30;
    taxOld += 500000 * 0.20;
    taxOld += 250000 * 0.05;
  } else if (taxableIncomeOld > 500000) {
    taxOld += (taxableIncomeOld - 500000) * 0.20;
    taxOld += 250000 * 0.05;
  } else if (taxableIncomeOld > 250000) {
    taxOld += (taxableIncomeOld - 250000) * 0.05;
  }

  if (taxableIncomeOld <= 500000) {
    taxOld = 0;
  } else {
    taxOld += taxOld * 0.04; // 4% cess
  }

  const savings = Math.abs(taxOld - taxNew);
  const recommended = taxNew <= taxOld ? "New Tax Regime" : "Old Tax Regime";

  return {
    success: true,
    formatted: `Recommended: ${recommended} (Save ₹${Math.round(savings).toLocaleString("en-IN")})`,
    breakdown: {
      "Gross Annual Income": `₹${annualIncome.toLocaleString("en-IN")}`,
      "Tax under New Regime": `₹${Math.round(taxNew).toLocaleString("en-IN")}`,
      "Tax under Old Regime": `₹${Math.round(taxOld).toLocaleString("en-IN")}`,
      "Recommended Option": recommended,
      "Net Annual Tax Savings": `₹${Math.round(savings).toLocaleString("en-IN")}`,
    },
  };
}

export function calculateGratuity(lastDrawnBasicSalary: number, yearsOfService: number): IndiaEngineResult {
  if (lastDrawnBasicSalary <= 0 || yearsOfService < 5) {
    return {
      success: false,
      formatted: "₹0",
      error: "Gratuity is applicable after minimum 5 continuous years of service with valid basic salary.",
    };
  }
  const gratuity = (15 * lastDrawnBasicSalary * yearsOfService) / 26;
  const maxGratuityCap = 2000000; // ₹20 Lakhs tax exemption cap under Indian law
  const payable = Math.min(gratuity, maxGratuityCap);

  return {
    success: true,
    formatted: `₹${Math.round(payable).toLocaleString("en-IN")}`,
    breakdown: {
      "Basic Salary + DA": `₹${lastDrawnBasicSalary.toLocaleString("en-IN")}`,
      "Tenure Completed": `${yearsOfService} Years`,
      "Gratuity Calculated": `₹${Math.round(gratuity).toLocaleString("en-IN")}`,
      "Statutory Cap": "₹20,00,000 (Tax-Free)",
      "Payable Gratuity": `₹${Math.round(payable).toLocaleString("en-IN")}`,
    },
  };
}

export function validateIfsc(ifscCode: string): IndiaEngineResult {
  const code = ifscCode.trim().toUpperCase();
  const regex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  if (!regex.test(code)) {
    return {
      success: false,
      formatted: "Invalid IFSC Code",
      error: "IFSC code must be 11 characters (e.g. SBIN0001234): 4 alphabetic bank code, 5th character '0', and 6 branch characters.",
    };
  }
  return {
    success: true,
    formatted: `Valid IFSC: ${code}`,
    breakdown: {
      "Bank Code Prefix": code.substring(0, 4),
      "Control Character": code.charAt(4),
      "Branch Identifier": code.substring(5),
      "Standard Compliance": "Verified against RBI format ✓",
    },
  };
}

export function calculateEpf(
  monthlyBasicSalary: number,
  currentAge: number = 25,
  retirementAge: number = 58,
  currentBalance: number = 0,
  annualSalaryIncreasePercent: number = 5,
  interestRatePercent: number = 8.25
): IndiaEngineResult {
  if (monthlyBasicSalary <= 0 || currentAge >= retirementAge) {
    return { success: false, formatted: "₹0", error: "Please enter valid basic salary and age parameters." };
  }

  const yearsToRetire = retirementAge - currentAge;
  let balance = currentBalance;
  let currentBasic = monthlyBasicSalary;
  let totalEmployeeContrib = 0;
  let totalEmployerContrib = 0;

  for (let y = 0; y < yearsToRetire; y++) {
    const employeeMonthly = currentBasic * 0.12;
    const employerEpfMonthly = currentBasic * 0.0367; // 3.67% to EPF (8.33% goes to EPS capped at 15k basic)

    const yearlyContrib = (employeeMonthly + employerEpfMonthly) * 12;
    totalEmployeeContrib += employeeMonthly * 12;
    totalEmployerContrib += employerEpfMonthly * 12;

    const interest = (balance + yearlyContrib / 2) * (interestRatePercent / 100);
    balance += yearlyContrib + interest;

    currentBasic += currentBasic * (annualSalaryIncreasePercent / 100);
  }

  const totalInterestEarned = balance - (currentBalance + totalEmployeeContrib + totalEmployerContrib);

  return {
    success: true,
    formatted: `₹${Math.round(balance).toLocaleString("en-IN")}`,
    breakdown: {
      "Total Maturity Corpus": `₹${Math.round(balance).toLocaleString("en-IN")}`,
      "Employee Contribution (12%)": `₹${Math.round(totalEmployeeContrib).toLocaleString("en-IN")}`,
      "Employer Contribution (3.67%)": `₹${Math.round(totalEmployerContrib).toLocaleString("en-IN")}`,
      "Total Interest Accrued": `₹${Math.round(totalInterestEarned).toLocaleString("en-IN")}`,
      "Retirement Horizon": `${yearsToRetire} Years (Age ${retirementAge})`,
    },
  };
}

export function validatePanCard(panStr: string): IndiaEngineResult {
  const clean = panStr.trim().toUpperCase();
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

  if (!panRegex.test(clean)) {
    return { success: false, formatted: "Invalid PAN Format", error: "PAN must be 10 characters (5 uppercase letters, 4 digits, 1 letter, e.g. ABCDE1234F)." };
  }

  const entityCode = clean.charAt(3);
  const entities: Record<string, string> = {
    P: "Individual / Person",
    C: "Company / Corporation",
    H: "Hindu Undivided Family (HUF)",
    F: "Firm / Limited Liability Partnership (LLP)",
    A: "Association of Persons (AOP)",
    T: "Trust",
    B: "Body of Individuals (BOI)",
    L: "Local Authority",
    J: "Artificial Juridical Person",
    G: "Government Agency",
  };

  const entityType = entities[entityCode] || "Other Entity";
  const surnameInitial = clean.charAt(4);

  return {
    success: true,
    formatted: `Valid PAN (${entityType}) ✓`,
    breakdown: {
      "PAN Number": clean,
      "Entity Classification": entityType,
      "4th Character Meaning": `"${entityCode}" stands for ${entityType}`,
      "5th Character (Surname Initial)": `"${surnameInitial}"`,
      "Format Compliance": "Valid Income Tax Department Syntax ✓",
    },
  };
}

export function validateAadhaarVerhoeff(aadhaarStr: string): IndiaEngineResult {
  const clean = aadhaarStr.trim().replace(/[\s-]/g, "");

  if (!/^\d{12}$/.test(clean)) {
    return { success: false, formatted: "Invalid Aadhaar Format", error: "Aadhaar number must consist of exactly 12 numeric digits." };
  }

  // Verhoeff algorithm multiplication and permutation matrices
  const d = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
    [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
    [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
    [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
    [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
    [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
    [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
    [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
  ];

  const p = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
    [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
    [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
    [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
    [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
    [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
    [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
  ];

  let c = 0;
  const digits = clean.split("").map(Number).reverse();

  for (let i = 0; i < digits.length; i++) {
    c = d[c][p[i % 8][digits[i]]];
  }

  if (c !== 0) {
    return { success: false, formatted: "Checksum Failed", error: "Aadhaar checksum failed. Number has a typo or invalid Verhoeff digit." };
  }

  const masked = `XXXX-XXXX-${clean.slice(8)}`;

  return {
    success: true,
    formatted: "Valid Aadhaar Checksum ✓",
    breakdown: {
      "Masked Format": masked,
      "Verhoeff Checksum": "Passed (Valid Checksum)",
      "Format Length": "12 Digits",
    },
  };
}

export function convertNumberToIndianWords(num: number): IndiaEngineResult {
  if (isNaN(num) || num < 0) {
    return { success: false, formatted: "", error: "Please enter a valid positive number." };
  }

  const a = ["", "One ", "Two ", "Three ", "Four ", "Five ", "Six ", "Seven ", "Eight ", "Nine ", "Ten ", "Eleven ", "Twelve ", "Thirteen ", "Fourteen ", "Fifteen ", "Sixteen ", "Seventeen ", "Eighteen ", "Nineteen "];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  const inWords = (n: number): string => {
    if (n === 0) return "Zero";
    let str = "";
    const crore = Math.floor(n / 10000000);
    n %= 10000000;
    const lakh = Math.floor(n / 100000);
    n %= 100000;
    const thousand = Math.floor(n / 1000);
    n %= 1000;
    const hundred = Math.floor(n / 100);
    n %= 100;

    if (crore > 0) str += `${inWords(crore)} Crore `;
    if (lakh > 0) str += `${inWords(lakh)} Lakh `;
    if (thousand > 0) str += `${inWords(thousand)} Thousand `;
    if (hundred > 0) str += `${a[hundred]}Hundred `;
    if (n > 0) {
      if (str !== "") str += "and ";
      if (n < 20) str += a[n];
      else str += `${b[Math.floor(n / 10)]} ${a[n % 10]}`;
    }
    return str.trim();
  };

  const words = inWords(Math.floor(num));
  const formattedCurrency = `Rupees ${words} Only`;

  return {
    success: true,
    formatted: formattedCurrency,
    breakdown: {
      "Numeric Amount": `₹${num.toLocaleString("en-IN")}`,
      "Indian Currency Text": formattedCurrency,
      "Numbering System": "Indian Lacs & Crores Standard",
    },
  };
}

export function validateIndianPinCode(pincodeStr: string): IndiaEngineResult {
  const clean = pincodeStr.trim();
  if (!/^[1-9][0-9]{5}$/.test(clean)) {
    return { success: false, formatted: "Invalid PIN Code", error: "PIN code must be a 6-digit number not starting with 0." };
  }

  const firstDigit = clean.charAt(0);
  const zones: Record<string, string> = {
    "1": "Northern Zone (Delhi, Haryana, Punjab, Himachal Pradesh, J&K, Chandigarh)",
    "2": "Northern Zone (Uttar Pradesh, Uttarakhand)",
    "3": "Western Zone (Rajasthan, Gujarat, Daman & Diu, Dadra & Nagar Haveli)",
    "4": "Western Zone (Maharashtra, Goa, Madhya Pradesh, Chhattisgarh)",
    "5": "Southern Zone (Andhra Pradesh, Telangana, Karnataka)",
    "6": "Southern Zone (Tamil Nadu, Kerala, Puducherry, Lakshadweep)",
    "7": "Eastern Zone (West Bengal, Odisha, North Eastern States, Andaman & Nicobar)",
    "8": "Eastern Zone (Bihar, Jharkhand)",
    "9": "APS (Army Postal Service / Field Post Office)",
  };

  const zoneDesc = zones[firstDigit] || "Indian Postal Circle";

  return {
    success: true,
    formatted: `Valid PIN: ${clean}`,
    breakdown: {
      "Postal PIN Code": clean,
      "Postal Zone": zoneDesc,
      "First Digit (Zone Indicator)": firstDigit,
      "Validation Status": "Valid Indian Postal Code Format ✓",
    },
  };
}
