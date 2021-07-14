import { useState } from "react";

export const useModal = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState([]);
  const [modalTitle, setModalTitle] = useState("");

  const openModal = (title = "", content = []) => {
    setModalTitle(title);
    setModalContent(content);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const updateContent = (content = []) => {
    setModalContent((oldContent) => [...oldContent, ...content]);
  };

  return {
    modalOpen,
    modalTitle,
    modalContent,
    openModal,
    closeModal,
    updateContent,
  };
};
