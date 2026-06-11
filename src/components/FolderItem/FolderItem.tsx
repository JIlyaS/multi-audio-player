import type { FC } from "react";
import { BsFolder } from "react-icons/bs";
import styles from "./FolderItem.module.css";

interface FolderItemProps {
  title: string;
}

export const FolderItem: FC<FolderItemProps> = ({ title }) => {
  return (
    <>
      <div className={styles.folderItem}>
        <div className={styles.folderItemIconWrap}>
          <span className={styles.folderItemIcon}>
            <BsFolder />
          </span>
        </div>
      </div>
      <div className={styles.folderItemContent}>
        <p className={styles.folderItemTitle}>{title}</p>
      </div>
    </>
  );
};
