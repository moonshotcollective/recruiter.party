import {
  Heading,
  HStack,
  VStack,
  Button,
  Divider,
  Input,
  SimpleGrid,
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import React, { useContext, useEffect, useState } from "react";

import Container from "../components/layout/Container";
import { Web3Context } from "../contexts/Web3Provider";
import { RecruiterCard } from "components/Profile/RecruiterCard";
import { ceramicCoreFactory } from "core/ceramic";
import { IPFS_GATEWAY } from "core/constants";

const Requests = () => {
  const { account, contracts, mySelf } = useContext(Web3Context);
  const [myPrivateProfile, setMyPrivateProfile] =
    useState<{ tokenId: number }>();
  const [requesters, setRequesters] = useState();
  const [recruiters, setRecruiters] = useState<any[]>([]);
  const { chainId } = useWeb3React();

  const profiles = [];

  const init = async () => {
    if (mySelf && contracts) {
      const privateProfile = await mySelf.get("privateProfile");
      if (!privateProfile) {
        return;
      }
      setMyPrivateProfile(privateProfile);
      const reqs = await contracts.readDrecruitContract.getRequesters(
        privateProfile.tokenId
      );
      setRequesters(reqs);
      const core = ceramicCoreFactory();
      const recruiterDIDs = await Promise.allSettled(
        reqs.map((recruiterAddress: string) =>
          core.getAccountDID(`${recruiterAddress}@eip155:${chainId}`)
        )
      );

      const recruiterProfiles = await Promise.all(
        // @ts-ignore
        recruiterDIDs.map(async (did, idx) => {
          if (did.status == "fulfilled") {
            const profile = await core.get("basicProfile", did.value);
            const formattedAvatar =
              profile && profile.image
                ? IPFS_GATEWAY + profile.image.original.src.split("//")[1]
                : "https://source.unsplash.com/random";
            const formattedCover =
              profile && profile.background
                ? IPFS_GATEWAY + profile.background?.original.src.split("//")[1]
                : "https://source.unsplash.com/random";
            return {
              address: reqs[idx],
              ...profile,
              avatarSrc: formattedAvatar,
              coverSrc: formattedCover,
              did: did.value,
            };
          }
          return {
            address: reqs[idx],
          };
        })
      );
      console.log("recruiterProfiles: ", recruiterProfiles);
      setRecruiters(recruiterProfiles);
    }
  };
  useEffect(() => {
    init();
  }, [account, mySelf, contracts]);

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
          fontWeight="normal"
        >
          Lorem ipsum dolor sit amet, consectetur adipisicing elit
        </Heading>

        <SimpleGrid width="100%" columns={3} spacing={6}>
          {recruiters.map((profile) => (
            <RecruiterCard
              {...profile}
              key={profile.did}
              approve
              currentPrivateProfileTokenId={myPrivateProfile?.tokenId}
            />
          ))}
        </SimpleGrid>
      </VStack>
    </Container>
  );
};

export default Requests;
