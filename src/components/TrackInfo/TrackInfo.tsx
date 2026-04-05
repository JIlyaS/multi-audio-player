// INFO: Отображение информации о текущем треке
import { $currentTrackPlaylistList } from "@/models/shared";
import { useUnit } from "effector-react";
import { BsMusicNoteBeamed, BsMusicNoteList } from "react-icons/bs";

import styles from "./TrackInfo.module.css";

export const TrackInfo = () => {

  const currentTrackPlaylistList = useUnit($currentTrackPlaylistList);
  const firstTrack = currentTrackPlaylistList[0];

  const isPlaylist = currentTrackPlaylistList.some((item) => item.type === "playlist");

  return (
    <div className={styles.trackInfo}>
      <div className={styles.trackInfoWrap}>
        <div className={styles.trackInfoIconBlock}>
          <span className={styles.trackInfoIcon}>
            {isPlaylist ? (
              <BsMusicNoteList size="32px" />
            ) : (
              <BsMusicNoteBeamed size="32px" />
            )}
          </span>
        </div>
      </div>
      <div className={styles.trackInfoContent}>
        <p className={styles.trackInfoTitle}>
          {firstTrack?.title || "Композиция не выбрана"}
        </p>
        <p className={styles.trackInfoAuthor}>
          {firstTrack?.author || "Неизвестно"}
        </p>
      </div>
    </div>
  );
};