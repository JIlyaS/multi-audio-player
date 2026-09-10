export function getBasePrefix() {
  const base = import.meta.env.VITE_BASE_URL || "/";
  return base.replace(/^\/+/, "").replace(/\/+$/, "") || undefined;
}
