import { getBasePrefix } from "@/shared/helpers/getBasePrefix";

export const isOnlyParamsTrackData = () => {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;

  console.log("isOnlyParamsTrackData", hostname, pathname, pathname.replaceAll('/', ''), getBasePrefix());
  console.log(
    "111",
    hostname.includes("localhost") || hostname.includes("multiaudioplayer"),
    pathname.replaceAll("/", "") === `${getBasePrefix()}`,
  );

  return (
    (hostname.includes("localhost") || hostname.includes("multiaudioplayer")) &&
    pathname.replaceAll('/', '') === `${getBasePrefix()}`
  );
}


export const isFilterTrackPlaylistParams = (id: string, trackId: string, playlistId: string): boolean => {
  const isOnlyParamsData = isOnlyParamsTrackData();

  console.log("isFilterTrackPlaylistParams isOnlyParamsData", isOnlyParamsData);

  if (!trackId && !playlistId && !isOnlyParamsData) {
    return true;
  }

  if (trackId && String(trackId) === id && isOnlyParamsData) {
    return true;
  }

  if (playlistId && String(playlistId) === id && isOnlyParamsData) {
    return true;
  }

  return false;
};

export const isCheckTrackPlaylistParams = (
  trackId: string,
  playlistId: string,
): boolean => {

  if (trackId || playlistId) {
    return true;
  }

  return false;
};
