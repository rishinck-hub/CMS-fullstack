// Basic date formatting and helpers

export function formatDateISO(date) {
  // Returns yyyy-mm-dd (for forms)
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
}

export function formatDateDisplay(date) {
  if (!date) return "";
  return new Date(date).toLocaleDateString();
}

export function formatTimeDisplay(date) {
  if (!date) return "";
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function isPast(date) {
  return new Date(date) < new Date();
}
