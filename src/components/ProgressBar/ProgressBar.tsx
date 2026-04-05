import { useAudioPlayerContext } from "../../shared/contexts/AudioPlayerContext";
import { formatTime } from "../../shared/helpers/formatTime";

import styles from "./ProgressBar.module.css";

// INFO: Показывает ход текущего трека
export const ProgressBar = () => {
  const {
    audioListRef,
    progressBarRef,
    timeProgress,
    duration,
    setTimeProgress,
  } = useAudioPlayerContext();

  const handleProgressChange = () => {
    if (audioListRef.current.length && progressBarRef.current) {
      const newTime = Number(progressBarRef.current.value);

      audioListRef.current.forEach((audio) => {
        if (!audio) {
          return;
        }

        audio.currentTime = newTime;
      });

      setTimeProgress(newTime);

      progressBarRef.current.style.setProperty(
        "--range-progress",
        `${(newTime / duration) * 100}%`
      );
    }
  };

  return (
    <div className={styles.progressBar}>
      <span className={styles.progressBarTimeContent}>
        {formatTime(timeProgress)}
      </span>
      <input
        className={styles.progressTimeInput}
        type="range"
        ref={progressBarRef}
        defaultValue="0"
        onChange={handleProgressChange}
      />
      <span className={styles.progressBarTimeContent}>
        {formatTime(duration)}
      </span>
    </div>
  );
};
