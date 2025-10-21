// Common validation functions

export function isEmail(email) {
  if (!email) return false;
  return /^[^@]+@[^@]+\.[^@]+$/.test(email);
}

export function isPhone(phone) {
  return /^\d{10}$/.test(phone || "");
}

export function isRequired(value) {
  return value !== undefined && value !== null && value !== "";
}

export function isPositiveNumber(val) {
  return typeof val === "number" && val > 0;
}
