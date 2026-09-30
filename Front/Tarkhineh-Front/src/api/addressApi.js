import { apiFetch } from "./client";

export function fetchAddresses() {
  return apiFetch("/addresses");
}

export function createAddress(address) {
  return apiFetch("/addresses", {
    method: "POST",
    body: {
      label: address.label,
      phone: address.phone,
      fullAddress: address.fullAddress,
      isSelf: address.isSelf,
      recipientName: address.recipientName,
      lat: address.lat ?? null,
      lng: address.lng ?? null,
    },
  });
}

export function updateAddress(id, data) {
  return apiFetch(`/addresses/${id}`, {
    method: "PUT",
    body: data,
  });
}

export function deleteAddress(id) {
  return apiFetch(`/addresses/${id}`, { method: "DELETE" });
}