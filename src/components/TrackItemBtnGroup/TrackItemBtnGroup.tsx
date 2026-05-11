import { useRef, useState, type FC } from "react";

import styles from "./TrackItemBtnGroup.module.css";
import { OverlayTooltip } from "@/shared/ui";
import { BsCopy } from "react-icons/bs";
import { generateCopyUrl } from "@/shared/helpers/generateCopyUrl";

interface Props {
  trackId: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const TrackItemBtnGroup: FC<Props> = ({ trackId }) => {
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


  return (
    <div
      className={styles.trackItemBtnWrap}
      onClick={(evt) => evt.stopPropagation()}
    >
      <OverlayTooltip
        id="copy-tooltip"
        tooltipTarget={tooltipTarget}
        showValue={isCopy}
        title={isCopy ? "Скопировано" : isCopyError ? "Ошибка копирования" : ""}
      >
        <button
          className={styles.copyButton}
          ref={tooltipTarget}
          onClick={() => {
            copyTextToClipboard(generateCopyUrl(trackId, 'track'));
          }}
        >
          <BsCopy />
        </button>
      </OverlayTooltip>
    </div>
  );
};
