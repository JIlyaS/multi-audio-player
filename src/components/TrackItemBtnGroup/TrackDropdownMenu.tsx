import type { FC, Ref } from "react";
import { Dropdown } from "react-bootstrap";
import { createPortal } from "react-dom"; 
import { DropdownMenu } from "@/components/DropdownMenu";

import { BsCopy } from "react-icons/bs";
import {
  generateCopyIncognitoUrl,
  generateCopyUrl,
} from "@/shared/helpers/generateCopyUrl";

import styles from "./TrackItemBtnGroup.module.css";

interface Props {
  trackId?: string | undefined;
  ref?: Ref<HTMLButtonElement | null>;
  onCopy: (text: string) => void;
}

export const TrackDropdownMenu: FC<Props> = ({ trackId = "", ref, onCopy }) => {
  return createPortal(
    <Dropdown.Menu
      id={trackId}
      as={DropdownMenu}
      show={false}
      rootCloseEvent="mousedown"
      className={styles.dropdownItemList}
    >
      <Dropdown.Item eventKey="copy" className={styles.dropdownItemWrap}>
        <button
          className={styles.dropdownItem}
          ref={ref}
          onClick={() => {
            onCopy(generateCopyUrl(trackId, "playlist"));
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
            onCopy(generateCopyIncognitoUrl(trackId, "playlist"));
          }}
        >
          <BsCopy /> <span>Копировать инкогнито</span>
        </button>
      </Dropdown.Item>
      {/* TODO: Блокировка скачивания треков */}
      {/* <Dropdown.Item
                eventKey="download"
                className={styles.dropdownItemWrap}
              >
                <button
                  className={styles.dropdownItem}
                  onClick={handleDownloadTrackClick}
                >
                  <BsDownload /> <span>Скачать</span>
                </button>
              </Dropdown.Item> */}
    </Dropdown.Menu>,
    document.body,
  );
};
