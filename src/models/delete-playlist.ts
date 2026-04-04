import { loadPlaylists } from "@/models/playlist";
import { $form } from "@/models/playlist-form";
import { loadTracks } from "@/models/track";
import { getApiUrl } from "@/shared/helpers/getApiUrl";
import { createEffect, createEvent, createStore, sample } from "effector";

const deletePlaylist = createEvent<string>();

const deletePlaylistFx = createEffect(async (id: string) => {
  try {
    // TODO: Переделать под библиотеку
    await fetch(getApiUrl(`/playlists/${id}`), {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch {
    throw new Error("Failed to delete playlist");
  }
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
  target: [loadPlaylists, loadTracks],
});

export {
  $form,
  $deletePlaylistError,
  $isDeletePlaylistSuccess,
  $isDeletePlaylistLoading,
  deletePlaylist,
};
