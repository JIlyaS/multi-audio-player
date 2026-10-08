import { useRef, useState, type FC} from "react";

import styles from "./PlayItemBtnGroup.module.css";
import { OverlayTooltip, ToggleButton } from "@/shared/ui";
import { UpdatePlaylistModal } from "@/features";
import { Dropdown, Spinner } from "react-bootstrap";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useUnit } from "effector-react";
import { deletePlaylist } from "@/models/delete-playlist";

import { $currentDownloadPlaylistId, $isDownloadPlaylistLoading, downloadPlaylist } from "@/models/download-playlist";
import { $currentTrackPlaylistList } from "@/models/shared";
import { useAudioPlayerContext } from "@/shared/contexts/AudioPlayerContext";

import { PlaylistDropdownMenu } from './PlaylistDropdownMenu';

interface Props {
  playlistId: string;
  playlistName: string;
  isPublic: boolean;
}


export const PlayItemBtnGroup: FC<Props> = ({
  playlistId,
  playlistName,
  isPublic,
}) => {
  const [isConfirmModal, setIsConfirmModal] = useState(false);
  const [isCopy, setIsCopy] = useState(false);
  const [isCopyError, setIsCopyError] = useState(false);
  const tooltipTarget = useRef<HTMLButtonElement | null>(null);

  // TODO: Переписать контекст под Effector или State формат
  const { setTimeProgress, setDuration } = useAudioPlayerContext();

  const isDownloadPlaylistLoading = useUnit($isDownloadPlaylistLoading);
  const currentDownloadPlaylistId = useUnit($currentDownloadPlaylistId);
  const currentTrackPlaylistList = useUnit($currentTrackPlaylistList);
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
    // TODO: Переделать логику в будущем - очищать продолжительность трека только после успешного удаления
    if (
      currentTrackPlaylistList.filter((item) => item.id !== trackId).length ===
      0
    ) {
      setTimeProgress(0);
      setDuration(0);
    }
    return;
  };

  return (
    <div
      className={styles.playItemBtnWrap}
      onClick={(evt) => evt.stopPropagation()}
      onDoubleClick={(evt) => evt.stopPropagation()}
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
          <Dropdown
            placement="bottom-start"
            drop="down"
            style={{ marginTop: "4px" }}
          >
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

            <PlaylistDropdownMenu
              playlistId={playlistId}
              isPublic={isPublic}
              isConfirmModal={isConfirmModal}
              setIsConfirmModal={setIsConfirmModal}
              onCopy={copyTextToClipboard}
              onDownload={handlePlaylistDownloadClick}
              onDelete={handleDeleteClick}
            />
          </Dropdown>
        )}
      </div>
    </div>
  );
};