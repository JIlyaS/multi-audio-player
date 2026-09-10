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

import styles from "./AudioPlayer.module.css";
import { getLogoPathName } from "@/shared/helpers/getLogoPathName";

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

  const [openDrawer, setOpenDrawer] = useState(() => {
    if (localStorage.getItem("storedOpenPlayer") === null) {
      return true;
    }
    
    return localStorage.getItem("storedOpenPlayer") === "true" ? true : false;
  });

  // TODO: Костыль, подумать как сделать более лаконичное решение
  useEffect(() => {
    if (!localStorage.getItem("userId")) {
      onSetUserId(generateSafeUUID());
    }
  }, [onSetUserId]);

  const handleInfinityTrackPlayingClick = () => {
    setIsInfinityPlaying((prev) => (prev ? false : true));
  };

  const handleRepeatTrackPlayingClick = () => {
    setIsRepeatPlaying((prev) => (prev ? false : true));
  };

  const handleSimplePlaylistCreateClick = () => {
    const currentTracks = currentTrackPlaylistList.filter(
      (item) => item.type === "track",
    );
    onCreateSimplePlaylist({
      // TODO: Надо придумать как генерировать title
      title: `Плейлист от ${getFormatDate()}`,
      author: "Неизвестно",
      isPublic: false,
      tracks: currentTracks,
    });
  };

  const handleOpenDrawerClick = () => {
    setOpenDrawer((prev) => {
      localStorage.setItem("storedOpenPlayer", String(!prev));

      return !prev;
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
          <img width={40} height={40} alt="Логотип" src={getLogoPathName()} />
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
              <button
                className={styles.audioTopBtn}
                onClick={handleOpenDrawerClick}
              >
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
                className={styles.audioTopBtn}
                onClick={handleInfinityTrackPlayingClick}
                disabled={isDisabledForEmptyTracks || isRepeatPlaying}
              >
                <BsChevronExpand
                  size="20px"
                  className={clsx(
                    styles.audioPlayerTopBtnIcon,
                    styles.audioPlayerTopBtnIconActive,
                    {
                      [styles.audioPlayerTopBtnInfinityIconActive]:
                        isInfinityPlaying,
                      [styles.audioPlayerTopBtnIconDisabled]:
                        isDisabledForEmptyTracks || isRepeatPlaying,
                    },
                  )}
                />
              </button>
            </OverlayTooltip>
            <OverlayTooltip
              id="repeat-current-track"
              title="Повтор текущего трека"
            >
              <button
                className={styles.audioTopBtn}
                onClick={handleRepeatTrackPlayingClick}
                disabled={isDisabledForEmptyTracks || isInfinityPlaying}
              >
                <BsRepeat1
                  size="20px"
                  className={clsx(
                    styles.audioPlayerTopBtnIcon,
                    styles.audioPlayerTopBtnIconActive,
                    {
                      [styles.audioPlayerTopBtnRepeatIconActive]:
                        isRepeatPlaying,
                      [styles.audioPlayerTopBtnIconDisabled]:
                        isDisabledForEmptyTracks || isInfinityPlaying,
                    },
                  )}
                />
              </button>
            </OverlayTooltip>
            <OverlayTooltip
              id="simple-create-playlist"
              title="Быстрое создание плейлиста"
            >
              <button
                className={styles.audioTopBtn}
                onClick={handleSimplePlaylistCreateClick}
                disabled={isDisabledCreateSimplePlaylist}
              >
                <BsDatabaseAdd
                  size="20px"
                  className={clsx(
                    styles.audioPlayerTopBtnIcon,
                    styles.audioPlayerTopBtnIconActive,
                    {
                      [styles.audioPlayerTopBtnIconDisabled]:
                        isDisabledCreateSimplePlaylist,
                    },
                  )}
                />
              </button>
            </OverlayTooltip>
          </div>
        </div>
      </div>
      <div
        className={clsx(
          styles.audioPlayerContentBlock,
          openDrawer
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none",
        )}
        style={{ transition: "opacity 0.2s ease-out" }}
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
};;;
