import { apiFetch } from "./client";

export function fetchSearchResults(query) {
  const q = query.trim();
  if (!q) return Promise.resolve([]);
  return apiFetch(`/search?q=${encodeURIComponent(q)}`);
}