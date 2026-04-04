import { $form, type IForm } from "@/models/playlist-form";
import { useStoreMap } from "effector-react";
import type { FC } from "react";
import { Form } from "react-bootstrap";

import styles from "./CheckboxField.module.css";
import { handleCheckboxChange } from "@/models/create-playlist";

interface Props {
  id: string;
  name: "isPublic";
  type?: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
}

export const CheckboxField: FC<Props> = ({
  id,
  name,
  label,
  required = false,
  disabled = false,
  readOnly = false,
}) => {

  const value = useStoreMap({
    store: $form,
    keys: [name],
    fn: (values: IForm) => values[name] ?? "",
  });

  return (
    <Form.Group className={styles.checkboxFieldGroup} controlId={id}>
      <Form.Check
        type="checkbox"
        name={name}
        checked={value}
        label={label}
        disabled={disabled}
        required={required}
        readOnly={readOnly}
        onChange={handleCheckboxChange}
      />
    </Form.Group>
  );
};
