// General catch-all for any helpers

export function sleep(ms = 300) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function objectMap(obj, fn) {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, fn(v, k)]));
}

export function isEmpty(obj) {
  return obj && Object.keys(obj).length === 0;
}
