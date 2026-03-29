import { PlayItem } from "@/components";
import { Form } from "react-bootstrap";

import styles from "./CheckboxListField.module.css";
import type { Track } from "@/shared/types";
import { useMemo, type FC } from "react";
import { $form, handleCheckboxListChange } from "@/models/create-playlist";
import { useStoreMap, useUnit } from "effector-react";
import {
  $searchValue,
  changeSearchValue,
  type IForm,
} from "@/models/playlist-form";
import { SearchInput } from "@/components/SearchInput";

interface Props {
  id: string;
  trackList: Track[];
  label: string;
  name: "tracks";
}

export const CheckboxListField: FC<Props> = ({
  id,
  trackList,
  label,
  name,
}) => {
  const searchValue = useUnit($searchValue);
  const onChangeSearchValue = useUnit(changeSearchValue);

  const trackFormList = useStoreMap({
    store: $form,
    keys: [name],
    fn: (values: IForm) =>
      values[name] && name === "tracks" ? values[name] : [],
  });

  // TODO: Подумать как переделать в будущем
  const filteredTrackList = useMemo(
    () =>
      trackList
        .filter((item) => item.type === "track")
        .filter((track) =>
          track.title.toLowerCase().includes(searchValue.toLowerCase()),
        ),
    [searchValue, trackList],
  );

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

  console.log("trackList", trackList);

  return (
    <Form.Group className="mb-3 px-[16px] h-full" controlId={id}>
      <Form.Label for="checkbox-list">{label}</Form.Label>
      <SearchInput
        searchValue={searchValue}
        onSearchValue={(value) => onChangeSearchValue(value)}
        className="mb-2"
      />
      {!filteredTrackList.length && (
        <p className={styles.trackListEmpty}>Ничего не найдено</p>
      )}
      {Boolean(filteredTrackList.length) && (
        <ul className={styles.trackPlaylistList} id="checkbox-list">
          {filteredTrackList.map((track) => (
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
                checked={trackFormList.some(
                  (item: Track) => item.id === track.id,
                )}
                onClick={(evt) => evt.stopPropagation()}
                onChange={() => handleSelectAudioChange(track.id)}
              />
              <PlayItem {...track} />
            </li>
          ))}
        </ul>
      )}
    </Form.Group>
  );
};
