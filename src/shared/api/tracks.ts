import apiClient from "@/shared/api/axiosInstance";
import { downloadFileFromLink } from "@/shared/helpers/downloadFileFromLink";
import { toast } from "react-toastify";

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
      console.error("Ошибка [fetchTracks]: ", err);
      toast.error(
        "Произошла ошибка при загрузке треков. Повторите попытку или обратитесь к администратору",
      );
    }
}

export async function fetchDownloadTrack(id: string, trackName: string) {
    try {
      const toastId = toast.loading("Идёт скачивание трека...");

      const response = await apiClient.get(`/tracks/download?id=${id}`, {
        responseType: "blob",
      });

      if (response.status >= 400) {
        throw new Error("Failed to fetch tracks");
      }

      toast.update(toastId, {
        render: "Трек успешно скачан",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      downloadFileFromLink(response.data, trackName);
    } catch (err) {
      console.error("Ошибка [fetchDownloadTrack]: ", err);
      toast.error("Произошла ошибка при скачивании трека. Повторите попытку или обратитесь к администратору");
    }
}

