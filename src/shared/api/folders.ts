import apiClient from "@/shared/api/axiosInstance";

interface IFetchFoldersParams {
    global?: boolean;
}

export async function fetchFolders({ global }: IFetchFoldersParams) {
    try {
      // TODO: Неоптимально, нужно переделать под новую либу
      let folderUri = "/folders";

      if (global) {
        folderUri = "/folders?global=true";
      }

      const response = await apiClient.get(folderUri);

      if (response.status >= 400) {
        throw new Error("Failed to fetch folders");
      }

      return response.data;
    } catch (err) {
        console.error("Ошибка:", err);
    }
}
