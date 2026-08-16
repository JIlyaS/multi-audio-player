import apiClient from "@/shared/api/axiosInstance";
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
        console.error("Ошибка:", err);
    }
}

export async function getViewCardPlaylist(id: string) {
    try {
        const response = await apiClient.get(`/playlists/${id}`);

        if (response.status >= 400) {
          throw new Error("Failed to get view card playlist");
        }

        return response.data;
    } catch (err) {
        console.error("Ошибка:", err);
    } 
}

export async function createPlaylist(data: ICreatePlaylistData) {
  try {
    const response = await apiClient.post("/playlists", data);

    if (response.status >= 400) {
      throw new Error("Failed to post create playlist");
    }

    return response;
  } catch (err) {
    console.error("Ошибка:", err);
  }
}

export async function updatePlaylist(data: IUpdatePlaylistData) {
  try {
    const response = await apiClient.patch("/playlists", data);

    if (response.status >= 400) {
      throw new Error("Failed to post update playlist");
    }

    return response.data;
  } catch (err) {
    console.error("Ошибка:", err);
  }
}

export async function fetchDownloadPlaylist(id: string, playlistName: string) {
    const response = await apiClient.get(`/playlists/download?id=${id}`, {
      responseType: "blob",
    });

    if (response.status >= 400) {
      throw new Error("Failed to post download playlist");
    }

    downloadFileFromLink(response.data, playlistName);
}

export async function fetchDeletePlaylist(id: string) {
  try {
    const response = await apiClient.delete(`/playlists/${id}`);

    if (response.status >= 400) {
      throw new Error("Failed to delete playlist");
    }

    return response.data;
  } catch (err) {
    console.error("Ошибка:", err);
  }
}
