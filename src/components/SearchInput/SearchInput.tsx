// INFO: Поиск аудиофайлов
// import { BsMusicNoteBeamed } from "react-icons/bs";
import Form from "react-bootstrap/Form";
import { useAudioPlayerContext } from "@/shared/contexts/AudioPlayerContext";
import { type ChangeEvent } from "react";
import { BsSearch } from "react-icons/bs";
// import debounce from "lodash/debounce";
// import { debounce } from "@/shared/helpers/debounce";
// import type { Track } from "../../shared/types";

export const SearchInput = () => {
  const { searchValue, setSearchValue } = useAudioPlayerContext();
  // const [searchValue, setSearchValue] = useState<string>("");

  // TODO: Смысла нет делать debounce для поиска на фронте
  // const onSearch = (value: string) => {
  //   // console.log(value);
  //   setSearchTracks();
  // };

  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // const onSearchResult = useCallback(debounce(onSearch, 300), []);

  const handleSearchChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const searchValue = evt.target.value;
    setSearchValue(searchValue);
    // onSearchResult(searchValue);
  };

  return (
    <div className="relative">
      <BsSearch className="absolute text-white top-[11px] left-[10px]" />
      <Form.Control
        name="search"
        id="search"
        className="bg-[#4c4848]! text-white indent-[25px]"
        value={searchValue}
        onChange={handleSearchChange}
      />
    </div>
  );
};
