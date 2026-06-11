export interface Track {
  id: string;
  type: "track";
  title: string;
  link: string;
  // folder?: Folder;
  folder?: Folder | null;
  folderId: string | null;
  tags: string[];
  author: string;
}

export interface Playlist {
  id: string;
  type: "playlist";
  title: string;
  tracks: Track[];
  userId?: string | null;
  folder?: Folder | null;
  folderId: string | null;
  tags: string[];
  isPublic: boolean;
  author: string;
}

export interface Folder {
  id: string;
  name: string;
  title: string;
  isPublic: boolean;
  isGlobal: boolean;
  // TODO: Пока скрываем это свойство
  userId?: string | null;
}

export interface FolderOption {
  id: string;
  label: string;
  value?: string;
}
