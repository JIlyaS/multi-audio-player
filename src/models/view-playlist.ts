import { $form, resetForm } from "@/models/playlist-form";
import { getApiUrl } from "@/shared/helpers/getApiUrl";
import type { Playlist } from "@/shared/types";
import { createEffect, createEvent, createStore, sample } from "effector";

const viewCardPlaylist = createEvent<string>();

const $currentPlaylist = createStore<Playlist | null>(null).reset(resetForm);

const viewCardPlaylistFx = createEffect(async (id: string) => {
  try {
    const response = await fetch(getApiUrl(`/playlists/${id}`), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch tracks");
    }

    return await response.json();
  } catch {
    throw new Error("Failed to get data playlist");
  }
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
    tracks: data.tracks,
  }),
  target: $form,
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
