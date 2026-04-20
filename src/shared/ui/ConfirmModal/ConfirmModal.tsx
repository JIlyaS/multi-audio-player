import { type FC, type ReactNode } from "react";
import { Button, Modal } from "react-bootstrap";

import styles from "./ConfirmModal.module.css";
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
        <Modal.Header className={styles.confirmModalHeader} closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.confirmModalContent}>
          {description}
        </Modal.Body>
        <Modal.Footer className={styles.confirmModalFooter}>
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