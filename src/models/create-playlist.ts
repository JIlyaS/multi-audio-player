import { loadPlaylists } from "@/models/playlist";
import { $form, resetForm } from "@/models/playlist-form";
import { loadTracks } from "@/models/track";
import type { Track } from "@/shared/types";
import { createEffect, createEvent, createStore, sample } from "effector";

interface IFieldCheckboxUpdate {
  name: string;
  value: Track[];
};

const createSubmitForm = createEvent<React.FormEvent<HTMLFormElement>>();
const fieldUpdate = createEvent();

const sendSubmitFormFx = createEffect(
  async ({ title, author, trackIds }: { title: string; author?: string | undefined, trackIds: string[] }) => {
    try {
      await fetch("http://localhost:8000/playlists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, author, trackIds }),
      });
    } catch {
      throw new Error("Failed to send form");
    }
  },
);

const $isCreatePlaylistSuccess = createStore<boolean>(false).reset(resetForm);
const $createPlaylistError = createStore<string | null>(null).reset(resetForm);
const $isCreatePlaylistLoading = sendSubmitFormFx.pending;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
$form.on(fieldUpdate, (form, { key, value }: any) => ({
  ...form,
  [key]: value,
}));

const handleChange = fieldUpdate.prepend(
  (evt: React.ChangeEvent<HTMLInputElement>) => ({
    key: evt.target.name,
    value: evt.target.value,
  }),
);

const handleCheckboxListChange = fieldUpdate.prepend(
  (data: IFieldCheckboxUpdate) => ({
    key: data.name,
    value: data.value,
  }),
);

createSubmitForm.watch((evt: React.FormEvent<HTMLFormElement>) => {
  evt.preventDefault();
});


sample({
  clock: createSubmitForm,
  source: $form,
  fn: (data) => ({...data, trackIds: data.tracks.filter(item => !!item).map((item) => item.id)}),
  target: sendSubmitFormFx,
});

sample({
  clock: sendSubmitFormFx.failData,
  fn: (error: Error) => error.message,
  target: $createPlaylistError,
});

sample({
  clock: sendSubmitFormFx.doneData,
  fn: () => true,
  target: $isCreatePlaylistSuccess,
});


sample({
  clock: sendSubmitFormFx.doneData,
  target: [loadPlaylists, loadTracks],
});

export {
  $form,
  $createPlaylistError,
  $isCreatePlaylistSuccess,
  $isCreatePlaylistLoading,
  createSubmitForm,
  fieldUpdate,
  handleChange,
  handleCheckboxListChange,
};

