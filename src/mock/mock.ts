import { v4 as uuidv4 } from "uuid";
import audio1 from "@/shared/assets/01. Sound_09534_StormC.mp3";
import audio2 from "@/shared/assets/02. Sound_09442_Bass_Mute.mp3";

// import demo from "@/shared/assets/default.png";
import audioSingle from "@/shared/assets/single-audio.png";
import audioMultiple from "@/shared/assets/playlist.png";
import type { Playlist, Track } from "@/shared/types";

export const mockTracks: (Track | Playlist)[] = [
  {
    id: uuidv4(),
    type: "track",
    title: "01. Sound_09534_StormC",
    src: audio1,
    author: "Владимир",
    thumbnail: audioSingle,
  },
  {
    id: uuidv4(),
    type: "track",
    title: "02. Sound_09442_Bass_Mute",
    src: audio2,
    author: "Владислав",
    thumbnail: audioSingle,
  },
  {
    id: uuidv4(),
    type: "playlist",
    title: "Тестовый плейлист",
    tracks: [audio1, audio2],
    author: "Илья",
    thumbnail: audioMultiple,
  },
];
