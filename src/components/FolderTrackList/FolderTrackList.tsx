import { useEffect, useState, type FC } from "react";

import clsx from "clsx";

import styles from "./FolderTrackList.module.css";
import { FolderItem } from "@/components/FolderItem";
import { BsCheck2Square, BsChevronDown } from "react-icons/bs";
import { TrackBlock } from "@/components/TrackBlock";
import type { Playlist, Track } from "@/shared/types";
import { useUnit } from "effector-react";
import { useAudioPlayerContext } from "@/shared/contexts/AudioPlayerContext";
import { $currentTrackPlaylistList, updateCurrentTrackPlaylistList, $trackPlaylistList, $isSelectAll } from "@/models/shared";
// import { OverlayTooltip } from "@/shared/ui";

interface Props {
  folder: {
    trackList: (Track | Playlist)[];
    id: string;
    name: string;
    title: string;
    isPublic: boolean;
    isGlobal: boolean;
    userId?: string | null;
  };
}

export const FolderTrackList: FC<Props> = ({ folder }) => {
  // TODO: Переписать контекст под Effector или State формат
  const { setDuration } = useAudioPlayerContext();
  const isSelectAll = useUnit($isSelectAll);
  const currentTrackPlaylistList = useUnit($currentTrackPlaylistList);
  const trackPlaylistList = useUnit($trackPlaylistList);

  const [isFolderSelected, setIsFolderSelected] = useState(false);

  const currentFolderTrackList = currentTrackPlaylistList.filter((item) => item.folderId === folder.id);

  const isSelectAllFolder = isSelectAll || currentFolderTrackList.length === folder.trackList.length;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsFolderSelected(isSelectAllFolder ? true : false);
  }, [isSelectAllFolder]);
  
  // TODO: Переделать localStorage под корректный формат
  const [isOpenFolder, setIsOpenFolder] = useState(() => {
    const storedOpenFolder = localStorage.getItem("storedOpenFolder") || null;

    const parsedOpenFolder: string[] =
      storedOpenFolder ? JSON.parse(storedOpenFolder) : [];
    return parsedOpenFolder.includes(folder.id);
  });

  const handleToggleFolderChange = (folderId: string) => {
    const storedOpenFolder = localStorage.getItem("storedOpenFolder") || null;

    let parsedOpenFolder: string[] =
      storedOpenFolder ? JSON.parse(storedOpenFolder) : [];

    setIsOpenFolder((prevState) => {

        if (prevState) {
            parsedOpenFolder = parsedOpenFolder.includes(folderId)
              ? parsedOpenFolder.filter((item) => item !== folderId)
              : parsedOpenFolder;
            localStorage.setItem(
              "storedOpenFolder",
              JSON.stringify(parsedOpenFolder),
            );
            return false;
        }

        if (!parsedOpenFolder.includes(folderId)) {
            parsedOpenFolder.push(folderId)
            localStorage.setItem(
              "storedOpenFolder",
              JSON.stringify(parsedOpenFolder),
            );
        }


        return true;
    });
  };

  // TODO: Переделать под подходящий паттерн проектирование
  const handleSelectAudioChange = (id: string) => {
    const isSelected = currentTrackPlaylistList.some((item) => item.id === id);
    const currentSelectedTrack = trackPlaylistList.find(
      (track) => track.id === id,
    );

    if (currentSelectedTrack) {
      if (isSelected) {
        updateCurrentTrackPlaylistList(
          currentTrackPlaylistList.filter((item) => item.id !== id),
        );

        // TODO: Переделать логику в будущем
        if (
          currentTrackPlaylistList.filter((item) => item.id !== id).length === 0
        ) {
          setDuration(0);
        }
        return;
      }

      updateCurrentTrackPlaylistList([
        ...currentTrackPlaylistList,
        currentSelectedTrack,
      ]);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSelectAllFolderClick = (evt: any) => {
    evt.stopPropagation();

    setIsFolderSelected((prevValue) => {
        if (prevValue) {
          updateCurrentTrackPlaylistList([
            ...currentTrackPlaylistList.filter(
              (item) => item.folderId !== folder.id,
            ),
          ]);
          // TODO: Переделать логику в будущем
          if (
            currentTrackPlaylistList.filter(
                (item) => item.folderId !== folder.id,
              ).length === 0
                   ) {
                     setDuration(0);
                   }
          return false;
        }

        updateCurrentTrackPlaylistList([
          ...currentTrackPlaylistList.filter(
            (item) => item.folderId !== folder.id,
          ),
          ...trackPlaylistList.filter((item) => item.folderId === folder.id),
        ]);

        return true;
    });
  } 

  if (!folder.trackList.length && !folder.isGlobal) {
    return null;
  }

  return (
    <>
      <li
        key={folder.id}
        className={styles.playListFolderItem}
        tabIndex={0}
        onKeyDown={(evt) => {
          if (evt.key === "Enter" || evt.key === " ") {
            handleToggleFolderChange(folder.id);
          }
        }}
        onClick={() => handleToggleFolderChange(folder.id)}
      >
        <div className={styles.folderItemWrap}>
            <button
              className={clsx(styles.folderSelectedBtn, {
                [styles.folderSelectedBtnActive]: isFolderSelected,
              })}
              onClick={handleSelectAllFolderClick}
            >
              <BsCheck2Square />
            </button>
          <FolderItem {...folder} />
        </div>
        <div
          className={clsx(styles.folderItemBtnGroup, {
            ["rotate-180"]: isOpenFolder,
          })}
        >
          <BsChevronDown size="18px" />
        </div>
      </li>
      {folder.trackList.length ? (
        <li>
          <ul
            className={clsx(styles.folderTrackList, {
              [styles.folderTrackListActive]: isOpenFolder,
            })}
          >
            {folder.trackList.map((track) => (
              <TrackBlock
                key={track.id}
                track={track}
                containerClassName={styles.folderTrackBlock}
                currentTracks={currentTrackPlaylistList}
                onAudioChange={handleSelectAudioChange}
              />
            ))}
          </ul>
        </li>
      ) : null}
    </>
  );
};;;