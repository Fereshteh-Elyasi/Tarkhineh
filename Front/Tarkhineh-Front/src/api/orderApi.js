import { apiFetch } from "./client";

export function fetchOrders() {
  return apiFetch("/orders");
}

export function createOrder(payload) {
  return apiFetch("/orders", {
    method: "POST",
    body: payload,
  });
}

export function cancelOrder(id) {
  return apiFetch(`/orders/${id}/cancel`, { method: "POST" });
}