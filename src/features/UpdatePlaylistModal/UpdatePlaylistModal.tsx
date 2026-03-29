// INFO: Редактирование плейлиста
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import { CustomModal } from "@/components";
import { useEffect, useState, type FC } from "react";
import { Button, Form } from "react-bootstrap";
import { useUnit } from "effector-react";
import { $trackPlaylistList } from "@/models/shared";

import { viewCardPlaylist } from "@/models/view-playlist";
import { CheckboxListField, ConfirmModal, InputField, OverlayTooltip } from "@/shared/ui";
import { resetForm } from "@/models/playlist-form";
import {
  $isUpdatePlaylistSuccess,
  updateSubmitForm,
} from "@/models/update-playlist";
import {
  $isDeletePlaylistSuccess,
  deletePlaylist,
} from "@/models/delete-playlist";

import styles from "./UpdatePlaylistModal.module.css";

interface Props {
  trackId: string;
}

export const UpdatePlaylistModal: FC<Props> = ({ trackId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [isConfirmModal, setIsConfirmModal] = useState(false);

  const trackPlaylistList = useUnit($trackPlaylistList);
  const isSuccessUpdatePlaylist = useUnit($isUpdatePlaylistSuccess);
  const isSuccessDeletePlaylist = useUnit($isDeletePlaylistSuccess);
  const onViewCardPlaylist = useUnit(viewCardPlaylist);
  const onDeletePlaylist = useUnit(deletePlaylist);

  const onResetForm = useUnit(resetForm);

  const trackList = trackPlaylistList.filter((track) => track.type === "track");

  const onUpdateSubmitForm = useUnit(updateSubmitForm);

  // TODO: Переделать
  useEffect(() => {
    if (isSuccessUpdatePlaylist || isSuccessDeletePlaylist) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsOpen(false);
      onResetForm();
    }
  }, [isSuccessUpdatePlaylist, onResetForm, isSuccessDeletePlaylist]);

  useEffect(() => {
    if (isOpen) {
      onViewCardPlaylist(trackId);
    }
  }, [isOpen, onViewCardPlaylist, trackId]);

  const handleDeleteClick = () => {
    onDeletePlaylist(trackId);
    setIsOpen(false);
    onResetForm();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCloseClick = (evt: any) => {
    evt.stopPropagation();
    setIsOpen(false);
    onResetForm();
  };

  const handleCloseModalClick = () => {
    setIsOpen(false);
    onResetForm();
  };

  return (
    <>
      <OverlayTooltip id="update-tooltip" title="Редактировать плейлист">
        <button
          className={styles.updateButton}
          onClick={(evt) => {
            evt.stopPropagation();
            setIsOpen(true);
          }}
        >
          <BsPencilSquare size="18px" />
        </button>
      </OverlayTooltip>
      <CustomModal
        title="Редактировать плейлист"
        isOpen={isOpen}
        isForm
        onClose={handleCloseModalClick}
      >
        <Form
          className={styles.updatePlaylistModalForm}
          onSubmit={onUpdateSubmitForm}
        >
          <InputField
            id="formTitle"
            label="Название плейлиста"
            placeholder="Введите название"
            name="title"
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
            disabled={!isPublic}
            required={isPublic}
          />
          <CheckboxListField
            id="formTrackList"
            trackList={trackList}
            label="Список композиций"
            name="tracks"
          />
          <div className={styles.updatePlaylistModalBtnGroup}>
            <Button variant="secondary" onClick={handleCloseClick}>
              Закрыть
            </Button>
            <ConfirmModal
              title="Подтверждение удаления"
              description="Вы уверены что хотите удалить плейлист?"
              show={isConfirmModal}
              onConfirm={handleDeleteClick}
              onClose={() => setIsConfirmModal(false)}
            >
              <Button variant="danger" onClick={() => setIsConfirmModal(true)}>
                <BsTrash />
              </Button>
            </ConfirmModal>
            <Button variant="primary" type="submit">
              Сохранить
            </Button>
          </div>
        </Form>
      </CustomModal>
    </>
  );
};
