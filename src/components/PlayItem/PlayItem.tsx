import type { FC } from "react";
import { BsMusicNoteBeamed, BsMusicNoteList } from "react-icons/bs";

import styles from "./PlayItem.module.css";
import { Badge } from "react-bootstrap";

interface PlayItemProps {
  title: string;
  author: string;
  type: string;
  tags: string[],
}

export const PlayItem: FC<PlayItemProps> = ({ title, author, type, tags }) => {

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
        {tags.length ? (
          <p className={styles.playItemTagList}>
            {tags.map((tag) => (
              <Badge bg="success" key={tag}>{tag}</Badge>
            ))}
          </p>
        ) : null}
      </div>
    </>
  );
};
