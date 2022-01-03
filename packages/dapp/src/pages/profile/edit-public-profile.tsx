import { AddIcon, ChevronLeftIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  InputGroup,
  SimpleGrid,
  Spacer,
  Stack,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
} from "@chakra-ui/react";
import useCustomColor from "core/hooks/useCustomColor";
import React, { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

const EditPublicProfile = () => {
  const { accentColor } = useCustomColor();
  const [title, setTitle] = useState<string>("");

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setValue,
    control,
  } = useForm();

  const {
    fields: xpFields,
    append: xpAppend,
    remove: xpRemove,
  } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "experiences", // unique name for your Field Array
    // keyName: "id", default to "id", you can change the key name
  });

  const {
    fields: skillFields,
    append: skillAppend,
    remove: skillRemove,
  } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "skillTags", // unique name for your Field Array
    // keyName: "id", default to "id", you can change the key name
  });

  const {
    fields: eduFields,
    append: eduAppend,
    remove: eduRemove,
  } = useFieldArray({
    control,
    name: "education",
  });

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
      <FormControl isInvalid={errors.skillTags} mt={2} mb={2}>
        <FormLabel>Skills</FormLabel>
        <Text mb={2} fontSize="sm">
          Description
        </Text>
        {skillFields.length > 0 && (
          <SimpleGrid
            w="full"
            border="purple.500"
            borderRadius="md"
            p={1}
            borderWidth="2px"
            columns={4}
            spacing={4}
          >
            {skillFields.map((item, index) => (
              <Tag
                size="md"
                key={item.id}
                color="white"
                borderRadius="md"
                backgroundColor="purple.500"
              >
                <TagLabel>
                  <Input
                    placeholder="TypeScript"
                    border="none"
                    _focus={{
                      border: "none",
                    }}
                    {...register(`skillTags.${index}.value`, {
                      maxLength: {
                        value: 450,
                        message: "Maximum length should be 450",
                      },
                    })}
                  />
                </TagLabel>
                <TagCloseButton onClick={() => skillRemove(index)} />
              </Tag>
            ))}
          </SimpleGrid>
        )}

        <Button onClick={() => skillAppend("")} mt={5} mb={5}>
          <AddIcon mr={2} color="white" />
          Add Skill
        </Button>
        <FormErrorMessage>
          {errors.skillTags && errors.skillTags.message}
        </FormErrorMessage>
      </FormControl>
      <Divider />
      <FormControl isInvalid={errors.experiences} mt={2} mb={2}>
        <FormLabel htmlFor="experiences" fontWeight="bold">
          Experience
        </FormLabel>
        <Text mb={2} fontSize="sm">
          Description
        </Text>
        {xpFields.map((item, index) => (
          <InputGroup key={item.id} mb={2}>
            <Input
              borderColor="neutralDark"
              placeholder="Add experience"
              {...register(`experiences.${index}.value`, {
                maxLength: {
                  value: 150,
                  message: "Maximum length should be 150",
                },
              })}
            />
            <Button
              onClick={() => xpRemove(index)}
              ml={2}
              backgroundColor="transparent"
            >
              <CloseIcon color={accentColor} w={4} h={4} />
            </Button>
          </InputGroup>
        ))}
        <Button onClick={() => xpAppend("")} m={2} ml={0}>
          <AddIcon mr={3} color="white" />
          Add experience
        </Button>
        <FormErrorMessage>
          {errors.experiences && errors.experiences.message}
        </FormErrorMessage>
      </FormControl>
      <Divider />

      <FormControl mt={2} mb={2}>
        <FormLabel htmlFor="education" fontWeight="bold">
          Education
        </FormLabel>
        <Text mb={2} fontSize="sm">
          Description
        </Text>
        {eduFields.map((item, index) => (
          <InputGroup key={item.id} mb={2}>
            <Input
              {...register(`education.${index}.value`, {
                maxLength: {
                  value: 450,
                  message: "Maximum length should be 450",
                },
              })}
              color="white"
              placeholder="education"
            />
            <Button
              onClick={() => eduRemove(index)}
              ml={2}
              backgroundColor="transparent"
            >
              <CloseIcon color={accentColor} w={4} h={4} />
            </Button>
          </InputGroup>
        ))}
        <Button onClick={() => eduAppend("")} m={2} ml={0}>
          <AddIcon mr={3} color="white" />
          Add education
        </Button>
        <FormErrorMessage>
          {errors.education && errors.education.message}
        </FormErrorMessage>
      </FormControl>
      <Flex>
        <Spacer />
        <Button mr={2} backgroundColor={"transparent"} color={accentColor}>
          Back
        </Button>
        <Button
          _hover={{
            backgroundColor: "transparent",
            borderColor: accentColor,
            borderWidth: "1px",
            color: accentColor,
          }}
          mr={2}
          backgroundColor={accentColor}
          color="purple.500"
        >
          Next
        </Button>
      </Flex>
    </div>
  );
};

export default EditPublicProfile;
