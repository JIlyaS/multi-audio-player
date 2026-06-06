import { isCheckTrackPlaylistParams, isFilterTrackPlaylistParams } from "@/shared/helpers/isFilterTrackPlaylistParams";
import type { Folder, Playlist, Track } from "@/shared/types";

export const getFilteredTracks = (
  allTrackPlaylistList: (Track | Playlist)[],
  searchValue: string,
): (Track | Playlist)[] => {
  const filteredData = isCheckTrackPlaylistParams()
    ? allTrackPlaylistList
    : allTrackPlaylistList.filter((item) => !item.folderId);

  return filteredData.filter((track) => {
    // INFO: Фильтрация на фронте по query params
    return (
      isFilterTrackPlaylistParams(track.id) &&
      (track.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        track.tags.some((tag) =>
          tag.toLowerCase().includes(searchValue.toLowerCase()),
        ))
    );
  });
};

export const getFilteredTracksForFolders = (
  trackPlaylistForFolderList: (Folder & { trackList: (Track | Playlist)[] })[],
  searchValue: string,
): (Folder & { trackList: (Track | Playlist)[] })[] => {
    if (isCheckTrackPlaylistParams()) {
       return [];
    }

  return trackPlaylistForFolderList
    .filter(
      (folder) =>
        folder.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        folder.trackList.some((track) => {
          return (
            track.title.toLowerCase().includes(searchValue.toLowerCase()) ||
            track.tags.some((tag) =>
              tag.toLowerCase().includes(searchValue.toLowerCase()),
            )
          );
        }),
    )
    .map((folder) => ({
      ...folder,
      trackList: folder.trackList.filter(
        (track) =>
          track.folder?.title.toLowerCase().includes(searchValue.toLowerCase()) ||
          track.title.toLowerCase().includes(searchValue.toLowerCase()) ||
          track.tags.some((tag) =>
            tag.toLowerCase().includes(searchValue.toLowerCase()),
          ),
      ),
    }));
};
