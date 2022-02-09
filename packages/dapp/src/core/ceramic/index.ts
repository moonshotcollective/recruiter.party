import { AlsoKnownAs, Account } from "@datamodels/identity-accounts-web";
import publishedModel from "@recruiter.party/schemas/lib/model.json";
import { Core } from "@self.id/core";

import { GITHUB_HOST } from "../constants";

export const CERAMIC_TESTNET = "testnet-clay";
export const CERAMIC_TESTNET_NODE_URL = "https://ceramic-clay.3boxlabs.com";
export const CERAMIC_MAINNET_NODE_URL = "https://gateway.ceramic.network";
export const CERAMIC_LOCAL_NODE_URL = "http://localhost:7007";

export const schemaAliases = {
  CONTRIBUTORS_ALIAS: "contributors",
};

// READ ONLY CLIENT
export const ceramicCoreFactory = () => {
  // connect to a known URL
  // const core = new Core({ ceramic: "http://localhost:7007" });
  // or use one of the preconfigured option
  return new Core({
    ceramic: CERAMIC_TESTNET_NODE_URL,
    model: publishedModel,
  });
};

export function findGitHub(
  { accounts }: AlsoKnownAs,
  username: string
): Account | undefined {
  return accounts.find((a: any) => a.host === GITHUB_HOST && a.id === username);
}
export function findGitHubIndex(
  { accounts }: AlsoKnownAs,
  username: string
): number {
  return accounts.findIndex(
    (a: any) => a.host === GITHUB_HOST && a.id === username
  );
}
