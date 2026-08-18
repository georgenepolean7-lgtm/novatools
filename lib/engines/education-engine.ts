export interface EducationEngineResult {
  success: boolean;
  formatted: string;
  breakdown?: Record<string, string | number>;
  error?: string;
}

export function calculateGpa(courses: { credits: number; gradePoint: number }[]): EducationEngineResult {
  if (!courses || courses.length === 0) {
    return { success: false, formatted: "0.00", error: "Please add at least one course." };
  }
  let totalPoints = 0;
  let totalCredits = 0;

  for (const c of courses) {
    if (c.credits > 0 && c.gradePoint >= 0) {
      totalPoints += c.credits * c.gradePoint;
      totalCredits += c.credits;
    }
  }

  if (totalCredits === 0) {
    return { success: false, formatted: "0.00", error: "Total credits must be greater than zero." };
  }

  const gpa = totalPoints / totalCredits;
  return {
    success: true,
    formatted: `${gpa.toFixed(2)} GPA`,
    breakdown: {
      "Cumulative GPA": gpa.toFixed(2),
      "Total Quality Points": totalPoints.toFixed(1),
      "Total Credit Hours": totalCredits,
      "Grade Equivalent": gpa >= 3.7 ? "A / Distinction" : gpa >= 3.0 ? "B / First Class" : gpa >= 2.0 ? "C / Average" : "Pass",
    },
  };
}

export function convertCgpaToPercentage(cgpa: number, scale: "10" | "4" = "10"): EducationEngineResult {
  if (cgpa < 0 || (scale === "10" && cgpa > 10) || (scale === "4" && cgpa > 4)) {
    return { success: false, formatted: "0%", error: `Please enter a valid CGPA between 0 and ${scale}.` };
  }

  // Standard CBSE / AICTE formula for 10-point scale: Percentage = CGPA * 9.5
  const percentage = scale === "10" ? cgpa * 9.5 : (cgpa / 4) * 100;

  return {
    success: true,
    formatted: `${percentage.toFixed(2)}%`,
    breakdown: {
      "Input CGPA": `${cgpa} / ${scale}`,
      "Calculated Percentage": `${percentage.toFixed(2)}%`,
      "Conversion Standard": scale === "10" ? "CBSE/AICTE Standard (CGPA × 9.5)" : "Standard 4.0 Scale Conversion",
      "Division": percentage >= 60 ? "First Division" : percentage >= 50 ? "Second Division" : "Third Division",
    },
  };
}

export function generateCitation(params: {
  style: "APA" | "MLA" | "Chicago";
  author: string;
  title: string;
  year: string;
  publisher?: string;
  url?: string;
}): EducationEngineResult {
  const { style, author, title, year, publisher, url } = params;
  if (!author || !title || !year) {
    return { success: false, formatted: "", error: "Author, Title, and Year are required." };
  }

  let citation = "";
  if (style === "APA") {
    citation = `${author} (${year}). *${title}*. ${publisher ? `${publisher}.` : ""}${url ? ` ${url}` : ""}`;
  } else if (style === "MLA") {
    citation = `${author}. *${title}*. ${publisher ? `${publisher}, ` : ""}${year}.${url ? ` ${url}` : ""}`;
  } else {
    citation = `${author}. ${year}. *${title}*. ${publisher ? `${publisher}.` : ""}${url ? ` ${url}` : ""}`;
  }

  return {
    success: true,
    formatted: citation,
    breakdown: {
      "Citation Style": `${style} 7th/8th Edition`,
      "Academic Standard": "Formatted Bibliographic Entry ✓",
    },
  };
}

export function calculateWeightedGrade(
  assignments: { name: string; score: number; maxScore: number; weightPercent: number }[]
): EducationEngineResult {
  if (!assignments || assignments.length === 0) {
    return { success: false, formatted: "0%", error: "Please enter at least one assignment category." };
  }

  let totalWeightedScore = 0;
  let totalWeight = 0;

  for (const item of assignments) {
    if (item.maxScore > 0 && item.weightPercent > 0) {
      const percentage = (item.score / item.maxScore) * 100;
      totalWeightedScore += (percentage * item.weightPercent);
      totalWeight += item.weightPercent;
    }
  }

  if (totalWeight === 0) {
    return { success: false, formatted: "0%", error: "Total weight percentage must be greater than zero." };
  }

  const finalPercentage = totalWeightedScore / totalWeight;
  let letter = "F";
  if (finalPercentage >= 90) letter = "A";
  else if (finalPercentage >= 80) letter = "B";
  else if (finalPercentage >= 70) letter = "C";
  else if (finalPercentage >= 60) letter = "D";

  return {
    success: true,
    formatted: `${finalPercentage.toFixed(2)}% (${letter})`,
    breakdown: {
      "Weighted Final Grade": `${finalPercentage.toFixed(2)}%`,
      "Letter Grade": letter,
      "Total Evaluated Weight": `${totalWeight}%`,
      "Performance Level": finalPercentage >= 75 ? "Good / Distinction" : finalPercentage >= 50 ? "Satisfactory" : "Needs Improvement",
    },
  };
}

