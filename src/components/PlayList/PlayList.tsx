// INFO: Отобразить список доступных треков
import Form from "react-bootstrap/Form";
import { useAudioPlayerContext } from "../../shared/contexts/AudioPlayerContext";
import { useMemo } from "react";
import { PlayItem } from "@/components";
import { UpdatePlaylistModal } from "@/features";

export const PlayList = () => {
  const { currentTrack, currentTracks, tracks, searchValue, setCurrentTracks } =
    useAudioPlayerContext();

  const filteredTracks = useMemo(
    () =>
      tracks.filter((track) =>
        track.title.toLowerCase().includes(searchValue.toLowerCase())
      ),
    [searchValue, tracks]
  );

  // useEffect(() => {
  //   if (searchValue) {
  //     onTracks((tracks) =>
  //       tracks.filter((track) => track.title.includes(searchValue))
  //     );
  //   } else {
  //     onTracks((tracks) =>
  //       tracks.filter((track) => track.title.includes(searchValue))
  //     );
  //   }
  // }, [searchValue]);

  // const handleClick = (track: Track | Playlist) => {
  //   setCurrentTrack(track);
  //   setIsPlaying(true);
  // };

  // TODO: Переделать под подходящий паттерн проектирование
  const handleSelectAudioChange = (id: string) => {
    const isSelected = currentTracks.some((item) => item.id === id);
    const currentSelectedTrack = tracks.find((track) => track.id === id);

    if (currentSelectedTrack) {
      if (isSelected) {
        setCurrentTracks((prevValue) =>
          prevValue.filter((item) => item.id !== id)
        );
        return;
      }

      setCurrentTracks((prevValue) => [...prevValue, currentSelectedTrack]);
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
          className={`flex items-center gap-3 p-[0.5rem_10px] cursor-pointer  justify-between ${
            currentTrack.title === track.title ? "bg-[#a66646]" : ""
          }`}
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
              checked={currentTracks.some((item) => item.id === track.id)}
              onClick={(evt) => evt.stopPropagation()}
              onChange={() => handleSelectAudioChange(track.id)}
            />
            <PlayItem {...track} />
          </div>
          {track.type === "playlist" && (
            <div>
              <UpdatePlaylistModal />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};
