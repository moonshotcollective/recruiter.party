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
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import { Web3Context } from "../../contexts/Web3Provider";
import { ceramicCoreFactory } from "core/ceramic";
import useCustomColor from "core/hooks/useCustomColor";

interface EditPublicProfileProps {
  nextStep: () => void;
  prevStep: () => void;
  activeStep: number;
  existingUser: boolean;
}

const EditPublicProfile = ({
  nextStep,
  prevStep,
  activeStep,
  existingUser,
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
    prepend: xpTitlePrepend,
  } = useFieldArray({
    control,
    name: "xpTitle",
  });

  const {
    fields: xpDescriptionFields,
    append: xpDescriptionAppend,
    remove: xpDescriptionRemove,
    prepend: xpDescriptionPrepend,
  } = useFieldArray({
    control,
    name: "xpDescription",
  });

  const {
    fields: xpCompanyFields,
    append: xpCompanyAppend,
    remove: xpCompanyRemove,
    prepend: xpCompanyPrepend,
  } = useFieldArray({
    control,
    name: "company",
  });

  const {
    fields: xpStartDateFields,
    append: xpStartDateAppend,
    remove: xpStartDateRemove,
    prepend: xpStartDatePrepend,
  } = useFieldArray({
    control,
    name: "startDate",
  });

  const {
    fields: xpEndDateFields,
    append: xpEndDateAppend,
    remove: xpEndDateRemove,
    prepend: xpEndDatePrepend,
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
    fields: eduTitleFields,
    append: eduTitleAppend,
    remove: eduTitleRemove,
    prepend: eduTitlePrepend,
  } = useFieldArray({
    control,
    name: "eduTitle",
  });

  const {
    fields: institutionFields,
    append: institutionAppend,
    remove: institutionRemove,
    prepend: institutionPrepend,
  } = useFieldArray({
    control,
    name: "institution",
  });

  const {
    fields: eduStartDateFields,
    append: eduStartDateAppend,
    remove: eduStartDateRemove,
    prepend: eduStartDatePrepend,
  } = useFieldArray({
    control,
    name: "eduStartDate",
  });

  const {
    fields: eduEndDateFields,
    append: eduEndDateAppend,
    remove: eduEndDateRemove,
    prepend: eduEndDatePrepend,
  } = useFieldArray({
    control,
    name: "eduEndDate",
  });

  const {
    fields: eduDescFields,
    append: eduDescAppend,
    remove: eduDescRemove,
    prepend: eduDescPrepend,
  } = useFieldArray({
    control,
    name: "eduDescription",
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
        if (publicProfile?.education.length > 0) {
          publicProfile.education
            .slice()
            .reverse()
            .forEach(
              (edu: {
                title: string;
                institution: string;
                description: string;
                startDate: string;
                endDate: string;
              }) => {
                console.log("edu: ", { edu });
                eduTitlePrepend({ value: edu.title });
                institutionPrepend({ value: edu.institution });
                eduDescPrepend({ value: edu.description });
                eduStartDatePrepend({ value: edu.startDate });
                eduEndDatePrepend({ value: edu.endDate });
              }
            );
        }

        if (publicProfile?.experiences.length > 0) {
          publicProfile.experiences
            .slice()
            .reverse()
            .forEach(
              (exp: {
                title: string;
                company: string;
                description: string;
                startDate: string;
                endDate: string;
              }) => {
                console.log("exp: ", { exp });
                xpTitlePrepend({ value: exp.title });
                xpCompanyPrepend({ value: exp.company });
                xpDescriptionPrepend({ value: exp.description });
                xpStartDatePrepend({ value: exp.startDate });
                xpEndDatePrepend({ value: exp.endDate });
              }
            );
        }

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
      const education = values.eduTitle.map((title: any, index: number) => {
        return {
          title: title.value,
          institution: values.institution[index].value,
          startDate: values.eduStartDate[index].value,
          endDate: values.eduEndDate[index].value,
          description: values.eduDescription[index].value,
        };
      });
      console.log("education", { education });

      console.log("experiences: ", { experiences });

      await mySelf.client.dataStore.set("publicProfile", {
        skillTags,
        experiences,
        education,
      });

      const privateProfile = await mySelf.get("privateProfile");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/profiles/${privateProfile.tokenId}`,
        {},
        {
          withCredentials: true,
        }
      );
      console.log("response: ", response);

      nextStep();
    } catch (error) {
      console.log("Error while submitting data: ", error);
      alert("Error while submitting data");
    }
  };

  return (
    <Box as="main" w="full">
      <Stack as="form" onSubmit={handleSubmit(onSubmit)}>
        <Button
          onClick={prevStep}
          w={24}
          pl={2}
          backgroundColor="transparent"
          color={accentColor}
        >
          <ChevronLeftIcon w={8} h={8} /> Back
        </Button>
        <Heading mt={2} mb={2} fontWeight="medium" color={accentColor}>
          Build your profile
        </Heading>
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
        <Box mt={2} mb={2}>
          <FormLabel htmlFor="experiences" fontWeight="bold">
            Experience
          </FormLabel>
          <Text mb={2} fontSize="sm">
            Add your experience
          </Text>
          {xpTitleFields.map((item, index) => (
            <Box marginY={5}>
              <Flex alignItems="center" justifyContent="space-between">
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
        </Box>
        <Divider />

        <Box mt={2} mb={2}>
          <FormLabel htmlFor="education" fontWeight="bold">
            Education
          </FormLabel>
          <Text mb={2} fontSize="sm">
            Add your education
          </Text>
          {eduTitleFields.map((item, index) => (
            <Box marginY={5}>
              <Flex alignItems="center" justifyContent="space-between">
                <Text mb={2} fontSize="lg">
                  Education {index + 1}
                </Text>
                <Button
                  onClick={() => {
                    eduTitleRemove(index);
                    eduStartDateRemove(index);
                    eduEndDateRemove(index);
                    institutionRemove(index);
                    eduDescRemove(index);
                  }}
                  backgroundColor="transparent"
                >
                  <CloseIcon color={accentColor} w={4} h={4} />
                </Button>
              </Flex>
              <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                <GridItem>
                  <FormControl
                    isInvalid={errors.eduTitle && errors.eduTitle[index]}
                  >
                    <FormLabel htmlFor="title">Title</FormLabel>
                    <Input
                      {...register(`eduTitle.${index}.value`, {
                        required: true,
                        maxLength: {
                          value: 50,
                          message: "Maximum length should be 50",
                        },
                      })}
                    />
                  </FormControl>
                </GridItem>
                <GridItem>
                  <FormControl
                    isInvalid={errors.institution && errors.institution[index]}
                  >
                    <FormLabel htmlFor="institution">
                      School or Institution
                    </FormLabel>
                    <Input
                      {...register(`institution.${index}.value`, {
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
                    isInvalid={
                      errors.eduStartDate && errors.eduStartDate[index]
                    }
                  >
                    <FormLabel htmlFor="eduStartDate">Start Date</FormLabel>
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
                      {...register(`eduStartDate.${index}.value`, {
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
                    isInvalid={errors.eduEndDate && errors.eduEndDate[index]}
                  >
                    <FormLabel htmlFor="eduEndDate">End Date</FormLabel>
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
                      {...register(`eduEndDate.${index}.value`, {
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
                    isInvalid={
                      errors.eduDescription && errors.eduDescription[index]
                    }
                  >
                    <FormLabel htmlFor="eduDescription">Description</FormLabel>
                    <Textarea
                      borderColor="neutralDark"
                      placeholder="Description"
                      {...register(`eduDescription.${index}.value`, {
                        required: false,
                        maxLength: {
                          value: 450,
                          message: "Maximum length should be 450",
                        },
                      })}
                    />
                  </FormControl>
                </GridItem>
              </Grid>
            </Box>
          ))}
        </Box>
        <Button
          onClick={() => {
            eduTitleAppend("");
            eduStartDateAppend("");
            eduEndDateAppend("");
            eduDescAppend("");
            institutionAppend("");
          }}
          m={5}
          ml={0}
          width="fit-content"
        >
          <AddIcon mr={3} color="white" />
          Add education
        </Button>
        <Flex>
          <Spacer />
          <Button
            onClick={prevStep}
            mr={2}
            backgroundColor="transparent"
            color={accentColor}
          >
            Back
          </Button>
          {existingUser && (
            <Button
              onClick={nextStep}
              mr={2}
              backgroundColor="transparent"
              color={accentColor}
            >
              Next
            </Button>
          )}
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
            Save
          </Button>
        </Flex>
      </Stack>
    </Box>
  );
};

export default EditPublicProfile;
