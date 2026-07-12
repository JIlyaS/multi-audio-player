import { useRef, useState, type FC } from "react";

import styles from "./TrackItemBtnGroup.module.css";
import { OverlayTooltip, ToggleButton } from "@/shared/ui";
import { BsCopy, BsThreeDotsVertical, BsDownload } from "react-icons/bs";
import { generateCopyUrl } from "@/shared/helpers/generateCopyUrl";
import { Dropdown, Spinner } from "react-bootstrap";
import { DropdownMenu } from "@/components/DropdownMenu";
import { $currentDownloadTrackId, $isDownloadTrackLoading, downloadTrack } from "@/models/download-track";
import { useUnit } from "effector-react";

interface Props {
  trackId: string;
  trackName: string;
}

export const TrackItemBtnGroup: FC<Props> = ({ trackId, trackName }) => {
  const onDownloadTrack = useUnit(downloadTrack);
  const isDownloadTrackLoading = useUnit($isDownloadTrackLoading);
  const currentDownloadTrackId = useUnit($currentDownloadTrackId);

  const [isCopy, setIsCopy] = useState(false);
  const [isCopyError, setIsCopyError] = useState(false);
  const tooltipTarget = useRef<HTMLButtonElement | null>(null);

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

  const handleDownloadTrackClick = () => {
    onDownloadTrack({trackId, trackName});
  };

  return (
    <div
      className={styles.trackItemBtnWrap}
      onClick={(evt) => evt.stopPropagation()}
    >
      <div className={styles.dropdownWrap}>
        {isDownloadTrackLoading && trackId === currentDownloadTrackId ? (
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
          <Dropdown>
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
                    copyTextToClipboard(generateCopyUrl(trackId, "playlist"));
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
                  onClick={handleDownloadTrackClick}
                >
                  <BsDownload /> <span>Скачать</span>
                </button>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}
      </div>
    </div>
  );
};
