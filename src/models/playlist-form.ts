import type { Track } from "@/shared/types";
import { createEvent, createStore, sample } from "effector";

interface IForm {
  id?: string;
  title: string;
  isPublic: boolean;
  folderId?: string | null;
  userId?: string | null;
  author?: string | undefined;
  tracks: Track[];
}

interface IFieldCheckboxUpdate {
  name: string;
  value: (string | Track)[];
}

const resetForm = createEvent();
const changeSearchValue = createEvent<string>();
const fieldUpdate = createEvent();

const $searchValue = createStore<string>("").reset(resetForm);


const $form = createStore<IForm>({
  id: "",
  title: "",
  author: "",
  userId: null,
  folderId: null,
  isPublic: false,
  tracks: [],
}).reset(resetForm);

sample({
  clock: changeSearchValue,
  target: $searchValue
});

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

const handleSelectChange = fieldUpdate.prepend(
  (evt: React.ChangeEvent<HTMLSelectElement>) => ({
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


export { type IForm, $form, $searchValue, handleChange, handleSelectChange, handleCheckboxChange, handleCheckboxListChange, changeSearchValue, resetForm };