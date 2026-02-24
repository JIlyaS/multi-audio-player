/* eslint-disable @typescript-eslint/no-unused-vars */
// INFO: Редактирование плейлиста
import { BsPencilSquare } from "react-icons/bs";
import { CustomModal } from "@/components";
import { useEffect, useState, type FC } from "react";
import { Button, Form } from "react-bootstrap";
import { useUnit } from "effector-react";
import { $trackPlaylistList } from "@/models/shared";

import { viewCardPlaylist } from "@/models/view-playlist"; 
import { CheckboxListField, InputField } from "@/shared/ui";
import { resetForm } from "@/models/playlist-form";
import { $isUpdatePlaylistSuccess, updateSubmitForm } from "@/models/update-playlist";

interface Props {
  trackId: string;
}

export const UpdatePlaylistModal: FC<Props> = ({ trackId }) => {
  const [isOpen, setIsOpen] = useState(false);

  const trackPlaylistList = useUnit($trackPlaylistList);
  const isSuccess = useUnit($isUpdatePlaylistSuccess);
  const onViewCardPlaylist = useUnit(viewCardPlaylist);

  const onResetForm = useUnit(resetForm);

  const trackList = trackPlaylistList.filter((track) => track.type === "track");

  const onUpdateSubmitForm = useUnit(updateSubmitForm);

  console.log('isSuccess', isSuccess);

  // TODO: Переделать
  useEffect(() => {
    if (isSuccess) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsOpen(false);
      onResetForm();
    }
  }, [isSuccess, onResetForm]);

  useEffect(() => {
    if (isOpen) {
      onViewCardPlaylist(trackId);
    }
  }, [isOpen, onViewCardPlaylist, trackId]);

  return (
    <>
      <button
        onClick={(evt) => {
          evt.stopPropagation();
          setIsOpen(true);
        }}
      >
        <BsPencilSquare />
      </button>
      <CustomModal
        title="Редактировать плейлист"
        isOpen={isOpen}
        isForm
        onClose={() => {
          setIsOpen(false);
          onResetForm();
        }}
      >
        <Form onSubmit={onUpdateSubmitForm}>
          <InputField
            id="formTitle"
            label="Название плейлиста"
            placeholder="Введите название"
            name="title"
          />
          <InputField
            id="formAuthor"
            label="Автор плейлиста"
            placeholder="Введите автора"
            name="author"
          />
          <CheckboxListField
            id="formTrackList"
            trackList={trackList}
            label="Список композиций"
            name="tracks"
          />
          <div className="flex w-full justify-end gap-[8px] border-t-1 margin-x-[-10px] p-[12px]">
            <Button
              variant="secondary"
              onClick={() => {
                setIsOpen(false);
                onResetForm();
              }}
            >
              Закрыть
            </Button>
            <Button variant="primary" type="submit">
              Сохранить
            </Button>
          </div>
        </Form>
      </CustomModal>
    </>
  );
};;
