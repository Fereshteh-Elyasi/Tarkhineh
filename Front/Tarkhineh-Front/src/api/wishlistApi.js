import { apiFetch } from "./client";

export function fetchWishlist() {
  return apiFetch("/wishlist");
}

export function addToWishlist(menuItemId) {
  return apiFetch("/wishlist", {
    method: "POST",
    body: { menuItemId },
  });
}

export function removeFromWishlist(menuItemId) {
  return apiFetch(`/wishlist/${menuItemId}`, { method: "DELETE" });
}