import { getBasePrefix } from "@/shared/helpers/getBasePrefix";

export const isOnlyParamsTrackData = () => {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;

  return (
    (hostname === "localhost" || hostname === "multiaudioplayer") &&
    pathname.replaceAll('/', '') === `${getBasePrefix()}`
  );
}


export const isFilterTrackPlaylistParams = (id: string): boolean => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  const isOnlyParamsData = isOnlyParamsTrackData();

  if (
    !urlParams.has("trackId") &&
    !urlParams.has("playlistId") &&
    !isOnlyParamsData
  ) {
    return true;
  }

  if (
    urlParams.has("trackId") &&
    String(urlParams.get("trackId")) === id &&
    isOnlyParamsData
  ) {
    return true;
  }

  if (
    urlParams.has("playlistId") &&
    String(urlParams.get("playlistId")) === id &&
    isOnlyParamsData
  ) {
    return true;
  }

  return false;
};

export const isCheckTrackPlaylistParams = (): boolean => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  if (
    urlParams.has("trackId") || urlParams.has("playlistId")
  ) {
    return true;
  }

  return false;
}
