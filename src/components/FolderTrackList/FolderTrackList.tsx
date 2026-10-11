import { useCallback, useEffect, useState, type FC } from "react";
import clsx from "clsx";

import styles from "./FolderTrackList.module.css";
import { FolderItem } from "@/components/FolderItem";
import { BsCheck2Square, BsChevronDown } from "react-icons/bs";
import { TrackBlock } from "@/components/TrackBlock";
import type { Playlist, Track } from "@/shared/types";
import { useUnit } from "effector-react";
import { useAudioPlayerContext } from "@/shared/contexts/AudioPlayerContext";
import { $currentTrackPlaylistList, updateCurrentTrackPlaylistList, $trackPlaylistList, $selectAllState, selectCurrentTrackPlaylistList } from "@/models/shared";
import { CheckState } from "@/shared/consts";
import React from "react";

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
  isOpen: boolean;
  onToggleFolder: (folderId: string) => void;
}

export const FolderTrackList: FC<Props> = ({ folder, isOpen, onToggleFolder }) => {
  // TODO: Переписать контекст под Effector или State формат
  const { setTimeProgress, setDuration, setIsPlaying } =
    useAudioPlayerContext();
  const selectAllState = useUnit($selectAllState);
  const currentTrackPlaylistList = useUnit($currentTrackPlaylistList);
  const trackPlaylistList = useUnit($trackPlaylistList);
  const onSelectCurrentTrackPlaylistList = useUnit(
    selectCurrentTrackPlaylistList,
  );

  const [isFolderSelected, setIsFolderSelected] = useState(false);

  const currentFolderTrackList = currentTrackPlaylistList.filter(
    (item) => item.folderId === folder.id,
  );

  const isSelectAllFolder = Boolean(
    selectAllState === CheckState.CHECKED ||
    (currentFolderTrackList.length &&
      folder.trackList.length &&
      currentFolderTrackList.length === folder.trackList.length),
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsFolderSelected(isSelectAllFolder);
  }, [isSelectAllFolder]);

  const handleToggle = useCallback(() => {
    if (!folder.trackList.length) return;
    onToggleFolder(folder.id);
  }, [folder.id, folder.trackList.length, onToggleFolder]);

  // TODO: Переделать под подходящий паттерн проектирование
  const handleSelectAudioChange = useCallback(
    (id: string) => {
      const isSelected = currentTrackPlaylistList.some(
        (item) => item.id === id,
      );
      const currentSelectedTrack = trackPlaylistList.find(
        (track) => track.id === id,
      );

      if (currentSelectedTrack) {
        if (isSelected) {
          const filteredCurrentTrackPlaylistList =
            currentTrackPlaylistList.filter((item) => item.id !== id);

          // INFO: Если выбрали некоторые треки и плейлисты
          if (filteredCurrentTrackPlaylistList.length) {
            onSelectCurrentTrackPlaylistList(CheckState.INDETERMINATE);
          }

          // INFO: Если треки и плейлисты пусты
          if (!filteredCurrentTrackPlaylistList.length) {
            onSelectCurrentTrackPlaylistList(CheckState.UNCHECKED);
          }

          updateCurrentTrackPlaylistList(filteredCurrentTrackPlaylistList);

          // TODO: Переделать логику в будущем
          if (
            currentTrackPlaylistList.filter((item) => item.id !== id).length ===
            0
          ) {
            setTimeProgress(0);
            setDuration(0);
          }
          return;
        }

        const newCurrentTrackPlaylistList = [
          ...currentTrackPlaylistList,
          currentSelectedTrack,
        ];

        // INFO: Если выбрали все треки и плейлисты
        if (newCurrentTrackPlaylistList.length === trackPlaylistList.length) {
          onSelectCurrentTrackPlaylistList(CheckState.CHECKED);
        }

        // INFO: Если выбрали некоторые треки и плейлисты
        if (
          newCurrentTrackPlaylistList.length &&
          newCurrentTrackPlaylistList.length !== trackPlaylistList.length
        ) {
          onSelectCurrentTrackPlaylistList(CheckState.INDETERMINATE);
        }

        updateCurrentTrackPlaylistList(newCurrentTrackPlaylistList);
      }
    },
    [
      currentTrackPlaylistList,
      onSelectCurrentTrackPlaylistList,
      setDuration,
      setTimeProgress,
      trackPlaylistList,
    ],
  );

  // TODO: Переделать под подходящий паттерн проектирование
  const handleStartAudioDblClick = useCallback(
    (id: string) => {
      const isSelected = currentTrackPlaylistList.some(
        (item) => item.id === id,
      );
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
            currentTrackPlaylistList.filter((item) => item.id !== id).length ===
            0
          ) {
            setTimeProgress(0);
            setDuration(0);
          }

          setIsPlaying(false);
          return;
        }

        updateCurrentTrackPlaylistList([
          ...currentTrackPlaylistList,
          currentSelectedTrack,
        ]);

        setIsPlaying(true);
      }
    },
    [
      currentTrackPlaylistList,
      setDuration,
      setIsPlaying,
      setTimeProgress,
      trackPlaylistList,
    ],
  );

  const handleSelectAllFolderClick = useCallback(
    (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      evt.stopPropagation();

      setIsFolderSelected((prevValue) => {
        if (prevValue) {
          const filteredCurrentTrackPlaylistList =
            currentTrackPlaylistList.filter(
              (item) => item.folderId !== folder.id,
            );

          // INFO: Если выбрали некоторые треки и плейлисты
          if (filteredCurrentTrackPlaylistList.length) {
            onSelectCurrentTrackPlaylistList(CheckState.INDETERMINATE);
          }

          // INFO: Если треки и плейлисты пусты
          if (!filteredCurrentTrackPlaylistList.length) {
            onSelectCurrentTrackPlaylistList(CheckState.UNCHECKED);
          }

          updateCurrentTrackPlaylistList([...filteredCurrentTrackPlaylistList]);
          // TODO: Переделать логику в будущем
          if (filteredCurrentTrackPlaylistList.length === 0) {
            setTimeProgress(0);
            setDuration(0);
          }
          return false;
        }

        const newCurrentTrackPlaylistList = [
          ...currentTrackPlaylistList.filter(
            (item) => item.folderId !== folder.id,
          ),
          ...trackPlaylistList.filter((item) => item.folderId === folder.id),
        ];

        // INFO: Если выбрали все треки и плейлисты
        if (newCurrentTrackPlaylistList.length === trackPlaylistList.length) {
          onSelectCurrentTrackPlaylistList(CheckState.CHECKED);
        }

        // INFO: Если выбрали некоторые треки и плейлисты
        if (
          newCurrentTrackPlaylistList.length &&
          newCurrentTrackPlaylistList.length !== trackPlaylistList.length
        ) {
          onSelectCurrentTrackPlaylistList(CheckState.INDETERMINATE);
        }

        updateCurrentTrackPlaylistList(newCurrentTrackPlaylistList);

        return true;
      });
    },
    [
      currentTrackPlaylistList,
      folder.id,
      onSelectCurrentTrackPlaylistList,
      setDuration,
      setTimeProgress,
      trackPlaylistList,
    ],
  );

  if (!folder.trackList.length && !folder.isGlobal) {
    return null;
  }

  return (
    <>
      <div
        key={folder.id}
        className={clsx(styles.playListFolderItem)}
        tabIndex={0}
        aria-expanded={isOpen}
        onKeyDown={(evt) => {
          if (evt.key === "Enter" || evt.key === " ") {
            handleToggle();
          }
        }}
        onClick={handleToggle}
      >
        <div className={styles.folderItemWrap}>
          <button
            className={clsx(styles.folderSelectedBtn, {
              [styles.folderSelectedBtnActive]: isFolderSelected,
              [styles.folderSelectedBtnDisabled]: !folder.trackList.length,
            })}
            disabled={!folder.trackList.length}
            onClick={handleSelectAllFolderClick}
          >
            <BsCheck2Square />
          </button>
          <FolderItem {...folder} />
        </div>
        <div
          className={clsx(styles.folderItemBtnGroup, {
            ["rotate-180"]: isOpen,
            [styles.folderItemBtnGroupDisabled]: !folder.trackList.length,
          })}
        >
          <BsChevronDown size="18px" />
        </div>
      </div>

      {isOpen && folder.trackList.length ? (
        <div>
          <ul
            className={clsx(styles.folderTrackList, {
              [styles.folderTrackListActive]: isOpen,
              ["pointer-events-none"]: !isOpen,
            })}
          >
            {folder.trackList.map((track) => (
              <TrackBlock
                key={track.id}
                track={track}
                containerClassName={styles.folderTrackBlock}
                currentTracks={currentTrackPlaylistList}
                onAudioTrackPlay={handleStartAudioDblClick}
                onAudioTrackSelect={handleSelectAudioChange}
              />
            ))}
          </ul>
        </div>
      ) : null}
    </>
  );
};

export const FolderTrackListMemo = React.memo(FolderTrackList);