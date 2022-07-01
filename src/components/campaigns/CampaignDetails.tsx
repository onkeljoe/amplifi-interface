import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  useProposalData,
  useActiveProtocol,
  useProposalStatus,
  useUserVotes,
} from "../../state/governance/hooks";
import ReactMarkdown from "react-markdown";
import { RowBetween, RowFixed } from "../Row";
import { AutoColumn } from "../Column";
import { TYPE, ExternalLink } from "../../theme";
import { ChevronRight } from "react-feather";
import { ProposalStatus } from "../governance/styled";
import { DateTime } from "luxon";
import { AVERAGE_BLOCK_TIME_IN_SECS, BIG_INT_ZERO } from "../../constants";
import { isAddress, getEtherscanLink } from "../../utils";
import { useActiveWeb3React } from "../../hooks";
import VoterList from "../governance/VoterList";
import VoteModal from "../vote/VoteModal";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { BodyWrapper } from "../../pages/AppBody";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../state";
import { SUPPORTED_PROTOCOLS } from "../../state/governance/reducer";
import useCurrentBlockTimestamp from "../../hooks/useCurrentBlockTimestamp";
import { ApplicationModal } from "../../state/application/actions";
import {
  useBlockNumber,
  useModalOpen,
  useToggleModal,
} from "../../state/application/hooks";
import { BigNumber } from "ethers";
import { nameOrAddress } from "../../utils/getName";
import { useAllIdentities } from "../../state/social/hooks";
import { ButtonError } from "../Button";
import { useCampaign, useCampaignMaps } from "hooks/useCampaign";
import Tabs from "components/Tabs";
import CampaignContent from './CampaignContent'
import { Break } from "./CampaignList";
import Loader from "components/Loader";

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
const CardWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  width: 100%;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    grid-template-columns: 1fr;
    margin: 0;
    padding: 0;
  `};
`;

export const CardSection = styled(AutoColumn)<{ disabled?: boolean }>`
  padding: 1rem;
  z-index: 1;
  opacity: ${({ disabled }) => disabled && "0.4"};
`;

const DetailText = styled.div`
  word-break: break-all;
`;

const MarkDownWrapper = styled.div`
  overflow: scroll;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    max-width: 400px;
  `};
`;

const AddressWrapper = styled.div`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    max-width: 300px;
  `};
`;

function CampaignDetails({
  location: {
    pathname
  },
  match: {
    params: { protocolID, campaignID, tabID },
  },
  history,
}: RouteComponentProps<{ protocolID: string; campaignID: string; tabID? : string }>) {
  const { chainId } = useActiveWeb3React();

  // if valid protocol id passed in, update global active protocol
  const dispatch = useDispatch<AppDispatch>();
  const [, setActiveProtocol] = useActiveProtocol();
  useEffect(() => {
    if (protocolID && Object.keys(SUPPORTED_PROTOCOLS).includes(protocolID)) {
      setActiveProtocol(SUPPORTED_PROTOCOLS[protocolID]);
    }
  }, [dispatch, protocolID, setActiveProtocol]);

  const {
    amplifiCampaigns,
    amplifiCampaignsTabData,
    uriToRouteMap,
    routeToUriMap,
    page: {
      useCampaignACFsInstead, //for the overview tab
      data,
      loadingPageData
    }
  } = useCampaign(protocolID, pathname, campaignID);

  return (
    <BodyWrapper>
      <Wrapper>
        <ProposalInfo gap="lg" justify="start">
          <RowBetween style={{ width: "100%", alignItems: "flex-start" }}>
            <RowFixed>
              <ArrowWrapper
                onClick={() => {
                  history?.length === 1 ? history.push("/") : history.goBack();
                }}
                style={{ alignItems: "flex-start" }}
              >
                <TYPE.body fontWeight="600">Campaigns</TYPE.body>
              </ArrowWrapper>
              <ChevronRight size={16} />
              <TYPE.body>{"Campaign #" + campaignID}</TYPE.body>
            </RowFixed>

            {true && (
              <ProposalStatus status={"" ?? ""}>{"Status here"}</ProposalStatus>
            )}
          </RowBetween>
          <AutoColumn gap="10px" style={{ width: "100%" }}>
            <TYPE.largeHeader style={{ marginBottom: ".5rem" }}>
              {data.title ? data.title : campaignID}
            </TYPE.largeHeader>
            <RowBetween>
              <TYPE.main>
                Date here
              </TYPE.main>
            </RowBetween>
            {amplifiCampaignsTabData.length > 0 && <Tabs
              data={amplifiCampaignsTabData}
              value={tabID ? routeToUriMap[pathname] : amplifiCampaignsTabData[0].uri}
              onChange={(value) => {
                console.log(value)
              }}
              onClick={(value : any) => {
                history.replace(uriToRouteMap[value])
              }}
            />}
            <Break />
            {data.loading && !data.content ? <Loader /> : <CampaignContent content={data.content} /> }
            {data.error && <div>Error loading content</div>}
          </AutoColumn>
              {/* Auto column
          <AutoColumn gap="md">
            Auto column
          </AutoColumn>
          <AutoColumn gap="md">
            Auto column
          </AutoColumn>
          <AutoColumn gap="md">
            Auto column
          </AutoColumn> */}
        </ProposalInfo>
      </Wrapper>
    </BodyWrapper>
  );
}

export default withRouter(CampaignDetails);
