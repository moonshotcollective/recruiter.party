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
import { Web3Context } from "../../contexts/Web3Provider";
import { ceramicCoreFactory } from "core/ceramic";
import useCustomColor from "core/hooks/useCustomColor";
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

interface EditBasicProfileProps {
  nextStep: () => void;
  prevStep: () => void;
  activeStep: number;
}

const EditBasicProfile = ({
  nextStep,
  prevStep,
  activeStep,
}: EditBasicProfileProps) => {
  const { contracts } = useContext(Web3Context);
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
      if (contracts) {
        const did =
          "did:3:kjzl6cwe1jw149z5serhpr3dmdrg5h67bdwe259m2o7z7pn8d7e6cuc0stz7z0s";

        const core = ceramicCoreFactory();
        const basicProfile = await core.get("basicProfile", did);
        console.log("basicProfile: ", { basicProfile });

        // @ts-expect-error
        const publicProfile = await core.get("publicProfile", did);
        console.log("publicProfile: ", { publicProfile });

        // @ts-expect-error
        const privateProfile = await core.get("privateProfile", did);
        console.log("privateProfile: ", { privateProfile });
      }
    };
    getProfiles();
  }, []);

  return (
    <Box as="main" w={"full"}>
      <Stack as="form" onSubmit={() => {}}>
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
            // name="image"
            borderColor="purple.500"
            type="file"
            defaultValue=""
            // onChange={onFileChange}
            placeholder="image"
            {...(register("image"), (onchange = onFileChange))}
          />
          <FormErrorMessage>
            {errors.image && errors.image.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.background}>
          <FormLabel htmlFor="background">Header Background</FormLabel>
          <Image ref={background} src={backgroundURL} />
          <Input
            borderColor="purple.500"
            type={"file"}
            placeholder="background"
            {...(register("background"), (onchange = onFileChange))}
          />
          <FormErrorMessage>
            {errors.background && errors.background.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl>
          <FormLabel>Description</FormLabel>
          <Textarea
            borderColor="purple.500"
            type={"text"}
            placeholder="Web3 and Blockchain enthusiast"
            // value={description}
            // onChange={(e) => setDescription(e.target.value)}
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
          <Input
            type="date"
            borderColor="purple.500"
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
      </Stack>
      <Flex mt={6}>
        <Spacer />
        <Button
          _hover={{
            backgroundColor: "transparent",
            borderColor: accentColor,
            borderWidth: "1px",
            color: accentColor,
          }}
          onClick={nextStep}
          mr={2}
          backgroundColor={accentColor}
          color="purple.500"
        >
          Next
        </Button>
      </Flex>
    </Box>
  );
};

export default EditBasicProfile;
