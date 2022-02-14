import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Image,
  Input,
  Select,
  Spacer,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import axios from "axios";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useForm } from "react-hook-form";

import { emojis } from "../../../helpers";
import { COUNTRIES } from "../../../helpers/countries";
import { Web3Context } from "../../contexts/Web3Provider";
import { ceramicCoreFactory } from "core/ceramic";
import useCustomColor from "core/hooks/useCustomColor";

interface EditBasicProfileProps {
  nextStep: () => void;
  prevStep: () => void;
  activeStep: number;
  existingUser: boolean;
}

const EditBasicProfile = ({
  nextStep,
  prevStep,
  activeStep,
  existingUser,
}: EditBasicProfileProps) => {
  const { mySelf } = useContext(Web3Context);
  const { accentColor } = useCustomColor();
  const [imageURL, setImageURL] = useState<string>("");
  const [backgroundURL, setBackgroundURL] = useState<string>("");
  const image = useRef(null);
  const background = useRef(null);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm();

  const onFileChange = useCallback((event) => {
    const input = event.target;
    const file = input.files?.[0];
    if (!file) return;
    const img = image.current;
    const bg = background.current;
    if (!img || !bg) return;
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      console.log(reader.result); // eslint-disable-line no-console
      if (input.name === "image") {
        // @ts-expect-error
        img.src = reader.result;
      }
      if (input.name === "background") {
        // @ts-expect-error
        bg.src = reader.result;
      }
    });
    reader.readAsDataURL(file);
  }, []);

  // fetch data from ceramic
  useEffect(() => {
    const getProfiles = async () => {
      if (mySelf) {
        const basicProfile = await mySelf.get("basicProfile");
        console.log("basicProfile: ", { basicProfile });
        if (!basicProfile) return;
        Object.entries(basicProfile).forEach(([key, value]) => {
          console.log({ key, value });
          if (["image", "background"].includes(key)) {
            const {
              // @ts-expect-error
              original: { src: url },
            } = value;
            const match = url.match(/^ipfs:\/\/(.+)$/);
            if (match) {
              const ipfsUrl = `//ipfs.io/ipfs/${match[1]}`;
              if (key === "image") {
                setImageURL(ipfsUrl);
              }
              if (key === "background") {
                setBackgroundURL(ipfsUrl);
              }
            }
          } else {
            setValue(key, value);
          }
        });
      }
    };
    getProfiles();
  }, [mySelf]);

  const onSubmit = async (values: any) => {
    console.log("values from onSubmit: ", { values });
    try {
      const formData = new FormData();
      formData.append("type", "image/*");
      const [imageFile] = values.image;
      const [backgroundFile] = values.background;
      if (imageFile || backgroundFile) {
        if (image && imageFile) {
          formData.append("image", imageFile);
        }
        if (background && backgroundFile) {
          formData.append("background", backgroundFile);
        }
        const cids = await fetch("/api/image-storage", {
          method: "POST",
          body: formData,
        })
          .then((r) => r.json())
          .then((response) => {
            return response.cids;
          });
        const refs = { image: image.current, background: background.current };

        ["image", "background"].forEach((key) => {
          console.log(cids[key]);
          if (cids[key]) {
            values[key] = {
              original: {
                src: `ipfs://${cids[key]}`,
                mimeType: "image/*",
                // TODO: change hardcoded width & height
                width: 200,
                height: 200,
              },
            };
          } else {
            delete values[key];
          }
        });
      }

      if (values.residenceCountry === "") {
        delete values.residenceCountry;
      }
      if (values.birthDate === "") {
        delete values.birthDate;
      }
      if (!imageFile) {
        delete values.image;
      }
      if (!backgroundFile) {
        delete values.background;
      }

      await mySelf.client.dataStore.merge("basicProfile", values);

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
      console.log("Error while saving BasicProfile: ", error);
      alert("Error while saving data");
    }
  };

  return (
    <Box as="main" w="full">
      <Stack as="form" onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={errors.name}>
          <FormLabel htmlFor="name">Name</FormLabel>
          <Input
            placeholder="anon"
            borderColor="purple.500"
            {...register("name", {
              maxLength: {
                value: 150,
                message: "Maximum length should be 150",
              },
            })}
          />
          <FormErrorMessage>
            {errors.name && errors.name.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.image}>
          <FormLabel htmlFor="image">Profile Image</FormLabel>
          <Image ref={image} src={imageURL} />
          <Input
            borderColor="purple.500"
            type="file"
            defaultValue=""
            // @ts-expect-error
            ref={register}
            placeholder="image"
            {...register("image")}
            name="image"
            onChange={onFileChange}
          />
          <FormErrorMessage>
            {errors.image && errors.image.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.background}>
          <FormLabel htmlFor="background">Header Background</FormLabel>
          <Image ref={background} src={backgroundURL} />
          <Input
            type="file"
            {...register("background")}
            borderColor="purple.500"
            defaultValue=""
            onChange={onFileChange}
            placeholder="background"
          />
          <FormErrorMessage>
            {errors.background && errors.background.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl>
          <FormLabel>Description</FormLabel>
          <Textarea
            borderColor="purple.500"
            placeholder="Web3 and Blockchain enthusiast"
            {...register("description", {
              maxLength: {
                value: 420,
                message: "Maximum length should be 420",
              },
            })}
          />
          <FormErrorMessage>
            {errors.description && errors.description.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.emoji}>
          <FormLabel>emoji</FormLabel>
          <Select
            borderColor="purple.500"
            {...register("emoji")}
            placeholder="Select an emoji"
          >
            {emojis.map((emoji) => (
              <option value={emoji} key={emoji}>
                {emoji}
              </option>
            ))}
          </Select>
          <FormErrorMessage>
            {errors.emoji && errors.emoji.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.birthDate}>
          <FormLabel htmlFor="birthDate">Birthdate</FormLabel>
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
            placeholder="birthDate"
            {...register("birthDate")}
          />
          <FormErrorMessage>
            {errors.birthDate && errors.birthDate.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.url}>
          <FormLabel htmlFor="url">Website</FormLabel>
          <Input
            placeholder="ens-or-website.eth"
            borderColor="purple.500"
            {...register("url", {
              maxLength: 240,
            })}
          />
          <FormErrorMessage>
            {errors.url && errors.url.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.homeLocation}>
          <FormLabel htmlFor="homeLocation">Location</FormLabel>
          <Input
            placeholder="London"
            borderColor="purple.500"
            {...register("homeLocation", {
              maxLength: 140,
            })}
          />
          <FormErrorMessage>
            {errors.homeLocation && errors.homeLocation.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.residenceCountry}>
          <FormLabel htmlFor="residenceCountry">Country</FormLabel>
          <Select
            placeholder="Select your country of residence"
            borderColor="purple.500"
            {...register("residenceCountry")}
          >
            {COUNTRIES.map(({ name, iso2 }: { name: string; iso2: string }) => (
              <option value={iso2} key={iso2}>
                {name}
              </option>
            ))}
          </Select>
          <FormErrorMessage>
            {errors.residenceCountry && errors.residenceCountry.message}
          </FormErrorMessage>
        </FormControl>
        <Flex mt={6}>
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
            isLoading={isSubmitting}
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
            Save
          </Button>
        </Flex>
      </Stack>
    </Box>
  );
};

export default EditBasicProfile;
