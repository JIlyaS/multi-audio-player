import { $playlists } from "@/models/playlist";
import { $tracks } from "@/models/track";
import { generateSafeUUID } from "@/shared/helpers/generateSafeUUID";
import type { Playlist, Track } from "@/shared/types";
import { combine, createEvent, createStore, sample } from "effector";
import { persist } from "effector-storage/local";

const $userId = createStore<string>("");
const setUserId = createEvent<string>();

persist({
  store: $userId,
  key: "userId",
  serialize: (userId) => String(userId), 
  def: generateSafeUUID(),
  sync: "force"
});

sample({
  clock: setUserId,
  target: $userId
});

const $trackIndex = createStore<number>(0);
const updateTrackIndex = createEvent();
const selectCurrentTrackPlaylistList = createEvent<boolean>();

const $currentTrackPlaylistList = createStore<(Track | Playlist)[]>([]);
const $isSelectAll = createStore<boolean>(false);

const $currentTracksForForm = createStore<Track[]>([]);

const $trackPlaylistList = combine($tracks, $playlists, (tracks, playlists) => [
  ...playlists,
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
  $trackIndex,
  $currentTrackPlaylistList,
  $trackPlaylistList,
  $isSelectAll,
  $currentTracksForForm,
  setUserId,
  updateTrackIndex,
  updateCurrentTrackPlaylistList,
  selectCurrentTrackPlaylistList,
};
