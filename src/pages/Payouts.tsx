import React from "react";
import { BodyWrapper, MediumHeaderWrapper } from "./AppBody";
import PayoutList from "components/campaigns/PayoutList";
import { RouteComponentProps } from "react-router-dom";
import { useActiveWeb3React } from "../hooks";
import { ChainId } from "@uniswap/sdk";
import { OutlineCard } from "../components/Card";
import { useProtocolUpdate } from "../hooks/useProtocolUpdate";
import { AutoColumn } from "../components/Column";
import Dropdown from "../components/governance/Dropdown";
import { TYPE } from "../theme";
import { useActiveProtocol } from "../state/governance/hooks";
import { RowFixed } from "../components/Row";
import { WrappedListLogo } from "../components/governance/styled";
import Tabs from "../components/governance/Tabs";

import { Above1080Only, Below1080Only } from "../theme/components";
import {
  boostedBribesToPayoutListFormat,
  dataToTotalFormat,
} from "components/campaigns/utils/dataConverter";

export default function Payouts({
  match: {
    params: { protocolID },
  },
}: RouteComponentProps<{ protocolID?: string }>) {
  // if valid protocol id passed in, update global active protocol
  useProtocolUpdate(protocolID);

  // if on testnet, show warning
  const { chainId } = useActiveWeb3React();

  const [activeProtocol] = useActiveProtocol();

  return (
    <BodyWrapper>
      <AutoColumn gap='1rem'>
        <MediumHeaderWrapper>
          <AutoColumn gap='sm'>
            <Above1080Only>
              <RowFixed>
                <WrappedListLogo src={activeProtocol?.logo} />
                <TYPE.mediumHeader
                  ml='8px'
                  fontWeight={600}
                  color={activeProtocol?.primaryColor}
                >
                  {activeProtocol?.name}
                </TYPE.mediumHeader>
              </RowFixed>
            </Above1080Only>
            <Below1080Only>
              <Dropdown />
            </Below1080Only>
            <Tabs />
          </AutoColumn>
        </MediumHeaderWrapper>
        <PayoutList
          title={"Top Payouts"}
          // todo: require ipfs gateway in config
          url={`https://amplifi.infura-ipfs.io/ipfs/Qmf9Thq47xDnChagDRcguuZJdg8XbmtuU1QdZjxbNTPQuE`}
          hideZero={false}
          dataConverter={dataToTotalFormat}
          description={`Qmf9Thq47xDnChagDRcguuZJdg8XbmtuU1QdZjxbNTPQuE`}
        />
      </AutoColumn>
    </BodyWrapper>
  );
}
