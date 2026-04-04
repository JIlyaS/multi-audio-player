import { useState, type FC } from "react";

import styles from "./PlayItemBtnGroup.module.css";
import { ConfirmModal, OverlayTooltip } from "@/shared/ui";
import { UpdatePlaylistModal } from "@/features";
import { BsTrash } from "react-icons/bs";
import { useUnit } from "effector-react";
import { deletePlaylist } from "@/models/delete-playlist";

interface Props {
    trackId: string;
}

export const PlayItemBtnGroup: FC<Props> = ({ trackId }) => {
    const [isConfirmModal, setIsConfirmModal] = useState(false);

    const onDeletePlaylist = useUnit(deletePlaylist);

  const handleDeleteClick = (trackId: string) => {
    onDeletePlaylist(trackId);
    // TODO: Закрывать модальное окно только после успешного удаления
    setIsConfirmModal(false);
  };

  return (
    <div
      className={styles.playListUpdateBtnWrap}
      onClick={(evt) => evt.stopPropagation()}
    >
      <UpdatePlaylistModal trackId={trackId} />
      <ConfirmModal
        title="Подтверждение удаления"
        description="Вы уверены что хотите удалить плейлист?"
        show={isConfirmModal}
        onConfirm={() => handleDeleteClick(trackId)}
        onClose={() => setIsConfirmModal(false)}
      >
        <OverlayTooltip id="delete-tooltip" title="Удалить плейлист">
          <button
            className={styles.deleteButton}
            onClick={(evt) => {
              evt.stopPropagation();
              setIsConfirmModal(true);
            }}
          >
            <BsTrash size="18px" />
          </button>
        </OverlayTooltip>
      </ConfirmModal>
    </div>
  );
};