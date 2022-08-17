import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { useProtocolUpdate } from "../hooks/useProtocolUpdate";
import { BodyWrapper, MediumHeaderWrapper } from "./AppBody";
// import { useActiveWeb3React } from '../hooks'
import { useActiveProtocol } from "../state/governance/hooks";
import { AutoColumn } from "../components/Column";
import { Above1080Only, Below1080Only } from "../theme/components";
import { RowBetween, RowFixed } from "../components/Row";
import { WrappedListLogo } from "../components/governance/styled";
import Dropdown from "../components/governance/Dropdown";
import Tabs from "../components/governance/Tabs";
import { TYPE } from "../theme";
import CampaignList from "components/campaigns/CampaignList";
import CampaignDetails from "components/campaigns/CampaignDetails";
import { useActiveCampaign } from "state/campaigns/hooks";
import CRE8RPriceCard from "components/CRE8RPriceCard";

export default function Amplifi({
  match: {
    params: { protocolID, campaignID },
  },
}: RouteComponentProps<{ protocolID?: string, campaignID?: string }>) {
  // if valid protocol id passed in, update global active protocol
  useProtocolUpdate(protocolID);
  // if on testnet, show warning
  //const { chainId } = useActiveWeb3React()

  const [activeProtocol] = useActiveProtocol();
  const [activeCampaign] = useActiveCampaign();
  return (
    <BodyWrapper>
      <AutoColumn gap="1rem">
        <div> 
          <AutoColumn gap="sm">
            <Above1080Only>
              <RowBetween>
                <RowFixed>
                  <WrappedListLogo src={activeProtocol?.logo} />
                  <AutoColumn>
                    <TYPE.mediumHeader
                      ml="8px"
                      fontWeight={600}
                      color={activeProtocol?.primaryColor}
                    >
                      {activeProtocol?.name}
                    </TYPE.mediumHeader>
                    {campaignID && <TYPE.small
                      ml="8px"
                      fontWeight={600}
                      color={activeProtocol?.primaryColor}
                    >
                      {activeCampaign?.title}
                    </TYPE.small>}
                  </AutoColumn>

                </RowFixed>
                <CRE8RPriceCard />
              </RowBetween>
            </Above1080Only>
            <Below1080Only>
              <Dropdown />
            </Below1080Only>
            <Tabs />
          </AutoColumn>
        </div>
        {campaignID ? <CampaignDetails /> : <CampaignList />}
      </AutoColumn>
    </BodyWrapper>
  );
}
