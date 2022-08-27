import React, { useEffect } from "react";
import { LoadingRows } from "components/Loader";
import { RowBetween } from "components/Row";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import styled from "styled-components";
import { TYPE } from "theme";
import { StyledInternalLink } from "../../theme";
import { AutoColumn } from "components/Column";
import { EmptyWrapper } from "components/governance/styled";
import { useCampaign } from "hooks/useCampaign";
import { useDispatch } from "react-redux";
import { AppDispatch } from "state";
import { useActiveProtocol } from "state/governance/hooks";
import { SUPPORTED_PROTOCOLS } from "state/governance/reducer";

const Wrapper = styled.div<{ backgroundColor?: string }>`
  width: 100%;
`;

const ResponsiveText = styled(TYPE.black)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 14px;
  `};
`;

const ProposalItem = styled.div`
  text-decoration: none;
  :hover {
    cursor: pointer;
    opacity: 0.7;
  }
`;

export const Break = styled.div`
  width: 100%;
  border-top: 1px solid;
  border-color: ${({ theme }) => theme.bg3};
  margin: 1rem 0;
`;

function CampaignList({
  match: {
    params: { protocolID },
  },
}: RouteComponentProps<{ protocolID: string }>) {
  // const [activeProtocol, setActiveProtocol] = useActiveProtocol();
  const { amplifiCampaigns, uriToRouteMap } = useCampaign(protocolID);

  // if valid protocol id passed in, update global active protocol
  const dispatch = useDispatch<AppDispatch>();
  const [, setActiveProtocol] = useActiveProtocol();
  useEffect(() => {
    if (protocolID && Object.keys(SUPPORTED_PROTOCOLS).includes(protocolID)) {
      setActiveProtocol(SUPPORTED_PROTOCOLS[protocolID]);
    }
  }, [dispatch, protocolID, setActiveProtocol]);

  return (
    <Wrapper>
      {amplifiCampaigns && amplifiCampaigns.length === 0 ? (
        <EmptyWrapper>
          <TYPE.mediumHeader style={{ marginBottom: "8px" }}>
            No campaigns found.
          </TYPE.mediumHeader>
          <TYPE.subHeader>
            <i>Please contact CRE8RDAO if you have any inquiries</i>
          </TYPE.subHeader>
        </EmptyWrapper>
      ) : (
        <AutoColumn gap='0'>
          <TYPE.mediumHeader marginTop='1rem'>Campaigns</TYPE.mediumHeader>
          <Break />
          <AutoColumn gap='0'>
            {amplifiCampaigns ? (
              amplifiCampaigns.map((v) => {
                return (
                  <ProposalItem key={v.id} as={Link} to={uriToRouteMap[v.uri]}>
                    <RowBetween>
                      <ResponsiveText mr='10px'>{v.title}</ResponsiveText>
                      <StyledInternalLink to={uriToRouteMap[v.uri]}>
                        View Campaign
                      </StyledInternalLink>
                    </RowBetween>
                    <Break />
                  </ProposalItem>
                );
              })
            ) : (
              <LoadingRows style={{ paddingTop: 10 }}>
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
              </LoadingRows>
            )}
          </AutoColumn>
        </AutoColumn>
      )}

      {/* todo(jono) - add loading campaigns (like what is in the proposals) */}
    </Wrapper>
  );
}

export default withRouter(CampaignList);
