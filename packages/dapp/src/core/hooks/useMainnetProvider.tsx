import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

const createProvider = async (url: string) => {
  const p = new ethers.providers.StaticJsonRpcProvider(url);
  await p.ready;
  return p;
};

export function useMainnetProvider(
  url: string
): ethers.providers.StaticJsonRpcProvider | undefined {
  const [provider, setProvider] = useState<StaticJsonRpcProvider>();

  useEffect(() => {
    async function createAndSetProvider() {
      if (url === "") {
        return;
      }
      if (!url) {
        console.error("Please pass in a valid RPC url");
        return;
      }
      try {
        const p = await createProvider(url);
        setProvider(p);
      } catch (error) {
        console.error(error);
      }
    }
    createAndSetProvider();
  }, [url]);

  return provider;
}
