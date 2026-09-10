import { getBasePrefix } from "@/shared/helpers/getBasePrefix";

export const generateCopyIncognitoUrl = (
  id: string,
  type: "track" | "playlist",
): string => {
  const url = import.meta.env.VITE_APP_EXTERNAL_COPY_URL || "localhost:8000";
   
  if (window.location.hostname.includes("localhost")) {
    return `${window.location.protocol}//${window.location.host}/${getBasePrefix()}/?${type}Id=${id}`;
  }
  return `${window.location.protocol}//${url}/${getBasePrefix()}/?${type}Id=${id}`;
};

export const generateCopyUrl = (
  id: string,
  type: "track" | "playlist",
): string => {
    return `${window.location.protocol}//${window.location.host}/${window.location.pathname}/?${type}Id=${id}`;
};
  

