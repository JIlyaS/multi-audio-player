import { isCheckTrackPlaylistParams, isFilterTrackPlaylistParams, isOnlyParamsTrackData } from "@/shared/helpers/isFilterTrackPlaylistParams";
import type { Folder, Playlist, Track } from "@/shared/types";

export const getFilteredTracks = (
  trackPlaylistList: (Track | Playlist)[],
  params: {
    searchValue: string;
    playlistId: string;
    trackId: string;
  },
): (Track | Playlist)[] => {
  const filteredData = isCheckTrackPlaylistParams(
    params.trackId,
    params.playlistId,
  )
    ? trackPlaylistList
    : trackPlaylistList.filter((item) => !item.folderId);

  return filteredData.filter((track) => {
    // INFO: Фильтрация на фронте по query params
    return (
      isFilterTrackPlaylistParams(track.id, params.trackId, params.playlistId) &&
      (track.title.toLowerCase().includes(params.searchValue.toLowerCase()) ||
        track.tags.some((tag) =>
          tag.toLowerCase().includes(params.searchValue.toLowerCase()),
        ))
    );
  });
};

export const getFilteredTracksForFolders = (
  trackPlaylistForFolderList: (Folder & { trackList: (Track | Playlist)[] })[],
  params: {
    searchValue: string;
    playlistId: string;
    trackId: string;
  },
): (Folder & { trackList: (Track | Playlist)[] })[] => {
  if (isCheckTrackPlaylistParams(params.trackId, params.playlistId)) {
    return [];
  }

  if (isOnlyParamsTrackData()) {
    return [];
  }

  return trackPlaylistForFolderList
    .filter(
      (folder) =>
        folder.title.toLowerCase().includes(params.searchValue.toLowerCase()) ||
        folder.trackList.some((track) => {
          return (
            track.title
              .toLowerCase()
              .includes(params.searchValue.toLowerCase()) ||
            track.tags.some((tag) =>
              tag.toLowerCase().includes(params.searchValue.toLowerCase()),
            )
          );
        }),
    )
    .map((folder) => ({
      ...folder,
      trackList: folder.trackList.filter(
        (track) =>
          track.folder?.title
            .toLowerCase()
            .includes(params.searchValue.toLowerCase()) ||
          track.title
            .toLowerCase()
            .includes(params.searchValue.toLowerCase()) ||
          track.tags.some((tag) =>
            tag.toLowerCase().includes(params.searchValue.toLowerCase()),
          ),
      ),
    }));
};
