export interface Track {
  id: string;
  type: "track";
  title: string;
  link: string;
  author: string;
  thumbnail?: string;
}

export interface Playlist {
  id: string;
  type: "playlist";
  title: string;
  tracks: Track[];
  author: string;
  thumbnail?: string;
}
