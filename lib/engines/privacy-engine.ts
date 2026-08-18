export interface PrivacyEngineResult {
  success: boolean;
  output: string;
  breakdown?: Record<string, string | number>;
  error?: string;
}

export function generateSecurePassword(options: {
  length?: number;
  uppercase?: boolean;
  lowercase?: boolean;
  numbers?: boolean;
  symbols?: boolean;
}): PrivacyEngineResult {
  const {
    length = 16,
    uppercase = true,
    lowercase = true,
    numbers = true,
    symbols = true,
  } = options;

  let chars = "";
  if (uppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (lowercase) chars += "abcdefghijklmnopqrstuvwxyz";
  if (numbers) chars += "0123456789";
  if (symbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";

  if (!chars) chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  const buffer = new Uint32Array(length);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(buffer);
  } else {
    for (let i = 0; i < length; i++) buffer[i] = Math.floor(Math.random() * chars.length);
  }

  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars[buffer[i] % chars.length];
  }

  // Calculate entropy: E = L * log2(R)
  const entropy = Math.round(length * Math.log2(chars.length));
  let strength = "Moderate";
  if (entropy > 80) strength = "Very Strong (Enterprise)";
  else if (entropy > 60) strength = "Strong";
  else if (entropy < 40) strength = "Weak";

  return {
    success: true,
    output: password,
    breakdown: {
      "Character Length": length,
      "Entropy (Bits of Security)": `${entropy} bits`,
      "Strength Assessment": strength,
      "Character Set Pool Size": `${chars.length} characters`,
    },
  };
}

export function checkPasswordStrength(password: string): PrivacyEngineResult {
  if (!password) return { success: true, output: "Enter a password to test strength." };

  let poolSize = 0;
  if (/[a-z]/.test(password)) poolSize += 26;
  if (/[A-Z]/.test(password)) poolSize += 26;
  if (/[0-9]/.test(password)) poolSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) poolSize += 32;

  const entropy = Math.round(password.length * Math.log2(Math.max(2, poolSize)));
  let score = "Weak";
  if (entropy >= 80) score = "Very Strong (Cryptographic Grade)";
  else if (entropy >= 60) score = "Strong";
  else if (entropy >= 45) score = "Moderate";

  return {
    success: true,
    output: `Strength: ${score}\nEntropy: ${entropy} bits`,
    breakdown: {
      "Length": password.length,
      "Contains Uppercase": /[A-Z]/.test(password) ? "Yes ✓" : "No ✗",
      "Contains Lowercase": /[a-z]/.test(password) ? "Yes ✓" : "No ✗",
      "Contains Numbers": /[0-9]/.test(password) ? "Yes ✓" : "No ✗",
      "Contains Symbols": /[^a-zA-Z0-9]/.test(password) ? "Yes ✓" : "No ✗",
      "Calculated Entropy": `${entropy} bits`,
    },
  };
}
