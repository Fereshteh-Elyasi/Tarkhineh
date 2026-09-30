import { apiFetch } from "./client";

export function fetchTypeTabs() {
  return apiFetch("/menu/tabs");
}

export function fetchMenuItems(tab) {
  return apiFetch(`/menu/items?tab=${tab}`);
}
