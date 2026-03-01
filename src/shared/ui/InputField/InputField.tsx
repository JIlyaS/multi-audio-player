import { handleChange } from "@/models/create-playlist";
import { $form, type IForm } from "@/models/playlist-form";
import { useStoreMap } from "effector-react";
import type { FC } from "react";
import { Form } from "react-bootstrap";

interface Props {
  id: string;
  name: "title" | "author";
  placeholder: string;
  type?: string;
  label: string;   
}

export const InputField: FC<Props> = ({ id, name, label, placeholder }) => {
    const value = useStoreMap({
      store: $form,
      keys: [name],
      fn: (values: IForm) => values[name] ?? "",
    });

  
    return (
      <Form.Group className="mb-3 mt-3 px-[16px]" controlId={id}>
        <Form.Label>{label}</Form.Label>
        <Form.Control
          type={name}
          name={name}
          value={value}
          placeholder={placeholder}
          required
          onChange={handleChange}
        />
        {/* <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text> */}
      </Form.Group>
    );
  }