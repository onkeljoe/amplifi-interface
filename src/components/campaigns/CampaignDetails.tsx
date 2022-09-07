import React from "react";
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
import IncentivesKPI from "./IncentivesKPI";
import Highlights from "./Highlights";
import ReferralLinksCard from "components/ReferralLinksCard";
// import {
//   IncentivesAndKPIs,
//   Money,
//   Calendar,
//   Referree,
// } from "./typesIncentivesKPIs";

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
  console.log(page && page.data);
  return (
    <Wrapper>
      <Column gap='10px' style={{ width: "100%" }}>
        <CampaignBanner />
        <ReferralLinksCard />
        {/* {protocolsIAndK[protocolID] ? ( */}
        {page &&
        page.data &&
        page.data.amplifiCampaignFields &&
        page.data.amplifiCampaignFields.incentivesbonuskpis &&
        page.data.amplifiCampaignFields.incentivesbonuskpis.bonus &&
        page.data.amplifiCampaignFields.incentivesbonuskpis.kPIs &&
        page.data.amplifiCampaignFields.incentivesbonuskpis.incentives ? (
          <>
            <IncentivesKPI
              data={page.data.amplifiCampaignFields.incentivesbonuskpis}
            />
            <Highlights data={page.data.amplifiCampaignFields.highlights} />
          </>
        ) : (
          <CampaignContent />
        )}
        {/*) : (
          <>
            <CampaignContent />
          </>
        )} */}
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
        {page && (
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
        )}
        {page && page.error && <div>Error loading content</div>}
      </Column>
      {/* </ProposalInfo> */}
    </Wrapper>
  );
}

export default withRouter(CampaignDetails);

// const amplifiIandK: IncentivesAndKPIs = {
//   incentives: [
//     {
//       icon: "ETH",
//       text: "5%",
//     },
//     {
//       icon: "AMP",
//       text: "matching $AMP",
//     },
//   ],
//   bonus: [
//     {
//       icon: "AMP",
//       text: "2.5% $AMP",
//     },
//   ],
//   KPIs: [
//     {
//       text: "deposits ETH to Juicebox",
//     },
//     {
//       text: "payouts happen monthly",
//       extraInfo: {
//         startText: "Every 2 juicebox cycles",
//       },
//     },
//   ],
// };

// const amplifiHighlights: Array<Money | Calendar | Referree> = [
//   {
//     type: "money",
//     subText: "Currently Paid out",
//     mainText: "~$10k",
//     payoutKey: "payoutkey",
//     payoutTokens: ["USDC", "AMP"],
//   },
//   {
//     type: "calendar",
//     subText: "~48 hours after snapshot vote",
//     mainText: "Every 2 weeks",
//     infoBox: {
//       startText: "some calendar info",
//     },
//   },
// ];

// const billidropIandK: IncentivesAndKPIs = {
//   incentives: [
//     {
//       icon: "USDC",
//       text: "$60",
//     },
//     {
//       icon: "AMP",
//       text: "$60",
//     },
//   ],
//   bonus: [
//     {
//       icon: "AMP",
//       text: "$60",
//     },
//   ],
//   KPIs: [
//     {
//       text: "referee mints an NFT",
//       extraInfo: {
//         startText: "When an NFT is minted via referral link",
//       },
//     },
//   ],
// };

// const billidropHighlights: Array<Money | Calendar | Referree> = [
//   {
//     type: "money",
//     subText: "Currently Paid out",
//     mainText: "~$10k",
//     payoutKey: "payoutkey",
//     payoutTokens: ["USDC", "AMP"],
//   },
//   {
//     type: "calendar",
//     subText: "~48 hours after snapshot vote",
//     mainText: "Every 2 weeks",
//     infoBox: {
//       startText: "some calendar info",
//     },
//   },
// ];
// const protocolsIAndK: {
//   [protocolID: string]: {
//     ik: IncentivesAndKPIs;
//     highlights: Array<Money | Calendar | Referree>;
//   };
// } = {
//   AMPLIFI: {
//     ik: amplifiIandK,
//     highlights: amplifiHighlights,
//   },
//   BilliDrop: {
//     ik: billidropIandK,
//     highlights: billidropHighlights,
//   },
// };
