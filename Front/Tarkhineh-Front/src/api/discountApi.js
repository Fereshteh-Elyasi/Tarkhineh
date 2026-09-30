import { apiFetch } from "./client";

export function applyDiscountCode(code, subtotal) {
  return apiFetch("/discount/apply", {
    method: "POST",
    body: { code, subtotal },
  });
}

export function confirmPayment(orderId) {
  return apiFetch("/payment/confirm", {
    method: "POST",
    body: { orderId },
  });
}