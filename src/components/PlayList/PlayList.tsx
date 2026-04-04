// INFO: Отобразить список доступных треков
import Form from "react-bootstrap/Form";
import { useUnit } from "effector-react";

import { useAudioPlayerContext } from "../../shared/contexts/AudioPlayerContext";
import { useEffect, useMemo } from "react";
import { PlayItem } from "@/components";
import { $isTracksLoading, loadTracks } from "@/models/track";
import { $isPlaylistsLoading, loadPlaylists } from "@/models/playlist";
import {
  $currentTrackPlaylistList,
  $isSelectAll,
  $trackPlaylistList,
  selectCurrentTrackPlaylistList,
  updateCurrentTrackPlaylistList,
} from "@/models/shared";
import { Loader } from "@/shared/ui/Loader";
import { ToggleButton } from "react-bootstrap";

import styles from "./PlayList.module.css";
import { PlayItemBtnGroup } from "@/components/PlayItemBtnGroup";

export const PlayList = () => {
  const { searchValue, setDuration } = useAudioPlayerContext();

  const trackPlaylistList = useUnit($trackPlaylistList);
  const currentTrackPlaylistList = useUnit($currentTrackPlaylistList);
  const isTracksLoading = useUnit($isTracksLoading);
  const isPlaylistsLoading = useUnit($isPlaylistsLoading);
  const isSelectAll = useUnit($isSelectAll);

  // TODO: Скорее всего не здесь должно быть
  const onLoadTracks = useUnit(loadTracks);
  const onLoadPlaylists = useUnit(loadPlaylists);
  
  const onSelectCurrentTrackPlaylistList = useUnit(
    selectCurrentTrackPlaylistList,
  );

  const filteredTracks = useMemo(
    () =>
      trackPlaylistList.filter((track) =>
        track.title.toLowerCase().includes(searchValue.toLowerCase()),
      ),
    [searchValue, trackPlaylistList],
  );

  useEffect(() => {
    onLoadTracks();
    onLoadPlaylists();
  }, [onLoadPlaylists, onLoadTracks]);

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

  if (!filteredTracks.length) {
    return <p className={styles.playListEmpty}>Ничего не найдено</p>;
  }

  return (
    <>
      <div className={styles.playListBtnGroup}>
        <ToggleButton
          id="toggle-check"
          type="checkbox"
          variant="secondary"
          className="w-[140px]"
          size="sm"
          checked={isSelectAll}
          value="1"
          onChange={handleSelectAllAudioChange}
        >
          {isSelectAll ? "Снять выбранное" : "Выбрать все"}
        </ToggleButton>
      </div>
      <ul className={styles.playListList}>
        {filteredTracks.map((track) => (
          <li
            key={track.id}
            className={styles.playListItem}
            tabIndex={0}
            onKeyDown={(evt) => {
              if (evt.key === "Enter" || evt.key === " ") {
                handleSelectAudioChange(track.id);
              }
            }}
            onClick={() => handleSelectAudioChange(track.id)}
          >
            <div className={styles.playListCheckbox}>
              <Form.Check
                type="checkbox"
                id={track.id}
                checked={currentTrackPlaylistList.some(
                  (item) => item.id === track.id,
                )}
                onClick={(evt) => evt.stopPropagation()}
                onChange={() => handleSelectAudioChange(track.id)}
              />
              <PlayItem {...track} />
            </div>
            {track.type === "playlist" && (
              <PlayItemBtnGroup trackId={track.id} />
            )}
          </li>
        ))}
      </ul>
    </>
  );
};
