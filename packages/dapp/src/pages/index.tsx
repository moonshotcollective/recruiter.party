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

const Home = () => {
  const router = useRouter();

  function goTo(destination: string) {
    router.push(destination);
  }
  return (
    <Container>
      <VStack w="full" p="8" align="start" spacing="8">
        <Heading fontSize="4xl" mb={-6}>
          Recruiter.Party <span className="dot"></span>
        </Heading>
        <Heading
          fontSize="xl"
          color="purple.500"
          width="600px"
          lineHeight="8"
          fontWeight={"normal"}
        >
          Lorem ipsum dolor sit amet
          <br />
          consectetur adipisicing elit
        </Heading>
        <HStack>
          <Button textTransform="none" bgColor="yellow.200">
            Join as a Developer
          </Button>
          <Button
            textTransform="none"
            textColor="yellow.200"
            borderColor="yellow.200"
            variant="outline"
            onClick={() => {
              goTo('/requests');
            }}
          >
            View Requests
          </Button>
        </HStack>

        <Divider />

        <HStack align="start" justify="space-between" width="100%">
          <VStack align="start" maxWidth="50%">
            <Heading fontSize="2xl" color="yellow.200">
              Browse Developers
            </Heading>
            <Heading fontSize="md" color="purple.500" fontWeight="normal">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit
            </Heading>
          </VStack>
          <Input borderColor="purple.600" placeholder="Search" width="30%" />
        </HStack>

        <SimpleGrid width="100%" columns={3} spacing={6}>
          {profiles.map((profile) => (
            <ProfileCard {...profile} key={profile.avatarSrc} />
          ))}
        </SimpleGrid>
      </VStack>
    </Container>
  );
};

export default Home;
