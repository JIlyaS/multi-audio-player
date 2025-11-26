import { v4 as uuidv4 } from "uuid";
import audio1 from "../shared/assets/01. Sound_09534_StormC.mp3";
import audio2 from "../shared/assets/02. Sound_09442_Bass_Mute.mp3";

import demo from "../shared/assets/default.png";

export const tracks = [
  {
    id: uuidv4(),
    title: "01. Sound_09534_StormC",
    src: audio1,
    author: "Владимир",
    thumbnail: demo,
  },
  {
    id: uuidv4(),
    title: "02. Sound_09442_Bass_Mute",
    src: audio2,
    author: "Владислав",
    thumbnail: demo,
  },
];
