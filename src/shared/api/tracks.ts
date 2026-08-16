import apiClient from "@/shared/api/axiosInstance";
import { downloadFileFromLink } from "@/shared/helpers/downloadFileFromLink";

export async function fetchTracks() {
    try {
        const response = await apiClient.get(
            "/tracks",
        );
      
        if (response.status >= 400) {
            throw new Error("Failed to fetch tracks");
        }
      
        return response.data;
    } catch (err) {
        console.error("Ошибка:", err);
    }
}

export async function fetchDownloadTrack(id: string, trackName: string) {
    try {
      const response = await apiClient.get(`/tracks/download?id=${id}`, {
        responseType: "blob",
      });

      if (response.status >= 400) {
        throw new Error("Failed to fetch tracks");
      }

      downloadFileFromLink(response.data, trackName);
    } catch (err) {
      console.error("Ошибка:", err);
    }
}

