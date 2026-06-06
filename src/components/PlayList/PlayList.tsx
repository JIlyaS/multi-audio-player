// INFO: Отобразить список доступных треков
import { useUnit } from "effector-react";
import clsx from "clsx";

import { useAudioPlayerContext } from "../../shared/contexts/AudioPlayerContext";
import { useEffect, useMemo } from "react";
import { TrackBlock } from "@/components";
import { $isTracksLoading, loadTracks } from "@/models/track";
import { $isPlaylistsLoading, loadPlaylists } from "@/models/playlist";
import {
  $currentTrackPlaylistList,
  $isSelectAll,
  $trackPlaylistForFolderList,
  $allTrackPlaylistList,
  selectCurrentTrackPlaylistList,
  updateCurrentTrackPlaylistList,
} from "@/models/shared";
import { Loader } from "@/shared/ui/Loader";
import { ToggleButton } from "react-bootstrap";

import { loadFolderList } from "@/models/folder";
import { FolderTrackList } from "@/components/FolderTrackList";
import { getFilteredTracks, getFilteredTracksForFolders } from "@/components/PlayList/utils";

import styles from "./PlayList.module.css";

export const PlayList = () => {
  // TODO: Переписать контекст под Effector или State формат
  const { searchValue } = useAudioPlayerContext();

  const allTrackPlaylistList = useUnit($allTrackPlaylistList);
  const currentTrackPlaylistList = useUnit($currentTrackPlaylistList);
  const trackPlaylistForFolderList = useUnit($trackPlaylistForFolderList);
  const isTracksLoading = useUnit($isTracksLoading);
  const isPlaylistsLoading = useUnit($isPlaylistsLoading);
  const isSelectAll = useUnit($isSelectAll);
  // const globalFolders = useUnit($globalFolders);

  // TODO: Скорее всего не здесь должно быть
  const onLoadTracks = useUnit(loadTracks);
  const onLoadPlaylists = useUnit(loadPlaylists);
  // TODO: Временное решение - два запроса для разных страниц
  const onLoadFolderList = useUnit(loadFolderList);

  const onSelectCurrentTrackPlaylistList = useUnit(
    selectCurrentTrackPlaylistList,
  );

  const filteredTracks = useMemo(
    () => getFilteredTracks(allTrackPlaylistList, searchValue),
    [searchValue, allTrackPlaylistList],
  );

  const filteredTrackPlaylistForFolderList = useMemo(
    () => getFilteredTracksForFolders(trackPlaylistForFolderList, searchValue),
    [trackPlaylistForFolderList, searchValue],
  );

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
    const currentSelectedTrack = allTrackPlaylistList.find(
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
      <ul className={styles.playListList}>
        {filteredTrackPlaylistForFolderList.map((folder) => (
          <FolderTrackList key={folder.id} folder={folder} />
        ))}
        {filteredTracks.map((track) => (
          <TrackBlock
            key={track.id}
            track={track}
            currentTracks={currentTrackPlaylistList}
            onAudioChange={handleSelectAudioChange}
          />
        ))}
      </ul>
    </>
  );
};;
