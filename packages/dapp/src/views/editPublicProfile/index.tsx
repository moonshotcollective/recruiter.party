import { AddIcon, ChevronLeftIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Input,
  InputGroup,
  SimpleGrid,
  Spacer,
  Stack,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { ceramicCoreFactory } from "core/ceramic";
import useCustomColor from "core/hooks/useCustomColor";
import React, { useContext, useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Web3Context } from "../../contexts/Web3Provider";

interface EditPublicProfileProps {
  nextStep: () => void;
  prevStep: () => void;
  activeStep: number;
}

const EditPublicProfile = ({
  nextStep,
  prevStep,
  activeStep,
}: EditPublicProfileProps) => {
  const { account, contracts, mySelf } = useContext(Web3Context);
  const { accentColor } = useCustomColor();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setValue,
    control,
  } = useForm();

  const {
    fields: xpTitleFields,
    append: xpTitleAppend,
    remove: xpTitleRemove,
  } = useFieldArray({
    control,
    name: "xpTitle",
  });

  const {
    fields: xpDescriptionFields,
    append: xpDescriptionAppend,
    remove: xpDescriptionRemove,
  } = useFieldArray({
    control,
    name: "xpDescription",
  });

  const {
    fields: xpCompanyFields,
    append: xpCompanyAppend,
    remove: xpCompanyRemove,
  } = useFieldArray({
    control,
    name: "company",
  });

  const {
    fields: xpStartDateFields,
    append: xpStartDateAppend,
    remove: xpStartDateRemove,
  } = useFieldArray({
    control,
    name: "startDate",
  });

  const {
    fields: xpEndDateFields,
    append: xpEndDateAppend,
    remove: xpEndDateRemove,
  } = useFieldArray({
    control,
    name: "endDate",
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

  useEffect(() => {
    // get initial state from Ceramic
    (async () => {
      if (mySelf) {
        const publicProfile = await mySelf.client.dataStore.get(
          "publicProfile"
        );
        console.log("PublicProfile: ", { publicProfile });
        if (!publicProfile) return;
        Object.entries(publicProfile).forEach(([key, value]) => {
          setValue(
            key,
            // @ts-expect-error
            value.map((val: any) => ({ value: val }))
          );
        });
      }
    })();
  }, [mySelf]);

  const onSubmit = async (values: any) => {
    console.log("values from PublicProfile onSubmit: ", values);
    try {
      const skillTags = values.skillTags.map((skill: any) => skill.value);
      const experiences = values.xpTitle.map((title: any, index: number) => {
        return {
          title: title.value,
          description: values.xpDescription[index].value,
          company: values.company[index].value,
          startDate: values.startDate[index].value,
          endDate: values.endDate[index].value,
        };
      });

      console.log("experiences: ", { experiences });

      await mySelf.client.dataStore.set("publicProfile", {
        skillTags,
        experiences,
      });
      const me = await mySelf.client.dataStore.get("publicProfile");
      nextStep();
    } catch (error) {
      console.log("Error while submitting data: ", error);
      alert("Error while submitting data");
    }
  };

  return (
    <Box as="main" w={"full"}>
      <Stack as="form" onSubmit={handleSubmit(onSubmit)}>
        <Button
          onClick={prevStep}
          w={24}
          pl={2}
          backgroundColor={"transparent"}
          color={accentColor}
        >
          <ChevronLeftIcon w={8} h={8} /> Back
        </Button>
        <Heading mt={2} mb={2} fontWeight={"medium"} color={accentColor}>
          Build your profile
        </Heading>
        <FormControl isInvalid={errors.title} mt={2} mb={2}>
          <FormLabel htmlFor="title">Title</FormLabel>
          <Text mb={2} fontSize="sm">
            Enter your title
          </Text>
          <Input
            mb={4}
            {...register("title", {
              required: true,
              maxLength: {
                value: 50,
                message: "Maximun length should be 50",
              },
            })}
            borderColor="neutralDark"
            placeholder="Title"
          />
          <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
        </FormControl>
        <Divider />
        <FormControl isInvalid={errors.skillTags} mt={2} mb={2}>
          <FormLabel>Skills</FormLabel>
          <Text mb={2} fontSize="sm">
            Enter skills
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
        <FormControl mt={2} mb={2}>
          <FormLabel htmlFor="experiences" fontWeight="bold">
            Experience
          </FormLabel>
          <Text mb={2} fontSize="sm">
            Add your experience
          </Text>
          {xpTitleFields.map((item, index) => (
            <Box marginY={5}>
              <Flex alignItems="center" justifyContent={"space-between"}>
                <Text mb={2} fontSize="lg">
                  Experience {index + 1}
                </Text>
                <Button
                  onClick={() => {
                    xpTitleRemove(index);
                    xpCompanyRemove(index);
                    xpStartDateRemove(index);
                    xpEndDateRemove(index);
                    xpDescriptionRemove(index);
                  }}
                  backgroundColor="transparent"
                >
                  <CloseIcon color={accentColor} w={4} h={4} />
                </Button>
              </Flex>

              <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                <GridItem>
                  <FormControl
                    isInvalid={errors.xpTitle && errors.xpTitle[index]}
                  >
                    <FormLabel htmlFor="title">Title</FormLabel>
                    <Input
                      borderColor="neutralDark"
                      placeholder="Add Title"
                      {...register(`xpTitle.${index}.value`, {
                        required: true,
                        maxLength: {
                          value: 150,
                          message: "Maximum length should be 150",
                        },
                      })}
                    />
                  </FormControl>
                </GridItem>
                <GridItem>
                  <FormControl
                    isInvalid={errors.company && errors.company[index]}
                  >
                    <FormLabel htmlFor="company">Company</FormLabel>
                    <Input
                      borderColor="neutralDark"
                      placeholder="Company"
                      {...register(`company.${index}.value`, {
                        required: false,
                        maxLength: {
                          value: 150,
                          message: "Maximum length should be 150",
                        },
                      })}
                    />
                  </FormControl>
                </GridItem>
                <GridItem>
                  <FormControl
                    isInvalid={errors.startDate && errors.startDate[index]}
                  >
                    <FormLabel htmlFor="startDate">Start Date</FormLabel>
                    <input
                      style={{
                        color: "white",
                        borderColor: "#6A39EC",
                        borderWidth: "2px",
                        width: "100%",
                        background: "transparent",
                        padding: "2px",
                        paddingRight: "6px",
                        fontSize: "1.2rem",
                        borderRadius: "8px",
                      }}
                      type="date"
                      placeholder="Enter Start Date"
                      {...register(`startDate.${index}.value`, {
                        required: false,
                        maxLength: {
                          value: 150,
                          message: "Maximum length should be 150",
                        },
                      })}
                    />
                  </FormControl>
                </GridItem>
                <GridItem>
                  <FormControl
                    isInvalid={errors.endDate && errors.endDate[index]}
                  >
                    <FormLabel htmlFor="endDate">End Date</FormLabel>
                    <input
                      style={{
                        color: "white",
                        borderColor: "#6A39EC",
                        borderWidth: "2px",
                        width: "100%",
                        background: "transparent",
                        padding: "2px",
                        paddingRight: "6px",
                        fontSize: "1.2rem",
                        borderRadius: "8px",
                      }}
                      type="date"
                      placeholder="Enter End Date"
                      {...register(`endDate.${index}.value`, {
                        required: false,
                        maxLength: {
                          value: 150,
                          message: "Maximum length should be 150",
                        },
                      })}
                    />
                  </FormControl>
                </GridItem>
                <GridItem colSpan={2}>
                  <FormControl
                    isInvalid={
                      errors.xpDescription && errors.xpDescription[index]
                    }
                  >
                    <FormLabel htmlFor="description">Description</FormLabel>
                    <Textarea
                      borderColor="neutralDark"
                      placeholder="Description"
                      {...register(`xpDescription.${index}.value`, {
                        required: false,
                        maxLength: {
                          value: 150,
                          message: "Maximum length should be 150",
                        },
                      })}
                    />
                  </FormControl>
                </GridItem>
              </Grid>
            </Box>
          ))}
          <Button
            onClick={() => {
              xpTitleAppend("");
              xpCompanyAppend("");
              xpStartDateAppend("");
              xpEndDateAppend("");
              xpDescriptionAppend("");
            }}
            m={5}
            ml={0}
          >
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
            Add your education
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
          <Button
            onClick={prevStep}
            mr={2}
            backgroundColor={"transparent"}
            color={accentColor}
          >
            Back
          </Button>
          <Button
            type="submit"
            _hover={{
              backgroundColor: "transparent",
              borderColor: accentColor,
              borderWidth: "1px",
              color: accentColor,
            }}
            mr={2}
            isLoading={isSubmitting}
            backgroundColor={accentColor}
            color="purple.500"
          >
            Next
          </Button>
        </Flex>
      </Stack>
    </Box>
  );
};

export default EditPublicProfile;
