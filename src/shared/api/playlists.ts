import apiClient from "@/shared/api/axiosInstance";
import { toast } from "react-toastify";
import { downloadFileFromLink } from "@/shared/helpers/downloadFileFromLink";
import type { ICreatePlaylistData, IUpdatePlaylistData } from "@/shared/types";

export async function fetchPlaylists() {
    try {
        const response = await apiClient.get("/playlists");

        if (response.status >= 400) {
          throw new Error("Failed to fetch playlists");
        }
    
        return response.data;
    } catch (err) {
      console.error("Ошибка [fetchPlaylists]: ", err);
      toast.error(
        "Произошла ошибка при загрузке плейлистов. Повторите попытку или обратитесь к администратору",
      );
    }
}

export async function getViewCardPlaylist(id: string) {
    try {
        const response = await apiClient.get(`/playlists/${id}`);

        if (response.status >= 400) {
          throw new Error(
            "Failed to get view card playlist",
          );
        }

        return response.data;
    } catch (err) {
      console.error("Ошибка [getViewCardPlaylist]: ", err);
      toast.error(
        "Произошла ошибка при загрузке выбранного плейлиста. Повторите попытку или обратитесь к администратору",
      );
    } 
}

export async function createPlaylist(data: ICreatePlaylistData) {
  try {
    const response = await apiClient.post("/playlists", data);

    if (response.status >= 400) {
      throw new Error("Failed to post create playlist");
    }

    toast.success(
      "Плейлист успешно создан",
      {
        autoClose: 3000
      }
    );

    return response;
  } catch (err) {
    console.error("Ошибка [createPlaylist]: ", err);
    toast.error(
      "Произошла ошибка при создании плейлиста. Повторите попытку или обратитесь к администратору",
    );
  }
}

export async function updatePlaylist(data: IUpdatePlaylistData) {
  try {
    const response = await apiClient.patch("/playlists", data);

    if (response.status >= 400) {
      throw new Error("Failed to post update playlist");
    }

    toast.success("Плейлист успешно отредактирован", {
      autoClose: 3000,
    });

    return response.data;
  } catch (err) {
    console.error("Ошибка [updatePlaylist]: ", err);
    toast.error(
      "Произошла ошибка при обновлении плейлиста. Повторите попытку или обратитесь к администратору",
    );
  }
}

export async function fetchDownloadPlaylist(id: string, playlistName: string) {
  try {
    const toastId = toast.loading("Идёт скачивание плейлиста...");
    const response = await apiClient.get(`/playlists/download?id=${id}`, {
      responseType: "blob",
      timeout: 60000
    });

    if (response.status >= 400) {
      throw new Error(
        "Failed to post download playlist",
      );
    }

    toast.update(toastId, {
      render: "Плейлист успешно скачан",
      type: "success",
      isLoading: false,
      autoClose: 3000,
    });

    downloadFileFromLink(response.data, playlistName);
  } catch (err) {
    console.error("Ошибка [fetchDownloadPlaylist]: ", err);
    toast.error(
      "Произошла ошибка при скачивании плейлиста. Повторите попытку или обратитесь к администратору",
    );
  }
}

export async function fetchDeletePlaylist(id: string) {
  try {
    const response = await apiClient.delete(`/playlists/${id}`);

    if (response.status >= 400) {
      throw new Error("Failed to delete playlist");
    }

    toast.success("Плейлист успешно удалён", {
      autoClose: 3000,
    });

    return response.data;
  } catch (err) {
    console.error("Ошибка [fetchDeletePlaylist]: ", err);
    toast.error(
      "Произошла ошибка при удалении плейлиста. Повторите попытку или обратитесь к администратору",
    );
  }
}
