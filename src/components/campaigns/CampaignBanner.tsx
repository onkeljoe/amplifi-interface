import React from "react";
import { LoadingRows } from "components/Loader";
import Tabs from "components/Tabs";
import { useCampaign } from "hooks/useCampaign";
import { useEffect } from "react";
import { ChevronRight } from "react-feather";
import { useDispatch } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import styled from "styled-components";
import { AppDispatch } from "../../state";
import { useActiveProtocol } from "../../state/governance/hooks";
import { SUPPORTED_PROTOCOLS } from "../../state/governance/reducer";
import { TYPE } from "../../theme";
import Column, { AutoColumn } from "../Column";
import { ProposalStatus } from "../governance/styled";
import { RowBetween, RowFixed } from "../Row";
import CampaignContent from "./CampaignContent";
import CampaignOverview from "./CampaignOverview";
import ReferralLinksCard from "components/ReferralLinksCard";
import { Break } from "./CampaignOverview";
import config from "config";
const Wrapper = styled.div<{ backgroundColor?: string }>``;

const ProposalInfo = styled(AutoColumn)`
  border-radius: 12px;
  position: relative;
`;

const ArrowWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.text1};

  a {
    color: ${({ theme }) => theme.text1};
    text-decoration: none;
  }
  :hover {
    text-decoration: none;
    cursor: pointer;
  }
`;

export const CardSection = styled(AutoColumn)<{ disabled?: boolean }>`
  padding: 1rem;
  z-index: 1;
  opacity: ${({ disabled }) => disabled && "0.4"};
`;

function CampaignDetails({
  location: { pathname },
  match: {
    params: { protocolID, campaignID },
  },
  history,
}: RouteComponentProps<{
  protocolID: string;
  campaignID: string;
  tabID?: string;
}>) {
  // if valid protocol id passed in, update global active protocol
  const dispatch = useDispatch<AppDispatch>();
  const [, setActiveProtocol] = useActiveProtocol();
  useEffect(() => {
    if (protocolID && Object.keys(SUPPORTED_PROTOCOLS).includes(protocolID)) {
      setActiveProtocol(SUPPORTED_PROTOCOLS[protocolID]);
    }
  }, [dispatch, protocolID, setActiveProtocol]);

  const { amplifiCampaignsTabData, uriToRouteMap, page, tabUri } = useCampaign(
    protocolID,
    pathname,
    campaignID
  );

  return (
    <>
      <TYPE.body fontSize='12px' fontWeight='600' mb='1rem' mt='1rem'>
        {config.campaign.toast}
      </TYPE.body>
    </>
  );
}

export default withRouter(CampaignDetails);
