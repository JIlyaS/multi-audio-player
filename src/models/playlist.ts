import { fetchPlaylists } from "@/shared/api";
import type { Playlist } from "@/shared/types";
import { createEffect, createEvent, createStore, sample } from "effector";

const loadPlaylists = createEvent();

const $playlists = createStore<Playlist[]>([]);

// TODO: Переделать запрос под библиотеку
const fetchPlaylistsFx = createEffect(async () => {
  const response = await fetchPlaylists();
  
  return response;
});

const $isPlaylistsLoading = fetchPlaylistsFx.pending;

sample({
  clock: fetchPlaylistsFx.doneData,
  target: $playlists,
});

sample({
  clock: loadPlaylists,
  target: [fetchPlaylistsFx],
});

export { $playlists, $isPlaylistsLoading, loadPlaylists };
