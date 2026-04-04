import type { Track } from "@/shared/types";
import { createEvent, createStore, sample } from "effector";

interface IForm {
  id?: string;
  title: string;
  isPublic: boolean;
  userId?: string | null;
  author?: string | undefined;
  tracks: Track[];
}

const resetForm = createEvent();
const changeSearchValue = createEvent<string>();

const $searchValue = createStore<string>("").reset(resetForm);

const $form = createStore<IForm>({
  id: "",
  title: "",
  author: "",
  userId: null,
  isPublic: false,
  tracks: [],
}).reset(resetForm);

sample({
  clock: changeSearchValue,
  target: $searchValue
});

// sample({
//   clock: changeSearchValue,
//   source: $tracks,
//   fn: (tracks, searchValue) => tracks.filter((track) => track.title.includes(searchValue)),
//   target: $track
// });

export { type IForm, $form, $searchValue, changeSearchValue, resetForm };