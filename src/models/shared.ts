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
  sync: false
});

sample({
  clock: setUserId,
  target: $userId
});

const selectCurrentTrackPlaylistList = createEvent<boolean>();

const $currentTrackPlaylistList = createStore<(Track | Playlist)[]>([]);
const $isSelectAll = createStore<boolean>(false);

const $currentTracksForForm = createStore<Track[]>([]);

// TODO: не нравиться примесь!
const $trackPlaylistList = combine($tracks, $playlists, $userId, (tracks, playlists, userId) => [
  ...playlists.filter((item) => !item?.userId || item?.userId === userId),
  ...tracks,
]);

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
  $isSelectAll,
  $currentTracksForForm,
  setUserId,
  updateCurrentTrackPlaylistList,
  selectCurrentTrackPlaylistList,
};
