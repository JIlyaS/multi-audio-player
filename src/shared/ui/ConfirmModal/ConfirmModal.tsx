import { type FC, type ReactNode } from "react";
import { Button, Modal } from "react-bootstrap";

interface Props {
  title: string;
  description: string;
  show: boolean;
  children: ReactNode;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmModal: FC<Props> = ({
  title,
  description,
  show,
  children,
  onConfirm,
  onClose,
}) => {

  return (
    <>
      {children}

      <Modal show={show} centered onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{description}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Закрыть
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Подтвердить
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};