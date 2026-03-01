import type { Track } from "@/shared/types";
import { createEvent, createStore } from "effector";

interface IForm {
  id?: string;
  title: string;
  author?: string | undefined;
  tracks: Track[];
}

const resetForm = createEvent();

const $form = createStore<IForm>({
  id: "",
  title: "",
  author: "",
  tracks: [],
}).reset(resetForm);

export { type IForm, $form, resetForm };