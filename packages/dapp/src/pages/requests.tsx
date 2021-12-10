import {
  Heading,
  HStack,
  VStack,
  Button,
  Divider,
  Input,
  SimpleGrid,
} from "@chakra-ui/react";
import { getProfiles } from "../core/helpers";
import { ProfileCard, ProfileCardProps } from "components/ProfileCard";
import { useRouter } from "next/router";

import Container from "../components/layout/Container";

const profiles: ProfileCardProps[] = getProfiles();

const Requests = () => {
  const router = useRouter();

  function goTo(destination: string) {
    router.push(destination);
  }
  return (
    <Container>
      <VStack w="full" p="8" align="start" spacing="8">
        <Heading fontSize="4xl" mb={-6}>
          Requests
        </Heading>
        <Heading
          fontSize="xl"
          color="purple.500"
          width="600px"
          lineHeight="8"
          fontWeight={"normal"}
        >
          Lorem ipsum dolor sit amet, consectetur adipisicing elit
        </Heading>

        <SimpleGrid width="100%" columns={3} spacing={6}>
          {profiles.filter((profile) => !profile.isUnlocked).map((profile) => (
            <ProfileCard {...profile} key={profile.avatarSrc} approve={true} />
          ))}
        </SimpleGrid>
      </VStack>
    </Container>
  );
};

export default Requests;
