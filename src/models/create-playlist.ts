import { loadFolderList } from "@/models/folder";
import { loadPlaylists } from "@/models/playlist";
import { $form, resetForm } from "@/models/playlist-form";
import { $currentTracksForForm, $userId } from "@/models/shared";
import { loadTracks } from "@/models/track";
import { createPlaylist } from "@/shared/api";
import type { ICreatePlaylistData, Track } from "@/shared/types";
import { createEffect, createEvent, createStore, sample } from "effector";

interface ISimpleCreateForm {
  title: string;
  author?: string | undefined;
  userId?: string | null;
  isPublic: boolean;
  tracks: Track[];
}

const createSubmitForm = createEvent<React.FormEvent<HTMLFormElement>>();
const createSimplePlaylist = createEvent<ISimpleCreateForm>();
const openCreateModalClick = createEvent();

const sendSubmitFormFx = createEffect(
  async (data: ICreatePlaylistData) => {
    await createPlaylist(data);
  },
);

const $isCreatePlaylistSuccess = createStore<boolean>(false).reset(resetForm);
const $createPlaylistError = createStore<string | null>(null).reset(resetForm);
const $isCreatePlaylistLoading = sendSubmitFormFx.pending;

createSubmitForm.watch((evt: React.FormEvent<HTMLFormElement>) => {
  evt.preventDefault();
});

sample({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  clock: openCreateModalClick,
  source: { tracks: $currentTracksForForm, userId: $userId },
  fn: ({ tracks, userId }) => ({
    id: "",
    title: "",
    author: "",
    userId,
    folderId: null,
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
    folder: null,
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
  target: [loadPlaylists, loadTracks, loadFolderList],
});

export {
  $form,
  $createPlaylistError,
  $isCreatePlaylistSuccess,
  $isCreatePlaylistLoading,
  createSubmitForm,
  createSimplePlaylist,
  openCreateModalClick,
};
