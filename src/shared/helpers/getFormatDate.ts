export const getFormatDate = (): string => {
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    //   timeZoneName: "long",
    //   timeZone: "UTC",
    } as const;

    const formatter = new Intl.DateTimeFormat("ru-RU", options);

    return formatter.format(new Date());
} // new Intl.DateTimeFormat('en-US').format(date)