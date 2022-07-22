import React from 'react';
import { AutoColumn } from "components/Column";
import FeaturedImage from "components/FeaturedImage/FeaturedImage";
import { LoadingRows } from "components/Loader";
import Youtube from "components/Youtube";
import parse from "html-react-parser";
import { useActiveCampaign } from "state/campaigns/hooks";
import styled from "styled-components";
import { TYPE } from "theme";
const Wrapper = styled.div<{ backgroundColor?: string }>`
  width: 100%;
`;

export const Break = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.bg3};
  height: 1px;
  margin: 0;
`;

export default function CampaignOverview() {
  const [activeCampaign] = useActiveCampaign();
  if (!activeCampaign) {
    return <LoadingRows>
      <div/>
    </LoadingRows>
  }
  return (
    <Wrapper>
      <AutoColumn gap="0">
        {activeCampaign.featuredImage && (
          <>
            <FeaturedImage image={activeCampaign.featuredImage} />
          </>
        )}
        {activeCampaign.description && (
            <>
              {activeCampaign.budgetDescription && <TYPE.body fontSize="14px" fontWeight="600" mb="1rem" mt="1rem">
                <span style={{ fontWeight: "bolder" }}>
                  {" "}
                  Campaign Incentives:{" "}
                </span>{" "}
                <span>{activeCampaign.budgetDescription}</span>{" "}
              </TYPE.body>}
              <TYPE.body fontSize="14px" fontWeight="301" mb="1rem">
                {parse(activeCampaign.description)}
              </TYPE.body>
            </>
          )}
        {activeCampaign.overviewVideo && (
          <Youtube src={activeCampaign.overviewVideo} />
        )}
        <TYPE.mediumHeader mt={"1rem"}>🚧 Other fields 🚧</TYPE.mediumHeader>
        <p>baseUrl: {activeCampaign.baseUrl}</p>
        <p>budget: {activeCampaign.budget}</p>
        <p>campaignBudget: {activeCampaign.campaignBudget}</p>
        <p>description: {activeCampaign.description}</p>
        <p>budgetDescription: {activeCampaign.budgetDescription}</p>
        <p>featuredImage: {activeCampaign.featuredImage}</p>
        <p>goal: {activeCampaign.goal}</p>
        <p>id: {activeCampaign.id}</p>
        <p>isDemo: {activeCampaign.isDemo}</p>
        <p>kpi: {activeCampaign.kpi}</p>
        <p>overviewVideo: {activeCampaign.overviewVideo}</p>
        <p>protocolId: {activeCampaign.protocolId}</p>
        <p>startDate: {activeCampaign.startDate}</p>
        <p>whitelist: {activeCampaign.whitelist && activeCampaign.whitelist.length > 0 && activeCampaign.whitelist.map((f,i) => {
          return <p key={i}>{f}</p>
        })}</p>
      </AutoColumn>
    </Wrapper>
  );
}
