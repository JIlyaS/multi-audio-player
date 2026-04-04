import { loadPlaylists } from "@/models/playlist";
import { $form, resetForm } from "@/models/playlist-form";
import { $currentTracksForForm, $userId } from "@/models/shared";
import { loadTracks } from "@/models/track";
import { getApiUrl } from "@/shared/helpers/getApiUrl";
import type { Track } from "@/shared/types";
import { createEffect, createEvent, createStore, sample } from "effector";

interface IFieldCheckboxUpdate {
  name: string;
  value: Track[];
}
interface ISubmitForm {
  title: string;
  author?: string | undefined;
  // INFO: Это поле на данный момент имеет отношение только к фронту и создаётся и сохраняется только на фронте, в базе это не относится ни к какому пользователю
  userId?: string | null;
  isPublic: boolean;
  trackIds: string[];
}

interface ISimpleCreateForm {
  title: string;
  author?: string | undefined;
  userId?: string | null;
  isPublic: boolean;
  tracks: Track[];
}

const createSubmitForm = createEvent<React.FormEvent<HTMLFormElement>>();
const createSimplePlaylist = createEvent<ISimpleCreateForm>();
const fieldUpdate = createEvent();
const openCreateModalClick = createEvent();

const sendSubmitFormFx = createEffect(
  async ({ title, author, isPublic, userId, trackIds }: ISubmitForm) => {
    try {
      // TODO: Переделать под библиотеку
      await fetch(getApiUrl("/playlists"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          title, 
          author, 
          isPublic, 
          userId,
          trackIds
        }),
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

const handleCheckboxChange = fieldUpdate.prepend(
  (evt: React.ChangeEvent<HTMLInputElement>) => ({
    key: evt.target.name,
    value: evt.target.checked,
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
  clock: openCreateModalClick,
  source: { tracks: $currentTracksForForm, userId: $userId },
  fn: ({ tracks, userId }) => ({
    id: "",
    title: "",
    author: "",
    userId,
    isPublic: false,
    tracks: tracks,
  }),
  target: $form,
});

sample({
  clock: createSubmitForm,
  source: $form,
  fn: (data) => ({
      ...data,
      userId: data.isPublic ? null : data.userId,
      trackIds: data.tracks.filter((item) => !!item).map((item) => item.id),
    }
  ),
  target: sendSubmitFormFx,
});

sample({
  clock: createSimplePlaylist,
  source: $userId,
  fn: (userId, data) => ({
    ...data,
    isPublic: false,
    userId: userId,
    trackIds: data.tracks.filter((item) => !!item).map((item) => item.id),
  }),
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
  createSimplePlaylist,
  openCreateModalClick,
  fieldUpdate,
  handleChange,
  handleCheckboxChange,
  handleCheckboxListChange,
};
