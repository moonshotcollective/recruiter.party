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
import { UnlockIcon } from "@chakra-ui/icons";
import useCustomColor from "core/hooks/useCustomColor";
import { useRouter } from 'next/router'
import ApproveUnlockProfile from "components/Profile/ApproveUnlock";

export interface RecruiterCardProps {
  name: string;
  emoji: string;
  coverSrc: string;
  avatarSrc: string;
  city: string;
  country: string;
  description: string;
  did: string;
  address: string;
  approve: boolean;
  currentPrivateProfileTokenId: number;
}

export const RecruiterCard = ({
  name,
  emoji,
  coverSrc,
  avatarSrc,
  city,
  country,
  description,
  did,
  address,
  approve,
  currentPrivateProfileTokenId
}: RecruiterCardProps) => {
  const { accentColor } = useCustomColor();
  const router = useRouter()

  return (
    <Box
      border="2px solid"
      borderColor="purple.700"
      borderRadius="lg"
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
          <Avatar
            src={avatarSrc}
            size="xl"
            _hover={{ cursor: "pointer" }}
            onClick={() => router.push(`/profile/${did}`)}
          />
        </HStack>
        <Spacer mt={4} />
        <Text
          color={accentColor}
          _hover={{ cursor: "pointer" }}
          onClick={() => router.push(`/profile/${did}`)}
        >
          {emoji} {name}
        </Text>
        <Text fontSize="md">{description}</Text>
        <Spacer mt={4} />
        <Text fontSize="md">
          {city}
          {city && country && ", "} {country}
        </Text>
        <Spacer mt={4} />
        {approve && (
          <ApproveUnlockProfile recruiterAddress={address} currentPrivateProfileTokenId={currentPrivateProfileTokenId} />
        )}
      </VStack>
    </Box>
  );
};
