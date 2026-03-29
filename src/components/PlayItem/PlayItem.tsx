import type { FC } from "react";
import { BsMusicNoteBeamed, BsMusicNoteList } from "react-icons/bs";

import styles from "./PlayItem.module.css";

interface PlayItemProps {
  title: string;
  author: string;
  type: string;
}

export const PlayItem: FC<PlayItemProps> = ({ title, author, type }) => {

  return (
    <>
      <div className={styles.playItem}>
        <div className={styles.playItemIconWrap}>
          <span className={styles.playItemIcon}>
            {type === "playlist" ? <BsMusicNoteList /> : <BsMusicNoteBeamed />}
          </span>
        </div>
      </div>
      <div className={styles.playItemContent}>
        <p className={styles.playItemTitle}>{title}</p>
        <p className={styles.playItemAuthor}>{author}</p>
      </div>
    </>
  );
};
