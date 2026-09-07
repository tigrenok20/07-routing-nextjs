"use client";

import type { MouseEvent } from "react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import css from "./Modal.module.css";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

export default function Modal(props: ModalProps) {
  const { onClose, children } = props;

  useEffect(() => {
    const hadleCloseByEsc = (event: KeyboardEvent) => {
      if (event.code === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", hadleCloseByEsc);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", hadleCloseByEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleBakdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget === e.target) {
      onClose();
    }
  };

  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={handleBakdropClick}
    >
      <div className={css.modal}>{children}</div>
    </div>,
    document.body,
  );
}
