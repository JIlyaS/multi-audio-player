// INFO: Добавление нового плейлиста
import { BsFolderPlus } from "react-icons/bs";
import { CustomModal } from "@/components";
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useUnit } from "effector-react";
import { $trackPlaylistList } from "@/models/shared";
import { $isCreatePlaylistSuccess, createSubmitForm } from "@/models/create-playlist";

import { CheckboxListField, InputField } from "@/shared/ui";
import { resetForm } from "@/models/playlist-form";

export const AddPlaylistModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const trackPlaylistList = useUnit($trackPlaylistList);
  const isSuccess = useUnit($isCreatePlaylistSuccess);
  const onResetForm  = useUnit(resetForm);
  const trackList = trackPlaylistList.filter((track) => track.type === "track");

  const onCreateSubmitForm = useUnit(createSubmitForm);

  // TODO: Переделать
  useEffect(() => {
    if (isSuccess) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsOpen(false);
      onResetForm();
    }
  }, [isSuccess, onResetForm]);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        <BsFolderPlus />
      </button>
      <CustomModal
        title="Создать плейлист"
        isOpen={isOpen}
        isForm
        onClose={() => {
          setIsOpen(false);
          onResetForm();
        }}
      >
        <Form onSubmit={onCreateSubmitForm}>
          <InputField
            id="formTitle"
            label="Название плейлиста"
            placeholder="Введите название"
            name="title"
            type="text"
          />
          <InputField
            id="formAuthor"
            label="Автор плейлиста"
            placeholder="Введите автора"
            name="author"
            type="text"
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
};
