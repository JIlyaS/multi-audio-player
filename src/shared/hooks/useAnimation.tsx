import { useCallback, useRef, type RefObject } from "react";
import { useAudioPlayerContext } from "../contexts/AudioPlayerContext";

interface ReturnAnimationParams {
  playAnimationRef: RefObject<number | null>;
  startAnimation: () => void;
  updateProgress: () => void;
}

export const useAnimation = (): ReturnAnimationParams => {
  const playAnimationRef = useRef<number | null>(null);

  const {
    duration,
    setTimeProgress,
    audioRef,
    progressBarRef,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    audioListRef,
  } = useAudioPlayerContext();

  const updateProgress = useCallback(() => {
    if (audioRef.current && progressBarRef.current && duration) {
      const currentTime = audioRef.current.currentTime;
      setTimeProgress(currentTime);
      progressBarRef.current.value = currentTime.toString();
      progressBarRef.current.style.setProperty(
        "--range-progress",
        `${(currentTime / duration) * 100}%`
      );
    }
  }, [duration, setTimeProgress, audioRef, progressBarRef]);

  const startAnimation = useCallback(() => {
    if (audioRef.current && progressBarRef.current && duration) {
      const animate = () => {
        updateProgress();
        playAnimationRef.current = requestAnimationFrame(animate);
      };
      playAnimationRef.current = requestAnimationFrame(animate);
    }
  }, [updateProgress, duration, audioRef, progressBarRef]);

  return {
    playAnimationRef,
    startAnimation,
    updateProgress,
  };
};
