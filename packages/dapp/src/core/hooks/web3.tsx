import { Web3Provider } from "@ethersproject/providers";
import {
  useSafeAppConnection,
  SafeAppConnector,
} from "@gnosis.pm/safe-apps-web3-react";
import { useWeb3React as useWeb3ReactCore } from "@web3-react/core";
import { Web3ReactContextInterface } from "@web3-react/core/dist/types";
import { useContext, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";

import { Web3Context } from "../../contexts/Web3Provider";
import { injected } from "../connectors";

export function useActiveWeb3React(): Web3ReactContextInterface<Web3Provider> {
  const context = useWeb3ReactCore<Web3Provider>();
  const contextNetwork = useWeb3ReactCore<Web3Provider>("NETWORK");
  return context.active ? context : contextNetwork;
}

export function useEagerConnect() {
  const { activate, active } = useWeb3ReactCore();
  const [tried, setTried] = useState(false);

  if (typeof window === "undefined") {
    return null;
  }
  const triedToConnectToSafe = useSafeAppConnection(new SafeAppConnector());

  useEffect(() => {
    if (triedToConnectToSafe && !active) {
      injected.isAuthorized().then((isAuthorized) => {
        if (isAuthorized) {
          activate(injected, undefined, true).catch(() => {
            setTried(true);
          });
        } else if (isMobile && window.ethereum) {
          activate(injected, undefined, true).catch(() => {
            setTried(true);
          });
        } else {
          setTried(true);
        }
      });
    }
  }, [activate, active, triedToConnectToSafe]); // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (active && triedToConnectToSafe) {
      setTried(true);
    }
  }, [active, triedToConnectToSafe]);

  return tried;
}

/**
 * Use for network and injected - logs user in
 * and out after checking what network theyre on
 */
export function useInactiveListener(suppress = false) {
  const { connectWeb3 } = useContext(Web3Context);
  const { active, error, activate } = useWeb3ReactCore(); // specifically using useWeb3React because of what this hook does
  useEffect(() => {
    const { ethereum } = window;

    if (ethereum && ethereum.on && !error && !suppress) {
      const handleChainChanged = () => {
        // eat errors
        activate(injected, undefined, true).catch((error) => {
          console.error("Failed to activate after chain changed", error);
        });
      };

      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          // eat errors
          activate(injected, undefined, true).catch((error) => {
            console.error("Failed to activate after accounts changed", error);
          });
        }
      };

      ethereum.on("chainChanged", handleChainChanged);
      ethereum.on("accountsChanged", handleAccountsChanged);
      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener("chainChanged", handleChainChanged);
          ethereum.removeListener("accountsChanged", handleAccountsChanged);
        }
      };
    }
    return undefined;
  }, [active, error, suppress, activate, connectWeb3]);
}
