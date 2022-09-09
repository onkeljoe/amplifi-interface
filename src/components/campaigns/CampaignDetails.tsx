import React, { useRef, useState } from "react";
import { LoadingRows } from "components/Loader";
import Tabs from "components/Tabs";
import { useCampaign } from "hooks/useCampaign";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import styled from "styled-components";
import { AppDispatch } from "../../state";
import { useActiveProtocol } from "../../state/governance/hooks";
import { SUPPORTED_PROTOCOLS } from "../../state/governance/reducer";
import Column, { AutoColumn } from "../Column";
import CampaignContent from "./CampaignContent";
import CampaignOverview from "./CampaignOverview";
import CampaignBanner from "./CampaignBanner";
import ReferralLinksCard from "components/ReferralLinksCard";
import { useAutoAnimate } from "hooks/useAutoAnimate";

const Wrapper = styled.div<{ backgroundColor?: string }>``;

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

  const [parent] = useAutoAnimate();

  return (
    <Wrapper>
      <Column gap='10px' style={{ width: "100%" }}>
        <CampaignBanner />
        <ReferralLinksCard />
        <CampaignContent />
        {amplifiCampaignsTabData.length > 0 && (
          <div style={{ paddingBottom: 10 }}>
            <Tabs
              data={amplifiCampaignsTabData}
              value={tabUri}
              onChange={() => {
                //optional
              }}
              onClick={(value: any) => {
                history.replace(uriToRouteMap[value]);
              }}
            />
          </div>
        )}
        <div ref={parent}>
          {page ? (
            <>
              {page.type === "SubPage" ? (
                <>
                  {(() => {
                    const Component = page.data.component;
                    return <Component />;
                  })()}
                </>
              ) : page.type === "WPACFPage" ? (
                <CampaignOverview />
              ) : (
                <>
                  {/* <Break /> */}
                  {!page || !page.data ? (
                    <LoadingRows>
                      <div />
                      <div />
                      <div />
                      <div />
                    </LoadingRows>
                  ) : (
                    // WPContentPage
                    <CampaignContent content={page.data.content} />
                  )}
                </>
              )}
            </>
          ) : (
            <LoadingRows>
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
          {page && page.error && <div>Error loading content</div>}
        </div>
      </Column>
      {/* </ProposalInfo> */}
    </Wrapper>
  );
}

export default withRouter(CampaignDetails);
