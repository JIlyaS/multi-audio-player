import { downloadFileFromLink } from "@/shared/helpers/downloadFileFromLink";
import { getApiUrl } from "@/shared/helpers/getApiUrl";
import { createEffect, createEvent, createStore, sample } from "effector";

const downloadTrack = createEvent<{ trackId: string; trackName: string }>();

const $currentDownloadTrackId = createStore<string | null>(null);

const downloadTrackFx = createEffect(
  async ({ trackId, trackName }: { trackId: string; trackName: string }) => {
    const response = await fetch(getApiUrl(`/tracks/download?id=${trackId}`));
    if (!response.ok) {
      throw new Error("Failed to fetch tracks");
    }
    const downloadedTrack = await response.blob();

    downloadFileFromLink(downloadedTrack, trackName);
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
