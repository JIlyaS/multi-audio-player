import { useRef, useState, type FC} from "react";

import styles from "./PlayItemBtnGroup.module.css";
import { ConfirmModal, OverlayTooltip } from "@/shared/ui";
import { UpdatePlaylistModal } from "@/features";
import Dropdown from "react-bootstrap/Dropdown";
import { BsTrash } from "react-icons/bs";
import { BsCopy } from "react-icons/bs";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useUnit } from "effector-react";
import { deletePlaylist } from "@/models/delete-playlist";

import { DropdownMenu, ToggleButton } from "./components"; 
import { generateCopyUrl } from "@/shared/helpers/generateCopyUrl";

interface Props {
    trackId: string;
}


export const PlayItemBtnGroup: FC<Props> = ({ trackId }) => {
    const [isConfirmModal, setIsConfirmModal] = useState(false);
    const [isCopy, setIsCopy] = useState(false);
    const [isCopyError, setIsCopyError] = useState(false);
    const tooltipTarget = useRef<HTMLButtonElement | null>(null);

    const onDeletePlaylist = useUnit(deletePlaylist);

    const copyTextToClipboard = async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setIsCopy(true);
        setIsCopyError(false);
        setTimeout(() => setIsCopy(false), 2000);
      } catch (err) {
        setIsCopy(false);
        setIsCopyError(true);
        console.error("Ошибка:", err);
      }
    };

  const handleDeleteClick = (trackId: string) => {
    onDeletePlaylist(trackId);
    // TODO: Закрывать модальное окно только после успешного удаления
    setIsConfirmModal(false);
  };

  return (
    <div
      className={styles.playItemBtnWrap}
      onClick={(evt) => evt.stopPropagation()}
    >
      <UpdatePlaylistModal trackId={trackId} />

      <Dropdown>
        <Dropdown.Toggle as={ToggleButton}>
          <OverlayTooltip
            id="copy-tooltip"
            tooltipTarget={tooltipTarget}
            showValue={isCopy}
            title={
              isCopy ? "Скопировано" : isCopyError ? "Ошибка копирования" : ""
            }
          >
            <BsThreeDotsVertical />
          </OverlayTooltip>
        </Dropdown.Toggle>

        <Dropdown.Menu
          as={DropdownMenu}
          show={false}
          className={styles.dropdownItemList}
        >
          <Dropdown.Item eventKey="copy" className={styles.dropdownItemWrap}>
            <button
              className={styles.dropdownItem}
              ref={tooltipTarget}
              onClick={() => {
                copyTextToClipboard(generateCopyUrl(trackId, "playlist"));
              }}
            >
              <BsCopy /> <span>Копировать</span>
            </button>
          </Dropdown.Item>
          <Dropdown.Item eventKey="delete" className={styles.dropdownItemWrap}>
            <ConfirmModal
              title="Подтверждение удаления"
              description="Вы уверены что хотите удалить плейлист?"
              show={isConfirmModal}
              onConfirm={() => handleDeleteClick(trackId)}
              onClose={() => setIsConfirmModal(false)}
            >
              <button
                className={styles.dropdownItem}
                onClick={(evt) => {
                  evt.stopPropagation();
                  setIsConfirmModal(true);
                }}
              >
                <BsTrash size="18px" /> <span>Удалить</span>
              </button>
            </ConfirmModal>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};