import {
  Button,
  Container,
  Divider,
  Heading,
  HStack,
  Input,
  SimpleGrid,
  VStack,
  Spinner,
  Text,
  Image,
  FormControl,
  FormLabel,
  Box,
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Web3Context } from "../contexts/Web3Provider";
import { hexToString } from "../core/helpers";
import { ceramicCoreFactory } from "core/ceramic";
import { getDidFromTokenURI } from "../../helpers";
import useCustomColor from "../core/hooks/useCustomColor";
import { ProfileCard } from "components/Profile/Card";
import { IPFS_GATEWAY } from "core/constants";
import NextImage from "next/image";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";

const convertToSentenceCase = (str: string) => {
  const result = str.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
};

interface DevProfiles {
  did: string;
  basicProfile: {
    birthDate: string;
    description: string;
    emoji: string;
    homeLocation: string;
    image: {
      original: {
        src: string;
        height: number;
        width: number;
        mimeType: string;
      };
    };
    background?: {
      original: {
        src: string;
        height: number;
        width: number;
        mimeType: string;
      };
    };
    name: string;
    residenceCountry: string;
    url: string;
  };
  cryptoAccounts: {
    [key: string]: string;
  };
  webAccounts: any;
  publicProfile: any;
  privateProfile: any;
}

interface SearchFieldProps {
  value: { [key: string]: string | number };
  setValue: React.Dispatch<
    React.SetStateAction<{
      [key: string]: string | number;
    }>
  >;
  fieldName: string;
  label?: string;
}

const SearchField: React.FC<SearchFieldProps> = ({
  value,
  setValue,
  fieldName,
  label,
}) => {
  return (
    <Box>
      <FormLabel htmlFor={fieldName}>
        {label || convertToSentenceCase(fieldName)}
      </FormLabel>
      <Input
        id={fieldName}
        value={value[fieldName]}
        onChange={(e) => {
          setValue((d) => {
            return {
              ...d,
              [fieldName]: e.target.value,
            };
          });
        }}
      />
    </Box>
  );
};

