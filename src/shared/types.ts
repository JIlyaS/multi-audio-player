export interface Track {
  id: string;
  type: "track";
  title: string;
  link: string;
  tags: string[];
  author: string;
}

export interface Playlist {
  id: string;
  type: "playlist";
  title: string;
  tracks: Track[];
  userId?: string | null;
  tags: string[];
  isPublic: boolean;
  author: string;
}
