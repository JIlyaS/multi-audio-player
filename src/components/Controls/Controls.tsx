import { useCallback, useEffect, useState } from "react";
import {
  BsFillFastForwardFill,
  BsFillPauseFill,
  BsFillPlayFill,
  BsFillRewindFill,
  BsSkipEndFill,
  BsSkipStartFill,
  BsShuffle,
  BsRepeat,
  BsStopFill,
} from "react-icons/bs";

import "./Controls.module.css";

import { useAudioPlayerContext } from "../../shared/contexts/AudioPlayerContext";
import { useAnimation } from "../../shared/hooks/useAnimation";

// INFO: Обеспечивает управление воспроизведением
export const Controls = () => {
  // currentTrack.src
  const { playAnimationRef, startAnimation, updateProgress } = useAnimation();
  const {
    tracks,
    // currentTrack,
    currentTracks,
    // setCurrentTracks,
    isPlaying,
    setDuration,
    setTrackIndex,
    setCurrentTrack,
    setIsPlaying,

    audioRef,
    progressBarRef,
    audioListRef,
  } = useAudioPlayerContext();

  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);

  const onLoadedMetadata = () => {
    const seconds = audioRef.current?.duration;
    if (seconds !== undefined) {
      setDuration(seconds);
      if (progressBarRef.current) {
        progressBarRef.current.max = seconds.toString();
      }
    }
  };

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime += 15;
      updateProgress();
    }
  };

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime -= 15;
      updateProgress();
    }
  };

  const handleStopClick = () => {
    currentTracks.forEach((_, idx) => {
      audioListRef.current[idx]?.pause();
      setIsPlaying(false);
    });
  };

  const handlePrevious = useCallback(() => {
    setTrackIndex((prev) => {
      const newIndex = isShuffle
        ? Math.floor(Math.random() * tracks.length)
        : prev === 0
        ? tracks.length - 1
        : prev - 1;
      setCurrentTrack(tracks[newIndex]);
      return newIndex;
    });
  }, [isShuffle, setCurrentTrack, setTrackIndex, tracks]);

  const handleNext = useCallback(() => {
    setTrackIndex((prev) => {
      const newIndex = isShuffle
        ? Math.floor(Math.random() * tracks.length)
        : prev >= tracks.length - 1
        ? 0
        : prev + 1;
      setCurrentTrack(tracks[newIndex]);
      return newIndex;
    });
  }, [isShuffle, setCurrentTrack, setTrackIndex, tracks]);

  useEffect(() => {
    if (isPlaying) {
      // audioRef.current?.play();
      // const currentTrackIds = currentTracks.map((item) => item.id);
      // currentTrackIds.forEach((idx) => {
      //   console.log("currentTrackIds", currentTrackIds, idx);
      //   audioListRef.current[idx]?.play();
      // });
      currentTracks.forEach((_, idx) => audioListRef.current[idx]?.play());
      startAnimation();
    } else {
      // audioRef.current?.pause();
      currentTracks.forEach((_, idx) => audioListRef.current[idx]?.pause());
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
    audioRef,
    audioListRef,
    currentTracks,
    playAnimationRef,
  ]);

  useEffect(() => {
    const currentAudioRef = audioRef.current;
    if (currentAudioRef) {
      currentAudioRef.onended = () => {
        if (isRepeat) {
          currentAudioRef.play();
        } else {
          handleNext();
        }
      };
    }
    return () => {
      if (currentAudioRef) {
        currentAudioRef.onended = null;
      }
    };
  }, [isRepeat, handleNext, audioRef]);

  useEffect(() => {
    audioListRef.current = audioListRef.current.slice(0, currentTracks.length);
  }, [audioListRef, currentTracks]);

  console.log("currentTracks", currentTracks);

  return (
    <div className="flex gap-4 items-center">
      {currentTracks.map((currentTrack, idx) => (
        <div key={currentTrack.id}>
          <audio
            src={currentTrack.src}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            ref={(el) => (audioListRef.current[idx] = el)}
            onLoadedMetadata={onLoadedMetadata}
          >
            <p>Ваш браузер не поддерживает встроенное аудио.</p>
          </audio>
        </div>
      ))}
      <button
        onClick={handlePrevious}
        disabled={currentTracks.length > 1 || !currentTracks.length}
      >
        <BsSkipStartFill size={20} />
      </button>
      <button
        onClick={skipBackward}
        disabled={currentTracks.length > 1 || !currentTracks.length}
      >
        <BsFillRewindFill size={20} />
      </button>
      <button
        onClick={() => setIsPlaying((prev) => !prev)}
        disabled={!currentTracks.length}
      >
        {isPlaying ? (
          <BsFillPauseFill size={30} />
        ) : (
          <BsFillPlayFill size={30} />
        )}
      </button>
      <button onClick={handleStopClick} disabled={!currentTracks.length}>
        <BsStopFill size={30} />
      </button>
      <button
        onClick={skipForward}
        disabled={currentTracks.length > 1 || !currentTracks.length}
      >
        <BsFillFastForwardFill size={20} />
      </button>
      <button
        onClick={handleNext}
        disabled={currentTracks.length > 1 || !currentTracks.length}
      >
        <BsSkipEndFill size={20} />
      </button>
      <button
        onClick={() => setIsShuffle((prev) => !prev)}
        disabled={currentTracks.length > 1 || !currentTracks.length}
      >
        <BsShuffle size={20} className={isShuffle ? "text-[#f50]" : ""} />
      </button>
      <button
        onClick={() => setIsRepeat((prev) => !prev)}
        disabled={currentTracks.length > 1 || !currentTracks.length}
      >
        <BsRepeat size={20} className={isRepeat ? "text-[#f50]" : ""} />
      </button>
    </div>
  );
};
