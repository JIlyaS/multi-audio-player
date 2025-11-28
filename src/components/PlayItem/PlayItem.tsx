import type { FC } from "react";
import { BsMusicNoteBeamed } from "react-icons/bs";

interface PlayItemProps {
  thumbnail?: string;
  title: string;
  author: string;
}

export const PlayItem: FC<PlayItemProps> = ({ thumbnail, title, author }) => {
  return (
    <>
      <div className="w-16 h-16 flex items-center justify-center bg-gray-200 rounded-sm overflow-hidden">
        {thumbnail ? (
          <img
            className="w-full h-full object-cover"
            src={thumbnail}
            alt="audio avatar"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-300 rounded-md">
            <span className="text-xl text-gray-600">
              <BsMusicNoteBeamed />
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-col content-start">
        <p className="font-bold text-sm">{title}</p>
        <p className="text-sm text-gray-400">{author}</p>
      </div>
    </>
  );
};
