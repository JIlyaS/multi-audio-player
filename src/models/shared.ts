import { $publicFolders } from "@/models/folder";
import { $playlists } from "@/models/playlist";
import { $tracks } from "@/models/track";
import { generateSafeUUID } from "@/shared/helpers/generateSafeUUID";
import type { Playlist, Track } from "@/shared/types";
import { combine, createEvent, createStore, sample } from "effector";
import { persist } from "effector-storage/local";

const $userId = createStore<string>("");
const setUserId = createEvent<string>();

// TODO: Подумать, стоит ли использовать этот метод для записи в localStorage
persist({
  store: $userId,
  key: "userId",
  def: generateSafeUUID(),
  sync: false,
});

sample({
  clock: setUserId,
  target: $userId,
});

const selectCurrentTrackPlaylistList = createEvent<boolean>();

const $currentTrackPlaylistList = createStore<(Track | Playlist)[]>([]);
const $isSelectAll = createStore<boolean>(false);

const $currentTracksForForm = createStore<Track[]>([]);

// TODO: не нравитcя примесь!
// TODO: Влияние на порядок для переключения вперёд/назад
const $trackPlaylistList = combine(
  $tracks,
  $playlists,
  $publicFolders,
  $userId,
  (tracks, playlists, publicFolders, userId) => {
    const allTrackPlaylistList = [
      ...playlists.filter((item) => !item?.userId || item?.userId === userId),
      ...tracks,
    ];
    const trackPlaylistList: (Track | Playlist)[] = [];
    const globalFolders = publicFolders.filter((folder) => folder.isGlobal);
    const defaultFolders = publicFolders.filter((folder) => !folder.isGlobal);

    globalFolders.forEach((globalFolder) => {
      const tracks = allTrackPlaylistList.filter((item) => item.folderId === globalFolder.id);
      trackPlaylistList.push(...tracks);
    });

    defaultFolders.forEach((defaultFolder) => {
      const tracks = allTrackPlaylistList.filter(
        (item) => item.folderId === defaultFolder.id,
      );
      trackPlaylistList.push(...tracks);
    });

    trackPlaylistList.push(
      ...allTrackPlaylistList.filter((item) => !item.folderId),
    );


    return trackPlaylistList;
  },
);

// TODO: Переделать - новая примесь для формирования списка треков в папках
const $trackPlaylistForFolderList = combine(
  $tracks,
  $playlists,
  $publicFolders,
  $userId,
  (tracks, playlists, publicFolders, userId) => {
    const trackPlaylistList = [
      ...playlists.filter((item) => !item?.userId || item?.userId === userId),
      ...tracks,
    ];

    const globalFolders = publicFolders.filter((folder) => folder.isGlobal);
    const defaultFolders = publicFolders.filter((folder) => !folder.isGlobal);
    const folderMapList = [...globalFolders, ...defaultFolders].map(
      (folder) => {
        return {
          ...folder,
          trackList: trackPlaylistList
            .filter((item) => item.folderId === folder.id)
            .sort((prevItem, nextItem) =>
              prevItem.title.localeCompare(nextItem.title, "ru", { sensitivity: "base" }),
            ),
        };
      },
    );
    return folderMapList;
  },
);

const updateCurrentTrackPlaylistList = createEvent<(Track | Playlist)[]>();

sample({
  clock: updateCurrentTrackPlaylistList,
  target: $currentTrackPlaylistList,
});

sample({
  clock: selectCurrentTrackPlaylistList,
  source: $trackPlaylistList,
  fn: (trackPlaylistList, isSelect) => (isSelect ? trackPlaylistList : []),
  target: $currentTrackPlaylistList,
});

sample({
  clock: selectCurrentTrackPlaylistList,
  target: $isSelectAll,
});

sample({
  source: $currentTrackPlaylistList,
  fn: (trackPlaylistList) =>
    trackPlaylistList.filter((item) => item.type === "track"),
  target: $currentTracksForForm,
});

export {
  $userId,
  $currentTrackPlaylistList,
  $trackPlaylistList,
  $trackPlaylistForFolderList,
  $isSelectAll,
  $currentTracksForForm,
  setUserId,
  updateCurrentTrackPlaylistList,
  selectCurrentTrackPlaylistList,
};
