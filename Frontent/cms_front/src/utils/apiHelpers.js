// Utility helpers for API responses or requests

// Extracts data or error from axios response
export function getApiError(error) {
  if (!error) return "Unknown error";
  if (error.response?.data?.detail) return error.response.data.detail;
  if (error.response?.data?.message) return error.response.data.message;
  if (error.message) return error.message;
  return "Network or server error";
}

// Attach default params to query url
export function withQuery(url, params = {}) {
  const esc = encodeURIComponent;
  const query = Object.keys(params)
    .map(k => esc(k) + "=" + esc(params[k]))
    .join("&");
  return query ? `${url}?${query}` : url;
}
