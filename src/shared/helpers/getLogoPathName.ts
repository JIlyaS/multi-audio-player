export const getLogoPathName = () => {
    return window.location.hostname.includes("viemedela.com")
      ? "//vie-medela.ru/base/logo.png"
      : "/logo.png";
}