import { AddIcon, ChevronLeftIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Button,
  Divider,
  Flex,
  FormControl,
  Heading,
  HStack,
  Input,
  InputGroup, Spacer,
  Stack,
  Tag,
  TagCloseButton,
  TagLabel,
  Text
} from "@chakra-ui/react";
import useCustomColor from "core/hooks/useCustomColor";
import React from "react";

const EditPublicProfile = () => {
  const { accentColor, coloredText, primaryColor } = useCustomColor();
  return (
    <div>
      <Button pl={2} backgroundColor={"transparent"} color={accentColor}>
        <ChevronLeftIcon w={8} h={8} /> Back
      </Button>
      <Heading mt={2} mb={2} fontWeight={"medium"} color={accentColor}>
        Build your profile
      </Heading>
      <FormControl mt={2} mb={2}>
        <Text>Title</Text>
        <Text mb={2} fontSize="sm">
          Description
        </Text>
        <Input mb={4} borderColor="neutralDark" placeholder="Title" />
      </FormControl>
      <Divider />
      <FormControl mt={2} mb={2}>
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
            <Button ml={5}>
              <AddIcon mr={2} color="white" />
              Add Skill
            </Button>
          </InputGroup>
        </Stack>
      </FormControl>
      <Divider />
      <FormControl mt={2} mb={2}>
        <Text>Experience</Text>
        <Text mb={2} fontSize="sm">
          Description
        </Text>
        {["developer", "designer", "marketer"].map((experience) => (
          <InputGroup mb={2}>
            <Input borderColor="neutralDark" placeholder={experience} />
            <Button ml={2} backgroundColor="transparent">
              <CloseIcon color={accentColor} w={4} h={4} />
            </Button>
          </InputGroup>
        ))}
        <Button m={2} ml={0}>
          <AddIcon mr={3} color="white" />
          Add experience
        </Button>
      </FormControl>
      <Divider />
      <FormControl mt={2} mb={2}>
        <Text>Education</Text>
        <Text mb={2} fontSize="sm">
          Description
        </Text>
        {["developer", "designer", "marketer"].map((education) => (
          <InputGroup mb={2}>
            <Input borderColor="neutralDark" placeholder="education" />
            <Button ml={2} backgroundColor="transparent">
              <CloseIcon color={accentColor} w={4} h={4} />
            </Button>
          </InputGroup>
        ))}
        <Button m={2} ml={0}>
          <AddIcon mr={3} color="white" />
          Add education
        </Button>
      </FormControl>
      <Flex>
        <Spacer />
        <Button
          mr={2}
          backgroundColor={"transparent"} color={accentColor}>Back</Button>
          <Button
          mr={2}
          backgroundColor={accentColor}
          color='neutralDark'>Next</Button>
      </Flex>
    </div>
  );
};

export default EditPublicProfile;
