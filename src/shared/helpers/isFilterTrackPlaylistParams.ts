import { getBasePrefix } from "@/shared/helpers/getBasePrefix";

export const isOnlyParamsTrackData = () => {
  const pathname = window.location.pathname;

  return (
    pathname.replaceAll("/", "") === `${getBasePrefix()}`
  );
}


export const isFilterTrackPlaylistParams = (id: string, trackId: string, playlistId: string): boolean => {
  const isOnlyParamsData = isOnlyParamsTrackData();

  if (!trackId && !playlistId && !isOnlyParamsData) {
    return true;
  }

  if (trackId && String(trackId) === id) {
    return true;
  }

  if (playlistId && String(playlistId) === id) {
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