export function calculateAttendance(
  classesAttended: number,
  totalClassesConducted: number,
  requiredPercentage: number = 75
): EducationEngineResult {
  if (totalClassesConducted <= 0 || classesAttended < 0 || classesAttended > totalClassesConducted) {
    return { success: false, formatted: "0%", error: "Attended classes cannot exceed total classes conducted." };
  }

  const currentPercent = (classesAttended / totalClassesConducted) * 100;
  let message = "";
  const breakdownDetails: Record<string, string | number> = {
    "Classes Attended": `${classesAttended} / ${totalClassesConducted}`,
    "Current Attendance": `${currentPercent.toFixed(2)}%`,
    "Required Threshold": `${requiredPercentage}%`,
  };

  if (currentPercent >= requiredPercentage) {
    // How many classes can safely be skipped?
    // (classesAttended) / (totalClassesConducted + x) >= (requiredPercentage / 100)
    // totalClassesConducted + x <= classesAttended / (requiredPercentage / 100)
    const maxTotalClasses = Math.floor(classesAttended / (requiredPercentage / 100));
    const safeBunks = Math.max(0, maxTotalClasses - totalClassesConducted);
    message = `Safe to miss next ${safeBunks} class(es)`;
    breakdownDetails["Attendance Status"] = "Eligible ✓";
    breakdownDetails["Classes You Can Safely Miss"] = `${safeBunks} Classes`;
  } else {
    // How many more classes must be attended consecutively?
    // (classesAttended + y) / (totalClassesConducted + y) >= (requiredPercentage / 100)
    // (100 * classesAttended + 100 * y) >= requiredPercentage * totalClassesConducted + requiredPercentage * y
    // y * (100 - requiredPercentage) >= requiredPercentage * totalClassesConducted - 100 * classesAttended
    const needed = Math.ceil((requiredPercentage * totalClassesConducted - 100 * classesAttended) / (100 - requiredPercentage));
    message = `Must attend next ${needed} class(es) consecutively`;
    breakdownDetails["Attendance Status"] = "Shortage (Below Requirement) ⚠️";
    breakdownDetails["Required Additional Classes"] = `${needed} Consecutive Classes`;
  }

  return {
    success: true,
    formatted: `${currentPercent.toFixed(2)}% (${message})`,
    breakdown: breakdownDetails,
  };
}

export function calculateExamScoreTarget(
  currentGradePercent: number,
  desiredFinalGradePercent: number,
  finalExamWeightPercent: number
): EducationEngineResult {
  if (finalExamWeightPercent <= 0 || finalExamWeightPercent >= 100) {
    return { success: false, formatted: "0%", error: "Final exam weight must be between 1% and 99%." };
  }

  // Final Grade = (Current Grade * (100 - Weight) + Exam Score * Weight) / 100
  // Desired * 100 = Current * (100 - Weight) + Exam * Weight
  // Exam * Weight = Desired * 100 - Current * (100 - Weight)
  const requiredExamScore = (desiredFinalGradePercent * 100 - currentGradePercent * (100 - finalExamWeightPercent)) / finalExamWeightPercent;

  let feasibility = "Achievable ✓";
  if (requiredExamScore > 100) feasibility = "Impossible (Requires over 100%)";
  else if (requiredExamScore <= 0) feasibility = "Already Secured (Even with 0%)";

  return {
    success: true,
    formatted: `${Math.max(0, Math.round(requiredExamScore))}% Required`,
    breakdown: {
      "Target Course Grade": `${desiredFinalGradePercent}%`,
      "Current Grade": `${currentGradePercent}%`,
      "Final Exam Weight": `${finalExamWeightPercent}%`,
      "Score Needed on Final Exam": `${requiredExamScore.toFixed(2)}%`,
      "Feasibility": feasibility,
    },
  };
}

export function calculateStudyTimePlan(creditHours: number, courseDifficulty: "easy" | "medium" | "hard" = "medium", daysPerWeek: number = 5): EducationEngineResult {
  if (creditHours <= 0) {
    return { success: false, formatted: "0 hrs", error: "Credit hours must be positive." };
  }

  const multiplier = courseDifficulty === "hard" ? 3 : courseDifficulty === "easy" ? 1.5 : 2;
  const totalWeeklyHours = creditHours * multiplier;
  const dailyHours = totalWeeklyHours / Math.max(1, Math.min(7, daysPerWeek));

  return {
    success: true,
    formatted: `${totalWeeklyHours} Hours / Week`,
    breakdown: {
      "Course Credits": `${creditHours} Credits`,
      "Difficulty Factor": `${multiplier} hrs study per credit hour`,
      "Total Recommended Weekly Study": `${totalWeeklyHours} Hours`,
      "Daily Study Time": `${dailyHours.toFixed(1)} Hours / Day (${daysPerWeek} days/wk)`,
    },
  };
}
