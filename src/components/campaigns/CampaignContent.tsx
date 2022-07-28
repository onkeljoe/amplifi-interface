import React from "react";
import { useActiveCampaign } from "state/campaigns/hooks";
export const CampaignContent = ({ content }: { content?: string }) => {
  const [activeCampaign] = useActiveCampaign();
  return <>
    {activeCampaign && activeCampaign?.content && <div dangerouslySetInnerHTML={{ __html: content || activeCampaign?.content }} />}
  </>
};



export default CampaignContent;