const Home = () => {
  const { account, contracts } = useContext(Web3Context);
  const router = useRouter();
  const { library } = useWeb3React();
  const { coloredText, accentColor } = useCustomColor();
  const [yourBalance, setYourBalance] = useState("");
  const [developerProfiles, setDeveloperProfiles] = useState<DevProfiles[]>([]);
  const [tokenMetadata, setTokenMetadata] = useState({
    name: null,
    symbol: null,
  });
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [profilesLoading, setProfilesLoading] = React.useState(true);
  const [error, setError] = React.useState<unknown>();
  const [searchProfilesText, setSearchProfilesText] = React.useState("");
  const [showAdvancedSearch, setShowAdvancedSearch] = React.useState(false);
  const [searchFields, setSearchFields] = React.useState<{
    [key: string]: string | number;
  }>({});

  const getEthBalance = async () => {
    if (library && account) {
      const res = await library?.getBalance(account);
      const balance = hexToString(res);
      setYourBalance(balance);
      // console.log(`balance`, balance);
    }
  };

  const init = async () => {
    if (library && library.getSigner() && contracts) {
      try {
        const tokenName = await contracts.readTokenContract.name();
        console.log(`tokenName: `, { tokenName });
        const tokenSymbol = await contracts.readTokenContract.symbol();
        console.log(`tokenSymbol: `, { tokenSymbol });
        setTokenMetadata({ name: tokenName, symbol: tokenSymbol });
        const lastTokenId = await contracts.readDrecruitContract.tokenId();
        const tokenIds = [...Array(parseInt(lastTokenId, 10)).keys()];
        const tokenURIs = await Promise.all(
          tokenIds.map(async (id) => contracts.readDrecruitContract.uri(id))
        );
        const developersDID = [
          ...new Set(tokenURIs.map((uri) => getDidFromTokenURI(uri).did)),
        ];
        const core = ceramicCoreFactory();
        // @ts-expect-error
        const devProfiles: DevProfiles[] = await Promise.all(
          developersDID.map(async (did) => ({
            did,
            basicProfile: await core.get("basicProfile", did),
            cryptoAccounts: await core.get("cryptoAccounts", did),
            webAccounts: await core.get("alsoKnownAs", did),
            // @ts-expect-error
            publicProfile: await core.get("publicProfile", did),
            // @ts-expect-error
            privateProfile: await core.get("privateProfile", did),
          }))
        );
        console.log(`devProfiles`, devProfiles);
        setDeveloperProfiles(devProfiles);
      } catch (error) {
        console.log("Error in init function: ", error);
        setError(error);
        setIsAlertOpen(true);
      } finally {
        setProfilesLoading(false);
      }
    }
  };

  useEffect(() => {
    init();
  }, [contracts]);

  useEffect(() => {
    getEthBalance();
  }, [account, library]);

  const generateQueryString = useMemo(() => {
    const arr = [];
    let op = "";
    for (let key in searchFields) {
      if (searchFields[key]) {
        arr.push(`${key}: "${searchFields[key]}"`);
      }
    }
    return arr.join(",");
  }, [searchFields]);

  const GET_PROFILES_QUERY = gql`
    query GetProfiles($searchText: String) {
      profiles(search: $searchText, ${generateQueryString}) {
        tokenId
        did
        basicProfile {
          name
          homeLocation
          residenceCountry
          description
          background {
            original {
              src
            }
          }
          emoji
          image {
            original {
              src
            }
          }
        }
        publicProfile {
          skillTags
        }
      }
    }
  `;

  const queryResult = useQuery(GET_PROFILES_QUERY, {
    variables: { searchText: searchProfilesText },
  });

  return (
    <>
      <VStack w="full" p="8" align="start" spacing="8">
        <HStack
          style={{ display: "flex", gap: "20px", justifyContent: "center" }}
        >
          <Heading fontSize="4xl" color={accentColor}>
            Recruiter.Party{" "}
          </Heading>
          <NextImage src="/white-circle.png" width="50px" height="50px" />
        </HStack>
        <Heading
          fontSize="xl"
          color={coloredText}
          width="600px"
          lineHeight="8"
          fontWeight={"normal"}
        >
          Lorem ipsum dolor sit amet
          <br />
          consectetur adipisicing elit
        </Heading>
        <HStack>
          <Button
            textTransform="none"
            bgColor={accentColor}
            onClick={() => router.push("/profile/edit")}
          >
            Join as a Developer
          </Button>
          <Button
            textTransform="none"
            textColor={accentColor}
            borderColor={accentColor}
            variant="outline"
            onClick={() => router.push("/requests")}
          >
            View Requests
          </Button>
        </HStack>

        <Divider />

        <HStack align="start" justify="space-between" width="100%">
          <VStack align="start" maxWidth="50%">
            <Heading fontSize="2xl" color={accentColor}>
              Browse Developers
            </Heading>
            <Heading fontSize="md" color={coloredText} fontWeight="normal">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit
            </Heading>
          </VStack>
          <Input
            borderColor={coloredText}
            placeholder="Search"
            width="30%"
            value={searchProfilesText}
            onChange={(e) => setSearchProfilesText(e.target.value)}
          />
          <Button onClick={() => setShowAdvancedSearch((t) => !t)}>
            {showAdvancedSearch ? "Hide " : "Show "} Advanced search
          </Button>
        </HStack>

        {showAdvancedSearch && (
          <form>
            <VStack>
              <FormControl>
                <SimpleGrid columns={3} spacing={6}>
                  <SearchField
                    value={searchFields}
                    setValue={setSearchFields}
                    fieldName="skills"
                  />

                  <SearchField
                    value={searchFields}
                    setValue={setSearchFields}
                    fieldName="residenceCountry"
                  />

                  <SearchField
                    value={searchFields}
                    setValue={setSearchFields}
                    fieldName="homeLocation"
                  />

                  <SearchField
                    value={searchFields}
                    setValue={setSearchFields}
                    fieldName="educationInstitution"
                  />

                  <SearchField
                    value={searchFields}
                    setValue={setSearchFields}
                    fieldName="educationTitle"
                  />

                  <SearchField
                    value={searchFields}
                    setValue={setSearchFields}
                    fieldName="experienceCompany"
                  />

                  <SearchField
                    value={searchFields}
                    setValue={setSearchFields}
                    fieldName="experienceTitle"
                  />
                </SimpleGrid>
              </FormControl>
            </VStack>
          </form>
        )}

        {error && (
          <Text color="red">An error has occured. Please try again.</Text>
        )}

        {queryResult.loading ? (
          <Spinner />
        ) : queryResult.data?.profiles.length > 0 ? (
          <SimpleGrid width="100%" columns={3} spacing={6}>
            {queryResult.data.profiles.map((profile: any) => (
              <ProfileCard
                key={profile.tokenId}
                avatarSrc={
                  profile.basicProfile && profile.basicProfile.image
                    ? IPFS_GATEWAY +
                      profile.basicProfile.image.original.src.split("//")[1]
                    : "https://source.unsplash.com/random"
                }
                name={
                  profile.basicProfile ? profile.basicProfile.name : "Anonymous"
                }
                city={profile.basicProfile && profile.basicProfile.homeLocation}
                country={
                  profile.basicProfile && profile.basicProfile.residenceCountry
                }
                description={
                  profile.basicProfile && profile.basicProfile.description
                }
                coverSrc={
                  profile.basicProfile && profile.basicProfile.background
                    ? IPFS_GATEWAY +
                      profile.basicProfile.background?.original.src.split(
                        "//"
                      )[1]
                    : "https://source.unsplash.com/random"
                }
                isUnlocked={false}
                skills={profile.publicProfile?.skillTags ?? []}
                did={profile.did}
                emoji={profile.basicProfile && profile.basicProfile.emoji}
              />
            ))}
          </SimpleGrid>
        ) : (
          <Text color={accentColor}>No Results.</Text>
        )}
      </VStack>
    </>
  );
};

export default Home;
