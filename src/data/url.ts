import { useActiveProtocol } from "state/governance/hooks";
import { GovernanceInfo } from "state/governance/reducer";
// import { SerializedToken } from "state/user/actions";


export async function getUrl(twitterHandle : string, governanceInfo : GovernanceInfo | undefined) : Promise<any> {
  if (!governanceInfo) {
    console.error('need governanace info')
    return;
  }
  const {token, baseUrl} = governanceInfo


  /**
   * https://hundred.finance/?utm_source=source&utm_medium=medium&utm_campaign=name&utm_id=twitter-ugm
   */
  //https://support.google.com/analytics/answer/10917952?hl=en#zippy=%2Cin-this-article
  const campaignUrl = baseUrl || 'https://www.google.com/?'
  const utm_source = twitterHandle
  const medium = twitterHandle
  const utm_campaign = governanceInfo.id || 'no_protocol_found' //todo- make id campaign specific rather than protocol specific
  const utm_id = governanceInfo.id
  //const utm_term = twitterHandle
  const domain = {
    id: '278c3d8b2f6d469e812bdddbf713a079',
    fullName: 'link.cre8r.vip'
  }

  const campaignUrlComponents = []
  campaignUrlComponents.push(`utm_source=${utm_source}`)
  campaignUrlComponents.push(`utm_medium=${medium}`)
  campaignUrlComponents.push(`utm_campaign=${utm_campaign}`)
  campaignUrlComponents.push(`utm_id=${utm_id}`)
  //campaignUrlComponents.push(`utm_term=${utm_term}`)


  if (!process.env.REACT_APP_REBRANDLY) {
    console.log(baseUrl + campaignUrlComponents.join('&'))
    return baseUrl?.replace('https://', '') + campaignUrlComponents.join('&')
  }

  const urlComponents = []
  
  urlComponents.push(`domain[id]=${domain.id}`)
  urlComponents.push(`domain[fullName]=${domain.fullName}`)


  const options = {
    method: 'GET',
    headers: {Accept: 'application/json', apikey: process.env.REACT_APP_REBRANDLY}
  };

  const response = await fetch('https://api.rebrandly.com/v1/links/new?destination=' + encodeURIComponent(campaignUrl + campaignUrlComponents.join('&')) + '&' + urlComponents.join('&'), options)
  const res = await response.json()
  return res.shortUrl
}