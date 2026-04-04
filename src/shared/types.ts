export interface Track {
  id: string;
  type: "track";
  title: string;
  link: string;
  author: string;
}

export interface Playlist {
  id: string;
  type: "playlist";
  title: string;
  tracks: Track[];
  userId?: string | null;
  isPublic: boolean;
  author: string;
}
