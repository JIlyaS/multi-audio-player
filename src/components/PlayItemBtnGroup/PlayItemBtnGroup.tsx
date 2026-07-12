import { useRef, useState, type FC} from "react";

import styles from "./PlayItemBtnGroup.module.css";
import { ConfirmModal, OverlayTooltip, ToggleButton } from "@/shared/ui";
import { UpdatePlaylistModal } from "@/features";
import { Dropdown, Spinner } from "react-bootstrap";
import { BsTrash } from "react-icons/bs";
import { BsCopy } from "react-icons/bs";
import { BsDownload } from "react-icons/bs";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useUnit } from "effector-react";
import { deletePlaylist } from "@/models/delete-playlist";

import { generateCopyUrl } from "@/shared/helpers/generateCopyUrl";
import { DropdownMenu } from "@/components/DropdownMenu";
import { $currentDownloadPlaylistId, $isDownloadPlaylistLoading, downloadPlaylist } from "@/models/download-playlist";

interface Props {
  playlistId: string;
  playlistName: string;
}


export const PlayItemBtnGroup: FC<Props> = ({ playlistId, playlistName }) => {
  const [isConfirmModal, setIsConfirmModal] = useState(false);
  const [isCopy, setIsCopy] = useState(false);
  const [isCopyError, setIsCopyError] = useState(false);
  const tooltipTarget = useRef<HTMLButtonElement | null>(null);

  const isDownloadPlaylistLoading = useUnit($isDownloadPlaylistLoading);
  const currentDownloadPlaylistId = useUnit($currentDownloadPlaylistId);
  const onDeletePlaylist = useUnit(deletePlaylist);
  const onDownloadPlaylist = useUnit(downloadPlaylist);

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

  const handlePlaylistDownloadClick = () => {
    onDownloadPlaylist({ playlistId, playlistName });
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
      <UpdatePlaylistModal trackId={playlistId} />

      <div className={styles.dropdownWrap}>
        {isDownloadPlaylistLoading &&
        playlistId === currentDownloadPlaylistId ? (
          <Spinner
            animation="border"
            role="status"
            size="sm"
            variant="primary"
            className={styles.selectFieldLoading}
          >
            <span className="visually-hidden">Загрузка...</span>
          </Spinner>
        ) : (
          <Dropdown style={{ marginTop: "4px" }}>
            <Dropdown.Toggle as={ToggleButton}>
              <OverlayTooltip
                id="copy-tooltip"
                tooltipTarget={tooltipTarget}
                showValue={isCopy}
                title={
                  isCopy
                    ? "Скопировано"
                    : isCopyError
                      ? "Ошибка копирования"
                      : ""
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
              <Dropdown.Item
                eventKey="copy"
                className={styles.dropdownItemWrap}
              >
                <button
                  className={styles.dropdownItem}
                  ref={tooltipTarget}
                  onClick={() => {
                    copyTextToClipboard(
                      generateCopyUrl(playlistId, "playlist"),
                    );
                  }}
                >
                  <BsCopy /> <span>Копировать</span>
                </button>
              </Dropdown.Item>
              <Dropdown.Item
                eventKey="download"
                className={styles.dropdownItemWrap}
              >
                <button
                  className={styles.dropdownItem}
                  onClick={handlePlaylistDownloadClick}
                >
                  <BsDownload /> <span>Скачать</span>
                </button>
              </Dropdown.Item>
              <Dropdown.Item
                eventKey="delete"
                className={styles.dropdownItemWrap}
              >
                <ConfirmModal
                  title="Подтверждение удаления"
                  description="Вы уверены что хотите удалить плейлист?"
                  show={isConfirmModal}
                  onConfirm={() => handleDeleteClick(playlistId)}
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
        )}
      </div>
    </div>
  );
};