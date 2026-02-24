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

import type { Playlist, Track } from "../types";

interface AudioPlayerContextType {
  searchTracks: (Track | Playlist)[];
  setSearchTracks: Dispatch<SetStateAction<(Track | Playlist)[]>>;
  searchValue: string;
  setSearchValue: Dispatch<SetStateAction<string>>;
  timeProgress: number;
  setTimeProgress: Dispatch<SetStateAction<number>>;
  duration: number;
  setDuration: Dispatch<SetStateAction<number>>;
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

  const [searchTracks, setSearchTracks] = useState<(Track | Playlist)[]>([]);


  // INFO: Поиск по наименованию трека
  const [searchValue, setSearchValue] = useState<string>("");

  const [timeProgress, setTimeProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLInputElement>(null);

  const audioListRef = useRef<Array<HTMLAudioElement | null>>([]);

  const contextValue = {
    searchValue,
    setSearchValue,

    timeProgress,
    setTimeProgress,
    duration,
    setDuration,
    isPlaying,
    setIsPlaying,

    searchTracks,
    setSearchTracks,

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
