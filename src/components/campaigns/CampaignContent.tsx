import React from "react";
import { useActiveCampaign } from "state/campaigns/hooks";
import { Wrapper } from "../../pages/AppBody";
export const CampaignContent = ({ content }: { content?: string }) => {
  const [activeCampaign] = useActiveCampaign();
  return (
    <>
      {activeCampaign && <Wrapper>activeCampaign?.content</Wrapper> && (
        <Wrapper>
          <div
            dangerouslySetInnerHTML={{
              __html: content || activeCampaign?.content,
            }}
          />
        </Wrapper>
      )}
    </>
  );
};

export default CampaignContent;
