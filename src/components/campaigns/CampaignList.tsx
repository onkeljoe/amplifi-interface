import React, { useEffect } from "react";
import Loader, { LoadingRows } from "components/Loader";
import { RowBetween, RowFixed } from "components/Row";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import styled from "styled-components";
import { OnlyAboveSmall, TYPE } from "theme";

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

const ProposalItem = styled.div`
  border-radius: 12px;
  padding: 1rem 0;
  margin: 1rem;
  text-decoration: none;

  :hover {
    cursor: pointer;
    opacity: 0.7;
  }
`;

const ResponsiveText = styled(TYPE.black)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 14px;
  `};
`;

export const Break = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.bg3};
  height: 1px;
  margin: 0;
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
          <TYPE.body style={{ marginBottom: "8px" }}>
            No campaigns found.
          </TYPE.body>
          <TYPE.subHeader>
            <i>Please contact CRE8RDAO if you have any inquiries</i>
          </TYPE.subHeader>
        </EmptyWrapper>
      ) : (
        <AutoColumn gap="0">
          <TYPE.body fontSize="16px" fontWeight="600" mb="1rem">
            Campaigns
          </TYPE.body>
          <Break style={{}} />
          {amplifiCampaigns ? (
            amplifiCampaigns.map((v, i) => {
              return (
                <div key={v.id}>
                  <ProposalItem as={Link} to={uriToRouteMap[v.uri]}>
                    <RowBetween>
                      <RowFixed>
                        <OnlyAboveSmall>
                          <TYPE.darkGray mr="8px">
                            {amplifiCampaigns.length - i + "."}
                          </TYPE.darkGray>
                        </OnlyAboveSmall>
                        <ResponsiveText mr="10px">{v.title}</ResponsiveText>
                      </RowFixed>
                      <Loader />
                    </RowBetween>
                  </ProposalItem>
                  <Break />
                </div>
              );
            })
          ) : (
            <LoadingRows style={{paddingTop: 10}}>
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
      )}

      {/* todo(jono) - add loading campaigns (like what is in the proposals) */}
    </Wrapper>
  );
}

export default withRouter(CampaignList);
