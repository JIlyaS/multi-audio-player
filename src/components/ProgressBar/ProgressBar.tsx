import { useAudioPlayerContext } from "../../shared/contexts/AudioPlayerContext";
import { formatTime } from "../../shared/helpers/formatTime";
import "./ProgressBar.module.css";

// INFO: Показывает ход текущего трека
export const ProgressBar = () => {
  const {
    // audioRef,
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
    <div className="flex items-center justify-center gap-5 w-full">
      <span>{formatTime(timeProgress)}</span>
      <input
        className="max-w-[80%] bg-gray-300"
        type="range"
        ref={progressBarRef}
        defaultValue="0"
        onChange={handleProgressChange}
      />
      <span>{formatTime(duration)}</span>
    </div>
  );
};
