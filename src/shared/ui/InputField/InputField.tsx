import { handleChange } from "@/models/create-playlist";
import { $form, type IForm } from "@/models/playlist-form";
import { useStoreMap } from "effector-react";
import type { FC } from "react";
import { Form } from "react-bootstrap";

import styles from "./InputField.module.css";

interface Props {
  id: string;
  name: "title" | "author";
  placeholder: string;
  type?: string;
  label: string; 
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
}

export const InputField: FC<Props> = ({ id, name, label, placeholder, required = false, disabled = false, readOnly = false }) => {

    const value = useStoreMap({
      store: $form,
      keys: [name],
      fn: (values: IForm) => values[name] ?? "",
    });

  
    return (
      <Form.Group className={styles.inputFieldGroup} controlId={id}>
        <Form.Label>{label}</Form.Label>
        <Form.Control
          type={name}
          name={name}
          value={value}
          autoComplete="off"
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          onChange={handleChange}
        />
        {/* <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text> */}
      </Form.Group>
    );
  }