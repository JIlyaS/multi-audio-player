// INFO: Отобразить список доступных треков
import Form from "react-bootstrap/Form";
import { useUnit } from "effector-react";

import { useAudioPlayerContext } from "../../shared/contexts/AudioPlayerContext";
import { useEffect, useMemo } from "react";
import { PlayItem } from "@/components";
import { UpdatePlaylistModal } from "@/features";
import {
  loadTracks,
} from "@/models/track";
import { loadPlaylists } from "@/models/playlist";
import {
  $currentTrackPlaylistList,
  $trackPlaylistList,
  updateCurrentTrackPlaylistList,
} from "@/models/shared";

export const PlayList = () => {
  const { searchValue, setDuration } = useAudioPlayerContext();

  const trackPlaylistList = useUnit($trackPlaylistList);
  const currentTrackPlaylistList = useUnit($currentTrackPlaylistList);
  // TODO: Скорее всего не здесь должно быть
  const onLoadTracks = useUnit(loadTracks);
  const onLoadPlaylists = useUnit(loadPlaylists);

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
            if (currentTrackPlaylistList.filter((item) => item.id !== id).length === 0) {
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

  if (!filteredTracks.length) {
    return <p className="h-[400px]">Ничего не найдено</p>;
  }

  return (
    <ul className="bg-[#4c4848] text-white h-[400px] overflow-y-auto bg-[#4c4848]">
      {filteredTracks.map((track, index) => (
        <li
          key={index}
          className={`flex items-center gap-3 p-[0.5rem_10px] cursor-pointer  justify-between 
          `}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleSelectAudioChange(track.id);
            }
          }}
          onClick={() => handleSelectAudioChange(track.id)}
        >
          <div className="flex items-center gap-3">
            <Form.Check
              type="checkbox"
              id={String(index)}
              checked={currentTrackPlaylistList.some(
                (item) => item.id === track.id,
              )}
              onClick={(evt) => evt.stopPropagation()}
              onChange={() => handleSelectAudioChange(track.id)}
            />
            <PlayItem {...track} />
          </div>
          {track.type === "playlist" && (
            <div>
              <UpdatePlaylistModal trackId={track.id} />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};
