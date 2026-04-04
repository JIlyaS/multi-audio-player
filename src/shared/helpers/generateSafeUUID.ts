export const generateSafeUUID = (): string => {
  try {
    // Предпочтительный способ
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return String(crypto.randomUUID());
    }

    // Fallback для старых сред
    if (typeof crypto !== "undefined" && crypto.getRandomValues) {
      const pattern = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
      return pattern.replace(/[xy]/g, (c) => {
        const r = crypto.getRandomValues(new Uint8Array(1))[0] % 16;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }

    throw new Error("No secure UUID generation method available");
  } catch (error) {
    console.error("UUID generation failed:", error);
    throw new Error("Failed to generate unique identifier");
  }
}
