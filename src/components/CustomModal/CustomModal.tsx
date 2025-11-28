import clsx from "clsx";
import { type FC, type PropsWithChildren } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import styles from "./CustomModal.module.css";

interface CustomModalProps {
  title: string;
  isOpen: boolean;
  isForm?: boolean;
  openBtnText?: string;
  closeBtnText?: string;
  onSubmit?: () => void;
  onClose: () => void;
}

export const CustomModal: FC<PropsWithChildren<CustomModalProps>> = ({
  title,
  children,
  isOpen,
  onClose,
  isForm = false,
  openBtnText = "Сохранить",
  closeBtnText = "Закрыть",
  onSubmit,
}) => {
  return (
    <Modal show={isOpen} onHide={onClose} size="lg">
      <Modal.Header
        closeButton
        className={clsx("bg-[#2e2d2d]", styles.modalHeader)}
      >
        <Modal.Title className="text-white">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-[#2e2d2d] text-white p-0!">
        {children}
      </Modal.Body>
      {!isForm && (
        <Modal.Footer className="bg-[#2e2d2d]!">
          <Button variant="secondary" onClick={onClose}>
            {closeBtnText}
          </Button>
          <Button variant="primary" onClick={onSubmit}>
            {openBtnText}
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  );
};
