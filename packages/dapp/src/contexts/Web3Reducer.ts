import { ethers } from "ethers";

/* eslint-disable import/prefer-default-export */
export type State = {
  loading: boolean;
  account?: string;
  chainId?: number;
  provider?: ethers.providers.Web3Provider;
  ens?: string;
  contracts?: any;
  tokenContract: any;
  connectWeb3?: any;
  logout?: any;
  targetNetwork?: any;
};
export const Web3Reducer = (state: State, action: Record<string, any>) => {
  switch (action.type) {
    case "SET_ACCOUNT":
      return {
        ...state,
        account: action.payload,
      };
    case "SET_ENS":
      return {
        ...state,
        ens: action.payload,
      };
    case "SET_PROVIDER":
      return {
        ...state,
        provider: action.payload,
      };
    case "SET_CONTRACTS":
      return {
        ...state,
        contracts: action.payload,
      };
      case "SET_TOKEN_CONTRACT":
        return {
          ...state,
          contracts: action.payload,
        };
    case "SET_TARGET_NETWORK":
      return {
        ...state,
        targetNetwork: action.payload,
      };
    default:
      return state;
  }
};
