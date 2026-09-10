import { PlayItem } from "@/components/PlayItem";
import { PlayItemBtnGroup } from "@/components/PlayItemBtnGroup";
import { TrackItemBtnGroup } from "@/components/TrackItemBtnGroup";
import type { FC } from "react";
import clsx from "clsx";

import styles from "./TrackBlock.module.css";
import { Form } from "react-bootstrap";
import type { Playlist, Track } from "@/shared/types";
import { getTrackName } from "@/shared/helpers/getTrackName";
import { transliterateToLatin } from "@/shared/helpers/transliterateToLatin";

interface Props {
  track: Track | Playlist;
  currentTracks: (Track | Playlist)[];
  containerClassName?: string;
  onAudioTrackPlay: (id: string) => void;
  onAudioTrackSelect: (id: string) => void;
}

export const TrackBlock: FC<Props> = ({
  track,
  currentTracks,
  containerClassName,
  onAudioTrackPlay,
  onAudioTrackSelect,
}) => {
  return (
    <li
      key={track.id}
      className={clsx(styles.playListItem, containerClassName)}
      tabIndex={0}
      onKeyDown={(evt) => {
        if (evt.key === "Enter" || evt.key === " ") {
          onAudioTrackSelect(track.id);
        }
      }}
      onClick={() => onAudioTrackSelect(track.id)}
      onDoubleClick={() => onAudioTrackPlay(track.id)}
    >
      <div className={styles.playListCheckboxWrap}>
        <Form.Check
          type="checkbox"
          id={track.id}
          className={styles.playListCheckbox}
          checked={currentTracks.some((item) => item.id === track.id)}
          onClick={(evt) => evt.stopPropagation()}
          onChange={() => onAudioTrackSelect(track.id)}
        />
        <PlayItem {...track} />
      </div>
      {/* TODO: Вернутся к разблокированию удаления для публичных плейлистов когда будет возможность удаления плейлистов либо тому кто создал, либо администратору */}
      {track.type === "playlist" && (
        <PlayItemBtnGroup
          playlistId={track.id}
          playlistName={transliterateToLatin(track.title) || "playlist"}
          isPublic={track.isPublic}
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
};
