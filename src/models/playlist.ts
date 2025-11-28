import type { Playlist } from "@/shared/types";
import { createStore } from "effector";

export const $playlists = createStore<Playlist[]>([]);
