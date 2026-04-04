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

import "./Controls.module.css";

import { useAnimation } from "../../shared/hooks/useAnimation";
import { useAudioPlayerContext } from "@/shared/contexts/AudioPlayerContext";
import { useUnit } from "effector-react";
import {
  $currentTrackPlaylistList,
  $trackPlaylistList,
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
  const trackPlaylistList = useUnit($trackPlaylistList);

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
    currentTrackPlaylistList.forEach((_, idx) => {
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

      currentTrackPlaylistList.forEach((currentTrack, idx) => {
        if (currentTrack.type === "playlist") {
          currentTrack.tracks.forEach((_, idx) => {
            audioListRef.current[idx]?.play();
          });
          return;
        }
        audioListRef.current[idx]?.play();
      });
      startAnimation();
    } else {
      currentTrackPlaylistList.forEach((currentTrack, idx) => {
        if (currentTrack.type === "playlist") {
          currentTrack.tracks.forEach((_, idx) => {
            audioListRef.current[idx]?.pause();
          });
          return;
        }
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
    if (currentTrackPlaylistList.length) {
      audioListRef.current = audioListRef.current.slice(
        0,
        currentTrackPlaylistList.length,
      );
    }
  }, [audioListRef, currentTrackPlaylistList.length]);

  return (
    <div className="flex gap-4 items-center">
      {currentTrackPlaylistList
        .filter((currentTrack) => currentTrack.type === "playlist")
        .map((currentTrack) => (
          <div key={currentTrack.id} className="absolute">
            {currentTrack.tracks.map((track, idx) => (
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
        ))}
      {currentTrackPlaylistList
        .filter((currentTrack) => currentTrack?.type === "track")
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
          color={isDisabledButtons ? "#808080" : "#FFFFFF"}
        />
      </button>
      <button onClick={skipBackward} disabled={isDisabledButtons}>
        <BsFillRewindFill
          size={20}
          color={isDisabledButtons ? "#808080" : "#FFFFFF"}
        />
      </button>
      <button
        onClick={() => setIsPlaying((prev) => !prev)}
        disabled={!currentTrackPlaylistList.length}
      >
        {isPlaying ? (
          <BsFillPauseFill
            size={30}
            color={!currentTrackPlaylistList.length ? "#808080" : "#FFFFFF"}
          />
        ) : (
          <BsFillPlayFill
            size={30}
            color={!currentTrackPlaylistList.length ? "#808080" : "#FFFFFF"}
          />
        )}
      </button>
      <button
        onClick={handleStopClick}
        disabled={!currentTrackPlaylistList.length}
      >
        <BsStopFill
          size={30}
          color={!currentTrackPlaylistList.length ? "#808080" : "#FFFFFF"}
        />
      </button>
      <button onClick={skipForward} disabled={isDisabledButtons}>
        <BsFillFastForwardFill
          size={20}
          color={isDisabledButtons ? "#808080" : "#FFFFFF"}
        />
      </button>
      <button
        onClick={handleNext}
        disabled={isDisabledButtons}
      >
        <BsSkipEndFill
          size={20}
          color={isDisabledButtons ? "#808080" : "#FFFFFF"}
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
};
