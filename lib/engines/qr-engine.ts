export interface QrEngineResult {
  success: boolean;
  payload: string;
  formattedDisplay: string;
  breakdown?: Record<string, string | number>;
}

export function generateVCardQr(vcard: {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  organization?: string;
  title?: string;
  website?: string;
}): QrEngineResult {
  const payload = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${vcard.lastName};${vcard.firstName};;;`,
    `FN:${vcard.firstName} ${vcard.lastName}`.trim(),
    vcard.organization ? `ORG:${vcard.organization}` : "",
    vcard.title ? `TITLE:${vcard.title}` : "",
    vcard.phone ? `TEL;TYPE=CELL:${vcard.phone}` : "",
    vcard.email ? `EMAIL;TYPE=INTERNET:${vcard.email}` : "",
    vcard.website ? `URL:${vcard.website}` : "",
    "END:VCARD",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    success: true,
    payload,
    formattedDisplay: `vCard 3.0: ${vcard.firstName} ${vcard.lastName} (${vcard.phone || vcard.email || "Contact"})`,
    breakdown: {
      "Full Name": `${vcard.firstName} ${vcard.lastName}`.trim(),
      "Phone": vcard.phone || "(None)",
      "Email": vcard.email || "(None)",
      "Organization": vcard.organization || "(None)",
      "Standard": "vCard 3.0 Standard Contact Format",
    },
  };
}

export function generateEmailQr(email: string, subject: string, body: string): QrEngineResult {
  const encSubject = encodeURIComponent(subject);
  const encBody = encodeURIComponent(body);
  const payload = `mailto:${email}?subject=${encSubject}&body=${encBody}`;

  return {
    success: true,
    payload,
    formattedDisplay: `mailto:${email}`,
    breakdown: {
      "Recipient Email": email,
      "Subject Line": subject || "(None)",
      "Message Body": body ? `${body.slice(0, 30)}...` : "(None)",
      "Action": "Opens default mail client with pre-filled email",
    },
  };
}

export function generateSmsQr(phone: string, message: string): QrEngineResult {
  const payload = `SMSTO:${phone}:${message}`;

  return {
    success: true,
    payload,
    formattedDisplay: `SMS to ${phone}`,
    breakdown: {
      "Phone Number": phone,
      "Pre-filled Message": message || "(Empty)",
      "Action": "Opens SMS messaging app on mobile devices",
    },
  };
}

export function generateUpiPaymentQr(vpa: string, payeeName: string, amount?: number, note?: string): QrEngineResult {
  let payload = `upi://pay?pa=${encodeURIComponent(vpa)}&pn=${encodeURIComponent(payeeName)}&cu=INR`;
  if (amount && amount > 0) {
    payload += `&am=${amount.toFixed(2)}`;
  }
  if (note) {
    payload += `&tn=${encodeURIComponent(note)}`;
  }

  return {
    success: true,
    payload,
    formattedDisplay: `UPI: ${vpa} (${payeeName})${amount ? ` - ₹${amount.toFixed(2)}` : ""}`,
    breakdown: {
      "UPI VPA": vpa,
      "Payee Name": payeeName,
      "Amount": amount ? `₹${amount.toFixed(2)}` : "Any Amount (Dynamic)",
      "Payment Note": note || "(None)",
      "Supported Apps": "Google Pay, PhonePe, Paytm, BHIM, Cred",
    },
  };
}
