import type { Track } from "@/shared/types";
import { createEffect, createEvent, createStore, sample } from "effector";

const $tracks = createStore<Track[]>([]);

const loadTracks = createEvent();

const updateCurrentTrack = createEvent();

const fetchTracksFx = createEffect(async () => {
  const response = await fetch(`http://localhost:8000/tracks`);
  if (!response.ok) {
    throw new Error("Failed to fetch tracks");
  }
  return await response.json();
});

sample({
  clock: fetchTracksFx.doneData,
  target: $tracks,
});

sample({
  clock: loadTracks,
  target: [fetchTracksFx],
});

export { $tracks, loadTracks, updateCurrentTrack };