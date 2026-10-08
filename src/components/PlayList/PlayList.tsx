// INFO: Отобразить список доступных треков
import { useUnit } from "effector-react";
import clsx from "clsx";

import { useAudioPlayerContext } from "../../shared/contexts/AudioPlayerContext";
import { useEffect, useMemo, useRef, useState } from "react";
import { TrackBlock } from "@/components";
import { $isTracksLoading, loadTracks } from "@/models/track";
import { $isPlaylistsLoading, loadPlaylists } from "@/models/playlist";
import {
  $currentTrackPlaylistList,
  $selectAllState,
  $trackPlaylistForFolderList,
  $trackPlaylistList,
  selectCurrentTrackPlaylistList,
  updateCurrentTrackPlaylistList,
} from "@/models/shared";
import { Loader } from "@/shared/ui/Loader";
// import { ToggleButton } from "react-bootstrap";
import { BsViewList } from "react-icons/bs";

import { loadFolderList } from "@/models/folder";
import { FolderTrackList } from "@/components/FolderTrackList";
import { getFilteredTracks, getFilteredTracksForFolders } from "@/components/PlayList/utils";

import styles from "./PlayList.module.css";
import { useListVirtualizer } from "@/shared/hooks/useListVirtualizer";
import { useRouter } from "@tanstack/react-router";
import { MultipleCheckbox, OverlayTooltip } from "@/shared/ui";
import { CheckState } from "@/shared/consts";

export const PlayList = () => {
  // TODO: Переписать контекст под Effector или State формат
  const { searchValue, setIsPlaying } = useAudioPlayerContext();

  const parentRef = useRef<HTMLDivElement | null>(null);

  const trackPlaylistList = useUnit($trackPlaylistList);
  const currentTrackPlaylistList = useUnit($currentTrackPlaylistList);
  const trackPlaylistForFolderList = useUnit($trackPlaylistForFolderList);
  const isTracksLoading = useUnit($isTracksLoading);
  const isPlaylistsLoading = useUnit($isPlaylistsLoading);
  const selectAllState = useUnit($selectAllState);

  const router = useRouter();
  const playlistId = router?.latestLocation?.search?.playlistId;
  const trackId = router?.latestLocation?.search?.trackId;

  // TODO: Скорее всего не здесь должно быть
  const onLoadTracks = useUnit(loadTracks);
  const onLoadPlaylists = useUnit(loadPlaylists);
  // TODO: Временное решение - два запроса для разных страниц
  const onLoadFolderList = useUnit(loadFolderList);

  const onSelectCurrentTrackPlaylistList = useUnit(
    selectCurrentTrackPlaylistList,
  );

  const filteredTracks = useMemo(
    () =>
      getFilteredTracks(trackPlaylistList, {
        searchValue,
        playlistId,
        trackId,
      }),
    [playlistId, searchValue, trackId, trackPlaylistList],
  );

  const filteredTrackPlaylistForFolderList = useMemo(
    () =>
      getFilteredTracksForFolders(trackPlaylistForFolderList, {
        searchValue,
        playlistId,
        trackId,
      }),
    [trackPlaylistForFolderList, searchValue, playlistId, trackId],
  );

  const [isOpenFolders, setIsOpenFolders] = useState(() => {
    const storedOpenFolder = localStorage.getItem("storedOpenFolder") || null;
    const filteredTrackPlaylistForFolderListIds =
      filteredTrackPlaylistForFolderList.map((item) => item.id);

    const parsedOpenFolder: string[] = storedOpenFolder
      ? JSON.parse(storedOpenFolder)
      : [];

    return parsedOpenFolder.some((item) =>
      filteredTrackPlaylistForFolderListIds.includes(item),
    );
  });

  const { virtualizer, virtualItems } = useListVirtualizer({
    parentRef,
    list: filteredTrackPlaylistForFolderList,
  });

  useEffect(() => {
    onLoadTracks();
    onLoadPlaylists();
    onLoadFolderList({}); // { global: true }
  }, [onLoadPlaylists, onLoadTracks, onLoadFolderList]);

  // TODO: Переписать контекст под Effector или State формат
  const { setDuration, setTimeProgress } = useAudioPlayerContext();

  // TODO: Переделать под подходящий паттерн проектирование
  const handleStartAudioDblClick = (id: string) => {
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
  };

  // TODO: Переделать под подходящий паттерн проектирование
  const handleSelectAudioChange = (id: string) => {
    const isSelected = currentTrackPlaylistList.some((item) => item.id === id);
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
        if (filteredCurrentTrackPlaylistList.length === 0) {
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
  };

  const handleSelectAllAudioChange = (
    nextState: keyof typeof CheckState,
  ) => {
    onSelectCurrentTrackPlaylistList(nextState);

    if (nextState === CheckState.UNCHECKED) {
      updateCurrentTrackPlaylistList([]);
    }
  };

  const handleRollupFoldersClick = () => {
    localStorage.setItem("storedOpenFolder", JSON.stringify([]));
    setIsOpenFolders(false);
  }

  if (isTracksLoading || isPlaylistsLoading) {
    return (
      <div className={styles.playListLoad}>
        <Loader />
      </div>
    );
  }

  if (!filteredTracks.length && !filteredTrackPlaylistForFolderList.length) {
    return (
      <div className={styles.playListEmpty}>
        <p className={styles.playListEmptyContent}>Ничего не найдено</p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.playListBtnGroup}>
        <MultipleCheckbox
          state={selectAllState}
          className={styles.playListSelectAllCheck}
          onChange={handleSelectAllAudioChange}
        />
        <OverlayTooltip id="rollup-folders" title="Свернуть папки">
          <button
            className={styles.playListRollupFoldersBtn}
            onClick={handleRollupFoldersClick}
            disabled={!isOpenFolders}
          >
            <BsViewList
              size="20px"
              className={clsx(
                styles.playListRollupFoldersBtnIcon,
                styles.playListRollupFoldersBtnIconActive,
                {
                  [styles.playListRollupFoldersBtnIconDisabled]: !isOpenFolders,
                },
              )}
            />
          </button>
        </OverlayTooltip>
      </div>
      <div className={styles.playListList}>
        <div ref={parentRef}>
          <ul
            className={styles.playListListWrapper}
            style={{
              height: `${virtualizer.getTotalSize()}px`,
            }}
          >
            {virtualItems.map((virtualItem) => {
              const folder =
                filteredTrackPlaylistForFolderList[virtualItem.index];

              return (
                <li
                  key={virtualItem.key}
                  data-index={virtualItem.index}
                  ref={virtualizer.measureElement}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                >
                  <FolderTrackList
                    key={folder.id}
                    folder={folder}
                    isOpenFolders={isOpenFolders}
                    onOpenFolders={(value) => setIsOpenFolders(value)}
                  />
                </li>
              );
            })}
          </ul>
        </div>
        <div>
          <ul className={styles.playListListWrapper}>
            {filteredTracks.map((track) => (
              <TrackBlock
                key={track.id}
                track={track}
                currentTracks={currentTrackPlaylistList}
                onAudioTrackPlay={handleStartAudioDblClick}
                onAudioTrackSelect={handleSelectAudioChange}
              />
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};;
