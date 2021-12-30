import {
  Button,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
} from "@chakra-ui/react";
import { AddIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import useCustomColor from "core/hooks/useCustomColor";
import React from "react";

const EditPublicProfile = () => {
  const { accentColor, coloredText, primaryColor } = useCustomColor();
  return (
    <div>
      <Button p={0} backgroundColor={"transparent"} color={accentColor}>
        <ChevronLeftIcon w={8} h={8} /> Back
      </Button>
      <Heading mt={2} mb={2} fontWeight={"medium"} color={accentColor}>
        Build your profile
      </Heading>
      <Text>Title</Text>
      <Text mb={2} fontSize="sm">
        Description
      </Text>
      <Input mb={4} borderColor="neutralDark" placeholder="Title" />
      <Text>Skills</Text>
      <Text mb={2} fontSize="sm">
        Description
      </Text>
      <HStack
        mb={2}
        spacing={4}
        borderRadius={"md"}
        p={2}
        borderWidth={1}
        borderColor="neutralDark"
      >
        {["sm", "md", "lg"].map((size) => (
          <Tag
            size="lg"
            key={size}
            borderRadius="md"
            variant="solid"
            colorScheme="teal"
            color="white"
          >
            <TagLabel>React</TagLabel>
            <TagCloseButton />
          </Tag>
        ))}
      </HStack>
      <Stack>
        <InputGroup>
          <Input mb={4} borderColor="neutralDark" placeholder="Add Skill" />
          <InputRightElement
            children={
              <Button backgroundColor='transparent'>
                <AddIcon color='white' />
              </Button>
            }
          />
        </InputGroup>
      </Stack>
    </div>
  );
};

export default EditPublicProfile;
