// INFO: Позволяет пользователю регулировать громкость звука
import { type ChangeEvent, useEffect, useState } from "react";
import { IoMdVolumeHigh, IoMdVolumeOff, IoMdVolumeLow } from "react-icons/io";
import { useAudioPlayerContext } from "../../shared/contexts/AudioPlayerContext";

export const VolumeControl = () => {
  const [volume, setVolume] = useState<number>(60);
  const [muteVolume, setMuteVolume] = useState(false);

  const { audioListRef } = useAudioPlayerContext();

  useEffect(() => {
    if (audioListRef.current.length) {
      audioListRef.current.forEach((audio) => {
        if (!audio) {
          return;
        }
        audio.volume = volume / 100;
        audio.muted = muteVolume;
      });
    }
  }, [volume, audioListRef, muteVolume]);

  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value));
  };

  return (
    <div>
      <div className="flex items-center gap-3">
        <button onClick={() => setMuteVolume((prev) => !prev)}>
          {muteVolume || volume < 5 ? (
            <IoMdVolumeOff size={25} />
          ) : volume < 40 ? (
            <IoMdVolumeLow size={25} />
          ) : (
            <IoMdVolumeHigh size={25} />
          )}
        </button>
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          style={{
            background: `linear-gradient(to right, #f50 ${volume}%, #ccc ${volume}%)`,
          }}
          className="volumn"
          onChange={handleVolumeChange}
        />
      </div>
    </div>
  );
};
