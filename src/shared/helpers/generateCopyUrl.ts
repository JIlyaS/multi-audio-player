import { getBasePrefix } from "@/shared/helpers/getBasePrefix";

export const generateCopyIncognitoUrl = (
  id: string,
  type: "track" | "playlist",
): string => {
  const url = import.meta.env.VITE_APP_EXTERNAL_COPY_URL;
   
  if (window.location.hostname.includes("localhost")) {
    return `${window.location.protocol}//${window.location.host}${getBasePrefix()}?${type}Id=${id}`;
  }

  if (window.location.hostname.includes("multiaudioplayer")) {
    return `${window.location.protocol}//${url}${getBasePrefix()}?${type}Id=${id}`;
  }

  // INFO: Production
  return `${window.location.protocol}//multiaudioplayer.ru/?${type}Id=${id}`;
};

export const generateCopyUrl = (
  id: string,
  type: "track" | "playlist",
): string => {
    if (
      window.location.hostname.includes("localhost") ||
      window.location.hostname.includes("multiaudioplayer")
    ) {
      return `${window.location.protocol}//${window.location.host}?${type}Id=${id}`;
    }
    return `${window.location.protocol}//${window.location.host}/${window.location.pathname}?${type}Id=${id}`;
};
  

