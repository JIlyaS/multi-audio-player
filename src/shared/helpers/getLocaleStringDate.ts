export const getLocaleStringDate = (): string => {
    const currentDate = new Date();

    return currentDate.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
}