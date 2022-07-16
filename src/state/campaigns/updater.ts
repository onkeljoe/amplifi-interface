import { useEffect } from "react";

import { useActiveProtocol } from "state/governance/hooks";
import { useMaxFetched } from "./hooks";
import { FETCHING_INTERVAL } from "./reducer";

export default function Updater(): null {
  const [activeProtocol] = useActiveProtocol();

  const [maxFetched, setMaxFetched] = useMaxFetched();

  // update maxed fetched amount if protocol is active
  useEffect(() => {
    if (activeProtocol && !maxFetched) {
      setMaxFetched(FETCHING_INTERVAL);
    }
  }, [activeProtocol, maxFetched, setMaxFetched]);

  // useEffect(() => {

  // }, [])
  return null;
}
