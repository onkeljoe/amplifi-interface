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
      <CampaignWrapper gridTemplateColumn={activeCampaign.overviewVideo ? '400px 1fr' : '1fr'}>
      <AutoColumn>
        {activeCampaign.overviewVideo && (
            <div style={{marginTop: 0}}>
              <Youtube src={activeCampaign.overviewVideo} />
            </div>
        )}
        </AutoColumn>
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
                }
              </>
            )}
        </AutoColumn>
      </CampaignWrapper>
    </Wrapper>
  );
}
