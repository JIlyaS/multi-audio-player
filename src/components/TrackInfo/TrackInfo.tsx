// INFO: Отображение информации о текущем треке
import { $currentTrackPlaylistList, $trackPlaylistForFolderList } from "@/models/shared";
import { useUnit } from "effector-react";

import styles from "./TrackInfo.module.css";
import { TrackInfoIcon } from "./TrackInfoIcon";
import { getTrackInfoAuthor, getTrackInfoTitle } from "./utils";
import clsx from "clsx";

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

  const isTrack =
    !isFolder && currentTrackPlaylistList.length &&
    currentTrackPlaylistList.every((item) => item.type === "track");
  const isPlaylist = !isFolder && currentTrackPlaylistList.some(
    (item) => item.type === "playlist",
  );

  const title = getTrackInfoTitle(
    isFolder ? firstTrackFolder : firstTrack,
    isFolder,
  );

  const author = getTrackInfoAuthor(firstTrack, isFolder);

  return (
    <div className={styles.trackInfo}>
      <div className={styles.trackInfoWrap}>
        <div
          className={clsx(styles.trackInfoIconBlock, {
            [styles.trackInfoIconFolderBlock]: isFolder,
            [styles.trackInfoIconTrackBlock]: isTrack,
            [styles.trackInfoIconPlaylistBlock]: isPlaylist,
          })}
        >
          <span className={styles.trackInfoIcon}>
            <TrackInfoIcon isFolder={isFolder} isPlaylist={isPlaylist} />
          </span>
        </div>
      </div>
      <div className={styles.trackInfoContent}>
        <p className={styles.trackInfoTitle} title={title}>
          {title}
        </p>
        <p className={styles.trackInfoAuthor} title={author || "Неизвестно"}>
          {author}
        </p>
      </div>
    </div>
  );
};