import type { FC, Ref } from "react";
import { Dropdown } from "react-bootstrap";
import { DropdownMenu } from "@/components/DropdownMenu";
import { createPortal } from "react-dom";

import { BsTrash } from "react-icons/bs";
import { BsCopy } from "react-icons/bs";
import { BsDownload } from "react-icons/bs";
import {
  generateCopyIncognitoUrl,
  generateCopyUrl,
} from "@/shared/helpers/generateCopyUrl";

import styles from "./PlayItemBtnGroup.module.css";
import { ConfirmModal } from "@/shared/ui";

interface Props {
  playlistId?: string | undefined;
  ref?: Ref<HTMLButtonElement | null>;
  isPublic: boolean;
  isConfirmModal: boolean;
  setIsConfirmModal: React.Dispatch<React.SetStateAction<boolean>>;
  onCopy: (text: string) => void;
  onDownload: () => void;
  onDelete: (trackId: string) => void;
}

export const PlaylistDropdownMenu: FC<Props> = ({
  playlistId = "",
  ref,
  isPublic,
  isConfirmModal,
  setIsConfirmModal,
  onCopy,
  onDownload,
  onDelete,
}) => {
  return createPortal(
    <Dropdown.Menu
      id={playlistId}
      as={DropdownMenu}
      show={false}
      rootCloseEvent="mousedown"
      className={styles.dropdownItemList}
      popperConfig={
        {
          strategy: "fixed",
          modifiers: [
            {
              name: "flip",
              enabled: false,
            },
            {
              name: "preventOverflow",
              options: { boundary: "viewport" },
            },
          ],
        }
      }
    >
      <Dropdown.Item eventKey="copy" className={styles.dropdownItemWrap}>
        <button
          className={styles.dropdownItem}
          ref={ref}
          onClick={() => {
            onCopy(generateCopyUrl(playlistId, "playlist"));
          }}
        >
          <BsCopy /> <span>Копировать</span>
        </button>
      </Dropdown.Item>
      <Dropdown.Item
        eventKey="copy-incognito"
        className={styles.dropdownItemWrap}
      >
        <button
          className={styles.dropdownItem}
          ref={ref}
          onClick={() => {
            onCopy(generateCopyIncognitoUrl(playlistId, "playlist"));
          }}
        >
          <BsCopy /> <span>Копировать инкогнито</span>
        </button>
      </Dropdown.Item>
      <Dropdown.Item eventKey="download" className={styles.dropdownItemWrap}>
        <button className={styles.dropdownItem} onClick={onDownload}>
          <BsDownload /> <span>Скачать</span>
        </button>
      </Dropdown.Item>
      {!isPublic && (
        <Dropdown.Item
          eventKey="delete"
          className={styles.dropdownItemWrap}
          disabled={isPublic}
        >
          <ConfirmModal
            title="Подтверждение удаления"
            description="Вы уверены что хотите удалить плейлист?"
            show={isConfirmModal}
            onConfirm={() => onDelete(playlistId)}
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
      )}
    </Dropdown.Menu>,
    document.body,
  );
};
