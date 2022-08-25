import React from "react";
import PayoutList from "components/campaigns/PayoutList";
import { RouteComponentProps } from "react-router-dom";
import { AutoColumn } from "../components/Column";
import Dropdown from "../components/governance/Dropdown";
import { WrappedListLogo } from "../components/governance/styled";
import Tabs from "../components/governance/Tabs";
import { RowFixed } from "../components/Row";
import { useProtocolUpdate } from "../hooks/useProtocolUpdate";
import { useActiveProtocol } from "../state/governance/hooks";
import { TYPE } from "../theme";
import { BodyWrapper, MediumHeaderWrapper } from "./AppBody";

import { dataToTotalFormat } from "components/campaigns/utils/dataConverter";
import { Above1080Only, Below1080Only } from "../theme/components";

export default function Payouts({
  match: {
    params: { protocolID },
  },
}: RouteComponentProps<{ protocolID?: string }>) {
  // if valid protocol id passed in, update global active protocol
  useProtocolUpdate(protocolID);

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
