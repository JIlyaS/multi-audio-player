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
// import { debounce } from "lodash";

import { mockTracks } from "../../mock/mock";
import type { Playlist, Track } from "../types";
// import { debounce } from "@/shared/helpers/debounce";

interface AudioPlayerContextType {
  // TODO: Старая конфигурация
  currentTrack: Track | Playlist;
  setCurrentTrack: Dispatch<SetStateAction<Track | Playlist>>;

  tracks: (Track | Playlist)[];
  setTracks: Dispatch<SetStateAction<(Track | Playlist)[]>>;
  searchTracks: (Track | Playlist)[];
  setSearchTracks: Dispatch<SetStateAction<(Track | Playlist)[]>>;
  currentTracks: (Track | Playlist)[];
  searchValue: string;
  setSearchValue: Dispatch<SetStateAction<string>>;
  setCurrentTracks: Dispatch<SetStateAction<(Track | Playlist)[]>>;
  timeProgress: number;
  setTimeProgress: Dispatch<SetStateAction<number>>;
  duration: number;
  setDuration: Dispatch<SetStateAction<number>>;
  setTrackIndex: Dispatch<SetStateAction<number>>;
  isPlaying: boolean;
  setIsPlaying: Dispatch<SetStateAction<boolean>>;

  // onSearchResult: (value: string) => void;

  audioRef: RefObject<HTMLAudioElement | null>;
  progressBarRef: RefObject<HTMLInputElement | null>;

  audioListRef: RefObject<Array<HTMLAudioElement | null>>;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(
  undefined
);

export const AudioPlayerProvider: FC<PropsWithChildren> = ({ children }) => {
  const [tracks, setTracks] = useState(mockTracks as (Track | Playlist)[]);
  const [trackIndex, setTrackIndex] = useState<number>(0);

  const [searchTracks, setSearchTracks] = useState<(Track | Playlist)[]>([]);

  // INFO: Выбор по умолчанию первого выбранного трека
  const [currentTrack, setCurrentTrack] = useState<Track | Playlist>(
    tracks[trackIndex]
  );

  // INFO: Множественное включение аудио
  const [currentTracks, setCurrentTracks] = useState<(Track | Playlist)[]>([
    tracks[trackIndex],
  ]);

  // INFO: Поиск по наименованию трека
  const [searchValue, setSearchValue] = useState<string>("");

  const [timeProgress, setTimeProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLInputElement>(null);

  const audioListRef = useRef<Array<HTMLAudioElement | null>>([]);

  const contextValue = {
    tracks,
    setTracks,

    currentTrack,
    setCurrentTrack,

    currentTracks,
    setCurrentTracks,
    searchValue,
    setSearchValue,

    timeProgress,
    setTimeProgress,
    duration,
    setDuration,
    setTrackIndex,
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
