import { API_URL } from "../services/session.js";
export function safeURL(value) {
  try {
    const url = new URL(value, API_URL);
    return value && ["http:", "https:"].includes(url.protocol)
      ? url.href
      : null;
  } catch {
    return null;
  }
}
