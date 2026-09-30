import { apiFetch } from "./client";

export function fetchBranches() {
  return apiFetch("/branches");
}

export function fetchBranchBySlug(slug) {
  return apiFetch(`/branches/${slug}`);
}
