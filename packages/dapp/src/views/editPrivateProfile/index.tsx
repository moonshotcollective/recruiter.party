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
import axios from "axios";
import { Web3Context } from "contexts/Web3Provider";
import { ceramicCoreFactory } from "core/ceramic";
import useCustomColor from "core/hooks/useCustomColor";
import React, { useContext, useEffect } from "react";
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
  const { contracts, mySelf, account, did } = useContext(Web3Context);

    const {
      handleSubmit,
      register,
      formState: { errors, isSubmitting },
      setValue,
    } = useForm();

  useEffect(() => {
    const getProfiles = async () => {
      if (mySelf) {
        const privateProfile = await mySelf.get("privateProfile");
        console.log("privateProfile: ", { privateProfile });
        if (privateProfile) {
          const decrypted = await mySelf.client.ceramic.did?.decryptDagJWE(
            JSON.parse(privateProfile.encrypted)
          );
          if (decrypted) {
            Object.entries(decrypted).forEach(([key, value]) => {
              console.log({ key, value });
              if (["image"].includes(key)) {
                const {
                  // @ts-expect-error
                  original: { src: url },
                } = value;
                const match = url.match(/^ipfs:\/\/(.+)$/);
                if (match) {
                  const ipfsUrl = `//ipfs.io/ipfs/${match[1]}`;
                  if (key === "image") {
                    console.log("image url: ", ipfsUrl);
                  }
                }
              } else {
                setValue(key, value);
              }
            });
          }
        }
      }
    };
    getProfiles();
  }, [mySelf]);

  const onSubmit = async (values: any) => {
    console.log("values from PrivateProfile: ", values);
    try {
      const { data: appDid } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/did`
      );

      const encryptedData = await mySelf.client.ceramic.did?.createDagJWE(values, [
        // logged-in user,
        did,
        // backend ceramic did
        appDid,
      ]);

      const developerTokenURI = await fetch("/api/json-storage", {
        method: "POST",
        body: JSON.stringify({
          did,
        }),
      })
        .then((r) => r.json())
        .then(({ cid, fileName }) => {
          console.log({ cid, fileName });
          return `ipfs://${cid}/${fileName}`;
        });
      console.log({ developerTokenURI });
      
      const tx = await contracts.writeDrecruitContract.mint(
        developerTokenURI,
        0
      );
      const receipt = await tx.wait();
      console.log({ receipt });
      const tokenId = receipt.events[0].args.id.toString();

      await mySelf.client.dataStore.set("privateProfile", {
        tokenURI: developerTokenURI,
        tokenId: parseInt(tokenId, 10),
        encrypted: JSON.stringify(encryptedData),
      });
      nextStep();
    } catch (error) {
      console.log(error);
      return error;
    }
  };

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
            >
              Save
            </Button>
          </Flex>
        </FormControl>
      </Stack>
    </Box>
  );
};

export default EditPrivateProfile;
