import { apiFetch } from "./client";

export function updateProfile(data) {
  return apiFetch("/auth/me", {
    method: "PUT",
    body: {
      fullName: data.fullName,
      displayName: data.displayName,
      email: data.email,
      birthDate: data.birthDate,
    },
  });
}