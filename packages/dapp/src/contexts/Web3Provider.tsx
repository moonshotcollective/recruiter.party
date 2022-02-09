import ABIS from "@recruiter.party/contracts/hardhat_contracts.json";
import publishedModel from "@recruiter.party/schemas/lib/model.json";
import { SelfID, EthereumAuthProvider } from "@self.id/web";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
// import Authereum from "authereum";
import axios from "axios";
import { ethers } from "ethers";
import React, {
  createContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import Web3Modal from "web3modal";

// @ts-ignore

import { ERC20ABI } from "../../helpers/abi";
import { CERAMIC_TESTNET } from "../core/ceramic";
import { NETWORK_URLS } from "../core/connectors";
import { ALL_SUPPORTED_CHAIN_IDS } from "../core/connectors/chains";
import { useActiveWeb3React } from "../core/hooks/web3";
import NETWORKS from "../core/networks";

import { State, Web3Reducer } from "./Web3Reducer";

export const supportedNetworks = Object.keys(ABIS);
const injected = new InjectedConnector({
  supportedChainIds: supportedNetworks.map((net) => parseInt(net, 10)),
});

const walletconnect = new WalletConnectConnector({
  rpc: NETWORK_URLS,
  qrcode: true,
});

const initialState = {
  loading: false,
  account: undefined,
  provider: undefined,
  contracts: undefined,
  chainId: undefined,
  did: undefined,
  mySelf: undefined,
} as State;

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      supportedChainIds: ALL_SUPPORTED_CHAIN_IDS,
      rpcs: NETWORK_URLS,
      qrcode: true,
    },
  },
  // authereum: {
  //   package: Authereum,
  // },
};

const Web3Context = createContext(initialState);

