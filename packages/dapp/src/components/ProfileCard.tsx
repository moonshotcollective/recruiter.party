import {
  Avatar,
  Box,
  HStack,
  Image,
  SimpleGrid,
  Spacer,
  Tag,
  Text,
  VStack,
  Button,
} from "@chakra-ui/react";
import { UnlockIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";

export interface ProfileCardProps {
  name: string;
  emoji: string;
  coverSrc: string;
  avatarSrc: string;
  isUnlocked: boolean;
  city: string;
  country: string;
  skills: string[];
  description: string;
}

export const ProfileCard = ({
  id,
  name,
  emoji,
  coverSrc,
  avatarSrc,
  isUnlocked,
  city,
  country,
  skills,
  description,
  approve
}: ProfileCardProps) => {
  const router = useRouter();

  return (
    <Box border="2px solid" borderColor="purple.700" borderRadius="lg">
      <Image
        objectFit="cover"
        height="100px"
        width="100%"
        src={coverSrc}
        alt="cover"
      />
      <VStack mt="-14" paddingX={4} paddingY={6} align="start">
        <HStack justify="space-between" width="100%">
          <Avatar src={avatarSrc} size="xl" />
          {isUnlocked && (
            <Text fontSize="sm" color="green.300">
              <UnlockIcon /> Unlocked
            </Text>
          )}
        </HStack>
        <Spacer mt={4} />
        <Text color="yellow.200">
          {emoji}
          <a href="#" onClick={() => router.push("/profile/" + id)}>
            {name}
          </a>
        </Text>
        <Text fontSize="md">{description}</Text>
        <Spacer mt={4} />
        <Text fontSize="md">
          {city}, {country}
        </Text>
        <Spacer mt={4} />
        <SimpleGrid columns={3} spacing={4}>
          {skills.map((skill, index) => (
            <Tag
              bgColor="purple.600"
              textAlign="center"
              size="md"
              key={index}
              minWidth="fit-content"
            >
              {skill}
            </Tag>
          ))}
        </SimpleGrid>
        {approve && (
          <VStack paddingY={6} width="100%" align="start">
            <Text fontSize="lg" color="yellow.200">0.2 MATIC</Text>
            <HStack pt={6} justify="end" width="100%">
              <Button colorScheme="yellow">Approve</Button>
            </HStack>
          </VStack>
        )}
      </VStack>
    </Box>
  );
};
