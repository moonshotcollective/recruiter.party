import { LinkIcon } from "@chakra-ui/icons";
import { HStack, VStack } from "@chakra-ui/layout";
import { Button, Text, useToast } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import axios from "axios";
import { ethers } from "ethers";
import React, { useContext, useEffect, useState } from "react";

import { Web3Context } from "contexts/Web3Provider";
import NETWORKS from "core/networks";

function ApproveUnlockProfile({
  currentPrivateProfileTokenId,
  recruiterAddress,
}: {
  currentPrivateProfileTokenId: number;
  recruiterAddress: string;
}) {
  const { contracts } = useContext(Web3Context);
  const { chainId } = useWeb3React();
  // @ts-expect-error
  const currentNetwork = NETWORKS[chainId];
  const toast = useToast();
  const [approvedStatus, setApprovedStatus] = useState<
    "unapproved" | "approving" | "approved"
  >("unapproved");
  const [amount, setAmount] = useState(0);

  const approveTexts = {
    unapproved: "Approve",
    approving: "Approving",
    approved: "Approved",
  };

  useEffect(() => {
    async function exec() {
      if (contracts) {
        const stakeAmount = await contracts.readDrecruitContract.requests(
          currentPrivateProfileTokenId,
          recruiterAddress
        );
        const gweiStakeAmount = +ethers.utils.formatUnits(stakeAmount);
        setAmount(gweiStakeAmount);
      }
    }
    exec();
  }, [currentPrivateProfileTokenId, recruiterAddress, contracts]);

  const handleApproval = async () => {
    try {
      setApprovedStatus("approving");
      const tx = await contracts.writeDrecruitContract.approveRequest(
        currentPrivateProfileTokenId,
        recruiterAddress
      );
      toast({
        title: "Approval transaction sent",
        description: (
          <text>
            Your transaction was successfully sent{" "}
            <a
              href={`${currentNetwork.blockExplorer}/tx/${tx.hash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkIcon color="white" />
            </a>
          </text>
        ),
        status: "success",
      });
      const receipt = await tx.wait();
      toast({
        title: "Approval transaction confirmed",
        description: (
          <text>
            Your transaction was confirmed{" "}
            <a
              href={`${currentNetwork.blockExplorer}/tx/${tx.hash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkIcon color="white" />
            </a>
          </text>
        ),
        status: "success",
      });
      setApprovedStatus("approved");
    } catch (err: any) {
      toast({
        title: "Approval transaction failed",
        description: err.message + (err.data ? ` ${err.data.message}` : ""),
        status: "error",
      });
      setApprovedStatus("unapproved");
    }
  };

  return (
    <HStack pt={6} justify="end" width="100%">
      <Text fontSize="lg" color="yellow.200">
        {amount} MATIC
      </Text>
      <Button
        colorScheme="yellow"
        onClick={(event) => {
          handleApproval();
        }}
        disabled={approvedStatus !== "unapproved"}
      >
        {approveTexts[approvedStatus]}
      </Button>
    </HStack>
  );
}

export default ApproveUnlockProfile;
