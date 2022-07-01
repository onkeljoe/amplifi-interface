import React from 'react'
export const CampaignContent = ({content} : {content: string}) => {
  return (
      <div
        dangerouslySetInnerHTML={{ __html: content }}
      />
  )
}

export default CampaignContent