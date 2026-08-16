import { fetchDownloadTrack } from "@/shared/api";
import { createEffect, createEvent, createStore, sample } from "effector";

const downloadTrack = createEvent<{ trackId: string; trackName: string }>();

const $currentDownloadTrackId = createStore<string | null>(null);

const downloadTrackFx = createEffect(
  async ({ trackId, trackName }: { trackId: string; trackName: string }) => {
    await fetchDownloadTrack(trackId, trackName);
  },
);

const $isDownloadTrackLoading = downloadTrackFx.pending;
const $isDownloadTrackSuccess = createStore<boolean>(false);

sample({
  clock: downloadTrack,
  target: [downloadTrackFx],
});

sample({
  clock: downloadTrack,
  fn: (data) => data.trackId,
  target: $currentDownloadTrackId,
});

sample({
  clock: downloadTrackFx.doneData,
  fn: () => true,
  target: $isDownloadTrackSuccess,
});

export { $isDownloadTrackLoading, $isDownloadTrackSuccess, $currentDownloadTrackId, downloadTrack };
