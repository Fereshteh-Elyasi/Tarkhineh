const API_BASE = import.meta.env.VITE_API_BASE_URL;
const BACKEND_ORIGIN = API_BASE.replace(/\/api$/, "");

function getToken() {
  return localStorage.getItem("token");
}

export function resolveImageUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${BACKEND_ORIGIN}${path}`;
}

export async function apiFetch(path, options = {}) {
  const token = getToken();

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error || "خطایی رخ داد");
  }

  return data;
}