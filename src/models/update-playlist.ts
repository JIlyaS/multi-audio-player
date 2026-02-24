import { loadPlaylists } from "@/models/playlist";
import { $form, resetForm } from "@/models/playlist-form";
import { loadTracks } from "@/models/track";
import { createEffect, createEvent, createStore, sample } from "effector";

interface IFieldCheckboxUpdate {
  name: string;
  value: string[];
};

const updateSubmitForm = createEvent<React.FormEvent<HTMLFormElement>>();
const fieldUpdate = createEvent();

const sendSubmitFormFx = createEffect(
  async ({ id, title, author, trackIds }: { id?: string, title: string; author?: string | undefined, trackIds: string[] }) => {
    try {
      await fetch(`http://localhost:8000/playlists`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, title, author, trackIds }),
      });
    } catch {
      throw new Error("Failed to send form");
    }
  },
);

const $isUpdatePlaylistSuccess = createStore<boolean>(false).reset(resetForm);
const $updatePlaylistError = createStore<string | null>(null).reset(resetForm);
const $isUpdatePlaylistLoading = sendSubmitFormFx.pending;

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
  fn: (data) => ({...data, trackIds: data.tracks.filter(item => !!item).map((item) => item.id)}),
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
  target: [loadPlaylists, loadTracks],
});

export {
  $form,
  $updatePlaylistError,
  $isUpdatePlaylistSuccess,
  $isUpdatePlaylistLoading,
  updateSubmitForm,
  handleChange,
  fieldUpdate,
  handleCheckboxListChange,
};

