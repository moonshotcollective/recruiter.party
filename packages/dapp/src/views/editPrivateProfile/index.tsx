import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Spacer,
  Stack,
} from "@chakra-ui/react";
import useCustomColor from "core/hooks/useCustomColor";
import React from "react";
import { useForm } from "react-hook-form";

interface EditPrivateProfileProps {
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
  activeStep: number;
}

const EditPrivateProfile = ({
  nextStep,
  prevStep,
  reset,
  activeStep,
}: EditPrivateProfileProps) => {
  const { accentColor } = useCustomColor();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm();

  const onSubmit = async () => {};

  return (
    <Box as="main" w={"full"}>
      <Stack as="form" onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={errors.firstname} mb={3}>
          <FormLabel htmlFor="firstname">Firstname</FormLabel>
          <Input
            placeholder="V"
            {...register("firstname", {
              maxLength: {
                value: 150,
                message: "Maximum length should be 150",
              },
            })}
          />
          <FormErrorMessage>
            {errors.firstname && errors.firstname.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.lastname} mb={3}>
          <FormLabel htmlFor="lastname">Lastname</FormLabel>
          <Input
            placeholder="Vendetta"
            {...register("lastname", {
              maxLength: {
                value: 150,
                message: "Maximum length should be 150",
              },
            })}
          />
          <FormErrorMessage>
            {errors.lastname && errors.lastname.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.email} mb={3}>
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input
            placeholder="my.email@e-corp.com"
            {...register("email", {
              maxLength: {
                value: 150,
                message: "Maximum length should be 150",
              },
            })}
          />
          <FormErrorMessage>
            {errors.email && errors.email.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.phone} mb={3}>
          <FormLabel htmlFor="phone">Phone number</FormLabel>
          <Input
            placeholder="Enter phone number"
            type="tel"
            {...register("phone")}
          />
          <FormErrorMessage>
            {errors.phone && errors.phone.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.physicalAddress} mb={3}>
          <FormLabel htmlFor="physicalAddress">Location</FormLabel>
          <Input
            placeholder="Quadratic Lands Avenue, 1337"
            {...register("physicalAddress", {
              maxLength: 140,
            })}
          />
          <FormErrorMessage>
            {errors.physicalAddress && errors.physicalAddress.message}
          </FormErrorMessage>
        </FormControl>
        <Flex mt={5}>
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
            isLoading={isSubmitting}
            _hover={{
              backgroundColor: "transparent",
              borderColor: accentColor,
              borderWidth: "1px",
              color: accentColor,
            }}
            // width="full"
            color="neutralDark"
            backgroundColor={accentColor}
            onClick={nextStep}
          >
            Save
          </Button>
        </Flex>
      </Stack>
    </Box>
  );
};

export default EditPrivateProfile;
