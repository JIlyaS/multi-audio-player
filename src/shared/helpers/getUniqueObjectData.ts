export const getUniqueObjectData = <T>(data: T[]): T[] => {
  return Array.from(new Set(data.map((item) => JSON.stringify(item)))).map(
    (item) => JSON.parse(item),
  );
};