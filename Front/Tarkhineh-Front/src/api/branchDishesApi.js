import { apiFetch } from "./client";

export function fetchBranchDishes(slug) {
  return apiFetch(`/branches/${slug}/dishes`);
}

export function fetchBranchReviews(slug) {
  return apiFetch(`/branches/${slug}/reviews`);
}