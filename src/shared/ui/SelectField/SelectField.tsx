import { useStoreMap } from "effector-react";
import type { FC } from "react";
import { Form, Spinner } from "react-bootstrap";
// TODO: Вынести из общего компонента
import { $form, handleSelectChange, type IForm } from "@/models/playlist-form";

import styles from "./SelectField.module.css";

interface FolderOption {
  id: string;
  value?: string;
  label: string;
}

interface Props {
  id: string;
  name: "folderId";
  optionList: FolderOption[];
  placeholder?: string;
  type?: string;
  label: string;
  loading?: boolean;
  required?: boolean;
  disabled?: boolean;
  // readOnly?: boolean;
}

// TODO: Пока заточен под playlist форму
export const SelectField: FC<Props> = ({
  id,
  name,
  label,
  optionList,
  placeholder,
  loading = false,
  required = false,
  disabled = false,
}) => {
  const value = useStoreMap({
    store: $form,
    keys: [name],
    fn: (values: IForm) => values[name] ?? "",
  });

  const optionListWithPlaceholder = (optionList: FolderOption[]) => {
    return (
      <>
        <option key="empty" value="">{placeholder}</option>
        {optionList.map((option: FolderOption) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </>
    );
  };

  return (
    <Form.Group className={styles.selectFieldGroup} controlId={id}>
      <Form.Label>{label}</Form.Label>
      {loading && (
        <Spinner
          animation="border"
          role="status"
          size="sm"
          variant="primary"
          className={styles.selectFieldLoading}
        >
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      )}
      <Form.Select
        name={name}
        aria-label={label}
        className={styles.selectField}
        value={value}
        disabled={disabled || loading}
        required={required}
        onChange={handleSelectChange}
      >
        {optionListWithPlaceholder(optionList)}
      </Form.Select>
      {/* <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text> */}
    </Form.Group>
  );
};
