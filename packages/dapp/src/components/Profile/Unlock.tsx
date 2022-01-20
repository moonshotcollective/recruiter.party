import React, { useContext, useEffect, useState } from "react";
import { HStack, VStack } from "@chakra-ui/layout";
import {
  Button,
  Text,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormLabel,
  Input,
  Checkbox,
} from "@chakra-ui/react";
import { LinkIcon } from "@chakra-ui/icons";
import useDebounce from "core/hooks/useDebounce";
import { BigNumber, ethers } from "ethers";
import Blockies from "react-blockies";
import NETWORKS from "core/networks";
import { Web3Context } from "contexts/Web3Provider";
import { useWeb3React } from "@web3-react/core";
import axios from "axios";

function UnlockProfile({
  privateProfile,
}: {
  privateProfile: { tokenId: number };
}) {
  const context = useContext(Web3Context);
  const { contracts, account } = useContext(Web3Context);
  const { chainId } = useWeb3React();
  // @ts-expect-error
  const currentNetwork = NETWORKS[chainId];
  const [stakeAmount, setStakeAmount] = useState("");
  const [unlimitedAllowanceWanted, setUnlimitedAllowanceWanted] =
    useState(true);
  const [currAllowance, setCurrAllowance] = useState<BigNumber>();
  const [approvalState, setApprovalState] = useState<
    "ENOUGH" | "NOT_ENOUGH" | "LOADING"
  >();
  const [tokenSymbol, setTokenSymbol] = useState("");
  const debouncedStakeAmount = useDebounce(stakeAmount, 500);
  const toast = useToast();
  const dRecruitContract = contracts.writeDrecruitContract;
  const tokenContract = contracts.writeTokenContract;
  const [requested, setRequested] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleRequestPrivateProfileUnlock = async () => {
    if (!stakeAmount || +stakeAmount < +"0.1") {
      return toast({
        title: "Please enter a valid stake amount. Minimum 0.1 tokens.",
        status: "error",
      });
    }
    const weiStakeAmount = ethers.utils.parseEther(stakeAmount);
    try {
      // Only ask for allowance if it is not enough
      if (approvalState === "NOT_ENOUGH") {
        const tx = await tokenContract.approve(
          dRecruitContract.address,
          unlimitedAllowanceWanted
            ? ethers.constants.MaxUint256.toString()
            : weiStakeAmount
        );
        toast({
          title: "Approval transaction sent",
          description: (
            <Text>
              Your transaction was successfully sent{" "}
              <a
                href={`${currentNetwork.blockExplorer}/tx/${tx.hash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkIcon color="white" />
              </a>
            </Text>
          ),
          status: "success",
        });
        await tx.wait();
        toast({
          title: "Approval transaction confirmed",
          description: (
            <Text>
              Your transaction was confirmed{" "}
              <a
                href={`${currentNetwork.blockExplorer}/tx/${tx.hash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkIcon color="white" />
              </a>
            </Text>
          ),
          status: "success",
        });
      }
      const tx = await dRecruitContract.request(
        privateProfile.tokenId,
        weiStakeAmount,
        {
          value: 0,
        }
      );
      toast({
        title: "Request transaction sent",
        description: (
          <Text>
            Your transaction was successfully sent{" "}
            <a
              href={`${currentNetwork.blockExplorer}/tx/${tx.hash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkIcon color="white" />
            </a>
          </Text>
        ),
        status: "success",
      });
      const receipt = await tx.wait();
      toast({
        title: "Request transaction confirmed",
        description: (
          <Text>
            Your transaction was confirmed{" "}
            <a
              href={`${currentNetwork.blockExplorer}/tx/${tx.hash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkIcon color="white" />
            </a>
          </Text>
        ),
        status: "success",
      });
      setRequested(true);
      onClose();
    } catch (err: any) {
      toast({
        title: "Request transaction failed",
        description: err.message + (err.data ? ` ${err.data.message}` : ""),
        status: "error",
      });
    }
    // @ts-expect-error
    setStakeAmount();
  };

  useEffect(() => {
    async function exec() {
      const weiStakeAmount = ethers.utils.parseEther(debouncedStakeAmount);
      const allowance = await tokenContract.allowance(
        account,
        dRecruitContract.address
      );
      if (allowance.lt(weiStakeAmount)) {
        setApprovalState("NOT_ENOUGH");
      } else {
        setApprovalState("ENOUGH");
      }
    }
    if (debouncedStakeAmount) {
      setApprovalState("LOADING");
      exec();
    }
  }, [isOpen, debouncedStakeAmount]);

  useEffect(() => {
    if (unlimitedAllowanceWanted) {
      setApprovalState("NOT_ENOUGH");
    }
  }, [unlimitedAllowanceWanted]);

  useEffect(() => {
    async function exec() {
      const allowance = await tokenContract.allowance(
        account,
        dRecruitContract.address
      );
      setCurrAllowance(allowance);
      const symbol = await tokenContract.symbol();
      setTokenSymbol(symbol);
    }
    exec();
  }, [isOpen]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Request unlock information</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack justifyItems="left">
              <FormLabel htmlFor="stakeAmount">
                Enter stake amount in {tokenSymbol}
              </FormLabel>
              <Input
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                placeholder="Minimum 0.1"
                borderColor="purple.500"
              />

              {currAllowance && currAllowance.lt(ethers.constants.MaxUint256) && (
                <HStack>
                  <FormLabel htmlFor="unlimitedAllowanceWanted">
                    Approve unlimited allowance?
                  </FormLabel>
                  <Checkbox
                    // @ts-expect-error
                    value={unlimitedAllowanceWanted}
                    onChange={(e) =>
                      setUnlimitedAllowanceWanted(e.target.checked)
                    }
                  />
                </HStack>
              )}
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button
              marginLeft={0}
              marginRight={"auto"}
              colorScheme="blue"
              onClick={() => {
                handleRequestPrivateProfileUnlock();
              }}
              disabled={!approvalState || approvalState === "LOADING"}
              isLoading={approvalState === "LOADING"}
            >
              {!approvalState || approvalState === "LOADING"
                ? "Enter amount"
                : approvalState === "ENOUGH"
                ? "Confirm"
                : "Approve"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Button
        bgColor="yellow.200"
        style={{ margin: "0 auto", marginTop: 20 }}
        onClick={onOpen}
        disabled={requested}
      >
        {requested ? "Requested" : "Unlock Contact"}
      </Button>
    </>
  );
}

export default UnlockProfile;
