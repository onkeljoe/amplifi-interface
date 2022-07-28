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

const CampaignWrapper = styled.div<{gridTemplateColumn?: string}>`
  display: grid;
  grid-template-columns: ${({gridTemplateColumn}) => gridTemplateColumn ? gridTemplateColumn : '1 fr'};
  gap: 24px;
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
      {/* {activeCampaign.content && <>
            {parse(activeCampaign.content)}
          </>} */}
      <CampaignWrapper gridTemplateColumn={activeCampaign.overviewVideo ? '2fr 3fr' : '1fr'}>
        <AutoColumn>
          
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
                  <TYPE.body fontSize="14px" fontWeight="301" mb="1rem" marginTop={-14}>
                    {parse(activeCampaign.goal)}
                  </TYPE.body>
                  </>}
                {activeCampaign.description && <>
                  <TYPE.subHeader>Description</TYPE.subHeader>
                  <TYPE.body fontSize="14px" fontWeight="301" mb="1rem" marginTop={-14}>
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
            <div style={{marginTop: 0}}>
              <Youtube src={activeCampaign.overviewVideo} />
            </div>
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
