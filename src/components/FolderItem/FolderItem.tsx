import type { FC } from "react";
import { BsFolder } from "react-icons/bs";
import { BsPinAngle } from "react-icons/bs";
import styles from "./FolderItem.module.css";

interface FolderItemProps {
  title: string;
  isGlobal: boolean;
}

export const FolderItem: FC<FolderItemProps> = ({ title, isGlobal }) => {
  return (
    <>
      <div className={styles.folderItem}>
        <div className={styles.folderItemIconWrap}>
          {isGlobal && <span className={styles.folderItemPinIcon}><BsPinAngle size={14} /></span>}
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
