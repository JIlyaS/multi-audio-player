export function getBasePrefix() {
  const base = import.meta.env.VITE_BASE_URL || "/";

  console.log(
    "getBasePrefix",
    import.meta.env.VITE_BASE_URL,
    base,
    base.replace(/^\/+/, "").replace(/\/+$/, "") || "",
  );
  return base.replace(/^\/+/, "").replace(/\/+$/, "") || "";
}
