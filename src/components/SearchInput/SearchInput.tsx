// INFO: Поиск аудиофайлов
// import { BsMusicNoteBeamed } from "react-icons/bs";
import Form from "react-bootstrap/Form";
import { type ChangeEvent, type FC } from "react";
import { BsSearch, BsXLg } from "react-icons/bs";
import { Button } from "react-bootstrap";
// import debounce from "lodash/debounce";
// import { debounce } from "@/shared/helpers/debounce";
// import type { Track } from "../../shared/types";

interface Props {
  searchValue: string;
  className?: string,
  onSearchValue: (value: string) => void;
}

export const SearchInput: FC<Props> = ({searchValue, className, onSearchValue}) => {
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
    onSearchValue(searchValue);
    // onSearchResult(searchValue);
  };

  const handleSearchDeleteClick = () => {
    onSearchValue("");
  };

  return (
    <div className={`relative ${className}`}>
      <BsSearch className="absolute text-white top-[11px] left-[10px]" />
      <Form.Control
        name="search"
        id="search"
        // placeholder="Поиск..."
        className="bg-[#4c4848]! text-white indent-[25px]"
        value={searchValue}
        onChange={handleSearchChange}
      />
      {searchValue && (
        <Button
          className="absolute text-white top-[4px] right-[1px]"
          variant="link"
          onClick={handleSearchDeleteClick}
        >
          <BsXLg />
        </Button>
      )}
    </div>
  );
};
