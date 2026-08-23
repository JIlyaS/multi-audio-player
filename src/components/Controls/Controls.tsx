import { useCallback, useEffect } from "react";
import {
  BsFillFastForwardFill,
  BsFillPauseFill,
  BsFillPlayFill,
  BsFillRewindFill,
  BsSkipEndFill,
  BsSkipStartFill,
  // BsShuffle,
  // BsRepeat,
  BsStopFill,
} from "react-icons/bs";
import clsx from "clsx";

import styles from "./Controls.module.css";
import "./Controls.module.css";

import { useAnimation } from "../../shared/hooks/useAnimation";
import { useAudioPlayerContext } from "@/shared/contexts/AudioPlayerContext";
import { useUnit } from "effector-react";
import {
  $currentTrackPlaylistList,
  $trackPlaylistList,
  updateCurrentTrackPlaylistList,
} from "@/models/shared";
import { getUniqueObjectData } from "@/shared/helpers/getUniqueObjectData";
import type { Track } from "@/shared/types";

// INFO: Обеспечивает управление воспроизведением
export const Controls = () => {
  const { playAnimationRef, startAnimation, updateProgress } = useAnimation();
  const {
    timeProgress,
    duration,
    isPlaying,
    setDuration,
    setIsPlaying,
    isRepeatPlaying,
    isInfinityPlaying,

    progressBarRef,
    audioListRef,
  } = useAudioPlayerContext();

  const currentTrackPlaylistList = useUnit($currentTrackPlaylistList);
  const trackPlaylistList = useUnit($trackPlaylistList);

  const currentOnlyTracks = getUniqueObjectData<Track>([
    ...currentTrackPlaylistList
      .filter((item) => item.type === "playlist")
      .map((item) => item.tracks)
      .flat(),
    ...currentTrackPlaylistList.filter((item) => item.type === "track"),
  ]);

  const isDisabledButtons =
    currentTrackPlaylistList.length > 1 || !currentTrackPlaylistList.length;

  const isDisabledPrevButton =
    isDisabledButtons ||
    (currentTrackPlaylistList.length === 1 &&
      trackPlaylistList.findIndex(
        (item) => item.id === currentTrackPlaylistList[0].id,
      )) === 0;

  const isDisabledNextButton =
    isDisabledButtons ||
    (currentTrackPlaylistList.length === 1 &&
      trackPlaylistList.findIndex(
        (item) => item.id === currentTrackPlaylistList[0].id,
      )) === trackPlaylistList.length - 1;

  const onLoadedMetadata = useCallback(() => {
    const durationList = audioListRef.current
      .map((item) => item?.duration)
      .flat()
      .filter((item) => !!item);

    const isValidNumber = durationList.every(
      (duration) => duration !== undefined,
    );

    if (durationList !== undefined && isValidNumber) {
      const maxValueSeconds = Math.max(...durationList);

      setDuration(maxValueSeconds);
      if (progressBarRef.current) {
        progressBarRef.current.max = maxValueSeconds.toString();
      }
    }
    // TODO: Некорректное поведение и обновление данных при зависимости - currentTrackPlaylistList.length
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioListRef, progressBarRef, setDuration, currentTrackPlaylistList.length]);

  const skipForward = () => {
    if (audioListRef.current) {
      audioListRef.current.forEach((audio) => {
        if (audio) {
          audio.currentTime += 15;
        }
      });
      updateProgress();
    }
  };

  const skipBackward = () => {
    if (audioListRef.current) {
      audioListRef.current.forEach((audio) => {
        if (audio) {
          audio.currentTime -= 15;
        }
      });
      updateProgress();
    }
  };

  const handleStopClick = () => {
    currentOnlyTracks.forEach((_, idx) => {
      console.log('_',_);
      audioListRef.current[idx]?.pause();
      setIsPlaying(false);
    });
  };

  const handlePrevious = useCallback(() => {
    const currentTrackId = trackPlaylistList
      .findIndex((item) => item.id === currentTrackPlaylistList[0]?.id);

    if (trackPlaylistList[currentTrackId - 1]) {
      updateCurrentTrackPlaylistList([trackPlaylistList[currentTrackId - 1]]);

      audioListRef.current[currentTrackId - 1]?.play();
    }
  }, [currentTrackPlaylistList, trackPlaylistList, audioListRef]);

  const handleNext = useCallback(() => {
    const currentTrackId = trackPlaylistList.findIndex(
      (item) => item.id === currentTrackPlaylistList[0]?.id,
    );

    if (trackPlaylistList[currentTrackId + 1]) {
      updateCurrentTrackPlaylistList([trackPlaylistList[currentTrackId + 1]]);

      audioListRef.current[currentTrackId + 1]?.play();
    }
  }, [currentTrackPlaylistList, trackPlaylistList, audioListRef]);

  useEffect(() => {
    if (isPlaying) {
      currentOnlyTracks.forEach((_, idx) => {
        if (!audioListRef.current[idx]?.ended) {
          audioListRef.current[idx]?.play();
        }
      });
      startAnimation();
    } else {
      currentOnlyTracks.forEach((_, idx) => {
        const currentTrackDuration = audioListRef.current[idx]?.duration || 0;
        if (currentTrackDuration <= timeProgress || !isPlaying) {
          audioListRef.current[idx]?.pause();
        }
      });
      if (playAnimationRef.current !== null) {
        cancelAnimationFrame(playAnimationRef.current);
        playAnimationRef.current = null;
      }
      updateProgress();
    }

    return () => {
      if (playAnimationRef.current !== null) {
        cancelAnimationFrame(playAnimationRef.current);
      }
    };
  }, [isPlaying, startAnimation, updateProgress, audioListRef, currentTrackPlaylistList, playAnimationRef, currentOnlyTracks, isInfinityPlaying, duration, timeProgress]);

  useEffect(() => {
    const currentAudioListRef = audioListRef.current;

    if (currentAudioListRef) {
      currentAudioListRef.forEach((currentAudioItemRef) => {
        if (currentAudioItemRef) {
          currentAudioItemRef.onended = () => {
            if (isRepeatPlaying) {
              currentAudioItemRef.play();
            } else {
              if (isInfinityPlaying) {
                handleNext();
              } else {
                currentOnlyTracks.forEach((_, idx) => {
                  // INFO: Проверка на то, что у каждого трека  в плейлисте закончилось время
                  const currentTrackDuration =
                    audioListRef.current[idx]?.duration || 0;
                  if (currentTrackDuration <= timeProgress) {
                    audioListRef.current[idx]?.pause();
                  }
                });
                const isEveryTimeEnd = currentOnlyTracks.every(
                  (_, idx) =>
                    audioListRef.current[idx]?.ended
                );

                if (isEveryTimeEnd) {
                  if (playAnimationRef.current !== null) {
                    cancelAnimationFrame(playAnimationRef.current);
                    playAnimationRef.current = null;
                  }
                  updateProgress();
                  setIsPlaying(false);
                }
              }
            }
          };
        }
      });
    }

    return () => {
      if (currentAudioListRef) {
        currentAudioListRef.forEach((currentAudioItemRef) => {
          if (currentAudioItemRef) {
            currentAudioItemRef.onended = null;
          }
        });
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isRepeatPlaying,
    handleNext,
    audioListRef,
    isInfinityPlaying,
    currentOnlyTracks,
    playAnimationRef,
    updateProgress,
  ]);

  useEffect(() => {
    if (currentOnlyTracks.length) {
      audioListRef.current = audioListRef.current.slice(
        0,
        currentOnlyTracks.length,
      );
    }
  }, [audioListRef, currentOnlyTracks.length]);

  return (
    <div className="flex gap-4 items-center">
      {currentOnlyTracks.map((currentTrack, idx) => (
        <div key={`${currentTrack?.id}-${idx}`} className="absolute">
          <audio
            src={currentTrack?.link}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            ref={(el) => (audioListRef.current[idx] = el)}
            onLoadedMetadata={onLoadedMetadata}
          >
            <p>Ваш браузер не поддерживает встроенное аудио.</p>
          </audio>
        </div>
      ))}
      <button onClick={handlePrevious} disabled={isDisabledPrevButton}>
        <BsSkipStartFill
          size={20}
          className={clsx(styles.controlsIcon, {
            [styles.controlsIconDisabled]: isDisabledPrevButton,
          })}
        />
      </button>
      <button onClick={skipBackward} disabled={isDisabledButtons}>
        <BsFillRewindFill
          size={20}
          className={clsx(styles.controlsIcon, {
            [styles.controlsIconDisabled]: isDisabledButtons,
          })}
        />
      </button>
      <button
        onClick={() => setIsPlaying((prev) => !prev)}
        disabled={!currentTrackPlaylistList.length}
      >
        {isPlaying ? (
          <BsFillPauseFill
            size={30}
            className={clsx(styles.controlsIcon, {
              [styles.controlsIconDisabled]: !currentTrackPlaylistList.length,
            })}
          />
        ) : (
          <BsFillPlayFill
            size={30}
            className={clsx(styles.controlsIcon, {
              [styles.controlsIconDisabled]: !currentTrackPlaylistList.length,
            })}
          />
        )}
      </button>
      <button
        onClick={handleStopClick}
        disabled={!currentTrackPlaylistList.length}
      >
        <BsStopFill
          size={30}
          className={clsx(styles.controlsIcon, {
            [styles.controlsIconDisabled]: !currentTrackPlaylistList.length,
          })}
        />
      </button>
      <button onClick={skipForward} disabled={isDisabledButtons}>
        <BsFillFastForwardFill
          size={20}
          className={clsx(styles.controlsIcon, {
            [styles.controlsIconDisabled]: isDisabledButtons,
          })}
        />
      </button>
      <button onClick={handleNext} disabled={isDisabledNextButton}>
        <BsSkipEndFill
          size={20}
          className={clsx(styles.controlsIcon, {
            [styles.controlsIconDisabled]: isDisabledNextButton,
          })}
        />
      </button>
      {/* <button
        onClick={() => setIsShuffle((prev) => !prev)}
        disabled={currentTracks.length > 1 || !currentTracks.length}
      >
        <BsShuffle size={20} className={isShuffle ? "text-[#f50]" : ""} />
      </button> */}
      {/* <button
        onClick={() => setIsRepeat((prev) => !prev)}
        disabled={currentTracks.length > 1 || !currentTracks.length}
      >
        <BsRepeat size={20} className={isRepeat ? "text-[#f50]" : ""} />
      </button> */}
    </div>
  );
};;
