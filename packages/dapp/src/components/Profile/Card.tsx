import { UnlockIcon } from "@chakra-ui/icons";
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
} from "@chakra-ui/react";
import { useRouter } from "next/router";

import useCustomColor from "core/hooks/useCustomColor";

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
  did: string;
}

export const ProfileCard = ({
  name,
  emoji,
  coverSrc,
  avatarSrc,
  isUnlocked,
  city,
  country,
  skills,
  description,
  did,
}: ProfileCardProps) => {
  const { accentColor } = useCustomColor();
  const router = useRouter();

  return (
    <Box
      border="2px solid"
      borderColor="purple.700"
      borderRadius="lg"
      _hover={{ cursor: "pointer" }}
      onClick={() => router.push(`/profile/${did}`)}
    >
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
        <Text color={accentColor}>
          {emoji} {name}
        </Text>
        <Text fontSize="md">{description}</Text>
        <Spacer mt={4} />
        <Text fontSize="md">
          {city}
          {city && country && ", "} {country}
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
      </VStack>
    </Box>
  );
};
