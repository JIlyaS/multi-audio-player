import { useCallback, useEffect, useState } from "react";
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
  $allTrackPlaylistList,
  updateCurrentTrackPlaylistList,
} from "@/models/shared";

// INFO: Обеспечивает управление воспроизведением
export const Controls = () => {
  const { playAnimationRef, startAnimation, updateProgress } = useAnimation();
  const {
    isPlaying,
    setDuration,
    setIsPlaying,

    progressBarRef,
    audioListRef,
  } = useAudioPlayerContext();

  const currentTrackPlaylistList = useUnit($currentTrackPlaylistList);
  const trackPlaylistList = useUnit($allTrackPlaylistList);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const currentOnlyTracks = [
    ...currentTrackPlaylistList
      .filter((item) => item.type === "playlist")
      .map((item) => item.tracks)
      .flat(),
    ...currentTrackPlaylistList.filter((item) => item.type === "track"),
  ];

  // Проявляем изобретательность с помощью `Set` и `map()` 🕵️‍♀️
  const unique = Array.from(
    new Set(currentOnlyTracks.map((item) => JSON.stringify(item))),
  ).map((item) => JSON.parse(item));

  // console.log("currentOnlyTracks", currentOnlyTracks);

  // const [isShuffle] = useState<boolean>(false);
  const [isRepeat] = useState<boolean>(false);

  const isDisabledButtons =
    currentTrackPlaylistList.length > 1 || !currentTrackPlaylistList.length;

  const onLoadedMetadata = () => {
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
  };

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
      audioListRef.current[idx]?.pause();
      setIsPlaying(false);
    });
  };

  const handlePrevious = useCallback(() => {
    const currentTrackId = trackPlaylistList.findIndex(
      (item) => item.id === currentTrackPlaylistList[0]?.id,
    );

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
      console.log(
        "currentTrackPlaylistList",
        currentTrackPlaylistList,
        audioListRef.current,
      );

      currentOnlyTracks.forEach((item, idx) => {
        // if (item.type === "playlist") {
        //   item.tracks.forEach((_, idx) => {
        //     audioListRef.current[idx]?.play();
        //   });
        //   return;
        // }

        console.log("idx", idx, item);
        audioListRef.current[idx]?.play();
      });
      startAnimation();
    } else {
      currentOnlyTracks.forEach((item, idx) => {
        // if (item.type === "playlist") {
        //   item.tracks.forEach((_, idx) => {
        //     audioListRef.current[idx]?.pause();
        //   });
        //   return;
        // }
        audioListRef.current[idx]?.pause();
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
  }, [
    isPlaying,
    startAnimation,
    updateProgress,
    audioListRef,
    currentTrackPlaylistList,
    playAnimationRef,
    currentOnlyTracks,
  ]);

  useEffect(() => {
    const currentAudioListRef = audioListRef.current;

    if (currentAudioListRef) {
      currentAudioListRef.forEach((currentAudioItemRef) => {
        if (currentAudioItemRef) {
          currentAudioItemRef.onended = () => {
            if (isRepeat) {
              currentAudioItemRef.play();
            } else {
              handleNext();
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
  }, [isRepeat, handleNext, audioListRef]);

  useEffect(() => {
    if (currentOnlyTracks.length) {
      audioListRef.current = audioListRef.current.slice(
        0,
        currentOnlyTracks.length,
      );

      console.log("audioListRef.current", audioListRef.current);
    }
  }, [audioListRef, currentOnlyTracks.length]);

  console.log(
    "currentTrackPlaylistList",
    currentTrackPlaylistList,
    currentOnlyTracks,
    unique,
  );

  return (
    <div className="flex gap-4 items-center">
      {/* {currentTrackPlaylistList
        .filter((currentTrack) => currentTrack.type === "playlist")
        .map((currentPlaylist) => (
          <div key={currentPlaylist.id} className="absolute">
            {currentPlaylist.tracks.map((track, idx) => (
              <audio
                key={track.link}
                src={track.link}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                ref={(el) => (audioListRef.current[idx] = el)}
                onLoadedMetadata={onLoadedMetadata}
              >
                <p>Ваш браузер не поддерживает встроенное аудио.</p>
              </audio>
            ))}
          </div>
        ))} */}
      {unique
        // .filter((currentTrack) => currentTrack?.type === "track")
        .map((currentTrack, idx) => (
          <div key={currentTrack?.id} className="absolute">
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
      <button onClick={handlePrevious} disabled={isDisabledButtons}>
        <BsSkipStartFill
          size={20}
          className={clsx(styles.controlsIcon, {
            [styles.controlsIconDisabled]: isDisabledButtons,
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
      <button onClick={handleNext} disabled={isDisabledButtons}>
        <BsSkipEndFill
          size={20}
          className={clsx(styles.controlsIcon, {
            [styles.controlsIconDisabled]: isDisabledButtons,
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
