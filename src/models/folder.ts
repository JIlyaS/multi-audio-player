// TODO: Не сделан формат приватных папок
import { fetchFolders } from "@/shared/api";
import type { Folder, FolderOption } from "@/shared/types";
import { createEffect, createEvent, createStore, sample } from "effector";

const loadFolders = createEvent<{ global?: boolean }>({});
const loadFolderList = createEvent<{ global?: boolean }>({});

const $folders = createStore<Folder[]>([]);
const $folderList = createStore<Folder[]>([]);

// TODO: Неоптимально, нужно переделать под новую либу
const fetchFoldersFx = createEffect(
  async ({ global }: { global?: boolean }) => {
    const response = fetchFolders({ global });

    return response;
  },
);

// TODO: Временное решение с разными запросами - запрос для списка  треков и плейлистов на странице плеера
// TODO: Неоптимально, нужно переделать под новую либу
const fetchFolderListFx = createEffect(
  async ({ global }: { global?: boolean }) => {
    const response = fetchFolders({ global });

    return response;
  },
);

const $isFoldersLoading = fetchFoldersFx.pending;
const $isFolderListLoading = fetchFolderListFx.pending;

sample({
  clock: fetchFoldersFx.doneData,
  target: $folders,
});

sample({
  clock: fetchFolderListFx.doneData,
  target: $folderList,
});

const $globalFolders = $folderList.map((folderList) =>
  folderList.filter((folder) => folder.isGlobal),
);
const $publicFolders = $folderList.map((folderList) =>
  folderList.filter((folder) => folder.isPublic || folder.isGlobal),
);

const $folderOptions = $folders.map(
  (folders) =>
    folders.map((folder) => ({
      id: folder.id,
      label: folder.title,
      value: folder.name,
    })) as FolderOption[],
);

sample({
  clock: loadFolders,
  target: [fetchFoldersFx],
});

sample({
  clock: loadFolderList,
  target: [fetchFolderListFx],
});

export {
  $folders,
  $folderList,
  $globalFolders,
  $publicFolders,
  $folderOptions,
  $isFoldersLoading,
  $isFolderListLoading,
  loadFolders,
  loadFolderList,
};
