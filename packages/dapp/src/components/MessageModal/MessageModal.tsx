import {
  Button,
  Flex,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { AiOutlineSend } from "react-icons/ai";

const MessageModal = ({
  isOpen,
  onOpen,
  onClose,
}: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) => {
  const MessageComp = ({
    message,
    self,
  }: {
    message: string;
    self: boolean;
  }) => {
    return (
      <Flex
        align="center"
        justify={self ? "flex-end" : "flex-start"}
        borderRadius={4}
        mb={1}
      >
        <Text>{message}</Text>
      </Flex>
    );
  };

  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center" fontSize="xl" fontWeight="bold">
          Message
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody overflowY="auto" maxHeight="60vh">
          <VStack height="full" spacing={3} align="stretch">
            {[0, 1, 2, 3, 4].map((i) => (
              <MessageComp
                self={i % 2 === 0}
                key={i}
                message={`Message ${i}`}
              />
            ))}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <InputGroup>
            <Input bg="whiteAlpha.900" color="gray.900" />
            <InputRightElement>
              <Button>
                <Icon as={AiOutlineSend} />
              </Button>
            </InputRightElement>
          </InputGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MessageModal;
