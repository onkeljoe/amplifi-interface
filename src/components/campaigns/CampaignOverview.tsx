import React from 'react';
import { AutoColumn } from "components/Column";
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
const formatGrid = (cols: number) => {
  let gridString = '1fr ';
    for (let i = 0; i < cols - 1; i++) {
      gridString += '1fr '
    }
    return gridString
}
const CampaignWrapper = styled.div<{cols: number}>`
  display: grid;
  grid-template-columns: ${({cols}) => formatGrid(cols)};
  gap: 12px;
  width: 100%;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    grid-template-columns: 1fr;
    margin: 0;
    padding: 0;
  `};
`;

export default function CampaignOverview() {
  const [activeCampaign] = useActiveCampaign();
  if (!activeCampaign) {
    return <LoadingRows>
      <div/>
    </LoadingRows>
  }
  return (
    <Wrapper style={{marginTop: 10}}>
      <CampaignWrapper cols={activeCampaign.overviewVideo ? 2 : 1}>
        <AutoColumn gap="md">
          {activeCampaign.content && <>
            {parse(activeCampaign.content)}
          </>}
          {activeCampaign.description && (
              <>
                {activeCampaign.budgetDescription && <>
                  <TYPE.subHeader>Campaign Incentives</TYPE.subHeader>
                  <TYPE.body>
                    {activeCampaign.budgetDescription}
                  </TYPE.body>
                </>}
                {activeCampaign.goal && <>
                  <TYPE.subHeader>Goal</TYPE.subHeader>
                  <TYPE.body fontSize="14px" fontWeight="301" mb="1rem">
                    {parse(activeCampaign.goal)}
                  </TYPE.body>
                  </>}
                {activeCampaign.description && <>
                  <TYPE.subHeader>Description</TYPE.subHeader>
                  <TYPE.body fontSize="14px" fontWeight="301" mb="1rem">
                  {parse(activeCampaign.description)}
                </TYPE.body>
                </>

              // todo - make video 50% width
                }
              </>
            )}
        </AutoColumn>
        <AutoColumn>
        {activeCampaign.overviewVideo && (
            <Youtube src={activeCampaign.overviewVideo} />
        )}
        </AutoColumn>
      </CampaignWrapper>
      <AutoColumn>
      {process.env.NODE_ENV == 'development' && <>
        <TYPE.mediumHeader mt={"1rem"}>🚧 Other fields 🚧</TYPE.mediumHeader>
        <p>baseUrl: {activeCampaign.baseUrl}</p>
        <p>budget: {activeCampaign.budget}</p>
        <p>content: {activeCampaign.content}</p>
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
      </>}
      </AutoColumn>
    </Wrapper>
  );
}
