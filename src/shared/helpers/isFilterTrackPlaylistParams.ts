export const isFilterTrackPlaylistParams = (id: string): boolean => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  if (!urlParams.has("trackId") && !urlParams.has("playlistId")) {
    return true;
  }

  if (urlParams.has("trackId") && String(urlParams.get("trackId")) === id) {
    return true;
  }

  if (
    urlParams.has("playlistId") &&
    String(urlParams.get("playlistId")) === id
  ) {
    return true;
  }

  return false;
};
