import React, { useEffect, useRef } from "react";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  HStack,
  Box,
} from "@chakra-ui/react";

const Console = ({ isOpen, onClose, title, children = [] }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [children]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        scrollBehavior="inside"
        size="full"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader backgroundColor="gray.50">
            <HStack spacing="24px">
              <Box
                backgroundColor="green.500"
                color="white"
                borderRadius="full"
                p={2}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </Box>
              <Box>
                <span style={{ textTransform: "uppercase" }}>{title}</span> -
                Console
              </Box>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            fontFamily="monospace"
            border={1}
            borderStyle={"solid"}
            borderColor={"gray.200"}
          >
            {children.map((c, idx) => (
              <p key={idx} className="mb-1">
                &gt; {c}
              </p>
            ))}
            <div ref={messagesEndRef} />
          </ModalBody>

          <ModalFooter backgroundColor="gray.50">
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Console;
