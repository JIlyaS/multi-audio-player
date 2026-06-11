import type { Playlist, Track } from "@/shared/types"

export const getTrackInfoTitle = (track: Track | Playlist | undefined, isFolder: boolean): string => {

    if (!track?.title) {
        return "Композиция не выбрана";
    }

    if (isFolder) {
        return track?.folder?.title || "";
    }

    return track.title;
}

export const getTrackInfoAuthor = (track: Track | Playlist, isFolder: boolean): string | null => {
    if (!track?.author) {
        return "Неизвестно";
    }

    if (isFolder) {
        return null;
    }

    return track.author;
}