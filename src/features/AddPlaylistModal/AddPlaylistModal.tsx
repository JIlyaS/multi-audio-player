// INFO: Добавление нового плейлиста
import { BsFolderPlus } from "react-icons/bs";
import { CustomModal } from "@/components";
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useUnit } from "effector-react";
import {
  $isCreatePlaylistSuccess,
  createSubmitForm,
  openCreateModalClick,
} from "@/models/create-playlist";

import { CheckboxListField, InputField, OverlayTooltip } from "@/shared/ui";
import { resetForm } from "@/models/playlist-form";
import { $tracks } from "@/models/track";

import styles from "./AddPlaylistModal.module.css";

export const AddPlaylistModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPublic, setIsPublic] = useState(false);

  const trackList = useUnit($tracks);
  const isSuccess = useUnit($isCreatePlaylistSuccess);
  const onResetForm = useUnit(resetForm);

  const onOpenCreateModalClick = useUnit(openCreateModalClick);
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
      <OverlayTooltip id="create-tooltip" title="Создать плейлист">
        <button
          onClick={() => {
            setIsOpen(true);
            onOpenCreateModalClick();
          }}
        >
          <BsFolderPlus size="20px" color="#ffffff" />
        </button>
      </OverlayTooltip>
      <CustomModal
        title="Создать плейлист"
        isOpen={isOpen}
        isForm
        onClose={() => {
          setIsOpen(false);
          onResetForm();
        }}
      >
        <Form
          onSubmit={onCreateSubmitForm}
          className={styles.addPlaylistModalForm}
        >
          <InputField
            id="formTitle"
            label="Название плейлиста"
            placeholder="Введите название"
            name="title"
            type="text"
            required
          />
          <div className={styles.checkboxWrapper}>
            <Form.Check
              type="checkbox"
              id="formPublic"
              checked={isPublic}
              onChange={() => setIsPublic((prev) => !prev)}
              label="Сделать общедоступным"
            />
          </div>
          <InputField
            id="formAuthor"
            label="Автор плейлиста"
            placeholder={
              isPublic
                ? "Введите автора"
                : "Для ввода значения сделайте плейлист общедоступным"
            }
            name="author"
            type="text"
            disabled={!isPublic}
            required={isPublic}
          />
          <CheckboxListField
            id="formTrackList"
            trackList={trackList}
            label="Список композиций"
            name="tracks"
          />
          <div className={styles.addPlaylistModalBtnGroup}>
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
