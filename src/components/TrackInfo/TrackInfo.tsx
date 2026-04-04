// INFO: Отображение информации о текущем треке
import { $currentTrackPlaylistList } from "@/models/shared";
import { useUnit } from "effector-react";
import { BsMusicNoteBeamed, BsMusicNoteList } from "react-icons/bs";

import styles from "./TrackInfo.module.css";

export const TrackInfo = () => {

  const currentTrackPlaylistList = useUnit($currentTrackPlaylistList);
  const firstTrack = currentTrackPlaylistList[0];

  // // TODO: Подумать какую информацию показывать для пользователя
  // if (!currentTrackPlaylistList[0]) {
  //   return null;
  // }

  const isPlaylist = currentTrackPlaylistList.some((item) => item.type === "playlist");

  return (
    <div className={styles.trackInfo}>
      <div className="w-24 h-24 min-w-24 flex items-center justify-center bg-gray-200 rounded-md overflow-hidden;">
        <div className="flex items-center justify-center w-full h-full bg-gray-300 rounded-md min-w-24">
          <span className="text-xl text-gray-600">
            {isPlaylist ? (
              <BsMusicNoteList size="32px" />
            ) : (
              <BsMusicNoteBeamed size="32px" />
            )}
          </span>
        </div>
        {/* )} */}
      </div>
      <div className={styles.trackInfoContent}>
        <p className="font-bold truncate max-w-64">
          {firstTrack?.title || "Композиция не выбрана"}
        </p>
        <p className="text-sm text-gray-400 truncate max-w-64">
          {firstTrack?.author || "Неизвестно"}
        </p>
      </div>
    </div>
  );
};