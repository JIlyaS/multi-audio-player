import { downloadFileFromLink } from "@/shared/helpers/downloadFileFromLink";
import { getApiUrl } from "@/shared/helpers/getApiUrl";
import { createEffect, createEvent, createStore, sample } from "effector";

const downloadPlaylist = createEvent<{
  playlistId: string;
  playlistName: string;
}>();

const $currentDownloadPlaylistId = createStore<string | null>(null);

const downloadPlaylistFx = createEffect(
  async ({ playlistId, playlistName }: { playlistId: string; playlistName: string }) => {
    const response = await fetch(getApiUrl(`/playlists/download?id=${playlistId}`));
    if (!response.ok) {
      throw new Error("Failed to fetch playlists");
    }
    const downloadedFile = await response.blob();

    downloadFileFromLink(downloadedFile, playlistName);
  },
);

const $isDownloadPlaylistLoading = downloadPlaylistFx.pending;
const $isDownloadPlaylistSuccess = createStore<boolean>(false);

sample({
  clock: downloadPlaylist,
  target: [downloadPlaylistFx],
});

sample({
  clock: downloadPlaylist,
  fn: (data) => data.playlistId,
  target: $currentDownloadPlaylistId,
});

sample({
  clock: downloadPlaylistFx.doneData,
  fn: () => true,
  target: $isDownloadPlaylistSuccess,
});

export {
  $isDownloadPlaylistLoading,
  $isDownloadPlaylistSuccess,
  $currentDownloadPlaylistId,
  downloadPlaylist,
};