const Web3Provider = ({ children }: { children: any }) => {
  const web3Modal = new Web3Modal({
    providerOptions,
    cacheProvider: false,
  });

  const [state, dispatch] = useReducer(Web3Reducer, initialState);
  const { chainId, activate, library } = useWeb3React();
  const { active, account } = useActiveWeb3React();
  console.log({ active, account });

  const setAccount = (account?: null | string) => {
    dispatch({
      type: "SET_ACCOUNT",
      payload: account,
    });
  };

  const setContracts = (contracts: null | any) => {
    dispatch({
      type: "SET_CONTRACTS",
      payload: contracts,
    });
  };

  const setENS = (ens: null | string) => {
    dispatch({
      type: "SET_ENS",
      payload: ens,
    });
  };

  const setDid = (did: null | string) => {
    dispatch({
      type: "SET_DID",
      payload: did,
    });
  };

  const setMySelf = (mySelf: null | any) => {
    dispatch({
      type: "SET_MY_SELF",
      payload: mySelf,
    });
  };

  useEffect(() => {
    async function handleActiveAccount() {
      if (active) {
        setAccount(account);

        const authenticatedResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/authenticated`,
          {
            withCredentials: true,
          }
        );

        if (
          authenticatedResponse.status === 200 &&
          authenticatedResponse.data.authenticated === true
        ) {
          const provider = await web3Modal.connect();
          const mySelf = await SelfID.authenticate({
            authProvider: new EthereumAuthProvider(provider, account!),
            ceramic: CERAMIC_TESTNET,
            connectNetwork: CERAMIC_TESTNET,
            model: publishedModel,
          });

          setDid(mySelf.id);
          setMySelf(mySelf);
        }
      }
    }
    handleActiveAccount();

    return () => {
      setAccount(null);
    };
  }, [account]);

  async function updateState() {
    if (chainId && library) {
      // check if supported network
      const strChainId = chainId?.toString();
      if (supportedNetworks.includes(strChainId)) {
        const provider = await web3Modal.connect();
        const lib = new ethers.providers.Web3Provider(provider);
        const signer = lib.getSigner();
        const network = NETWORKS[strChainId as keyof typeof NETWORKS];
        console.log({ network });
        const abis = ABIS as Record<string, any>;
        const readDrecruitContract = new ethers.Contract(
          abis[strChainId][network.name].contracts.DRecruitV1.address,
          abis[strChainId][network.name].contracts.DRecruitV1.abi,
          // TODO: replace this with static provider and rpc url based on chainId
          signer
        );
        const writeDrecruitContract = new ethers.Contract(
          abis[strChainId][network.name].contracts.DRecruitV1.address,
          abis[strChainId][network.name].contracts.DRecruitV1.abi,
          signer
        );

        const tokenAddress = await readDrecruitContract.token();
        console.log("tokenAddress: ", { tokenAddress });

        const readTokenContract = new ethers.Contract(
          tokenAddress,
          ERC20ABI,
          signer
        );
        const writeTokenContract = new ethers.Contract(
          tokenAddress,
          ERC20ABI,
          signer
        );
        setContracts({
          readDrecruitContract,
          writeDrecruitContract,
          readTokenContract,
          writeTokenContract,
        });
      }
    }
  }

  // Reload contracts globally on network change
  useEffect(() => {
    updateState();
  }, [ABIS, chainId, library]);

  const logout = async () => {
    setAccount(null);
    setContracts(null);
    localStorage.setItem("defaultWallet", "");
    await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/logout`,
      {},
      { withCredentials: true }
    );
  };

  const connectWeb3 = useCallback(async () => {
    // Set up Web3 Modal
    const provider = await web3Modal.connect();
    const lib = new ethers.providers.Web3Provider(provider);
    activate(lib?.connection.url === "metamask" ? injected : walletconnect);

    const signer = lib.getSigner();
    const account = await signer.getAddress();

    // get did
    const mySelf = await SelfID.authenticate({
      authProvider: new EthereumAuthProvider(lib.provider, account),
      ceramic: CERAMIC_TESTNET,
      connectNetwork: CERAMIC_TESTNET,
      model: publishedModel,
    });

    console.log("myself", { mySelf });
    console.log("DID", mySelf.id);

    setDid(mySelf.id);
    setMySelf(mySelf);

    // Get ens
    let ens = null;
    try {
      ens = await lib.lookupAddress(account);
    } catch (error) {
      console.log({ error });
    }

    const authResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/authenticated`,
      {
        withCredentials: true,
      }
    );

    console.log(authResponse.data);

    if (authResponse.data?.address?.toLowerCase() !== account.toLowerCase()) {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/nonce/${account}`
      );
      // @ts-expect-error
      const signature = await lib.provider.request({
        method: "personal_sign",
        params: [data.message, account],
      });
      const verifyResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/verify/${account}`,
        {
          signature,
        },
        {
          withCredentials: true,
        }
      );
      if (verifyResponse.status !== 200) {
        throw new Error("Unauthorized"); // handle this gracefully with an UI error
      }
    }

    // check if supported network
    const strChainId = chainId ? chainId?.toString() : "";
    if (supportedNetworks.includes(strChainId)) {
      const network = NETWORKS[strChainId as keyof typeof NETWORKS];
      const abis = ABIS as Record<string, any>;
      const readDrecruitContract = new ethers.Contract(
        abis[strChainId][network.name].contracts.DRecruitV1.address,
        abis[strChainId][network.name].contracts.DRecruitV1.abi,
        // TODO: replace this with static provider and rpc url based on chainId
        signer
      );
      const writeDrecruitContract = new ethers.Contract(
        abis[strChainId][network.name].contracts.DRecruitV1.address,
        abis[strChainId][network.name].contracts.DRecruitV1.abi,
        signer
      );

      const tokenAddress = await readDrecruitContract.token();
      console.log("tokenAddress: ", { tokenAddress });

      const readTokenContract = new ethers.Contract(
        tokenAddress,
        ERC20ABI,
        signer
      );
      const writeTokenContract = new ethers.Contract(
        tokenAddress,
        ERC20ABI,
        signer
      );
      setContracts({
        readDrecruitContract,
        writeDrecruitContract,
        readTokenContract,
        writeTokenContract,
      });
    }

    setAccount(account);
  }, [ABIS, chainId]);

  return (
    <Web3Context.Provider
      value={{
        ...state,
        connectWeb3,
        logout,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export { Web3Context, Web3Provider };
