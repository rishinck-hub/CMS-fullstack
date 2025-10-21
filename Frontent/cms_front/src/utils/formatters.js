// Functions to format text, phone, currency, etc.

export function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
}

export function formatPhone(phone) {
  if (!phone) return "";
  // Simple: (123) 456-7890
  return phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
}

export function formatCurrency(amount) {
  // INR or USD
  return typeof amount === "number"
    ? amount.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 })
    : amount;
}
