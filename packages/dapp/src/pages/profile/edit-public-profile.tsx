import { AddIcon, ChevronLeftIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  InputGroup,
  Spacer,
  Stack,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
} from "@chakra-ui/react";
import useCustomColor from "core/hooks/useCustomColor";
import React, { useState } from "react";

const EditPublicProfile = () => {
  const { accentColor, coloredText, primaryColor } = useCustomColor();
  const [title, setTitle] = useState<string>("");
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState<string>("");
  const [experience, setExperience] = useState<string[]>([]);
  const [education, setEducation] = useState<string[]>([]);

  return (
    <div>
      <Button pl={2} backgroundColor={"transparent"} color={accentColor}>
        <ChevronLeftIcon w={8} h={8} /> Back
      </Button>
      <Heading mt={2} mb={2} fontWeight={"medium"} color={accentColor}>
        Build your profile
      </Heading>
      <FormControl mt={2} mb={2}>
        <FormLabel>Title</FormLabel>
        <Text mb={2} fontSize="sm">
          Description
        </Text>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          mb={4}
          borderColor="neutralDark"
          placeholder="Title"
        />
      </FormControl>
      <Divider />
      <FormControl mt={2} mb={2}>
        <FormLabel>Skills</FormLabel>
        <Text mb={2} fontSize="sm">
          Description
        </Text>
        {skills.length > 0 && (
          <HStack
            mb={2}
            spacing={4}
            borderRadius={"md"}
            p={2}
            borderWidth={1}
            borderColor="neutralDark"
          >
            {skills.map((skill, index) => (
              <Tag
                size="lg"
                key={index}
                borderRadius="md"
                variant="solid"
                colorScheme="teal"
                color="white"
              >
                <TagLabel>{skill}</TagLabel>
                <TagCloseButton
                  onClick={() => {
                    setSkills((prevSkills) =>
                      [...prevSkills].filter((currSkill) => currSkill !== skill)
                    );
                  }}
                />
              </Tag>
            ))}
          </HStack>
        )}
        <Stack>
          <InputGroup>
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              mb={4}
              borderColor="neutralDark"
              placeholder="Add Skill"
            />
            <Button
              onClick={() => {
                if (newSkill === "") return;
                setSkills((skills) => [...skills, newSkill]);
                setNewSkill("");
              }}
              ml={5}
            >
              <AddIcon mr={2} color="white" />
              Add Skill
            </Button>
          </InputGroup>
        </Stack>
      </FormControl>
      <Divider />
      <FormControl mt={2} mb={2}>
        <FormLabel>Experience</FormLabel>
        <Text mb={2} fontSize="sm">
          Description
        </Text>
        {experience.map((exp, index) => (
          <InputGroup mb={2}>
            <Input
              borderColor="neutralDark"
              placeholder="Add experience"
              value={exp}
              onChange={(e) => {
                const newExperience = [...experience];
                newExperience[index] = e.target.value;
                setExperience(newExperience);
              }}
            />
            <Button
              onClick={() => {
                setExperience((experience) =>
                  [...experience].filter((currExp) => currExp !== exp)
                );
              }}
              ml={2}
              backgroundColor="transparent"
            >
              <CloseIcon color={accentColor} w={4} h={4} />
            </Button>
          </InputGroup>
        ))}
        <Button
          onClick={() => {
            setExperience((experience) => [...experience, ""]);
          }}
          m={2}
          ml={0}
        >
          <AddIcon mr={3} color="white" />
          Add experience
        </Button>
      </FormControl>
      <Divider />
      <FormControl mt={2} mb={2}>
        <FormLabel>Education</FormLabel>
        <Text mb={2} fontSize="sm">
          Description
        </Text>
        {education.map((edu, index) => (
          <InputGroup mb={2}>
            <Input
              value={edu}
              onChange={(e) => {
                const newEducation = [...education];
                newEducation[index] = e.target.value;
                setEducation(newEducation);
              }}
              borderColor="neutralDark"
              placeholder="education"
            />
            <Button
              onClick={() =>
                setEducation((educations) =>
                  [...educations].filter((currEdu) => currEdu !== edu)
                )
              }
              ml={2}
              backgroundColor="transparent"
            >
              <CloseIcon color={accentColor} w={4} h={4} />
            </Button>
          </InputGroup>
        ))}
        <Button
          onClick={() => setEducation((educations) => [...educations, ""])}
          m={2}
          ml={0}
        >
          <AddIcon mr={3} color="white" />
          Add education
        </Button>
      </FormControl>
      <Flex>
        <Spacer />
        <Button mr={2} backgroundColor={"transparent"} color={accentColor}>
          Back
        </Button>
        <Button mr={2} backgroundColor={accentColor} color="neutralDark">
          Next
        </Button>
      </Flex>
    </div>
  );
};

export default EditPublicProfile;
