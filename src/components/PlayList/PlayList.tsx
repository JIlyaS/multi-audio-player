// INFO: Отобразить список доступных треков
import { BsMusicNoteBeamed } from "react-icons/bs";
import Form from "react-bootstrap/Form";
import { useAudioPlayerContext } from "../../shared/contexts/AudioPlayerContext";
import type { Track } from "../../shared/types";

export const PlayList = () => {
  const { currentTrack, tracks, setIsPlaying, setCurrentTrack } =
    useAudioPlayerContext();

  const handleClick = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  return (
    <ul className="bg-[#4c4848] text-white max-h-72 overflow-y-auto">
      {tracks.map((track, index) => (
        <li
          key={index}
          className={`flex items-center gap-3 p-[0.5rem_10px] cursor-pointer ${
            currentTrack.title === track.title ? "bg-[#a66646]" : ""
          }`}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleClick(track);
            }
          }}
          onClick={() => handleClick(track)}
        >
          <Form.Check
            type="checkbox"
            id={String(index)}
            onClick={(evt) => evt.stopPropagation()}
            onChange={(evt) => evt.stopPropagation()}
          />
          <div className="w-16 h-16 flex items-center justify-center bg-gray-200 rounded-sm overflow-hidden">
            {track.thumbnail ? (
              <img
                className="w-full h-full object-cover"
                src={track.thumbnail}
                alt="audio avatar"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gray-300 rounded-md">
                <span className="text-xl text-gray-600">
                  <BsMusicNoteBeamed />
                </span>
              </div>
            )}
          </div>
          <div>
            <p className="font-bold text-sm">{track.title}</p>
            <p className="text-sm text-gray-400">{track.author}</p>
          </div>
        </li>
      ))}
    </ul>
  );
};
