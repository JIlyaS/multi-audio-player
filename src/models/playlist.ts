import type { Playlist } from "@/shared/types";
import { createEffect, createEvent, createStore, sample } from "effector";

const loadPlaylists = createEvent();

const $playlists = createStore<Playlist[]>([]);

const fetchPlaylistsFx = createEffect(async () => {
  const response = await fetch(`http://localhost:8000/playlists`);
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