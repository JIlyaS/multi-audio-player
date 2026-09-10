import { PlayItem } from "@/components";
import { Form } from "react-bootstrap";

import styles from "./CheckboxListField.module.css";
import type { Track } from "@/shared/types";
import { useMemo, useRef, type FC } from "react";
import { $form } from "@/models/create-playlist";
import { useStoreMap, useUnit } from "effector-react";
import {
  $searchValue,
  changeSearchValue,
  handleCheckboxListChange,
  type IForm,
} from "@/models/playlist-form";
import { SearchInput } from "@/components/SearchInput";
import { $currentPlaylist } from "@/models/view-playlist";
import { $currentTracksForForm } from "@/models/shared";
import { useListVirtualizer } from "@/shared/hooks/useListVirtualizer";

interface Props {
  id?: string;
  trackList: Track[];
  label: string;
  name: "tracks";
  isEdit?: boolean;
}

// TODO: Перезаписать компонент для выборки списка
export const CheckboxListField: FC<Props> = ({ trackList, label, name, isEdit }) => {
  const searchValue = useUnit($searchValue);
  const onChangeSearchValue = useUnit(changeSearchValue);

  const currentPlaylist = useUnit($currentPlaylist);
  const currentTracksForForm = useUnit($currentTracksForForm);
  const currentTracksForFormIds = currentTracksForForm.map((item) => item.id);

  const parentRef = useRef<HTMLDivElement>(null);

  const trackFormList = useStoreMap({
    store: $form,
    keys: [name],
    fn: (values: IForm) =>
      values[name] && name === "tracks" ? values[name] : [],
  });

  // TODO: Для редактирования
  const currentPlaylistTrackIds = (currentPlaylist?.tracks || []).map((item) => item.id);

  const sortedTrackList = useMemo(() => {
    if (isEdit) {
      return [
        ...trackList.filter((item) =>
          currentPlaylistTrackIds.includes(item.id),
        ),
        ...trackList.filter(
          (item) => !currentPlaylistTrackIds.includes(item.id),
        ),
      ];
    } else {
      return [
        ...trackList.filter((item) =>
          currentTracksForFormIds.includes(item.id),
        ),
        ...trackList.filter(
          (item) => !currentTracksForFormIds.includes(item.id),
        ),
      ];
    }
  }, [trackList, currentPlaylistTrackIds, currentTracksForFormIds, isEdit]);


  // TODO: Подумать как переделать в будущем
  const filteredTrackList = useMemo(
    () =>
      sortedTrackList
        .filter((item) => item.type === "track")
        .filter(
          (track) =>
            track.title.toLowerCase().includes(searchValue.toLowerCase()) ||
            track.tags.some((tag) =>
              tag.toLowerCase().includes(searchValue.toLowerCase()),
            ),
        ),
    [searchValue, sortedTrackList],
  );

  const { virtualizer, virtualItems } = useListVirtualizer({
    parentRef,
    list: filteredTrackList,
    overscan: 10
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
    <Form.Group className={styles.checkboxListField}>
      <Form.Label htmlFor="checkbox-list">{label}</Form.Label>
      <SearchInput
        searchValue={searchValue}
        onSearchValue={(value) => onChangeSearchValue(value)}
        className="mb-2"
        classNameElement={styles.checkboxListSearch}
      />
      {!filteredTrackList.length && (
        <div className={styles.trackListEmpty}>
          <p>Ничего не найдено</p>
        </div>
      )}
      {Boolean(filteredTrackList.length) && (
        <div
          className={styles.trackPlaylistList}
          ref={parentRef}
          id="checkbox-list"
        >
          <ul
            className={styles.trackPlaylistListWrapper}
            style={{
              height: `${virtualizer.getTotalSize()}px`,
            }}
          >
            {virtualItems.map((virtualItem) => {
              const track = filteredTrackList[virtualItem.index];
              const isChecked = trackFormList.some(
                (item: Track) => item.id === track.id,
              );

              return (
                <li
                  key={virtualItem.key}
                  data-index={virtualItem.index}
                  className={styles.trackPlaylistListItem}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                  ref={virtualizer.measureElement}
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
                    className={styles.trackPlaylistListCheck}
                    checked={isChecked}
                    disabled={!isChecked && trackFormList.length > 50}
                    onClick={(evt) => evt.stopPropagation()}
                    onChange={() => handleSelectAudioChange(track.id)}
                  />
                  <PlayItem {...track} />
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </Form.Group>
  );
};
