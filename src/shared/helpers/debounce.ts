// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debounce = (fn: (...args: any[]) => void, ms: number) => {
  let timer: number | undefined;
  return (...args: unknown[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
};
