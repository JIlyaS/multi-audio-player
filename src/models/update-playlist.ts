import { loadFolderList } from "@/models/folder";
import { loadPlaylists } from "@/models/playlist";
import { $form, resetForm } from "@/models/playlist-form";
import { loadTracks } from "@/models/track";
import { getApiUrl } from "@/shared/helpers/getApiUrl";
import { createEffect, createEvent, createStore, sample } from "effector";

const updateSubmitForm = createEvent<React.FormEvent<HTMLFormElement>>();
const fieldUpdate = createEvent();

const sendSubmitFormFx = createEffect(
  async ({
    id,
    title,
    folderId,
    author,
    trackIds,
  }: {
    id?: string;
    title: string;
    folderId?: string | null;
    author?: string | undefined;
    trackIds: string[];
  }) => {
    try {
      await fetch(getApiUrl("/playlists"), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, title, folderId, author, trackIds }),
      });
    } catch {
      throw new Error("Failed to send form");
    }
  },
);

const $isUpdatePlaylistSuccess = createStore<boolean>(false).reset(resetForm);
const $updatePlaylistError = createStore<string | null>(null).reset(resetForm);
const $isUpdatePlaylistLoading = sendSubmitFormFx.pending;

updateSubmitForm.watch((evt: React.FormEvent<HTMLFormElement>) => {
  evt.preventDefault();
});

sample({
  clock: sendSubmitFormFx.failData,
  fn: (error: Error) => error.message,
  target: $updatePlaylistError,
});

sample({
  clock: updateSubmitForm,
  source: $form,
  fn: (data) => {
    return {
      ...data,
      trackIds: data.tracks.filter((item) => !!item).map((item) => item.id),
    };
  },
  target: sendSubmitFormFx,
});

sample({
  clock: sendSubmitFormFx.failData,
  fn: (error: Error) => error.message,
  target: $updatePlaylistError,
});

sample({
  clock: sendSubmitFormFx.doneData,
  fn: () => true,
  target: $isUpdatePlaylistSuccess,
});

sample({
  clock: sendSubmitFormFx.doneData,
  target: [loadPlaylists, loadTracks, loadFolderList],
});

export {
  $form,
  $updatePlaylistError,
  $isUpdatePlaylistSuccess,
  $isUpdatePlaylistLoading,
  updateSubmitForm,
  fieldUpdate,
};
