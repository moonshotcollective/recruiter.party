import { Button, HStack, Input, Text, VStack } from "@chakra-ui/react";
import ABIS from "@scaffold-eth/hardhat-ts/hardhat_contracts.json";
import React, { ChangeEvent, useCallback, useContext, useEffect, useState } from "react";
import { Web3Context } from "../../contexts/Web3Provider";
import useCustomColor from "../../core/hooks/useCustomColor";
import NETWORKS from "../../core/networks";
import { DRecruitV1 } from "@scaffold-eth/hardhat-ts/generated/contract-types/DRecruitV1";
import { useWeb3React } from '@web3-react/core';
import { BigNumber, BigNumberish } from 'ethers';

type Block = {
  inputs?: Array<Object>;
  outputs?: Array<Object>;
  name?: string;
  stateMutability?: string;
  type: string;
};

function ContractFields({ ...others }: any) {
  const { contracts, account } = useContext(Web3Context);
  const { chainId } = useWeb3React();
  const [abi, setAbi] = useState([]);
  const { coloredText } = useCustomColor();
  const [fee, setFee] = useState<string>();
  const [tokenIdInput, setTokenIdInput] = useState<string>();
  const [yourReadContract, setYourReadContract] = useState<DRecruitV1>();
  const [yourWriteContract, setYourWriteContract] = useState<DRecruitV1>();

  const readFee = useCallback(
    async () => {
      if (yourReadContract) {
        const res = await yourReadContract.fee();
        console.log({ res })
        setFee(res.toString());
      }
    },
    [yourReadContract, contracts],
  )

  const writeFee = useCallback(
    async () => {
      if (yourWriteContract && account && tokenIdInput) {
        const transaction = await yourWriteContract.approveRequest(tokenIdInput, account);
        await transaction.wait();
        await readFee();
      }
    },
    [tokenIdInput, yourWriteContract, contracts],
  )

  useEffect(() => {
    if (chainId && contracts) {
      const strChainId = chainId.toString() as keyof typeof NETWORKS;
      const network = NETWORKS[strChainId];
      const abis = ABIS as Record<string, any>;
      if (abis[strChainId]) {
        const abi = abis[strChainId][network.name].contracts.DRecruitV1.abi;
        setAbi(abi);
        setYourReadContract(contracts.yourReadContract);
        setYourWriteContract(contracts.yourWriteContract);
      }
    }
  }, [chainId, contracts]);

  const handleTokenIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTokenIdInput(e.target.value);
  }

  return (
    <VStack
      bg="spacelightalpha"
      p="8"
      h="lg"
      borderRadius="base"
      spacing="4"
      align="start"
      {...others}
    >
      <Text textStyle="h1">Your Contract</Text>
      <Text textStyle="small">
        yarn chain, deploy in /hardhat and yarn dev in dapp.{" "}
        * make sure you are connected to localhost
      </Text>

      {abi &&
        abi.map((el: Block) => {
          if (el.type === "function" && el.inputs?.length !== 0) {
            return (
              <HStack key={el.name}>
                <Text>{el.name}</Text>
                <Input
                  value={tokenIdInput}
                  onChange={handleTokenIdChange}
                />
                <Button onClick={() => el.name && writeFee()}>Call</Button>
              </HStack>
            );
          }
          if (el.type === "function" && el.outputs?.length !== 0) {
            return (
              <HStack key={el.name}>
                <Text>{el.name}</Text>
                <Text color={coloredText}>{fee}</Text>
                <Button onClick={readFee}>Call</Button>
              </HStack>
            );
          }
        })}
      <Button onClick={() => console.log(abi)}>Check ABI in the console</Button>
    </VStack>
  );
}

export default ContractFields;
