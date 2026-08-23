import { loadPlaylists } from "@/models/playlist";
import { $form } from "@/models/playlist-form";
import { $currentTrackPlaylistList } from "@/models/shared";
import { loadTracks } from "@/models/track";
import { fetchDeletePlaylist } from "@/shared/api";
import { createEffect, createEvent, createStore, sample } from "effector";

const deletePlaylist = createEvent<string>();

// TODO: Переделать под библиотеку
const deletePlaylistFx = createEffect(async (id: string) => {
  const response = await fetchDeletePlaylist(id);

  return response;
});

const $isDeletePlaylistSuccess = createStore<boolean>(false);
const $deletePlaylistError = createStore<string | null>(null);
const $isDeletePlaylistLoading = deletePlaylistFx.pending;

sample({
  clock: deletePlaylist,
  target: deletePlaylistFx,
});

sample({
  clock: deletePlaylistFx.failData,
  fn: (error: Error) => error.message,
  target: $deletePlaylistError,
});

sample({
  clock: deletePlaylistFx.doneData,
  fn: () => true,
  target: $isDeletePlaylistSuccess,
});

sample({
  clock: deletePlaylistFx.doneData,
  source: [$currentTrackPlaylistList],
  fn: ([currentTrackPlaylistList], {id}) => {
    return currentTrackPlaylistList.filter((item) => item.id !== id);
  },
  target: $currentTrackPlaylistList,
});

sample({
  clock: deletePlaylistFx.doneData,
  target: [loadPlaylists, loadTracks],
});

export {
  $form,
  $deletePlaylistError,
  $isDeletePlaylistSuccess,
  $isDeletePlaylistLoading,
  deletePlaylist,
};
