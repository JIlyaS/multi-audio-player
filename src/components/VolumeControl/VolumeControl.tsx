// INFO: Позволяет пользователю регулировать громкость звука
import { type ChangeEvent, useEffect, useState } from "react";
import { IoMdVolumeHigh, IoMdVolumeOff, IoMdVolumeLow } from "react-icons/io";
import { useAudioPlayerContext } from "../../shared/contexts/AudioPlayerContext";

import styles from "./VolumeControl.module.css";

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

  const handleVolumeChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(evt.target.value));
  };

  return (
    <div className={styles.volumeControl}>
      <button onClick={() => setMuteVolume((prev) => !prev)}>
        {muteVolume || volume < 5 ? (
          <IoMdVolumeOff size={25} color="#FFFFFF" />
        ) : volume < 40 ? (
          <IoMdVolumeLow size={25} color="#FFFFFF" />
        ) : (
          <IoMdVolumeHigh size={25} color="#FFFFFF" />
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
  );
};
