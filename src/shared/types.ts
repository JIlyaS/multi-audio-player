export interface Track {
  id: string;
  type: "track";
  title: string;
  src: string;
  author: string;
  thumbnail?: string;
}

export interface Playlist {
  id: string;
  type: "playlist";
  title: string;
  tracks: string[];
  author: string;
  thumbnail?: string;
}
