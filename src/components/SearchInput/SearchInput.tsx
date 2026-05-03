// INFO: Поиск аудиофайлов
// import { BsMusicNoteBeamed } from "react-icons/bs";
import Form from "react-bootstrap/Form";
import { type ChangeEvent, type FC } from "react";
import { BsSearch, BsXLg } from "react-icons/bs";
import { Button } from "react-bootstrap";
import clsx from "clsx";
// import debounce from "lodash/debounce";
// import { debounce } from "@/shared/helpers/debounce";
// import type { Track } from "../../shared/types";

import styles from "./SearchInput.module.css";

interface Props {
  searchValue: string;
  className?: string,
  classNameElement?: string;
  onSearchValue: (value: string) => void;
}

export const SearchInput: FC<Props> = ({searchValue, className, classNameElement, onSearchValue}) => {
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
    <div className={clsx(styles.searchInputWrapper, className)}>
      <BsSearch className={styles.searchIcon} />
      <Form.Control
        name="search"
        id="search"
        // placeholder="Поиск..."
        className={clsx(styles.searchInputControl, classNameElement)}
        value={searchValue}
        onChange={handleSearchChange}
      />
      {searchValue && (
        <Button
          className={styles.searchButton}
          variant="link"
          onClick={handleSearchDeleteClick}
        >
          <BsXLg />
        </Button>
      )}
    </div>
  );
};
