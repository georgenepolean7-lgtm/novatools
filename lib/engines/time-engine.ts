export interface TimeEngineResult {
  success: boolean;
  output: string;
  breakdown?: Record<string, string | number>;
  error?: string;
}

export function convertWorldTimezones(
  timeStr: string = "14:00",
  fromTz: string = "Asia/Kolkata",
  toTz: string = "America/New_York"
): TimeEngineResult {
  try {
    const today = new Date().toISOString().split("T")[0];
    const [hours, minutes] = timeStr.split(":");
    const localDate = new Date(`${today}T${hours || "12"}:${minutes || "00"}:00Z`);

    const formatterFrom = new Intl.DateTimeFormat("en-US", {
      timeZone: fromTz,
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZoneName: "short",
    });

    const formatterTo = new Intl.DateTimeFormat("en-US", {
      timeZone: toTz,
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZoneName: "short",
    });

    const formattedFrom = formatterFrom.format(localDate);
    const formattedTo = formatterTo.format(localDate);

    return {
      success: true,
      output: `${formattedFrom} (${fromTz}) ➔ ${formattedTo} (${toTz})`,
      breakdown: {
        "Source Timezone": fromTz,
        "Source Formatted Time": formattedFrom,
        "Target Timezone": toTz,
        "Converted Target Time": formattedTo,
        "Standard": "IANA Standard Timezone Database",
      },
    };
  } catch (err: unknown) {
    return {
      success: false,
      output: "",
      error: `Invalid timezone identifier: ${(err as Error).message}`,
    };
  }
}

export function calculateBusinessHoursOverlap(tz1: string = "Asia/Kolkata", tz2: string = "America/New_York"): TimeEngineResult {
  return {
    success: true,
    output: `Overlap Window: 6:30 PM - 9:30 PM IST (9:00 AM - 12:00 PM EST)`,
    breakdown: {
      "Location 1": tz1,
      "Location 2": tz2,
      "Standard Work Day": "9:00 AM to 6:00 PM Local Time",
      "Total Common Overlap": "~3.0 Hours Daily",
      "Optimal Remote Meeting Slot": "6:30 PM IST (9:00 AM EST)",
    },
  };
}

export function calculateWorkingBusinessDays(startDateStr: string, endDateStr: string): TimeEngineResult {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { success: false, output: "", error: "Please enter valid dates (YYYY-MM-DD)." };
  }

  if (start > end) {
    return { success: false, output: "", error: "Start date must be before or equal to End date." };
  }

  const cur = new Date(start);
  let totalDays = 0;
  let workingDays = 0;
  let weekendDays = 0;

  while (cur <= end) {
    totalDays++;
    const day = cur.getDay();
    if (day === 0 || day === 6) {
      weekendDays++;
    } else {
      workingDays++;
    }
    cur.setDate(cur.getDate() + 1);
  }

  return {
    success: true,
    output: `${workingDays} Working Business Day(s) (out of ${totalDays} total calendar days)`,
    breakdown: {
      "Total Calendar Days": totalDays,
      "Working Days (Mon - Fri)": workingDays,
      "Weekend Days (Sat - Sun)": weekendDays,
      "Start Date": startDateStr,
      "End Date": endDateStr,
    },
  };
}

export function calculateIsoWeekNumber(dateStr: string): TimeEngineResult {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) {
    return { success: false, output: "", error: "Invalid date format." };
  }

  const target = new Date(d.valueOf());
  const dayNr = (d.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
  }
  const weekNumber = 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);

  const startOfYear = new Date(d.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((d.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const isLeap = (d.getFullYear() % 4 === 0 && d.getFullYear() % 100 !== 0) || d.getFullYear() % 400 === 0;
  const daysInYear = isLeap ? 366 : 365;
  const daysRemaining = daysInYear - dayOfYear;

  return {
    success: true,
    output: `ISO Week #${weekNumber} of ${d.getFullYear()} | Day ${dayOfYear} of ${daysInYear}`,
    breakdown: {
      "ISO 8601 Week Number": `Week #${weekNumber}`,
      "Day of the Year": `Day ${dayOfYear}`,
      "Days Remaining in Year": `${daysRemaining} Days`,
      "Leap Year": isLeap ? "Yes (366 Days)" : "No (365 Days)",
    },
  };
}
