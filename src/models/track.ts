import { fetchTracks } from "@/shared/api";
import type { Track } from "@/shared/types";
import { createEffect, createEvent, createStore, sample } from "effector";

const $tracks = createStore<Track[]>([]);

const loadTracks = createEvent();

const fetchTracksFx = createEffect(async () => {
  const response = await fetchTracks();

  return response;
});

const $isTracksLoading = fetchTracksFx.pending;

sample({
  clock: fetchTracksFx.doneData,
  target: $tracks,
});

sample({
  clock: loadTracks,
  target: [fetchTracksFx],
});

export { $tracks, $isTracksLoading, loadTracks };
