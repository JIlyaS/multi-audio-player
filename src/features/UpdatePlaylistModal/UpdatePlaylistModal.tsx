// INFO: Редактирование плейлиста
import { BsPencilSquare } from "react-icons/bs";
import { CustomModal, PlayItem } from "@/components";
import { useState, type FormEvent } from "react";
import { Button, Form } from "react-bootstrap";
import { useAudioPlayerContext } from "@/shared/contexts/AudioPlayerContext";
import type { Playlist, Track } from "@/shared/types";

export const UpdatePlaylistModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [checkedTracks, setCheckedTracks] = useState<(Track | Playlist)[]>([]);
  const { tracks } = useAudioPlayerContext();

  const handleFormSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    console.log("evt", evt);
  };

  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const handleClick = (track: Track) => {};

  const handleSelectAudioChange = (id: string) => {
    const isSelected = checkedTracks.some((item) => item.id === id);
    const currentSelectedTrack = tracks.find((track) => track.id === id);

    if (currentSelectedTrack) {
      if (isSelected) {
        setCheckedTracks((prevValue) =>
          prevValue.filter((item) => item.id !== id)
        );
        return;
      }

      setCheckedTracks((prevValue) => [...prevValue, currentSelectedTrack]);
    }
  };

  return (
    <>
      <button
        onClick={(evt) => {
          evt.stopPropagation();
          setIsOpen(true);
        }}
      >
        <BsPencilSquare />
      </button>
      <CustomModal
        title="Редактировать плейлист"
        isOpen={isOpen}
        isForm
        onClose={() => setIsOpen(false)}
      >
        <Form onSubmit={handleFormSubmit}>
          <Form.Group className="mb-3 mt-3 px-[16px]" controlId="formTitle">
            <Form.Label>Название плейлиста</Form.Label>
            <Form.Control type="title" placeholder="Введите название" />
            {/* <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text> */}
          </Form.Group>
          <Form.Group className="mb-3 px-[16px]" controlId="formTitle">
            <Form.Label>Список композиций</Form.Label>
            <ul>
              {tracks.map((track) => (
                // <Form.Check
                //   type="checkbox"
                //   key={track.id}
                //   id={`checkbox-${track.id}`}
                //   label={track.title}
                // />
                <li
                  key={track.id}
                  className={`flex items-center gap-3 p-[0.5rem_10px] cursor-pointer`}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleSelectAudioChange(track.id);
                    }
                  }}
                  onClick={() => handleSelectAudioChange(track.id)}
                >
                  <Form.Check
                    type="checkbox"
                    id={String(track.id)}
                    checked={checkedTracks.some((item) => item.id === track.id)}
                    onClick={(evt) => evt.stopPropagation()}
                    onChange={() => handleSelectAudioChange(track.id)}
                  />
                  <PlayItem {...track} />
                </li>
              ))}
            </ul>
          </Form.Group>
          <div className="flex w-full justify-end gap-[8px] border-t-1 margin-x-[-10px] p-[12px]">
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Закрыть
            </Button>
            <Button variant="primary" type="submit">
              Сохранить
            </Button>
          </div>
        </Form>
      </CustomModal>
    </>
  );
};
