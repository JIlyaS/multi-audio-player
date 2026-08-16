import { $form, resetForm } from "@/models/playlist-form";
import { getViewCardPlaylist } from "@/shared/api";
import type { Playlist } from "@/shared/types";
import { createEffect, createEvent, createStore, sample } from "effector";

const viewCardPlaylist = createEvent<string>();

const $currentPlaylist = createStore<Playlist | null>(null).reset(resetForm);

const viewCardPlaylistFx = createEffect(async (id: string) => {
  const response = await getViewCardPlaylist(id);

  return response;
});

const $viewPlaylistError = createStore<string | null>(null);
const $isViewPlaylistLoading = viewCardPlaylistFx.pending;

sample({
  clock: viewCardPlaylistFx.doneData,
  fn: (data: Playlist) => ({
    id: data.id,
    title: data.title,
    isPublic: data.isPublic,
    author: data.author,
    tags: data.tags,
    folder: data.folder,
    folderId: data.folder?.id,
    tracks: data.tracks,
  }),
  target: $form,
});

sample({
  clock: viewCardPlaylistFx.doneData,
  target: $currentPlaylist,
});

sample({
  clock: viewCardPlaylistFx.failData,
  fn: (error: Error) => error.message,
  target: $viewPlaylistError,
});

sample({
  clock: viewCardPlaylist,
  target: viewCardPlaylistFx,
});

export {
  $currentPlaylist,
  $viewPlaylistError,
  $isViewPlaylistLoading,
  viewCardPlaylist,
};
