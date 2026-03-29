// INFO: Родительский/Корневой компонент

import { useEffect, useState } from "react";
import { RiMenuAddLine } from "react-icons/ri";
import { BsDatabaseAdd } from "react-icons/bs";

import { Controls, PlayList, ProgressBar, TrackInfo, VolumeControl } from "../";
import { SearchInput } from "../SearchInput";
import { AddPlaylistModal } from "@/features";
import { useAudioPlayerContext } from "@/shared/contexts/AudioPlayerContext";

import styles from "./AudioPlayer.module.css";
import { useUnit } from "effector-react";
import { $currentTrackPlaylistList, setUserId } from "@/models/shared";
import { createSimplePlaylist } from "@/models/create-playlist";
import { OverlayTooltip } from "@/shared/ui";
import { generateSafeUUID } from "@/shared/helpers/generateSafeUUID";
// import { getLocaleStringDate } from "@/shared/helpers/getLocaleStringDate";
import { getFormatDate } from "@/shared/helpers/getFormatDate";

export const AudioPlayer = () => {
  const { searchValue, setSearchValue } = useAudioPlayerContext();

  const currentTrackPlaylistList = useUnit($currentTrackPlaylistList);
  const onCreateSimplePlaylist = useUnit(createSimplePlaylist);

  const onSetUserId = useUnit(setUserId);

  const isDisabledCreateSimplePlaylist =
    currentTrackPlaylistList.some((item) => item.type === "playlist") ||
    currentTrackPlaylistList.length === 0;

  const [openDrawer, setOpenDrawer] = useState(true);

  // TODO: Костыль, подумать как сделать более лаконичное решение
  useEffect(() => {
    if (!localStorage.getItem("userId")) {
      onSetUserId(generateSafeUUID());
    }
  }, [onSetUserId]);

  const handleSimplePlaylistCreateClick = () => {
    const currentTracks = currentTrackPlaylistList.filter((item) => item.type === "track");
    onCreateSimplePlaylist({
      // TODO: Надо придумать как генерировать title
      // TODO: Нужен ли здесь автор?
      title: `Плейлист от ${getFormatDate()}`, // ${getLocaleStringDate()}
      // author: "Неизвестно",
      isPublic: false,
      tracks: currentTracks,
    });
  }

  return (
    <div>
      <div className={styles.audioPlayerTopBlock}>
        <TrackInfo />
        <div className={styles.audioPlayerTopControlBlock}>
          <Controls />
          <ProgressBar />
        </div>
        <div className={styles.audioPlayerTopMenuBlock}>
          <VolumeControl />
          <div className={styles.audioPlayerTopBtnBlock}>
            <OverlayTooltip id="view-player" title="Скрыть список">
              <button onClick={() => setOpenDrawer((prev) => !prev)}>
                <RiMenuAddLine size="20px" color="#FFFFFF" />
              </button>
            </OverlayTooltip>
            <AddPlaylistModal />
            <OverlayTooltip id="simple-create-playlist" title="Быстрое создание плейлиста">
              <button
                onClick={handleSimplePlaylistCreateClick}
                disabled={isDisabledCreateSimplePlaylist}
              >
                <BsDatabaseAdd
                  size="20px"
                  color={isDisabledCreateSimplePlaylist ? "#808080" : "#FFFFFF"}
                />
              </button>
            </OverlayTooltip>
          </div>
        </div>
      </div>
      {/* TODO: Переделать под обычные стили */}
      <div
        className={`transition-max-height duration-300 ease-in-out overflow-hidden ${
          openDrawer ? "max-h-none" : "max-h-0"
        }`}
      >
        <div className={styles.audioPlayerSearchWrapper}>
          <SearchInput
            searchValue={searchValue}
            onSearchValue={(value) => setSearchValue(value)}
          />
        </div>
        <div className={styles.audioPlayerPlaylistBlock}>
          <PlayList />
        </div>
      </div>
    </div>
  );
};
