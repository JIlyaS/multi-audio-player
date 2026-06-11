import type { FC } from "react";
import { BsMusicNoteBeamed, BsMusicNoteList, BsFolder } from "react-icons/bs";

interface Props {
    isPlaylist: boolean;
    isFolder: boolean;
}

export const TrackInfoIcon: FC<Props> = ({isPlaylist, isFolder }) => {
    if (isFolder) {
      return <BsFolder size="32px" />
    }

    if (isPlaylist) {
        return <BsMusicNoteList size="32px" />;
    }

    return (<BsMusicNoteBeamed size="32px" />);
};
