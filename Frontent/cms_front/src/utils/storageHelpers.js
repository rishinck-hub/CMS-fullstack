// For managing storage (local/session)

export function getStorage(key, fallback = null) {
  try {
    const val = window.localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

export function setStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function removeStorage(key) {
  try {
    window.localStorage.removeItem(key);
  } catch {}
}
