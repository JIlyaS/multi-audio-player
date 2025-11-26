import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
  useRef,
  type RefObject,
  type FC,
  type PropsWithChildren,
} from "react";

import { tracks } from "../../mock/mock";
import type { Track } from "../types";

interface AudioPlayerContextType {
  tracks: Track[];
  currentTrack: Track;
  setCurrentTrack: Dispatch<SetStateAction<Track>>;
  currentTracks: Track[];
  setCurrentTracks: Dispatch<SetStateAction<Track[]>>;
  timeProgress: number;
  setTimeProgress: Dispatch<SetStateAction<number>>;
  duration: number;
  setDuration: Dispatch<SetStateAction<number>>;
  setTrackIndex: Dispatch<SetStateAction<number>>;
  isPlaying: boolean;
  setIsPlaying: Dispatch<SetStateAction<boolean>>;

  audioRef: RefObject<HTMLAudioElement | null>;
  progressBarRef: RefObject<HTMLInputElement | null>;

  audioListRef: RefObject<Array<HTMLAudioElement | null>>;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(
  undefined
);

export const AudioPlayerProvider: FC<PropsWithChildren> = ({ children }) => {
  const [trackIndex, setTrackIndex] = useState<number>(0);
  const [currentTrack, setCurrentTrack] = useState<Track>(tracks[trackIndex]);

  // INFO: Множественное включение аудио
  const [currentTracks, setCurrentTracks] = useState<Track[]>([
    tracks[trackIndex],
  ]);

  const [timeProgress, setTimeProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLInputElement>(null);

  const audioListRef = useRef<Array<HTMLAudioElement | null>>([]);

  const contextValue = {
    tracks,
    currentTrack,
    setCurrentTrack,

    currentTracks,
    setCurrentTracks,

    timeProgress,
    setTimeProgress,
    duration,
    setDuration,
    setTrackIndex,
    isPlaying,
    setIsPlaying,

    audioRef,
    progressBarRef,
    audioListRef,
  };
  return (
    <AudioPlayerContext.Provider value={contextValue}>
      {children}
    </AudioPlayerContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAudioPlayerContext = (): AudioPlayerContextType => {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error(
      "useAudioPlayerContext must be used within an AudioPlayerProvider"
    );
  }
  return context;
};
