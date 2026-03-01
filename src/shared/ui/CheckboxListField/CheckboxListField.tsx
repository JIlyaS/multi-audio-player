import { PlayItem } from "@/components";
import { Form } from "react-bootstrap";

import styles from "./CheckboxListField.module.css";
import type { Track } from "@/shared/types";
import { type FC } from "react";
import { $form, handleCheckboxListChange } from "@/models/create-playlist";
import { useStoreMap } from "effector-react";
import type { IForm } from "@/models/playlist-form";

interface Props {
  id: string;
  trackList: Track[];
  label: string;
  name: 'tracks';
}

export const CheckboxListField: FC<Props> = ({ id, trackList, label, name }) => {

  const trackFormList = useStoreMap({
    store: $form,
    keys: [name],
    fn: (values: IForm) =>
      values[name] && name === "tracks" ? values[name] : [],
  });

  const handleSelectAudioChange = (id: string) => {
    const isSelected = trackFormList.some((item: Track) => item.id === id);
    const currentSelectedTrack = trackList.find((track) => track.id === id);

    if (currentSelectedTrack) {
      if (isSelected) {
        handleCheckboxListChange({
          name,
          value: trackFormList.filter((item: Track) => item.id !== id),
        });
        return;
      }
    handleCheckboxListChange({
      name,
      value: [...trackFormList, currentSelectedTrack],
    });
    }
  };

  return (
    <Form.Group className="mb-3 px-[16px]" controlId={id}>
      <Form.Label>{label}</Form.Label>
      <ul className={styles.trackPlaylistList}>
        {trackList.map((track) => (
          <li
            key={track.id}
            className={`flex items-center gap-3 p-[0.5rem_10px] cursor-pointer`}
            tabIndex={0}
            onKeyDown={(evt) => {
              if (evt.key === "Enter" || evt.key === " ") {
                handleSelectAudioChange(track.id);
              }
            }}
            onClick={() => handleSelectAudioChange(track.id)}
          >
            <Form.Check
              type="checkbox"
              id={String(track.id)}
              checked={trackFormList.some((item: Track) => item.id === track.id)}
              onClick={(evt) => evt.stopPropagation()}
              onChange={() => handleSelectAudioChange(track.id)}
            />
            <PlayItem {...track} />
          </li>
        ))}
      </ul>
    </Form.Group>
  );
};
