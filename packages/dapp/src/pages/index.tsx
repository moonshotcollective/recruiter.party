import { RepeatIcon } from "@chakra-ui/icons";
import { HStack, IconButton, Text, VStack } from "@chakra-ui/react";
import { Title } from "@scaffold-eth/ui";
import { useWeb3React } from '@web3-react/core';
import ContractFields from "components/custom/ContractFields";
import React, { useContext, useEffect, useState } from "react";
import Faucet from "../components/custom/Faucet";
import { Web3Context } from "../contexts/Web3Provider";
import { hexToString } from "../core/helpers";
import useCustomColor from "../core/hooks/useCustomColor";
import {
  loadDRecruitV1Contract,
  loadTokenContract,
  getDidFromTokenURI,
} from "../../helpers";
import { ceramicCoreFactory } from "core/ceramic";
import { Contract } from "ethers";

const Home = () => {
  const { account, provider, targetNetwork } = useContext(Web3Context);
  const context = useContext(Web3Context);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const { library } = useWeb3React();
  const { coloredText, accentColor } = useCustomColor();
  const [yourBalance, setYourBalance] = useState("");
  const [dRecruitContract, setDRecruitContract] = useState<Contract | undefined>();
  const [tokenContract, setTokenContract] = useState<Contract | undefined>();
  const [tokenMetadata, setTokenMetadata] = useState({
    name: null,
    symbol: null,
  });
  const [developerProfiles, setDeveloperProfiles] = useState<
    {
      did: any;
      basicProfile: any;
      cryptoAccounts: any;
      webAccounts: any;
      publicProfile: any;
      privateProfile: any;
    }[]
  >([]);

  const getEthBalance = async () => {
    if (library && account) {
      const res = await library?.getBalance(account);
      const balance = hexToString(res);
      setYourBalance(balance);
      // console.log(`balance`, balance);
    }
  };

  useEffect(() => {
    getEthBalance();
  }, [account, library]);

  const init = async () => {
    console.log("provider from it", provider);
    if (provider && provider.getSigner()) {
      try {
        console.log("init executing");
        const signer = provider.getSigner();
        console.log("signer", {signer});
        const contract = await loadDRecruitV1Contract(targetNetwork, signer);
        console.log("contract", {contract});
        const tokenAddress = await contract.address;
        console.log("tokenAddress", {tokenAddress});
        const tokenContract = await loadTokenContract(tokenAddress, signer);
        console.log("tokenContract", {tokenContract});
        setDRecruitContract(contract);
        setTokenContract(tokenContract);
        const tokenName = await tokenContract.name();
        console.log("tokenName", {tokenName});
        const tokenSymbol = await tokenContract.symbol();
        console.log("tokenSymbol", {tokenSymbol});
        setTokenMetadata({ name: tokenName, symbol: tokenSymbol });
        const lastTokenId = await contract.tokenId();
        console.log("lastTokenId", {lastTokenId});
        const tokenIds = [...Array(parseInt(lastTokenId, 10)).keys()];
        console.log("tokenIds", {tokenIds});
        const tokenURIs = await Promise.all(
          tokenIds.map(async (id) => contract.uri(id))
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
        setDeveloperProfiles(devProfiles);
      } catch (error) {
        console.log('error in init function', { error });
        setIsAlertOpen(true);
      }
    }
  };

  useEffect(() => {
    console.log("init useEffect");
    init();
  }, [context]);

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
