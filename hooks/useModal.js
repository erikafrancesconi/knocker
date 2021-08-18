import { useState } from "react";

export const useModal = () => {
  const [modalContent, setModalContent] = useState([]);
  const [modalTitle, setModalTitle] = useState("");

  const openModal = (title = "", content = [], callback = () => {}) => {
    setModalTitle(title);
    setModalContent(content);
    callback();
  };

  const appendContent = (content = []) => {
    setModalContent((oldContent) => [...oldContent, ...content]);
  };

  return {
    modalTitle,
    modalContent,
    openModal,
    appendContent,
  };
};
