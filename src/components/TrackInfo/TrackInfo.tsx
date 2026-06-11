// INFO: Отображение информации о текущем треке
import { $currentTrackPlaylistList, $trackPlaylistForFolderList } from "@/models/shared";
import { useUnit } from "effector-react";

import styles from "./TrackInfo.module.css";
import { TrackInfoIcon } from "./TrackInfoIcon";
import { getTrackInfoAuthor, getTrackInfoTitle } from "./utils";

export const TrackInfo = () => {
  const currentTrackPlaylistList = useUnit($currentTrackPlaylistList);
  const trackPlaylistForFolderList = useUnit($trackPlaylistForFolderList);
  const firstTrack = currentTrackPlaylistList[0];
  const firstTrackFolder = currentTrackPlaylistList.find((item) => item.folderId);

  const currentTrackPlaylistIds = currentTrackPlaylistList.map((item) => item.id);

  const isFolder = trackPlaylistForFolderList.some((item) => {
    const isIncludes = item.trackList.map((item) => item.id).every((trackId) => {
      return currentTrackPlaylistIds.includes(trackId);
    });

    if (!item.trackList.length) {
      return false;
    }

    if (isIncludes) {
      return true;
    }

    return false;
  });

  const isPlaylist = currentTrackPlaylistList.some((item) => item.type === "playlist");

  return (
    <div className={styles.trackInfo}>
      <div className={styles.trackInfoWrap}>
        <div className={styles.trackInfoIconBlock}>
          <span className={styles.trackInfoIcon}>
            <TrackInfoIcon isFolder={isFolder} isPlaylist={isPlaylist} />
          </span>
        </div>
      </div>
      <div className={styles.trackInfoContent}>
        <p className={styles.trackInfoTitle}>
          {getTrackInfoTitle(
            isFolder ? firstTrackFolder : firstTrack,
            isFolder,
          )}
        </p>
        <p className={styles.trackInfoAuthor}>
          {getTrackInfoAuthor(firstTrack, isFolder)}
        </p>
      </div>
    </div>
  );
};