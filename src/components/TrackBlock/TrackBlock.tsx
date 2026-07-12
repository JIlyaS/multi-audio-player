import { PlayItem } from "@/components/PlayItem";
import { PlayItemBtnGroup } from "@/components/PlayItemBtnGroup";
import { TrackItemBtnGroup } from "@/components/TrackItemBtnGroup";
import type { FC } from "react";
import clsx from "clsx";

import styles from "./TrackBlock.module.css";
import { Form } from "react-bootstrap";
import type { Playlist, Track } from "@/shared/types";
import { getTrackName } from "@/shared/helpers/getTrackName";

interface Props {
  track: Track | Playlist;
  currentTracks: (Track | Playlist)[];
  containerClassName?: string;
  onAudioChange: (id: string) => void;
}

export const TrackBlock: FC<Props> = ({
  track,
  currentTracks,
  containerClassName,
  onAudioChange,
}) => {
  return (
    <li
      key={track.id}
      className={clsx(styles.playListItem, containerClassName)}
      tabIndex={0}
      onKeyDown={(evt) => {
        if (evt.key === "Enter" || evt.key === " ") {
          onAudioChange(track.id);
        }
      }}
      onClick={() => onAudioChange(track.id)}
    >
      <div className={styles.playListCheckboxWrap}>
        <Form.Check
          type="checkbox"
          id={track.id}
          className={styles.playListCheckbox}
          checked={currentTracks.some((item) => item.id === track.id)}
          onClick={(evt) => evt.stopPropagation()}
          onChange={() => onAudioChange(track.id)}
        />
        <PlayItem {...track} />
      </div>

      {track.type === "playlist" && (
        <PlayItemBtnGroup
          playlistId={track.id}
          playlistName="playlist"
        />
      )}
      {track.type === "track" && (
        <TrackItemBtnGroup
          trackId={track.id}
          trackName={getTrackName(track.link)}
        />
      )}
    </li>
  );
};;

