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
    progressBarRef,
    audioListRef,
  } = useAudioPlayerContext();

  const updateProgress = useCallback(() => {
    if (audioListRef.current && progressBarRef.current && duration) {
      const maxCurrentTime = Math.max(
        ...audioListRef.current
          .map(
            (audioItemRef: HTMLAudioElement | null) =>
              audioItemRef?.currentTime || 0,
          ),
      );

      const currentTime = maxCurrentTime;
      setTimeProgress(currentTime);
      progressBarRef.current.value = currentTime.toString();
      progressBarRef.current.style.setProperty(
        "--range-progress",
        `${(currentTime / duration) * 100}%`,
      );
    }
  }, [duration, setTimeProgress, audioListRef, progressBarRef]);

  const startAnimation = useCallback(() => {
    if (audioListRef.current && progressBarRef.current && duration) {
      const animate = () => {
        updateProgress();
        playAnimationRef.current = requestAnimationFrame(animate);
      };
      playAnimationRef.current = requestAnimationFrame(animate);
    }
  }, [updateProgress, duration, audioListRef, progressBarRef]);

  return {
    playAnimationRef,
    startAnimation,
    updateProgress,
  };
};
