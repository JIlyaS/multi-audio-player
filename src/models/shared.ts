import { $playlists } from "@/models/playlist";
import { $tracks } from "@/models/track";
import type { Playlist, Track } from "@/shared/types";
import { combine, createEvent, createStore, sample } from "effector";

const $trackIndex = createStore<number>(0);
const updateTrackIndex = createEvent();

const $currentTrackPlaylistList = createStore<(Track | Playlist)[]>([]);

const $trackPlaylistList = combine(
  $tracks,
  $playlists,
  (tracks, playlists) => [...playlists, ...tracks],
);

const updateCurrentTrackPlaylistList =
  createEvent<(Track | Playlist)[]>();

sample({
  clock: updateCurrentTrackPlaylistList,
  target: $currentTrackPlaylistList,
});

export {
  $trackIndex,
  $currentTrackPlaylistList,
  $trackPlaylistList,
  updateTrackIndex,
  updateCurrentTrackPlaylistList,
};
