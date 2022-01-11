import {
  Heading,
  HStack,
  VStack,
  Button,
  Divider,
  Input,
  SimpleGrid,
} from "@chakra-ui/react";
import { RecruiterCard } from "components/Profile/RecruiterCard";
import { Web3Context } from "../contexts/Web3Provider";
import React, { useContext, useEffect, useState } from "react";
import { ceramicCoreFactory } from "core/ceramic";
import { useWeb3React } from '@web3-react/core';
import { IPFS_GATEWAY } from "core/constants";

import Container from "../components/layout/Container";

const Requests = () => {
  const { account, contracts, mySelf } = useContext(Web3Context);
  const [myPrivateProfile, setMyPrivateProfile] = useState();
  const [requesters, setRequesters] = useState();
  const [recruiters, setRecruiters] = useState([]);
  const { chainId } = useWeb3React();

  const profiles = [];

  const init = async () => {
    if (mySelf) {
      const privateProfile = await mySelf.get("privateProfile");
      if (!privateProfile) {
        return;
      }
      setMyPrivateProfile(privateProfile);
      const reqs = await contracts.readDrecruitContract.getRequesters(privateProfile.tokenId);
      setRequesters(reqs);
      const core = ceramicCoreFactory();
      const recruiterDIDs = await Promise.allSettled(
        reqs.map(recruiterAddress => core.getAccountDID(`${recruiterAddress}@eip155:${chainId}`)),
      );

      const recruiterProfiles = await Promise.all(
        recruiterDIDs.map(async (did, idx) => {
          if (did.status == "fulfilled") {
            const profile = await core.get("basicProfile", did.value);
            const formattedAvatar =
              profile && profile.image ? IPFS_GATEWAY + profile.image.original.src.split("//")[1] : "https://source.unsplash.com/random";
            const formattedCover =
              profile && profile.background ? IPFS_GATEWAY + profile.background?.original.src.split("//")[1] : "https://source.unsplash.com/random";
            return {
              address: reqs[idx],
              ...profile,
              avatarSrc: formattedAvatar,
              coverSrc: formattedCover,
            };
          } else {
            return {
              address: reqs[idx],
            };
          }
        }),
      );
      setRecruiters(recruiterProfiles);
    }
  };
  useEffect(() => {
    init();
  }, [account]);

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
          {recruiters.map((profile) => (
            <RecruiterCard {...profile} key={profile.did} approve={true} currentPrivateProfileTokenId={myPrivateProfile.tokenId} />
          ))}
        </SimpleGrid>
      </VStack>
    </Container>
  );
};

export default Requests;