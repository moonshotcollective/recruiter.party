import DRecruiter from '../contracts/hardhat_contracts.json'
import { ethers } from 'ethers'
import { abis } from "./abi";

export const loadDRecruitV1Contract = async (targetNetwork, signer) => {
  console.log('Loading DRecruit contract...')
  console.log(`Target network: ${targetNetwork}`)
  const contract = new ethers.Contract(
    DRecruiter[targetNetwork.chainId][targetNetwork.name].contracts.DRecruitV1.address,
    DRecruiter[targetNetwork.chainId][targetNetwork.name].contracts.DRecruitV1.abi,
    signer,
  );
  return contract;
};

export const loadTokenContract = async (address, signer) => {
  const contract = new ethers.Contract(address, abis.ERC20, signer);
  return contract;
};

export const getDidFromTokenURI = tokenURI => {
  const [ipfsWithColon, _, cid, didFilename] = tokenURI.split("/");
  const [did] = didFilename.split(".json");
  return {
    did,
    cid,
    tokenURI,
    filename: didFilename,
  };
};