import { getApiUrl } from "@/shared/helpers/getApiUrl";
import type { Playlist } from "@/shared/types";
import { createEffect, createEvent, createStore, sample } from "effector";

const loadPlaylists = createEvent();

const $playlists = createStore<Playlist[]>([]);

const fetchPlaylistsFx = createEffect(async () => {
  // TODO: Переделать запрос под библиотеку
  const response = await fetch(getApiUrl("/playlists"));
  if (!response.ok) {
    throw new Error("Failed to fetch tracks");
  }
  return await response.json();
});

sample({
  clock: fetchPlaylistsFx.doneData,
  target: $playlists,
});

sample({
  clock: loadPlaylists,
  target: [fetchPlaylistsFx],
});

export { $playlists, loadPlaylists };
