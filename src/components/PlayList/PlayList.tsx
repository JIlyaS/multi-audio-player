// INFO: Отобразить список доступных треков
import { useUnit } from "effector-react";
import clsx from "clsx";

import { useAudioPlayerContext } from "../../shared/contexts/AudioPlayerContext";
import { useEffect, useMemo, useRef } from "react";
import { TrackBlock } from "@/components";
import { $isTracksLoading, loadTracks } from "@/models/track";
import { $isPlaylistsLoading, loadPlaylists } from "@/models/playlist";
import {
  $currentTrackPlaylistList,
  $isSelectAll,
  $trackPlaylistForFolderList,
  $trackPlaylistList,
  selectCurrentTrackPlaylistList,
  updateCurrentTrackPlaylistList,
} from "@/models/shared";
import { Loader } from "@/shared/ui/Loader";
import { ToggleButton } from "react-bootstrap";

import { loadFolderList } from "@/models/folder";
import { FolderTrackList } from "@/components/FolderTrackList";
import { getFilteredTracks, getFilteredTracksForFolders } from "@/components/PlayList/utils";

import styles from "./PlayList.module.css";
import { useListVirtualizer } from "@/shared/hooks/useListVirtualizer";

export const PlayList = () => {
  // TODO: Переписать контекст под Effector или State формат
  const { searchValue } = useAudioPlayerContext();

  const parentRef = useRef<HTMLDivElement>(null);

  const trackPlaylistList = useUnit($trackPlaylistList);
  const currentTrackPlaylistList = useUnit($currentTrackPlaylistList);
  const trackPlaylistForFolderList = useUnit($trackPlaylistForFolderList);
  const isTracksLoading = useUnit($isTracksLoading);
  const isPlaylistsLoading = useUnit($isPlaylistsLoading);
  const isSelectAll = useUnit($isSelectAll);

  // TODO: Скорее всего не здесь должно быть
  const onLoadTracks = useUnit(loadTracks);
  const onLoadPlaylists = useUnit(loadPlaylists);
  // TODO: Временное решение - два запроса для разных страниц
  const onLoadFolderList = useUnit(loadFolderList);

  const onSelectCurrentTrackPlaylistList = useUnit(
    selectCurrentTrackPlaylistList,
  );

  const filteredTracks = useMemo(
    () => getFilteredTracks(trackPlaylistList, searchValue),
    [searchValue, trackPlaylistList],
  );

  const filteredTrackPlaylistForFolderList = useMemo(
    () => getFilteredTracksForFolders(trackPlaylistForFolderList, searchValue),
    [trackPlaylistForFolderList, searchValue],
  );

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
  const { setDuration } = useAudioPlayerContext();

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
  const handleSelectAllAudioChange = (evt: any) => {
    if (evt.currentTarget.checked) {
      onSelectCurrentTrackPlaylistList(true);
    } else {
      onSelectCurrentTrackPlaylistList(false);
    }
  };

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
        <ToggleButton
          id="toggle-check"
          type="checkbox"
          variant="secondary"
          className={clsx(styles.playListSelectAllBtn, {
            [styles.playListSelectAllBtnActive]: isSelectAll,
          })}
          size="sm"
          checked={isSelectAll}
          value="1"
          onChange={handleSelectAllAudioChange}
        >
          {isSelectAll ? "Снять выбранное" : "Выбрать все"}
        </ToggleButton>
      </div>
      <div className={styles.playListList} ref={parentRef}>
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
                <FolderTrackList key={folder.id} folder={folder} />
              </li>
            );
          })}
        </ul>
        <ul className={styles.playListListWrapper}>
          {filteredTracks.map((track) => (
            <TrackBlock
              key={track.id}
              track={track}
              currentTracks={currentTrackPlaylistList}
              onAudioChange={handleSelectAudioChange}
            />
          ))}
        </ul>
        {/* TODO: старое отображение списков без оптимизации - удалить после тестирования */}
        {/* {filteredTrackPlaylistForFolderList.map((folder) => (
            <FolderTrackList key={folder.id} folder={folder} />
          ))}
          {filteredTracks.map((track) => (
            <TrackBlock
              key={track.id}
              track={track}
              currentTracks={currentTrackPlaylistList}
              onAudioChange={handleSelectAudioChange}
            />
          ))} */}
      </div>
    </>
  );
};;
