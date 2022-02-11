import {
  Button,
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
  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign='center' fontSize='xl' fontWeight="bold">Message</ModalHeader>
        <ModalCloseButton />
        <ModalBody overflowY="auto" height="60vh">
          <VStack spacing={3} align="stretch">
            <Text textAlign="left">Good morning</Text>
            <Text textAlign="right">Good morning</Text>
            <Text textAlign="left">Good morning</Text>
            <Text textAlign="right">Good morning</Text>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <InputGroup>
            <Input />
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
