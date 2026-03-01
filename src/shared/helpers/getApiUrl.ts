// TODO: Временная доработка
export const getApiUrl = (param: string) => {
  console.log(
    "import.meta.env.VITE_APP_TITLE",
    import.meta.env.VITE_APP_API_URL,
    import.meta.env.VITE_APP_API_URI,
  );

  return `${import.meta.env.VITE_APP_API_URL}${import.meta.env.VITE_APP_API_URI}${param}`;
};
