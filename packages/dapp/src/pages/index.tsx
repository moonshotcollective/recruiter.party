import { RepeatIcon } from "@chakra-ui/icons";
import { HStack, IconButton, Text, VStack } from "@chakra-ui/react";
import { Title } from "@scaffold-eth/ui";
import { useWeb3React } from "@web3-react/core";
import ContractFields from "components/custom/ContractFields";
import React, { useContext, useEffect, useState } from "react";
import Faucet from "../components/custom/Faucet";
import { Web3Context } from "../contexts/Web3Provider";
import { hexToString } from "../core/helpers";
import { ceramicCoreFactory } from "core/ceramic";
import { getDidFromTokenURI } from "../../helpers";
import { ERC20ABI } from "../../helpers/abi";
import useCustomColor from "../core/hooks/useCustomColor";
import { ethers } from "ethers";

interface DevProfiles {
  did: any;
  basicProfile: any;
  cryptoAccounts: any;
  webAccounts: any;
  publicProfile: any;
  privateProfile: any;
}

const Home = () => {
  const { account, contracts, tokenContract } = useContext(Web3Context);
  const { library } = useWeb3React();
  const { coloredText, accentColor } = useCustomColor();
  const [yourBalance, setYourBalance] = useState("");
  const [developerProfiles, setDeveloperProfiles] = useState<DevProfiles[]>([]);
  const [tokenMetadata, setTokenMetadata] = useState({
    name: null,
    symbol: null,
  });
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);

  const getEthBalance = async () => {
    if (library && account) {
      const res = await library?.getBalance(account);
      const balance = hexToString(res);
      setYourBalance(balance);
      // console.log(`balance`, balance);
    }
  };

  const init = async () => {
    if (library && library.getSigner() && contracts && tokenContract) {
      try {
        const tokenName = await tokenContract.readTokenContract.name();
        console.log(`tokenName: `, { tokenName });
        const tokenSymbol = await tokenContract.readTokenContract.symbol();
        console.log(`tokenSymbol: `, { tokenSymbol });
        setTokenMetadata({ name: tokenName, symbol: tokenSymbol });
        const lastTokenId = await contracts.readDrecruitContract.tokenId();
        const tokenIds = [...Array(parseInt(lastTokenId, 10)).keys()];
        const tokenURIs = await Promise.all(
          tokenIds.map(async (id) => contracts.uri(id))
        );
        const developersDID = [
          ...new Set(tokenURIs.map((uri) => getDidFromTokenURI(uri).did)),
        ];
        const core = ceramicCoreFactory();
        const devProfiles = await Promise.all(
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
        setIsAlertOpen(true);
      }
    }
  };

  useEffect(() => {
    init();
  }, [contracts ,tokenContract]);

  useEffect(() => {
    getEthBalance();
  }, [account, library]);

  return (
    <VStack>
      <HStack align="center" w="full">
        <Title color={accentColor}>Title</Title>
      </HStack>
      <Text textStyle="h2">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dignissimos
        esse rerum doloremque eligendi tenetur reprehenderit consequuntur
        adipisci officia amet quam architecto, commodi deserunt neque debitis
        porro non iusto asperiores molestiae!
      </Text>
      <Text color={coloredText}>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dignissimos
        esse rerum doloremque eligendi tenetur reprehenderit consequuntur
        adipisci officia amet quam architecto, commodi deserunt neque debitis
        porro non iusto asperiores molestiae!
      </Text>
      <HStack>
        <Text>Your Balance: {yourBalance}Ξ</Text>
        <IconButton
          onClick={getEthBalance}
          aria-label="refresh"
          icon={<RepeatIcon />}
        />
      </HStack>
      <ContractFields />
      <Faucet />
    </VStack>
  );
};

export default Home;
