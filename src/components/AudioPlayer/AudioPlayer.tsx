// INFO: Родительский/Корневой компонент
import { useEffect, useState } from "react";
import { RiMenuFold3Line, RiMenuFold4Line } from "react-icons/ri";
import { BsDatabaseAdd, BsChevronExpand, BsRepeat1 } from "react-icons/bs";
import { useUnit } from "effector-react";
import clsx from "clsx";

import { Controls, PlayList, ProgressBar, TrackInfo, VolumeControl } from "../";
import { SearchInput } from "../SearchInput";
import { AddPlaylistModal } from "@/features";
import { useAudioPlayerContext } from "@/shared/contexts/AudioPlayerContext";

import { $currentTrackPlaylistList, setUserId } from "@/models/shared";
import { createSimplePlaylist } from "@/models/create-playlist";
import { OverlayTooltip } from "@/shared/ui";
import { generateSafeUUID } from "@/shared/helpers/generateSafeUUID";
import { getFormatDate } from "@/shared/helpers/getFormatDate";
import logo from "@/shared/assets/logo.png";

import styles from "./AudioPlayer.module.css";

export const AudioPlayer = () => {
  const {
    isInfinityPlaying,
    setIsInfinityPlaying,
    searchValue,
    setSearchValue,
    isRepeatPlaying,
    setIsRepeatPlaying,
  } = useAudioPlayerContext();

  const currentTrackPlaylistList = useUnit($currentTrackPlaylistList);
  const onCreateSimplePlaylist = useUnit(createSimplePlaylist);

  const onSetUserId = useUnit(setUserId);

  const isDisabledCreateSimplePlaylist =
    currentTrackPlaylistList.some((item) => item.type === "playlist") ||
    currentTrackPlaylistList.length === 0;

  const isDisabledForEmptyTracks = currentTrackPlaylistList.length === 0;

  const [openDrawer, setOpenDrawer] = useState(true);

  // TODO: Костыль, подумать как сделать более лаконичное решение
  useEffect(() => {
    if (!localStorage.getItem("userId")) {
      onSetUserId(generateSafeUUID());
    }
  }, [onSetUserId]);

  const handleInfinityTrackPlayingClick = () => {
    setIsInfinityPlaying((prev) => prev ? false : true);
  }

  const handleRepeatTrackPlayingClick = () => {
    setIsRepeatPlaying((prev) => (prev ? false : true));
  }

  const handleSimplePlaylistCreateClick = () => {
    const currentTracks = currentTrackPlaylistList.filter((item) => item.type === "track");
    onCreateSimplePlaylist({
      // TODO: Надо придумать как генерировать title
      title: `Плейлист от ${getFormatDate()}`,
      author: "Неизвестно",
      isPublic: false,
      tracks: currentTracks,
    });
  }

  return (
    <div
      className={clsx(styles.audioPlayer, {
        [styles.audioPlayerVisible]: openDrawer,
      })}
    >
      <div
        className={clsx(styles.audioPlayerTopBlock, {
          [styles.audioPlayerTopBlockVisible]: openDrawer,
        })}
      >
        <div className={styles.audioPlayerLogo}>
          <img src={logo} width={40} height={40} alt="Логотип" />
        </div>
        <TrackInfo />
        <div className={styles.audioPlayerTopControlBlock}>
          <Controls />
          <ProgressBar />
        </div>
        <div className={styles.audioPlayerTopMenuBlock}>
          <VolumeControl />
          <div className={styles.audioPlayerTopBtnBlock}>
            <OverlayTooltip
              id="view-player"
              title={openDrawer ? "Скрыть список" : "Открыть список"}
            >
              <button onClick={() => setOpenDrawer((prev) => !prev)}>
                {openDrawer ? (
                  <RiMenuFold4Line
                    size="20px"
                    className={styles.audioPlayerTopBtnIcon}
                  />
                ) : (
                  <RiMenuFold3Line
                    size="20px"
                    className={styles.audioPlayerTopBtnIcon}
                  />
                )}
              </button>
            </OverlayTooltip>
            <AddPlaylistModal />
            <OverlayTooltip
              id="infinity-next-track"
              title="Проигрывание треков без остановки"
            >
              <button
                onClick={handleInfinityTrackPlayingClick}
                disabled={isDisabledForEmptyTracks || isRepeatPlaying}
              >
                <BsChevronExpand
                  size="20px"
                  className={clsx(styles.audioPlayerTopBtnIconActive, {
                    [styles.audioPlayerTopBtnInfinityIconActive]:
                      isInfinityPlaying,
                    [styles.audioPlayerTopBtnIconDisabled]:
                      isDisabledForEmptyTracks || isRepeatPlaying,
                  })}
                />
              </button>
            </OverlayTooltip>
            <OverlayTooltip
              id="repeat-current-track"
              title="Повтор текущего трека"
            >
              <button
                onClick={handleRepeatTrackPlayingClick}
                disabled={isDisabledForEmptyTracks || isInfinityPlaying}
              >
                <BsRepeat1
                  size="20px"
                  className={clsx(styles.audioPlayerTopBtnIconActive, {
                    [styles.audioPlayerTopBtnRepeatIconActive]: isRepeatPlaying,
                    [styles.audioPlayerTopBtnIconDisabled]:
                      isDisabledForEmptyTracks || isInfinityPlaying,
                  })}
                />
              </button>
            </OverlayTooltip>
            <OverlayTooltip
              id="simple-create-playlist"
              title="Быстрое создание плейлиста"
            >
              <button
                onClick={handleSimplePlaylistCreateClick}
                disabled={isDisabledCreateSimplePlaylist}
              >
                <BsDatabaseAdd
                  size="20px"
                  className={clsx(styles.audioPlayerTopBtnIconActive, {
                    [styles.audioPlayerTopBtnIconDisabled]:
                      isDisabledCreateSimplePlaylist,
                  })}
                />
              </button>
            </OverlayTooltip>
          </div>
        </div>
      </div>
      <div
        className={clsx(
          styles.audioPlayerContentBlock,
          openDrawer ? "opacity-100" : "opacity-0 invisible",
        )}
      >
        <div className={styles.audioPlayerSearchWrapper}>
          <SearchInput
            searchValue={searchValue}
            classNameElement={styles.audioPlayerSearchElement}
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
