import {
  Heading,
  HStack,
  VStack,
  Button,
  Divider,
  Input,
  SimpleGrid,
  Avatar,
  Box,
  Image,
  Spacer,
  Tag,
  Text,
  Icon,
  Grid,
  GridItem
} from "@chakra-ui/react";
import { UnlockIcon, EmailIcon, PhoneIcon, StarIcon } from "@chakra-ui/icons";
import { FaTwitter, FaMapMarkerAlt } from 'react-icons/fa'
import { getProfiles } from "../../../core/helpers";
import { useRouter } from "next/router";

import Container from "../../../components/layout/Container";

const profiles = getProfiles();

const Home = () => {
  const router = useRouter();
  const id = router.query.id;
  const profile = profiles.find(dev => dev.id == id);

  return (
    <Container>
      <VStack w="full" p="8" align="start" spacing="8">
        {profile && (
          <Box>
            <Image
              objectFit="cover"
              height="200px"
              width="100%"
              src={profile.coverSrc}
              alt="cover"
            />
            <HStack width="100%" align="start">
              <VStack mt="-10" paddingX={4} paddingY={6} align="start" width="70%">
                <HStack width="100%">
                  <Avatar src={profile.avatarSrc} size="2xl" />
                  <VStack paddingX={4} paddingY={6} align="start">
                    <Text fontSize="4xl">
                      {profile.emoji} {profile.name}
                    </Text>
                    <Text fontSize="lg" color="purple.200">{profile.description}</Text>
                    <Text fontSize="lg" color="purple.200">
                      <Icon as={FaMapMarkerAlt} /> {profile.city}, {profile.country}
                    </Text>
                  </VStack>
                </HStack>
                <Spacer mt={4} />
                <Heading fontSize="2xl" color="purple.200" pt={5}>
                  Skills
                </Heading>
                <SimpleGrid columns={6} spacing={4}>
                  {profile.skills.map((skill, index) => (
                    <Tag
                      bgColor="purple.600"
                      textAlign="center"
                      size="lg"
                      key={index}
                      minWidth="fit-content"
                    >
                      {skill}
                    </Tag>
                  ))}
                </SimpleGrid>
                <Heading fontSize="2xl" color="purple.200" pt={10} pb={5}>
                  Experiences
                </Heading>
                {profile.experiences.map((exp, index) => (
                  <VStack paddingX={4} paddingY={2} align="start">
                    <Heading fontSize="xl">
                      {exp.title}
                    </Heading>
                    <HStack width="100%" color="purple.200">
                      <Text fontSize="md">
                        {exp.company}
                      </Text>
                      <Icon viewBox='0 0 100 100'>
                        <circle fill='currentColor' cx="50" cy="50" r="15"/>
                      </Icon>
                      <Text fontSize="md">
                        {exp.duration} ({exp.start} - {exp.end})
                      </Text>
                    </HStack>
                    <Text fontSize="md">
                      {exp.description}
                    </Text>
                    <Divider style={{marginTop: 40}} />
                  </VStack>
                ))}
                <Heading fontSize="2xl" color="purple.200" pt={10} pb={5}>
                  Education
                </Heading>
                {profile.educations.map((education, index) => (
                  <VStack paddingX={4} paddingY={2} align="start">
                    <Heading fontSize="xl">
                      {education.school}
                    </Heading>
                    <HStack width="100%" color="purple.200">
                      <Text fontSize="md">
                        {education.title}
                      </Text>
                      <Icon viewBox='0 0 100 100'>
                        <circle fill='currentColor' cx="50" cy="50" r="15"/>
                      </Icon>
                      <Text fontSize="md">
                        {education.duration} ({education.start} - {education.end})
                      </Text>
                    </HStack>
                    <Text fontSize="md">
                      {education.description}
                    </Text>
                    <Divider style={{marginTop: 40}} />
                  </VStack>
                ))}
              </VStack>
              <VStack mt="-14" paddingX={4} paddingY={6} align="start" width="30%">
              <Box border="2px solid" borderColor="purple.700" borderRadius="lg" width="100%">
                <VStack paddingX={4} paddingY={6} spacing={6} align="start">
                  <Heading fontSize="2xl" color="purple.300">
                    Contact Info
                  </Heading>
                  <Text fontSize="lg" color="purple.200">
                    <EmailIcon /> {profile.isUnlocked ? profile.email : "Locked"}
                  </Text>
                  <Text fontSize="lg" color="purple.200">
                    <PhoneIcon /> {profile.isUnlocked ? profile.phone : "Locked"}
                  </Text>
                  <Text fontSize="lg" color="purple.200">
                    <Icon as={FaTwitter} /> {profile.isUnlocked ? profile.twitter : "Locked"}
                  </Text>
                  {!profile.isUnlocked && (
                    <Button bgColor="yellow.200" style={{margin: "0 auto", marginTop: 20}}>Unlock Contact</Button>
                  )}
                </VStack>
              </Box>
              </VStack>
            </HStack>
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default Home;
