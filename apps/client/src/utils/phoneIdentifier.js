/**
 * Normalize phone for MSG91 — same rules as Flutter AuthScreen._sendOtp:
 * digits only, prepend 91 when length is 10, result like 91XXXXXXXXXX (no +).
 */
export function getMsg91Identifier(val) {
  let digitsOnly = String(val || "").replace(/\D/g, "");
  if (digitsOnly.length === 10) {
    digitsOnly = `91${digitsOnly}`;
  }
  return digitsOnly;
}

export function isValidIndianPhone(val) {
  const cleaned = String(val || "").replace(/\D/g, "");
  return cleaned.length === 10 || (cleaned.startsWith("91") && cleaned.length === 12);
}
